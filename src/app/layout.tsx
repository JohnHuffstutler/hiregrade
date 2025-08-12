import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "HireGrade",
  description: "Grade, rewrite, and apply with AI. Get more interviews.",
};

function StubBanner() {
  const stub = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!stub) return null;
  return (
    <div className="w-full bg-yellow-50 text-yellow-900 border-b border-yellow-200 text-sm">
      <div className="mx-auto max-w-6xl px-4 py-2">Running in local stub mode (Supabase not configured).</div>
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StubBanner />
        <header className="sticky top-0 z-10 border-b bg-white/70 backdrop-blur">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
            <Link href="/" className="font-semibold tracking-tight">HireGrade</Link>
            <nav className="flex items-center gap-6 text-sm">
              <Link href="/grader" className="hover:underline">Resume Grader</Link>
              <Link href="/pricing" className="hover:underline">Pricing</Link>
              <Link href="/login" className="rounded-md border px-3 py-1.5 hover:bg-gray-50">Sign in</Link>
            </nav>
          </div>
        </header>
        {children}
        <footer className="border-t py-10 mt-16">
          <div className="mx-auto max-w-6xl px-4 text-sm text-gray-600 flex flex-wrap justify-between gap-4">
            <div>© {new Date().getFullYear()} HireGrade</div>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:underline">Privacy</Link>
              <Link href="/terms" className="hover:underline">Terms</Link>
              <a href="mailto:contact@example.com" className="hover:underline">Contact</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
