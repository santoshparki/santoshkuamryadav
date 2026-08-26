import { PageHeader } from "@/components/common/page-header";
import { listServices } from "@/lib/actions/services";
import { ServicesAdmin } from "@/features/admin/services/services-admin";

export default async function ServicesPage() {
  const services = await listServices();

  return (
    <div className="space-y-6">
      <PageHeader title="Services" description="Present the services you offer and manage their visibility." />
      <ServicesAdmin services={services} />
    </div>
  );
}
