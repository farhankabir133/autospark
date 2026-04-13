/**
 * Payment Configuration
 *
 * This app is designed to use Appwrite Functions as the payment gateway orchestrator.
 * SSLCommerz Live is configured as the primary payment processor.
 *
 * From the React side we:
 *   1) POST order details (cart items, customer info, etc.)
 *   2) Receive a SSLCommerz Gateway redirect URL
 *   3) Redirect the browser to the payment gateway
 *   4) SSLCommerz handles IPN validation and returns to success/fail pages
 *
 * All sensitive gateway credentials are stored securely in Appwrite environment variables.
 */

// Payment backend configuration
export const PAYMENT_API = {
  // Appwrite Function ID for SSLCommerz payment initialization
  INIT_FUNCTION_ID: import.meta.env.VITE_APPWRITE_FUNCTION_ID || 'sslcommerz-api',
  INIT_URL:
    import.meta.env.VITE_PAYMENT_INIT_URL ||
    `${import.meta.env.VITE_PAYMENT_API_URL}/api/payment/init` ||
    'https://autosparkbd.com/api/payment/init',
};

// Payment gateway configuration
export const PAYMENT_GATEWAY = {
  STORE_ID: import.meta.env.VITE_SSLCOMMERZ_STORE_ID || 'autosparkbd0live',
  LIVE_MODE: import.meta.env.VITE_SSLCOMMERZ_LIVE_MODE === 'true',
  // Redirect URLs configured in SSLCommerz dashboard
  SUCCESS_URL: `${import.meta.env.VITE_PAYMENT_API_URL || 'https://autosparkbd.com'}/payment/success`,
  FAIL_URL: `${import.meta.env.VITE_PAYMENT_API_URL || 'https://autosparkbd.com'}/payment/fail`,
  CANCEL_URL: `${import.meta.env.VITE_PAYMENT_API_URL || 'https://autosparkbd.com'}/payment/cancel`,
};

export type PaymentInitPayload = {
  cart: any[];
  total_amount: number;
  customer_name: string;
  mobile: string;
  address: string;
  thana: string;
  district: string;
  // Payment method: 'card' (SSLCommerz default)
  payment_method?: string;
};

export type PaymentInitResponse = {
  // URL where the user should be redirected to complete payment
  redirectUrl?: string;
  // Alternative field names for compatibility
  GatewayPageURL?: string;
  redirectGatewayURL?: string;
  // Transaction details
  tran_id?: string;
  status?: string;
  // Error information
  error?: string;
  message?: string;
};

export const getJsonHeaders = () => ({
  'Content-Type': 'application/json',
});
