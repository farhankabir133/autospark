/**
 * Payment Configuration
 * Centralized configuration for payment gateway integration
 */

// Supabase project details - loaded from environment variables
export const SUPABASE_CONFIG = {
  URL: import.meta.env.VITE_SUPABASE_URL || 'https://hcdwfxnvmvvkbpeshbqk.supabase.co',
  ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_o4V4NsBTa1omeSCyl8GuuA_UppA17sl',
};

// Payment Gateway URLs
export const PAYMENT_GATEWAY_URLS = {
  // Try multiple payment endpoints (primary and fallback)
  INIT_PAYMENT: import.meta.env.VITE_PAYMENT_API_URL 
    ? `${import.meta.env.VITE_PAYMENT_API_URL}/api/payment/init`
    : `${SUPABASE_CONFIG.URL}/functions/v1/init-ssl-payment`,
  
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

/**
 * SSLCommerz Store Credentials
 * These are loaded from environment variables in production
 * IMPORTANT: These should NEVER be exposed in frontend in production
 * The frontend should only call the backend Edge Function which has these credentials
 */
export const SSLCOMMERZ_STORE = {
  ID: import.meta.env.VITE_SSLCOMMERZ_STORE_ID || 'autos69cccc023b067',
  PASSWORD: import.meta.env.VITE_SSLCOMMERZ_STORE_PASSWORD || 'autos69cccc023b067@ssl',
  SANDBOX_MODE: import.meta.env.MODE === 'development',
};
