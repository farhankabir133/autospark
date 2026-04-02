/**
 * Payment Configuration
 * Centralized configuration for payment gateway integration
 */

// Supabase project details - loaded from environment variables with safe defaults
export const SUPABASE_CONFIG = {
  // These are public values; safe to embed as defaults so static builds (e.g. GitHub Pages) still work
  URL: import.meta.env.VITE_SUPABASE_URL || 'https://hcdwfxnvmvvkbpeshbqk.supabase.co',
  ANON_KEY:
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    'sb_publishable_o4V4NsBTa1omeSCyl8GuuA_UppA17sl',
};

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn(
    'Using fallback Supabase URL/ANON_KEY defaults. For production builds, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
  );
}

// Payment Gateway URLs
export const PAYMENT_GATEWAY_URLS = {
  // Primary: Supabase Edge Function for payment initialization
  INIT_PAYMENT: `${SUPABASE_CONFIG.URL}/functions/v1/init-ssl-payment`,
  
  // Fallback: Vercel serverless function
  INIT_PAYMENT_FALLBACK: `${
    import.meta.env.VITE_PAYMENT_API_URL || 'https://autospark-one.vercel.app'
  }/api/payment/init`,
  
  // SSLCommerz endpoints
  SSLCOMMERZ_SANDBOX: 'https://sandbox.sslcommerz.com',
  SSLCOMMERZ_VALIDATION: 'https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php',
};

/**
 * Get authorization header for Supabase Edge Functions
 */
export const getSupabaseAuthHeader = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${SUPABASE_CONFIG.ANON_KEY}`,
});
