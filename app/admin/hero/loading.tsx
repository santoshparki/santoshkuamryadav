export default function HeroLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading hero editor">
      <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="h-4 w-16 animate-pulse rounded bg-zinc-200" />
        <div className="mt-4 h-9 w-36 animate-pulse rounded bg-zinc-200" />
        <div className="mt-3 h-5 w-96 max-w-full animate-pulse rounded bg-zinc-100" />
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="h-20 animate-pulse rounded-xl bg-zinc-100" />
              <div className="h-20 animate-pulse rounded-xl bg-zinc-100" />
            </div>
            <div className="h-20 animate-pulse rounded-xl bg-zinc-100" />
            <div className="h-32 animate-pulse rounded-xl bg-zinc-100" />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="h-20 animate-pulse rounded-xl bg-zinc-100" />
              <div className="h-20 animate-pulse rounded-xl bg-zinc-100" />
            </div>
          </div>
          <div className="h-72 animate-pulse rounded-2xl bg-zinc-100" />
        </div>
      </div>
    </div>
  );
}
