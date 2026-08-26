"use server";

import { createClient as createServerClient } from "@/lib/supabase/server";
import { requireAuthenticatedUser } from "@/lib/auth/require-user";

export async function uploadFileToStorage(file: File, bucket: string, path: string) {
  await requireAuthenticatedUser();
  const supabase = await createServerClient();

  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data?.path ?? null;
}

export async function getPublicUrl(bucket: string, path: string) {
  const supabase = await createServerClient();
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
