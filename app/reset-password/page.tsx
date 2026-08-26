import ResetPasswordForm from "@/components/auth/reset-password-form";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AuthPageShell } from "@/components/auth/auth-page-shell";

export const dynamic = "force-dynamic";

export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.user) {
    redirect("/admin");
  }

  return (
    <AuthPageShell><ResetPasswordForm /></AuthPageShell>
  );
}
