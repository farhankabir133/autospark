import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from './env';

// No hardcoded fallbacks: env.ts throws in PROD when required vars are missing.
const supabaseUrl = env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (import.meta.env.DEV && (!supabaseUrl || !supabaseAnonKey)) {
  console.warn('[supabase] Missing VITE_SUPABASE_URL/ANON_KEY env. Set .env for production.');
}

// Bullet-proof: createClient THROWS on missing/invalid url+key, which would crash
// every lazy chunk that imports this module at load time. Never let that happen —
// callers must handle a null client (e.g. fall back to local/demo data).
let client: SupabaseClient | null = null;
try {
  if (supabaseUrl && supabaseAnonKey) {
    client = createClient(supabaseUrl, supabaseAnonKey);
  }
} catch (err) {
  if (import.meta.env.DEV) console.warn('[supabase] Client init failed, running without backend:', err);
  client = null;
}

export const supabase = client;
export const isSupabaseConfigured = (): boolean => client !== null;
