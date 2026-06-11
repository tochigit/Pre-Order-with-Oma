import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client for server-side usage.
 * Uses the SERVICE_ROLE_KEY to bypass RLS — only use in API routes.
 */
export function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing Supabase environment variables. " +
      "Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env"
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}
