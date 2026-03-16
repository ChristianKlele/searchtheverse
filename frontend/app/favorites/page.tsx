import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function FavoritesPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold mb-2">Your Favorites</h1>
        <p className="text-gray-600 mb-6">
          Logged in as {user.email}
        </p>

        <div className="rounded-2xl border border-gray-200 p-6 shadow-sm">
          <p>Your saved favorite verses will show here.</p>
        </div>
      </div>
    </main>
  );
}