import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Debug logs so we can see what Render is loading
  console.log("SUPABASE URL:", supabaseUrl);
  console.log(
    "SUPABASE KEY PREFIX:",
    supabaseAnonKey ? supabaseAnonKey.substring(0, 20) : "undefined"
  );

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
