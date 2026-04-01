import { createClient } from '@supabase/supabase-js';

// Supabase client for the payment example
// Uses same env variables as main app (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
// For Next.js API routes, these need to be set as regular env vars or read from .env files
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export function getSupabase() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY in .env');
  }
  return supabase;
}
