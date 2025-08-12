export const aiModel = process.env.AI_MODEL || "gpt-4o-mini";

export function isOpenAIConfigured() {
  return !!process.env.OPENAI_API_KEY;
}

export async function gradeExplanation(_: { resume: string; jd: string }) {
  return { top_recommendations: ["Add metrics", "Add keywords", "Keep layout simple"], tone: "concise" };
}

export async function rewriteResume(_: { resume: string; jd: string }) {
  return "## Summary\n- Improved X by 30%...\n";
}

export async function generateCoverLetter(_: { resume?: string; jd: string; role: string; company: string }) {
  return "Dear Hiring Manager,\n\n...";
}
