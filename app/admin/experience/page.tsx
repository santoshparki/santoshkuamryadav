import { PageHeader } from "@/components/common/page-header";
import { listExperiences } from "@/lib/actions/experience";
import { ExperienceAdmin } from "@/features/admin/experience/experience-admin";

export default async function ExperiencePage() {
  const experiences = (await listExperiences()) ?? [];

  return (
    <div className="space-y-6">
      <PageHeader title="Experience" description="Manage your professional timeline and role history." />
      <ExperienceAdmin experiences={experiences} />
    </div>
  );
}
