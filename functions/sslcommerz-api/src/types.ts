/**
 * Auto Spark - SSLCommerz Payment Integration
 * Production-Ready TypeScript Types
 * 
 * This module defines all TypeScript interfaces and types for the SSLCommerz
 * payment gateway integration with Appwrite Functions.
 */

/**
 * Request body for initiating a payment transaction
 */
export interface PaymentInitiationRequest {
  /** Total payment amount in BDT */
  total_amount: number;
  /** Customer full name */
  cus_name: string;
  /** Customer email address */
  cus_email: string;
  /** Customer phone number (11 digits, Bangladesh format) */
  cus_phone: string;
  /** Order ID (optional) - used to track order in your system */
  order_id?: string;
  /** Product/Service description */
  product_name?: string;
  /** Product category */
  product_category?: string;
  /** Customer address */
  cus_add1?: string;
  /** Customer city */
  cus_city?: string;
  /** Customer postal code */
  cus_postcode?: string;
  /** Customer country (default: Bangladesh) */
  cus_country?: string;
  /** Shipping address (if different from billing) */
  ship_add1?: string;
  /** Shipping city */
  ship_city?: string;
  /** Shipping postal code */
  ship_postcode?: string;
  /** Shipping country */
  ship_country?: string;
  /** Shipping method */
  shipping_method?: string;
}

/**
 * SSLCommerz initialization data structure
 * Sent to SSLCommerz gateway for payment processing
 */
export interface SSLCommerzInitData {
  /** Unique transaction ID (prefixed with AS_LIVE_) */
  tran_id: string;
  /** Total amount in BDT */
  total_amount: number;
  /** Currency code (always BDT for Bangladesh) */
  currency: 'BDT';
  /** URL where customer is redirected on successful payment */
  success_url: string;
  /** URL where customer is redirected on failed payment */
  fail_url: string;
  /** URL where customer is redirected on cancelled payment */
  cancel_url: string;
  /** Instant Payment Notification webhook URL */
  ipn_url: string;
  /** Store ID from SSLCommerz */
  store_id?: string;
  /** Store password from SSLCommerz */
  store_passwd?: string;
  /** Customer name */
  cus_name: string;
  /** Customer email */
  cus_email: string;
  /** Customer phone */
  cus_phone: string;
  /** Billing address line 1 */
  cus_add1: string;
  /** Billing city */
  cus_city: string;
  /** Billing postal code */
  cus_postcode: string;
  /** Billing country */
  cus_country: string;
  /** Shipping address line 1 */
  ship_name: string;
  /** Shipping address */
  ship_add1: string;
  /** Shipping city */
  ship_city: string;
  /** Shipping postal code */
  ship_postcode: string;
  /** Shipping country */
  ship_country: string;
  /** Shipping method */
  shipping_method: string;
  /** Product name */
  product_name: string;
  /** Product category */
  product_category: string;
  /** Product profile (general/physical_goods/digital_goods) */
  product_profile: string;
}

/**
 * SSLCommerz gateway initialization response
 */
export interface SSLCommerzInitResponse {
  /** Status of initialization (success/failed) */
  status: 'success' | 'failed';
  /** Gateway page URL to redirect customer to */
  GatewayPageURL?: string;
  /** Sessionkey for the transaction */
  sessionkey?: string;
  /** Error description if failed */
  description?: string;
}

/**
 * IPN (Instant Payment Notification) request body from SSLCommerz
 */
export interface SSLCommerzIPNRequest {
  /** Transaction ID */
  tran_id: string;
  /** Amount paid */
  amount: string;
  /** Currency */
  currency: string;
  /** Status of transaction (VALID/INVALID) */
  status: 'VALID' | 'INVALID';
  /** SSLCommerz transaction reference ID */
  val_id: string;
  /** Validation ID */
  validation_id?: string;
  /** Card brand/type */
  card_type?: string;
  /** Card issuer bank */
  card_issuer?: string;
  /** Card issuer bank country code */
  card_issuer_country?: string;
  /** Card issuer phone */
  card_issuer_phone?: string;
  /** Card issuer website */
  card_issuer_website?: string;
  /** Error details if any */
  error_code?: string;
  /** Merchant order reference */
  risk_level?: string;
  /** Risk title */
  risk_title?: string;
  /** Base fair rate */
  base_fair?: string;
  /** Converted amount */
  converted_amount?: string;
  /** Conversion rate */
  conversion_rate?: string;
  /** Benefit amount */
  benefit_amount?: string;
  /** Emi amount */
  emi_amount?: string;
  /** Emi issuer */
  emi_issuer?: string;
  /** Emi issue month */
  emi_issue_month?: string;
  /** Emi issue year */
  emi_issue_year?: string;
  /** Additional field 1 */
  additional_field?: string;
  /** Additional field 2 */
  additional_field_2?: string;
}

/**
 * Validation response from SSLCommerz
 */
export interface SSLCommerzValidationResponse {
  /** Validation ID */
  valid_id?: string;
  /** Transaction ID */
  tran_id: string;
  /** Amount */
  amount: string;
  /** Card type */
  card_type?: string;
  /** Card number (masked) */
  card_number?: string;
  /** Validation result (VALID/INVALID/ERROR) */
  result?: string;
  /** Validation status */
  status?: string;
}

/**
 * Order document in Appwrite database
 */
export interface Order {
  /** Appwrite document ID */
  $id?: string;
  /** Transaction ID from SSLCommerz */
  tran_id: string;
  /** Order status (pending/paid/failed/cancelled) */
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  /** Payment amount */
  amount: number;
  /** Currency (BDT) */
  currency: string;
  /** Customer name */
  customer_name: string;
  /** Customer email */
  customer_email: string;
  /** Customer phone */
  customer_phone: string;
  /** Order date */
  created_at?: string;
  /** Payment date */
  paid_at?: string | null;
  /** Validation ID from SSLCommerz */
  validation_id?: string | null;
  /** Payment method (card/bank/mobile) */
  payment_method?: string;
  /** Additional metadata */
  metadata?: Record<string, any>;
}

/**
 * API Response structure for all endpoints
 */
export interface APIResponse<T = any> {
  /** Success flag */
  success: boolean;
  /** Response data */
  data?: T;
  /** Error message if any */
  error?: string;
  /** HTTP status code */
  statusCode: number;
}

/**
 * Environment variables configuration
 */
export interface AppwriteConfig {
  /** SSLCommerz Store ID */
  SSLCZ_STORE_ID: string;
  /** SSLCommerz Store Password */
  SSLCZ_STORE_PASSWD: string;
  /** Appwrite API Endpoint */
  APPWRITE_API_ENDPOINT: string;
  /** Appwrite API Key */
  APPWRITE_API_KEY: string;
  /** Appwrite Project ID */
  APPWRITE_PROJECT_ID: string;
  /** Appwrite Database ID for orders */
  APPWRITE_ORDERS_DATABASE_ID: string;
  /** Appwrite Orders Collection ID */
  APPWRITE_ORDERS_COLLECTION_ID: string;
  /** Auto Spark domain base URL */
  BASE_URL: string;
  /** Appwrite Function endpoint */
  APPWRITE_FUNCTION_ENDPOINT: string;
}

/**
 * Transaction ID generator configuration
 */
export interface TransactionConfig {
  /** Prefix for transaction ID (e.g., AS_LIVE_) */
  prefix: string;
  /** Timestamp format */
  includeTimestamp: boolean;
  /** Random suffix length */
  randomSuffixLength: number;
}
