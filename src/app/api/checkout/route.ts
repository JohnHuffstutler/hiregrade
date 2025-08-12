import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const stripeConfigured = !!process.env.STRIPE_SECRET_KEY;
  if (!stripeConfigured) {
    return NextResponse.json({ success: false, error: "Stripe not configured" }, { status: 501 });
  }
  // TODO: create checkout session with Stripe
  return NextResponse.json({ success: true, url: "/account" });
}
