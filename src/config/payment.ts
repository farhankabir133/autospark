/**
 * Payment Configuration
 *
 * This app is now designed to talk to a single external payment
 * orchestrator ("ProKit" style backend) that knows how to handle
 * Nagad, bKash and any other local gateways.
 *
 * From the React side we only:
 *   1) POST the order + chosen payment method
 *   2) Receive a redirect URL
 *   3) Redirect the browser there
 *
 * The secure gateway credentials live on that external backend,
 * not inside this static site.
 */

// URL of your payment backend (now the Node/Express + SSLCommerz proxy)
// Example (local dev): http://localhost:8787/api/payment/init
// MUST be configured via env in real deployments.
export const PAYMENT_API = {
  // Appwrite Function ID for SSLCommerz API
  INIT_FUNCTION_ID: import.meta.env.VITE_APPWRITE_FUNCTION_ID || 'sslcommerz-api',
  INIT_URL:
    import.meta.env.VITE_PAYMENT_INIT_URL ||
    'http://localhost:8787/api/payment/init', // dev default – set VITE_PAYMENT_INIT_URL in production
};

export type PaymentInitPayload = {
  cart: any[];
  total_amount: number;
  customer_name: string;
  mobile: string;
  address: string;
  thana: string;
  district: string;
  // e.g. 'bkash' | 'nagad' | 'card'
  payment_method: string;
};

export type PaymentInitResponse = {
  // URL where the user should be redirected to complete payment
  redirectUrl?: string;
  // Optional additional fields the backend may return
  GatewayPageURL?: string;
  redirectGatewayURL?: string;
  tran_id?: string;
  status?: string;
  error?: string;
  message?: string;
};

export const getJsonHeaders = () => ({
  'Content-Type': 'application/json',
});
