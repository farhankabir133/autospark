import { createClient } from '@supabase/supabase-js';
import { env } from './env';

// No hardcoded fallbacks: env.ts throws in PROD when required vars are missing.
const supabaseUrl = env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY as string;

if (import.meta.env.DEV && (!supabaseUrl || !supabaseAnonKey)) {
  console.warn('[supabase] Missing VITE_SUPABASE_URL/ANON_KEY env. Set .env for production.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
