import { PageHeader } from "@/components/common/page-header";
import { listContactMessages } from "@/lib/actions/contact-messages";
import { ContactMessagesAdmin } from "@/features/admin/contact-messages/contact-messages-admin";

export default async function MessagesPage() {
  const messages = await listContactMessages();

  return (
    <div className="space-y-6">
      <PageHeader title="Messages" description="Review contact form submissions and manage incoming requests." />
      <ContactMessagesAdmin messages={messages} />
    </div>
  );
}
