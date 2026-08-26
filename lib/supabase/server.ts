/**
 * Server Supabase Client
 * Used in server components, API routes, and Server Actions
 */
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/supabase";
import { getSupabasePublicEnv } from "@/lib/env";

export async function createClient() {
  const cookieStore = await cookies();
  const { url, anonKey } = getSupabasePublicEnv();

  return createServerClient<Database>(
    url,
    anonKey,
    {
      // Only provide a read-only cookie getter here. Mutating cookies is only
      // allowed inside Server Actions or Route Handlers per Next.js rules.
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );
}
