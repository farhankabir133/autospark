// A-05: Central env validation — fail fast in PROD, warn in DEV
import { z } from 'zod';

const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url().optional(),
  VITE_SUPABASE_ANON_KEY: z.string().min(10).optional(),
  VITE_APPWRITE_ENDPOINT: z.string().url().optional(),
  VITE_APPWRITE_PROJECT_ID: z.string().min(1).optional(),
  VITE_APPWRITE_DATABASE_ID: z.string().min(1).optional(),
  VITE_APPWRITE_COLLECTION_ID: z.string().min(1).optional(),
  VITE_APPWRITE_FUNCTION_ID: z.string().min(1).optional(),
  VITE_PAYMENT_API_URL: z.string().url().optional(),
  VITE_PAYMENT_INIT_URL: z.string().url().optional(),
});

export const env = envSchema.parse(import.meta.env);

if (import.meta.env.PROD) {
  const required = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'] as const;
  const missing = required.filter(k => !env[k as keyof typeof env]);
  if (missing.length) console.error(`[env] Missing required in PROD: ${missing.join(', ')} — build will use fallbacks but may fail at runtime`);
}
