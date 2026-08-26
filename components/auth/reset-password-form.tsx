"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const accessToken = searchParams.get("access_token");
  const type = searchParams.get("type");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isInvalidLink = type !== "recovery" || !accessToken;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (isInvalidLink) {
      setError("Reset link is invalid or missing.");
      return;
    }

    setLoading(true);
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      setLoading(false);
      setError("Unable to process reset link. Please try again or request a new reset email.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) {
      setError(error.message || "Unable to reset password.");
      return;
    }

    setMessage("Your password has been reset. Redirecting to login...");
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-zinc-200 bg-white/90 p-8 shadow-xl backdrop-blur-xl sm:p-10">
      <div>
        <h1 className="text-3xl font-semibold text-zinc-950">Reset password</h1>
        <p className="mt-3 text-sm text-zinc-600">Set a new password for your account.</p>
      </div>

      {message ? <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</div> : null}
      {error || isInvalidLink ? <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error ?? "Reset link is invalid or missing."}</div> : null}

      <div className="space-y-4">
        <label className="block text-sm font-medium text-zinc-700">
          New password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
          />
        </label>

        <label className="block text-sm font-medium text-zinc-700">
          Confirm new password
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={loading || isInvalidLink}
        className="inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Resetting password..." : "Reset password"}
      </button>
    </form>
  );
}
