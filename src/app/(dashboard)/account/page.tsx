export default function AccountPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Account</h1>
      <div className="mt-6 rounded-xl border p-5">
        <div className="text-sm text-gray-600">Plan: Free</div>
        <div className="text-sm text-gray-600">Credits: 1</div>
        <div className="mt-4">
          <button className="rounded-lg bg-black px-5 py-2.5 text-white disabled:opacity-50" disabled title="Stripe not configured. Add envs to enable portal.">
            Manage billing
          </button>
        </div>
      </div>
    </main>
  );
}
