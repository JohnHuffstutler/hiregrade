import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { resumeText, jobText, company, role } = body || {};
    if (!jobText || !company || !role) {
      return NextResponse.json({ success: false, error: "Missing inputs" }, { status: 400 });
    }
    const coverLetterMarkdown = `Dear Hiring Manager at ${company},\n\nI’m excited to apply for the ${role} role...`;
    return NextResponse.json({ success: true, data: { coverLetterMarkdown } });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
