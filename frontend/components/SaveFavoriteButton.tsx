"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type VerseProps = {
  verse: {
    id: number;
    book: string;
    chapter: number;
    verse: number;
    text: string;
  };
};

export default function SaveFavoriteButton({ verse }: VerseProps) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSave() {
    setLoading(true);
    setMessage("");

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { error } = await supabase.from("favorite_verses").insert({
      user_id: user.id,
      verse_id: verse.id,
      book: verse.book,
      chapter: verse.chapter,
      verse: verse.verse,
      text: verse.text,
    });

    if (error) {
      setMessage("Could not save verse.");
    } else {
      setMessage("Verse saved.");
    }

    setLoading(false);
  }

  return (
    <div className="mt-3">
      <button
        onClick={handleSave}
        disabled={loading}
        className="border rounded-lg px-3 py-2"
      >
        {loading ? "Saving..." : "⭐ Save Verse"}
      </button>

      {message && <p className="text-sm mt-2">{message}</p>}
    </div>
  );
}
