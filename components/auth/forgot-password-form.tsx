"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      setError(error.message || "Unable to send reset link. Please try again.");
      return;
    }

    setMessage("If an account exists, a password reset link has been sent to your email.");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-zinc-200 bg-white/90 p-8 shadow-xl backdrop-blur-xl sm:p-10">
      <div>
        <h1 className="text-3xl font-semibold text-zinc-950">Forgot password</h1>
        <p className="mt-3 text-sm text-zinc-600">Enter your email and we’ll send you a reset link.</p>
      </div>

      {message ? <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</div> : null}
      {error ? <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

      <label className="block text-sm font-medium text-zinc-700">
        Email
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
          placeholder="you@example.com"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Sending reset link..." : "Send reset link"}
      </button>
    </form>
  );
}
