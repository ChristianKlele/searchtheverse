export type SearchHistoryItem = {
    query: string;
    createdAt: string;
  };
  
  const HISTORY_KEY = "searchtheverse_history";
  
  export function saveSearchToHistory(query: string) {
    if (typeof window === "undefined") return;
  
    const trimmed = query.trim();
    if (!trimmed) return;
  
    const existing = getSearchHistory();
  
    const filtered = existing.filter(
      (item) => item.query.toLowerCase() !== trimmed.toLowerCase()
    );
  
    const updated: SearchHistoryItem[] = [
      {
        query: trimmed,
        createdAt: new Date().toISOString(),
      },
      ...filtered,
    ].slice(0, 25);
  
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  }
  
  export function getSearchHistory(): SearchHistoryItem[] {
    if (typeof window === "undefined") return [];
  
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
  
    try {
      return JSON.parse(raw) as SearchHistoryItem[];
    } catch {
      return [];
    }
  }
  
  export function clearSearchHistory() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(HISTORY_KEY);
  }