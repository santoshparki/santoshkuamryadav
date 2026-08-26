import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { requireAuthenticatedUser } from "@/lib/auth/require-user";

export default async function AdminAuth({ children }: { children: React.ReactNode }) {
  await requireAuthenticatedUser();
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect("/login");
  }

  return <>{children}</>;
}
