import { NextResponse } from "next/server";

export async function POST() {
  const hasEnv = !!process.env.STRIPE_WEBHOOK_SECRET && !!process.env.STRIPE_SECRET_KEY;
  if (!hasEnv) {
    return NextResponse.json({ success: false, error: "Stripe webhook not configured" }, { status: 501 });
  }
  // TODO: verify signature and update Supabase
  return NextResponse.json({ success: true });
}
