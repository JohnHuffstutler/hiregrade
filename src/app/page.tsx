"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-[70vh]">
      <section className="mx-auto max-w-5xl px-4 pt-14 pb-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight">Get more interviews.</h1>
          <p className="mt-4 text-gray-600">
            Grade your resume against any job description, instantly rewrite it, and generate a tailored cover letter.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/grader" className="rounded-lg bg-black px-5 py-3 text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black">
              Try free scan
            </Link>
            <Link href="/pricing" className="rounded-lg border px-5 py-3 hover:bg-gray-50">
              See pricing
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
