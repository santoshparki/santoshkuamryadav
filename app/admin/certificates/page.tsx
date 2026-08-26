import { PageHeader } from "@/components/common/page-header";
import { listCertificates } from "@/lib/actions/certificates";
import { CertificatesAdmin } from "@/features/admin/certificates/certificates-admin";

export default async function CertificatesPage() {
  const certificates = await listCertificates();

  return (
    <div className="space-y-6">
      <PageHeader title="Certificates" description="Showcase your credentials and professional achievements." />
      <CertificatesAdmin certificates={certificates} />
    </div>
  );
}
