"use client";

import { useState } from "react";

export default function CoverLetterPage() {
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [jobText, setJobText] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [letter, setLetter] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, company, jobText, resumeText }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Generation failed");
      setLetter(json.data.coverLetterMarkdown);
    } catch (e: any) {
      setError(e.message || "Failed to generate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Cover Letter</h1>
      <div className="mt-6 grid gap-6">
        <div className="rounded-xl border p-5 grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Role</label>
            <input
              className="mt-2 w-full rounded-lg border p-2"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Company</label>
            <input
              className="mt-2 w-full rounded-lg border p-2"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium">Job Description</label>
            <textarea
              className="mt-2 w-full rounded-lg border p-3"
              rows={8}
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium">Resume Text (optional)</label>
            <textarea
              className="mt-2 w-full rounded-lg border p-3"
              rows={8}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            />
          </div>
        </div>
        <div>
          <button
            className="rounded-lg bg-black px-5 py-2.5 text-white disabled:opacity-50"
            disabled={!role || !company || !jobText || loading}
            onClick={onGenerate}
          >
            {loading ? "Generating..." : "Generate"}
          </button>
          {error && (
            <div className="mt-3 rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>
      </div>

      {letter && (
        <div className="mt-8 rounded-xl border p-5">
          <div className="text-sm font-medium">Cover Letter (Markdown)</div>
          <pre className="mt-2 overflow-auto text-sm">{letter}</pre>
        </div>
      )}
    </main>
  );
}
