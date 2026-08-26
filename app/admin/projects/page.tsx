import { PageHeader } from "@/components/common/page-header";
import { listProjects } from "@/lib/actions/projects";
import { ProjectsAdmin } from "@/features/admin/projects/projects-admin";

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
  const params = await searchParams;
  const search = params.search ?? "";
  const projects = await listProjects(search);

  return (
    <div className="space-y-6">
      <PageHeader title="Projects" description="Create, edit, and manage your portfolio project listings and gallery assets." />
      <ProjectsAdmin projects={projects} search={search} />
    </div>
  );
}
