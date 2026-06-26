import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

if (!isSupabaseConfigured) {
  console.error(
    "Supabase env vars ausentes. Verifique VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY."
  );
}

// Use safe placeholders when env vars are missing so that `createClient` does not
// throw at module load time and crash the entire app (white screen). Queries will
// fail gracefully and the UI still renders.
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseKey || "placeholder-anon-key"
);
