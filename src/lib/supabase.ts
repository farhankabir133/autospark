import { createClient } from '@supabase/supabase-js';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hcdwfxnvmvvkbpeshbqk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_o4V4NsBTa1omeSCyl8GuuA_UppA17sl';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
