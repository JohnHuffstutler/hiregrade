"use client";

import { useState } from "react";

export default function RewritePage() {
  const [resumeText, setResumeText] = useState("");
  const [jobText, setJobText] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ rewrittenMarkdown: string; estimatedScoreBoost: number; diffHtml: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onRewrite = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobText }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Rewrite failed");
      setData(json.data);
    } catch (e: any) {
      setError(e.message || "Failed to rewrite");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Rewrite</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border p-5">
          <label className="text-sm font-medium">Before (paste your current resume text)</label>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            rows={16}
            className="mt-2 w-full rounded-lg border p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <div className="rounded-xl border p-5">
          <label className="text-sm font-medium">Job Description</label>
          <textarea
            value={jobText}
            onChange={(e) => setJobText(e.target.value)}
            rows={8}
            className="mt-2 w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-black"
          />
          <button
            className="mt-4 rounded-lg bg-black px-5 py-2.5 text-white disabled:opacity-50"
            disabled={!resumeText || !jobText || loading}
            onClick={onRewrite}
          >
            {loading ? "Generating..." : "Generate"}
          </button>
          {error && <div className="mt-3 rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700">{error}</div>}
        </div>
      </div>

      {data && (
        <div className="mt-8 rounded-xl border p-5">
          <div className="text-sm text-gray-600">Estimated score boost: <span className="font-semibold text-black">{data.estimatedScoreBoost}%</span></div>
          <div className="prose mt-4" dangerouslySetInnerHTML={{ __html: data.diffHtml }} />
          <div className="mt-6 rounded-lg border bg-gray-50 p-4">
            <div className="text-sm font-medium">After (Markdown)</div>
            <pre className="mt-2 overflow-auto text-sm">{data.rewrittenMarkdown}</pre>
          </div>
        </div>
      )}
    </main>
  );
}
