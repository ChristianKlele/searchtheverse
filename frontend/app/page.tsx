"use client";

import { useEffect, useState } from "react";

type Verse = {
  id: number;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  testament: string;
  bookOrder: number;
  translation: string;
};

const BOOKS = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy",
  "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel",
  "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles",
  "Ezra", "Nehemiah", "Esther", "Job", "Psalms", "Proverbs",
  "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah",
  "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos",
  "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah",
  "Haggai", "Zechariah", "Malachi", "Matthew", "Mark", "Luke",
  "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians",
  "Galatians", "Ephesians", "Philippians", "Colossians",
  "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy",
  "Titus", "Philemon", "Hebrews", "James", "1 Peter", "2 Peter",
  "1 John", "2 John", "3 John", "Jude", "Revelation"
];

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightText(text: string, query: string) {
  if (!query.trim()) return text;

  const words = query.trim().split(/\s+/).filter(Boolean).map(escapeRegex);
  if (words.length === 0) return text;

  const regex = new RegExp(`(${words.join("|")})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, index) => {
    const isMatch = words.some((word) => new RegExp(`^${word}$`, "i").test(part));
    return isMatch ? (
      <mark key={index} className="rounded bg-amber-300 px-1 text-black">
        {part}
      </mark>
    ) : (
      <span key={index}>{part}</span>
    );
  });
}

export default function Home() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState<"verse" | "passage" | "chapter" | "search">("verse");

  const [verseRef, setVerseRef] = useState("");
  const [passageRef, setPassageRef] = useState("");
  const [selectedBook, setSelectedBook] = useState("John");
  const [selectedBookOrder, setSelectedBookOrder] = useState(43);
  const [selectedChapter, setSelectedChapter] = useState(3);

  const [lookupResult, setLookupResult] = useState<Verse | null>(null);
  const [passageResults, setPassageResults] = useState<Verse[]>([]);
  const [chapterResults, setChapterResults] = useState<Verse[]>([]);
  const [searchResults, setSearchResults] = useState<Verse[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dailyVerse, setDailyVerse] = useState<Verse | null>(null);

  const [error, setError] = useState("");
  const [copiedMessage, setCopiedMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const themeClasses = darkMode ? "bg-zinc-950 text-white" : "bg-stone-100 text-zinc-950";
  const sidebarClasses = darkMode ? "border-zinc-800 bg-zinc-950" : "border-stone-300 bg-white";
  const mainCard = darkMode
    ? "rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl"
    : "rounded-3xl border border-stone-300 bg-white p-6 shadow-xl";
  const inputClasses = darkMode
    ? "w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-amber-500"
    : "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-zinc-950 outline-none focus:border-amber-600";
  const resultCardClasses = darkMode
    ? "rounded-2xl border border-zinc-800 bg-zinc-950 p-4"
    : "rounded-2xl border border-stone-300 bg-stone-50 p-4";
  const subtleText = darkMode ? "text-zinc-400" : "text-zinc-600";
  const primaryButton = darkMode
    ? "bg-white text-black hover:bg-zinc-200"
    : "bg-black text-white hover:bg-zinc-800";
  const secondaryButton = darkMode
    ? "bg-zinc-800 text-white hover:bg-zinc-700"
    : "bg-stone-200 text-zinc-900 hover:bg-stone-300";

  useEffect(() => {
    async function loadDailyVerse() {
      try {
        const res = await fetch("/api/daily");
        if (!res.ok) throw new Error();

        const data: Verse = await res.json();
        setDailyVerse(data);
      } catch (err) {
        console.error("Failed to load daily verse", err);
      }
    }

    loadDailyVerse();
  }, []);

  function sidebarButton(tab: "verse" | "passage" | "chapter" | "search", label: string, icon: string) {
    const active = activeTab === tab;
    return (
      <button
        onClick={() => setActiveTab(tab)}
        className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
          active ? primaryButton : secondaryButton
        }`}
      >
        <span>{icon}</span>
        <span className="font-medium">{label}</span>
      </button>
    );
  }

  function clearOutputs() {
    setLookupResult(null);
    setPassageResults([]);
    setChapterResults([]);
    setError("");
  }

  async function handleVerseLookup(e: React.FormEvent) {
    e.preventDefault();
    clearOutputs();
    setLoading(true);

    try {
      const res = await fetch(`/api/lookup?ref=${encodeURIComponent(verseRef)}`);
      if (!res.ok) throw new Error();

      const data: Verse = await res.json();
      setLookupResult(data);
    } catch {
      setError("Could not find that verse. Try something like John 3:16.");
    } finally {
      setLoading(false);
    }
  }

  async function handlePassageLookup(e: React.FormEvent) {
    e.preventDefault();
    clearOutputs();
    setLoading(true);

    try {
      const res = await fetch(`/api/passage?ref=${encodeURIComponent(passageRef)}`);
      if (!res.ok) throw new Error();

      const data: Verse[] = await res.json();
      setPassageResults(data);
    } catch {
      setError("Could not find that passage. Try something like John 3:16-18.");
    } finally {
      setLoading(false);
    }
  }

  async function handleChapterLookup(bookOrder?: number, chapter?: number, bookName?: string) {
    clearOutputs();
    setLoading(true);

    const finalBookOrder = bookOrder ?? selectedBookOrder;
    const finalChapter = chapter ?? selectedChapter;
    const finalBookName = bookName ?? selectedBook;

    try {
      const res = await fetch(
        `/api/chapter?bookOrder=${finalBookOrder}&chapter=${finalChapter}`
      );
      if (!res.ok) throw new Error();

      const data: Verse[] = await res.json();
      setChapterResults(data);
      setSelectedBookOrder(finalBookOrder);
      setSelectedChapter(finalChapter);
      setSelectedBook(finalBookName);
    } catch {
      setError("Could not load that chapter.");
    } finally {
      setLoading(false);
    }
  }

  async function runSearch(query: string) {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error();

      const data: Verse[] = await res.json();
      setSearchResults(data);
    } catch {
      setSearchResults([]);
    }
  }

  async function copyVerseText(verse: Verse) {
    const text = `${verse.book} ${verse.chapter}:${verse.verse} — ${verse.text}`;
    await navigator.clipboard.writeText(text);
    setCopiedMessage("Verse copied.");
    setTimeout(() => setCopiedMessage(""), 2000);
  }

  async function copyVerseLink(verse: Verse) {
    const ref = `${verse.book} ${verse.chapter}:${verse.verse}`;
    const shareUrl = `${window.location.origin}/?verse=${encodeURIComponent(ref)}`;
    await navigator.clipboard.writeText(shareUrl);
    setCopiedMessage("Verse link copied.");
    setTimeout(() => setCopiedMessage(""), 2000);
  }

  function openVerseFromResult(verse: Verse) {
    setActiveTab("verse");
    setVerseRef(`${verse.book} ${verse.chapter}:${verse.verse}`);
    setLookupResult(verse);
    setPassageResults([]);
    setChapterResults([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goToPreviousChapter() {
    if (selectedChapter > 1) {
      handleChapterLookup(selectedBookOrder, selectedChapter - 1, selectedBook);
    }
  }

  function goToNextChapter() {
    handleChapterLookup(selectedBookOrder, selectedChapter + 1, selectedBook);
  }

  return (
    <main className={`min-h-screen ${themeClasses}`}>
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className={`border-r p-6 ${sidebarClasses}`}>
          <div className="mb-8 flex items-center gap-3">
            <img
              src="/searchtheverse-logo.png"
              alt="SearchTheVerse"
              className="h-12 w-auto"
            />
            <div>
              <h1 className="text-xl font-bold">SearchTheVerse</h1>
              <p className={`text-xs ${subtleText}`}>KJV Bible Explorer</p>
            </div>
          </div>

          <div className="space-y-3">
            {sidebarButton("verse", "Verse Lookup", "🔎")}
            {sidebarButton("passage", "Passage Lookup", "📖")}
            {sidebarButton("chapter", "Chapter Reader", "📚")}
            {sidebarButton("search", "Keyword Search", "🔍")}
          </div>

          <div className="mt-8 border-t border-zinc-800 pt-6">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-full rounded-2xl px-4 py-3 font-medium transition ${primaryButton}`}
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>

          <div className={`mt-8 text-sm ${subtleText}`}>
            <p className="mb-2 font-semibold">Features</p>
            <ul className="space-y-2">
              <li>• Exact verse lookup</li>
              <li>• Passage search</li>
              <li>• Full chapter reading</li>
              <li>• Keyword highlighting</li>
              <li>• Shareable verse links</li>
              <li>• Daily verse</li>
            </ul>
          </div>
        </aside>

        <section className="p-6 md:p-10">
          {copiedMessage && (
            <div
              className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
                darkMode
                  ? "border-green-800 bg-green-900/40 text-green-300"
                  : "border-green-300 bg-green-100 text-green-700"
              }`}
            >
              {copiedMessage}
            </div>
          )}

          {dailyVerse && (
            <div className={`${mainCard} mb-8`}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className={`text-sm font-semibold uppercase tracking-[0.2em] ${subtleText}`}>
                    Daily Verse
                  </p>
                  <h2 className="mt-2 text-3xl font-bold">Verse of the Day</h2>
                </div>

                <button
                  onClick={() => copyVerseText(dailyVerse)}
                  className={`rounded-xl px-3 py-2 text-sm ${secondaryButton}`}
                >
                  Copy
                </button>
              </div>

              <div className={`mt-5 ${resultCardClasses}`}>
                <button
                  onClick={() => openVerseFromResult(dailyVerse)}
                  className="text-left text-lg font-semibold underline-offset-4 hover:underline"
                >
                  {dailyVerse.book} {dailyVerse.chapter}:{dailyVerse.verse}
                </button>

                <p className="mt-3 leading-8">{dailyVerse.text}</p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    onClick={() => copyVerseText(dailyVerse)}
                    className={`rounded-xl px-3 py-2 text-sm ${secondaryButton}`}
                  >
                    Copy Verse
                  </button>

                  <button
                    onClick={() => copyVerseLink(dailyVerse)}
                    className={`rounded-xl px-3 py-2 text-sm ${secondaryButton}`}
                  >
                    Share
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "verse" && (
            <div className={mainCard}>
              <h2 className="text-3xl font-bold">Verse Lookup</h2>
              <p className={`mt-2 ${subtleText}`}>
                Search for an exact verse reference.
              </p>

              <form onSubmit={handleVerseLookup} className="mt-6 space-y-4">
                <input
                  type="text"
                  value={verseRef}
                  onChange={(e) => setVerseRef(e.target.value)}
                  placeholder="John 3:16"
                  className={inputClasses}
                />
                <button
                  type="submit"
                  className={`rounded-2xl px-5 py-3 font-semibold transition ${primaryButton}`}
                >
                  Find Verse
                </button>
              </form>

              {error && <p className="mt-4 text-red-400">{error}</p>}

              {loading && <div className="mt-6">Loading...</div>}

              {lookupResult && !loading && (
                <div className={`mt-6 ${resultCardClasses}`}>
                  <p className="text-lg font-semibold">
                    {lookupResult.book} {lookupResult.chapter}:{lookupResult.verse}
                  </p>
                  <p className="mt-3 leading-8">{lookupResult.text}</p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      onClick={() => copyVerseText(lookupResult)}
                      className={`rounded-xl px-3 py-2 text-sm ${secondaryButton}`}
                    >
                      Copy Verse
                    </button>
                    <button
                      onClick={() => copyVerseLink(lookupResult)}
                      className={`rounded-xl px-3 py-2 text-sm ${secondaryButton}`}
                    >
                      Share
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "passage" && (
            <div className={mainCard}>
              <h2 className="text-3xl font-bold">Passage Lookup</h2>
              <p className={`mt-2 ${subtleText}`}>
                Search for a verse range like John 3:16-18.
              </p>

              <form onSubmit={handlePassageLookup} className="mt-6 space-y-4">
                <input
                  type="text"
                  value={passageRef}
                  onChange={(e) => setPassageRef(e.target.value)}
                  placeholder="John 3:16-18"
                  className={inputClasses}
                />
                <button
                  type="submit"
                  className={`rounded-2xl px-5 py-3 font-semibold transition ${primaryButton}`}
                >
                  Find Passage
                </button>
              </form>

              {error && <p className="mt-4 text-red-400">{error}</p>}

              {loading && <div className="mt-6">Loading...</div>}

              {passageResults.length > 0 && !loading && (
                <div className="mt-6 space-y-3">
                  {passageResults.map((verse) => (
                    <div key={verse.id} className={resultCardClasses}>
                      <button
                        onClick={() => openVerseFromResult(verse)}
                        className="font-semibold underline-offset-4 hover:underline"
                      >
                        {verse.book} {verse.chapter}:{verse.verse}
                      </button>
                      <p className="mt-2 leading-8">{verse.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "chapter" && (
            <div className={mainCard}>
              <h2 className="text-3xl font-bold">Chapter Reader</h2>
              <p className={`mt-2 ${subtleText}`}>
                Open and read an entire chapter.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <select
                  value={selectedBook}
                  onChange={(e) => {
                    const newBook = e.target.value;
                    const index = BOOKS.findIndex((book) => book === newBook);
                    setSelectedBook(newBook);
                    setSelectedBookOrder(index + 1);
                  }}
                  className={inputClasses}
                >
                  {BOOKS.map((book) => (
                    <option key={book} value={book}>
                      {book}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min="1"
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(Number(e.target.value))}
                  className={inputClasses}
                />

                <button
                  onClick={() => handleChapterLookup()}
                  className={`rounded-2xl px-5 py-3 font-semibold transition ${primaryButton}`}
                >
                  Open Chapter
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={goToPreviousChapter}
                  className={`rounded-xl px-4 py-2 text-sm ${secondaryButton}`}
                >
                  Previous Chapter
                </button>
                <button
                  onClick={goToNextChapter}
                  className={`rounded-xl px-4 py-2 text-sm ${secondaryButton}`}
                >
                  Next Chapter
                </button>
              </div>

              {error && <p className="mt-4 text-red-400">{error}</p>}

              {loading && <div className="mt-6">Loading...</div>}

              {chapterResults.length > 0 && !loading && (
                <div className="mt-6 space-y-3 max-h-[700px] overflow-y-auto pr-1">
                  {chapterResults.map((verse) => (
                    <div key={verse.id} className={resultCardClasses}>
                      <button
                        onClick={() => openVerseFromResult(verse)}
                        className="font-semibold underline-offset-4 hover:underline"
                      >
                        <span className="mr-2 text-amber-500">{verse.verse}</span>
                        {verse.book} {verse.chapter}:{verse.verse}
                      </button>
                      <p className="mt-2 leading-8">{verse.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "search" && (
            <div className={mainCard}>
              <h2 className="text-3xl font-bold">Keyword Search</h2>
              <p className={`mt-2 ${subtleText}`}>
                Search the full Bible by keyword.
              </p>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => runSearch(e.target.value)}
                placeholder="faith"
                className={`${inputClasses} mt-6`}
              />

              <div className="mt-6 space-y-4 max-h-[700px] overflow-y-auto pr-1">
                {searchResults.map((verse) => (
                  <div key={verse.id} className={resultCardClasses}>
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div className="flex-1">
                        <button
                          onClick={() => openVerseFromResult(verse)}
                          className="text-left font-semibold underline-offset-4 hover:underline"
                        >
                          {verse.book} {verse.chapter}:{verse.verse}
                        </button>

                        <p className="mt-2 leading-8">
                          {highlightText(verse.text, searchQuery)}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => copyVerseText(verse)}
                          className={`rounded-xl px-3 py-2 text-sm ${secondaryButton}`}
                        >
                          Copy
                        </button>

                        <button
                          onClick={() => copyVerseLink(verse)}
                          className={`rounded-xl px-3 py-2 text-sm ${secondaryButton}`}
                        >
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {!searchResults.length && searchQuery && (
                  <div className={`rounded-2xl border border-dashed p-5 text-sm ${subtleText}`}>
                    No results found.
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
