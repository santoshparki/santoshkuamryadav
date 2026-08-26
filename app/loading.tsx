export default function Loading() {
  return (
    <main className="portfolio-shell min-h-screen bg-[#070B12] px-6 py-16 sm:px-10 lg:px-16" aria-busy="true" aria-label="Loading portfolio" role="status">
      <div className="mx-auto max-w-7xl space-y-12 pt-20">
        <div className="max-w-3xl space-y-6">
          <div className="loading-shimmer h-7 w-44 rounded-full bg-cyan-200/10" />
          <div className="loading-shimmer h-16 max-w-2xl rounded-2xl bg-white/10 sm:h-24" />
          <div className="loading-shimmer h-5 max-w-xl rounded-full bg-white/[0.07]" />
          <div className="loading-shimmer h-5 max-w-lg rounded-full bg-white/[0.07]" />
        </div>
        <div className="grid gap-6 md:grid-cols-3" aria-hidden="true">
          {["first", "second", "third"].map((key) => (
            <div key={key} className="loading-shimmer h-56 rounded-[28px] border border-white/[0.07] bg-white/[0.035]" />
          ))}
        </div>
      </div>
      <span className="sr-only">Loading portfolio content</span>
    </main>
  );
}
