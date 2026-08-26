import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export function AuthPageShell({ children }: { children: ReactNode }) {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070B12] px-6 py-12 sm:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.15),_transparent_40%)]" />
      <div className="relative w-full max-w-md">
        <div className="mb-8 flex items-center justify-between text-sm">
          <Link href="/" className="inline-flex items-center gap-2 font-medium text-slate-300 transition hover:text-cyan-200">
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            Back to portfolio
          </Link>
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100">
            <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5" />
            Secure access
          </span>
        </div>
        {children}
      </div>
    </section>
  );
}
