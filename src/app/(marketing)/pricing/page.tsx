"use client";

export default function PricingPage() {
  const stripeEnvMissing = !process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;

  const Price = ({ title, price, blurb, disabled }: { title: string; price: string; blurb: string; disabled?: boolean }) => (
    <div className="rounded-xl border p-6 shadow-sm flex flex-col">
      <div className="text-sm font-medium">{title}</div>
      <div className="mt-2 text-3xl font-semibold">{price}</div>
      <div className="mt-2 text-sm text-gray-600">{blurb}</div>
      <button
        className="mt-6 rounded-lg bg-black px-5 py-2.5 text-white disabled:cursor-not-allowed disabled:opacity-50"
        disabled={disabled}
        title={disabled ? "Stripe not configured. Add envs to enable checkout." : undefined}
      >
        Buy
      </button>
    </div>
  );

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Pricing</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <Price title="One-time" price="$19.99" blurb="1 tailored resume rewrite" disabled={stripeEnvMissing} />
        <Price title="Monthly" price="$12.99/mo" blurb="Unlimited rewrites + interviews" disabled={stripeEnvMissing} />
        <Price title="Annual" price="$99/year" blurb="Best value" disabled={stripeEnvMissing} />
      </div>
      <div className="mt-10 text-sm text-gray-600">
        Refund policy: If you’re unhappy, contact us and we’ll make it right.
      </div>
    </main>
  );
}
