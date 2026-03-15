"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Account created! Check your email to confirm your account.");
    }

    setLoading(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border p-6 shadow-lg">

        <h1 className="mb-6 text-2xl font-bold">
          Create Account
        </h1>

        <form onSubmit={handleSignup} className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            required
            className="w-full rounded-lg border px-4 py-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            required
            className="w-full rounded-lg border px-4 py-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg border px-4 py-3 font-medium hover:bg-zinc-100"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>

        </form>

        {message && (
          <p className="mt-4 text-sm">
            {message}
          </p>
        )}

        <p className="mt-6 text-sm">
          Already have an account?{" "}
          <a href="/login" className="underline">
            Log in
          </a>
        </p>

      </div>
    </main>
  );
}