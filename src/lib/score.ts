const STOPWORDS = new Set([
  "the","and","for","with","that","this","from","your","you","are","was","were","has","have","had","our","about","into","over","under","per",
  "a","an","to","of","in","on","as","by","at","or","be","is","it","we","us","they","them"
]);

function tokenize(s: string): string[] {
  return (s.toLowerCase().match(/[a-z0-9%$]+/g) || []).filter(w => w.length >= 3 && !STOPWORDS.has(w));
}

export function extractKeywords(jd: string, topN = 30): string[] {
  const freq = new Map<string, number>();
  for (const t of tokenize(jd)) freq.set(t, (freq.get(t) || 0) + 1);
  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([w]) => w);
}

export function matchPercentage(resumeText: string, jdKeywords: string[]): number {
  const tokens = new Set(tokenize(resumeText));
  const overlap = jdKeywords.filter((k) => tokens.has(k));
  return Math.round((overlap.length / Math.max(1, jdKeywords.length)) * 100);
}

export function formattingScore(resumeText: string): number {
  let score = 80;
  const t = resumeText;
  if (/│|┃|┆|┇/.test(t)) score -= 15;
  const pipes = (t.match(/\|/g) || []).length;
  if (pipes > 20) score -= 10;
  if (/table|image|figure|columns?/i.test(t)) score -= 10;
  return Math.max(0, Math.min(100, score));
}

const ACTION_VERBS = [
  "led","built","created","designed","improved","reduced","increased","shipped","launched","optimized","managed","developed","implemented","delivered","spearheaded","owned","architected"
];

export function clarityScore(resumeText: string): number {
  const bullets = resumeText.split(/\n/).filter((l) => /^\s*[-•*]/.test(l));
  if (bullets.length === 0) return 0;
  const good = bullets.filter((l) => ACTION_VERBS.some((v) => new RegExp(`\\b${v}\\b`, "i").test(l)));
  return Math.round((good.length / bullets.length) * 100);
}

export function impactScore(resumeText: string): number {
  const bullets = resumeText.split(/\n/).filter((l) => /^\s*[-•*]/.test(l));
  if (bullets.length === 0) return 0;
  const good = bullets.filter((l) => /\d|%|\$|(reduced|increased|saved|grew)/i.test(l));
  return Math.round((good.length / bullets.length) * 100);
}

export function overallScore(keyword: number, skill: number, formatting: number, clarity: number, impact: number): number {
  const val = 0.35 * keyword + 0.2 * skill + 0.15 * formatting + 0.15 * clarity + 0.15 * impact;
  return Math.round(Math.max(0, Math.min(100, val)));
}

export function computeScores(resumeText: string, jdText: string) {
  const keywords = extractKeywords(jdText);
  const keyword = matchPercentage(resumeText, keywords);
  const skill = matchPercentage(resumeText, keywords.slice(0, Math.max(1, Math.round(keywords.length * 0.6))));
  const formatting = formattingScore(resumeText);
  const clarity = clarityScore(resumeText);
  const impact = impactScore(resumeText);
  const overall = overallScore(keyword, skill, formatting, clarity, impact);
  const missing_keywords = keywords.filter((k) => !new Set(tokenize(resumeText)).has(k));
  return { keyword, skill, formatting, clarity, impact, overall, missing_keywords };
}
