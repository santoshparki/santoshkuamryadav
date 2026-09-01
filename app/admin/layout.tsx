import type { Metadata } from "next";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/features/admin/dashboard/dashboard-shell";
import { createClient } from "@/lib/supabase/server";
import AdminHeader from "@/components/auth/admin-header";
import { requireAuthenticatedUser } from "@/lib/auth/require-user";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portfolio Admin",
  description: "Admin dashboard for managing your portfolio CMS",
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  await requireAuthenticatedUser();

  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl space-y-6">
        <AdminHeader email={user.email ?? null} />
        {children}
      </div>
    </DashboardShell>
  );
}
