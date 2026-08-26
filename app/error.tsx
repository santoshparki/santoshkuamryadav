"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("Portfolio page failed to render", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#070B12] px-6 text-center text-white">
      <div className="max-w-lg rounded-[28px] border border-cyan-300/15 bg-[#091525]/90 p-8 shadow-[0_28px_80px_rgba(2,10,24,0.42)] sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">Portfolio</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">This page needs another try.</h1>
        <p className="mt-4 leading-7 text-slate-400">A temporary issue interrupted the page load. Your content is safe—please try again.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={unstable_retry} className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-5 py-3 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/20">
            Try again
          </button>
          <Link href="/" className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10">
            Go home
          </Link>
        </div>
        {error.digest ? <p className="mt-5 text-xs text-slate-600">Reference: {error.digest}</p> : null}
      </div>
    </main>
  );
}
