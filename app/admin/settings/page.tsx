import { PageHeader } from "@/components/common/page-header";
import { SiteSettingsAdmin } from "@/features/admin/site-settings/site-settings-admin";
import { getSiteSettings } from "@/lib/actions/site-settings";

export default async function SettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <PageHeader title="Site Settings" description="Control the global metadata and contact details used across the portfolio." />
      <SiteSettingsAdmin settings={settings} />
    </div>
  );
}
