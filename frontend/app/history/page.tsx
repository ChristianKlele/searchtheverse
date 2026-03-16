"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type SearchHistoryItem = {
  id: string;
  query: string;
  created_at: string;
};

export default function HistoryPage() {
  const supabase = createClient();

  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadHistory() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setHistory([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("search_history")
        .select("id, query, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        setError("Could not load search history.");
        setLoading(false);
        return;
      }

      setHistory((data ?? []) as SearchHistoryItem[]);
      setLoading(false);
    }

    loadHistory();
  }, [supabase]);

  const handleClear = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from("search_history").delete().eq("user_id", user.id);
    setHistory([]);
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          ← Back to Home
        </Link>

        {history.length > 0 && (
          <button
            onClick={handleClear}
            className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Clear History
          </button>
        )}
      </div>

      <h1 className="text-3xl font-bold mb-6">Search History</h1>

      {loading ? (
        <div className="rounded-xl border p-4">
          <p>Loading history...</p>
        </div>
      ) : error ? (
        <div className="rounded-xl border p-4">
          <p>{error}</p>
        </div>
      ) : history.length === 0 ? (
        <div className="rounded-xl border p-4">
          <p>No search history yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div key={item.id} className="rounded-xl border p-4">
              <p className="font-semibold">{item.query}</p>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(item.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}