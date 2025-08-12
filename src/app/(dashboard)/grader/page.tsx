"use client";

import { useState } from "react";

export default function GraderPage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobText, setJobText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const onAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const fd = new FormData();
      if (file) fd.append("resume", file);
      fd.append("jobText", jobText);
      const res = await fetch("/api/analyze", { method: "POST", body: fd });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Analyze failed");
      setResult(json.data);
    } catch (e: any) {
      setError(e.message || "Failed to analyze");
    } finally {
      setLoading(false);
    }
  };

  const tryDemo = () => {
    setJobText("We are seeking a Software Engineer with experience in React, TypeScript, Node.js, and AWS...");
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Resume Grader</h1>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border p-5">
          <label className="text-sm font-medium">Upload resume (PDF/DOC/DOCX)</label>
          <input
            className="mt-2 w-full rounded-lg border p-2 file:mr-3 file:rounded-md file:border file:bg-gray-50"
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          {file && (
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="truncate">{file.name}</span>
              <button className="text-red-600 hover:underline" onClick={() => setFile(null)}>Remove</button>
            </div>
          )}
          <button onClick={tryDemo} className="mt-4 text-sm underline">Try demo</button>
        </div>

        <div className="rounded-xl border p-5">
          <label className="text-sm font-medium">Paste Job Description</label>
          <textarea
            value={jobText}
            onChange={(e) => setJobText(e.target.value)}
            rows={12}
            className="mt-2 w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-black"
            placeholder="Paste the job details here..."
          />
          <div className="mt-1 text-right text-xs text-gray-500">{jobText.length} chars</div>
        </div>
      </div>

      <div className="mt-6">
        <button
          disabled={!file || !jobText || loading}
          onClick={onAnalyze}
          className="rounded-lg bg-black px-5 py-2.5 text-white disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {error && <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      {result && (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border p-5">
            <div className="text-sm font-medium">Scores</div>
            <ul className="mt-3 text-sm text-gray-700 space-y-1">
              {Object.entries(result.scores || {}).map(([k, v]) => (
                <li key={k} className="flex items-center justify-between">
                  <span className="capitalize">{k.replace(/_/g, " ")}</span>
                  <span className="font-semibold">{v as any}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border p-5">
            <div className="text-sm font-medium">Missing Keywords</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {(result.missing_keywords || []).map((kw: string) => (
                <span key={kw} className="rounded-full border px-3 py-1 text-xs">{kw}</span>
              ))}
            </div>
            <div className="mt-5 text-sm">
              <div className="font-medium">Top Recommendations</div>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {(result.recommendations || []).map((r: string, i: number) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
