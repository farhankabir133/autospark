// A-05: Central env validation — warn in PROD for static hosting (GitHub Pages), fail only for server builds
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

// For static hosting (GitHub Pages), we don't require DB credentials at build time
// since API endpoints (Vercel functions) handle server-side secrets.
// Only VITE_PAYMENT_API_URL is needed client-side for payment initiation.
if (import.meta.env.PROD) {
  const required = ['VITE_PAYMENT_API_URL'] as const;
  const missing = required.filter(k => !env[k as keyof typeof env]);
  if (missing.length) {
    console.warn(`[env] Missing in PROD (using fallback): ${missing.join(', ')}`);
  }
  // Warn about missing DB credentials but don't throw
  const dbRequired = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY', 'VITE_APPWRITE_DATABASE_ID', 'VITE_APPWRITE_COLLECTION_ID'] as const;
  const dbMissing = dbRequired.filter(k => !env[k as keyof typeof env]);
  if (dbMissing.length) {
    console.warn(`[env] DB credentials not set at build time (expected for static hosting): ${dbMissing.join(', ')}`);
  }
}
