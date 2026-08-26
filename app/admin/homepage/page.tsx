import { PageHeader } from "@/components/common/page-header";
import { HomepageSectionsAdmin } from "@/features/admin/homepage/homepage-sections-admin";
import { prisma, withDbFallback } from "@/lib/prisma";

export default async function HomepageSectionsPage() {
  const saved = await withDbFallback(() => prisma.homepageSection.findMany({ orderBy: { sortOrder: "asc" } }), []);
  return <div className="space-y-6"><PageHeader title="Homepage Sections" description="Show or hide complete sections on your public homepage." /><HomepageSectionsAdmin saved={saved} /></div>;
}
