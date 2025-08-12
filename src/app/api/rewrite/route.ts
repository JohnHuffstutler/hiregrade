import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body?.resumeText || !body?.jobText) {
      return NextResponse.json({ success: false, error: "Missing inputs" }, { status: 400 });
    }

    const rewrittenMarkdown = "## Summary\n- Improved X by 30%...\n\n## Experience\n- Led Y resulting in $1M...";
    const estimatedScoreBoost = 28;
    const diffHtml = "<div class='diff'><ins>Improved 30%</ins> <del>Improved</del></div>";

    return NextResponse.json({ success: true, data: { rewrittenMarkdown, estimatedScoreBoost, diffHtml } });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
