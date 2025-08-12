import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const resume = form.get("resume") as File | null;
    const jobText = (form.get("jobText") as string) || "";
    if (!resume || !jobText) {
      return NextResponse.json({ success: false, error: "Missing inputs" }, { status: 400 });
    }

    const scores = { keyword_match: 42, skill_match: 55, formatting: 60, clarity: 50, impact: 40, overall: 49 };
    const missing_keywords = ["Kubernetes", "GraphQL"];
    const recommendations = [
      "Add metrics to 3 bullets (%, $, time).",
      "Include core JD keywords in Skills section.",
      "Use single-column, text-only layout.",
    ];

    return NextResponse.json({
      success: true,
      data: {
        resumeId: "stub-resume-id",
        jdId: "stub-jd-id",
        scores,
        missing_keywords,
        recommendations,
      },
    });
  } catch (e) {
    return NextResponse.json({ success: false, error: "Parsing failure" }, { status: 500 });
  }
}
