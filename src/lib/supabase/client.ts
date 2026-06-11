import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client for browser-side usage.
 * Uses the ANON_KEY which respects Row Level Security.
 * Only use in client components.
 */
export function createBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing Supabase environment variables. " +
      "Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env"
    );
  }

  return createClient(url, key);
}
