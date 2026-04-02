/**
 * Payment Configuration
 * Centralized configuration for payment gateway integration
 */

// Supabase project details - loaded from environment variables
export const SUPABASE_CONFIG = {
  URL: import.meta.env.VITE_SUPABASE_URL,
  ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
};

// Validate Supabase config
if (!SUPABASE_CONFIG.URL || !SUPABASE_CONFIG.ANON_KEY) {
  console.error('Missing Supabase configuration. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

// Payment Gateway URLs
export const PAYMENT_GATEWAY_URLS = {
  // Primary: Supabase Edge Function for payment initialization
  INIT_PAYMENT: `${SUPABASE_CONFIG.URL}/functions/v1/init-ssl-payment`,
  
  // Fallback: Vercel serverless function
  INIT_PAYMENT_FALLBACK: `${import.meta.env.VITE_PAYMENT_API_URL}/api/payment/init`,
  
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
