"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export default function AdminHeader({ email }: { email: string | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogout() {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signOut();
    setLoading(false);

    if (error) {
      setError(error.message || "Unable to sign out. Please try again.");
      return;
    }

    router.replace("/login");
  }

  return (
    <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-zinc-500">Admin</p>
        <p className="mt-2 text-lg font-medium text-zinc-950">
          Signed in as <span className="text-emerald-600">{email ?? "Unknown user"}</span>
        </p>
      </div>
      <div className="flex items-center gap-3">
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
        >
          View Portfolio
          <ExternalLink aria-hidden="true" className="h-4 w-4" />
        </a>
        <button
          type="button"
          onClick={handleLogout}
          disabled={loading}
          className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing out..." : "Logout"}
        </button>
      </div>
    </div>
  );
}
