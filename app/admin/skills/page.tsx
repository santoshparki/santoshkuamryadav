import { PageHeader } from "@/components/common/page-header";
import { listSkills, listSkillCategories } from "@/lib/actions/skills";
import { SkillsAdmin } from "@/features/admin/skills/skills-admin";

export default async function SkillsPage({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
  const params = await searchParams;
  const search = params.search ?? "";
  const [skills, categories] = await Promise.all([listSkills(search), listSkillCategories()]);

  return (
    <div className="space-y-6">
      <PageHeader title="Skills" description="Create, edit, and organize your portfolio skills and categories." />
      <SkillsAdmin skills={skills} categories={categories} search={search} />
    </div>
  );
}
