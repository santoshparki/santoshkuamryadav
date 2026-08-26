import { PageHeader } from "@/components/common/page-header";
import { SocialLinksAdmin } from "@/features/admin/social-links/social-links-admin";
import { getSocialLinks } from "@/lib/actions/social-links";

export default async function SocialLinksPage() {
  const socialLinks = await getSocialLinks();

  return (
    <div className="space-y-6">
      <PageHeader title="Social Links" description="Manage the profiles and external links displayed on your portfolio." />
      <SocialLinksAdmin socialLinks={socialLinks} />
    </div>
  );
}
