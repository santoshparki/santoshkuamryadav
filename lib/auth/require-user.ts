import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

/** Ensures that a Server Action is being called by an authorized CMS user. */
export async function requireAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized");
  }

  if (!user.email) {
    throw new Error("Forbidden");
  }

  const profile = await prisma.user.findUnique({ where: { email: user.email } });
  if (!profile || (profile.role !== "ADMIN" && profile.role !== "EDITOR")) {
    throw new Error("Forbidden");
  }

  return user;
}
