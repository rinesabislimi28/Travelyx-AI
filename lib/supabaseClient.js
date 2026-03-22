/**
 * Supabase Client Initialization
 * ------------------------------
 * Exposes a singleton browser client used for authentication and database calls.
 * Next.js public environment variables are explicitly mapped here.
 */
import { createBrowserClient } from "@supabase/ssr";

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);