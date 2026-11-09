import type { SupabaseClient } from "@supabase/supabase-js";

const { VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY } = import.meta.env;

let client: SupabaseClient | undefined;

export async function getSupabase() {
  if (client == null) {
    const { createClient } = await import("@supabase/supabase-js");

    client = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY, { auth: { persistSession: false } });
  }

  return client;
}
