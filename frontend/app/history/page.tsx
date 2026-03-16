import Link from "next/link";

export default function HistoryPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          ← Back to Home
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Search History</h1>

      <div className="rounded-xl border p-4">
        <p>Your recent searches will show here.</p>
      </div>
    </main>
  );
}