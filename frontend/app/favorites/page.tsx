import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default async function FavoritesPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: favorites, error } = await supabase
    .from("favorite_verses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return <main className="p-6">Error loading favorites.</main>;
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">My Favorite Verses</h1>

      {!favorites || favorites.length === 0 ? (
        <p>No saved verses yet.</p>
      ) : (
        <div className="space-y-4">
          {favorites.map((fav) => (
            <div key={fav.id} className="border rounded-xl p-4">
              <p className="font-semibold mb-2">
                {fav.book} {fav.chapter}:{fav.verse}
              </p>
              <p>{fav.text}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
