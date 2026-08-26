import { PageHeader } from "@/components/common/page-header";
import { listEducation } from "@/lib/actions/education";
import { EducationAdmin } from "@/features/admin/education/education-admin";

export default async function EducationPage() {
  const education = await listEducation();

  return (
    <div className="space-y-6">
      <PageHeader title="Education" description="Track your academic background and qualifications." />
      <EducationAdmin education={education} />
    </div>
  );
}
