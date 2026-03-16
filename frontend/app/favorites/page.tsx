import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type FavoriteVerse = {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  created_at: string;
};

export default async function FavoritesPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: favorites, error: favoritesError } = await supabase
    .from("favorite_verses")
    .select("*")
    .order("created_at", { ascending: false });

  if (favoritesError) {
    return <main className="p-6">Error loading favorites.</main>;
  }

  const typedFavorites = (favorites ?? []) as FavoriteVerse[];

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">My Favorite Verses</h1>
      <p className="text-gray-600 mb-6">Logged in as {user.email}</p>

      {typedFavorites.length === 0 ? (
        <p>No saved verses yet.</p>
      ) : (
        <div className="space-y-4">
          {typedFavorites.map((fav) => (
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