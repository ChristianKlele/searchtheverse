import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function HistoryPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: history, error } = await supabase
    .from("search_history")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return <main className="p-6">Error loading history.</main>;
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Search History</h1>

      {!history || history.length === 0 ? (
        <p>No search history yet.</p>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <div key={item.id} className="border rounded-xl p-4">
              <p className="font-medium">{item.query}</p>
              <p className="text-sm opacity-70">
                {new Date(item.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
