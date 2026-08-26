import { prisma, withDbFallback } from "@/lib/prisma";

async function getDashboardStats() {
  const [aboutCount, projectCount, blogCount, messageCount] = await Promise.all([
    withDbFallback(() => prisma.about.count(), 0),
    withDbFallback(() => prisma.project.count(), 0),
    withDbFallback(() => prisma.blog.count(), 0),
    withDbFallback(() => prisma.contactMessage.count(), 0),
  ]);

  return {
    aboutCount,
    projectCount,
    blogCount,
    messageCount,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500">Overview</p>
        <h1 className="mt-3 text-3xl font-semibold text-zinc-950">Portfolio Admin CMS</h1>
        <p className="mt-3 max-w-2xl text-base text-zinc-600">
          Manage your portfolio content from one premium dashboard with a scalable foundation for content, media, and settings.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "About Entries", value: stats.aboutCount },
          { label: "Projects", value: stats.projectCount },
          { label: "Blogs", value: stats.blogCount },
          { label: "Messages", value: stats.messageCount },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-zinc-500">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold text-zinc-950">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-zinc-950">Quick Actions</h2>
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-600">Phase 1</span>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              "Create a portfolio entry",
              "Publish a new blog",
              "Add a featured project",
              "Review contact messages",
            ].map((action) => (
              <div key={action} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
                {action}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-zinc-950">Next Up</h2>
          <ul className="mt-6 space-y-3 text-sm text-zinc-600">
            <li>• CRUD screens for about, hero, skills, and projects</li>
            <li>• Auth-protected admin routes</li>
            <li>• Media upload and storage integration</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
