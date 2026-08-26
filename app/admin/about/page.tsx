import { prisma, withDbFallback } from "@/lib/prisma";
import { PageHeader } from "@/components/common/page-header";
import { AboutForm } from "@/features/admin/about/about-form";
import { AboutTagsAdmin } from "@/features/admin/about/about-tags-admin";

export default async function AboutPage() {
  const about = await withDbFallback(
    () =>
      prisma.about.findFirst({
        include: {
          tags: {
            orderBy: { displayOrder: "asc" },
          },
        },
      }),
    null
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="About"
        description="Manage the About section content and highlight tags for the portfolio site."
      />

      <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <AboutForm about={about} />
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <AboutTagsAdmin aboutId={about?.id ?? ""} tags={about?.tags ?? []} />
      </div>
    </div>
  );
}
