import { createClient } from '@supabase/supabase-js';

// P0 fix: validate env presence; fallback kept for zero-config preview but warn in dev
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hcdwfxnvmvvkbpeshbqk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_o4V4NsBTa1omeSCyl8GuuA_UppA17sl';

if (import.meta.env.DEV && (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY)) {
  console.warn('[supabase] Missing VITE_SUPABASE_URL/ANON_KEY env - using fallback credentials. Set env for production.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
