/**
 * Auto Spark - SSLCommerz Payment Integration
 * Utility Functions
 * 
 * Helper functions for transaction management, validation, and data transformation.
 */

import type { TransactionConfig } from './types';

/**
 * Generates a unique transaction ID with AS_LIVE_ prefix
 * Format: AS_LIVE_<timestamp>_<random>
 * 
 * @returns {string} Unique transaction ID
 * 
 * @example
 * generateTransactionId() // AS_LIVE_1713012345678_a7f3k9m2
 */
export function generateTransactionId(): string {
  const prefix = 'AS_LIVE_';
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `${prefix}${timestamp}_${randomSuffix}`;
}

/**
 * Validates email format
 * 
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates Bangladesh phone number format
 * Accepts 11-digit numbers starting with 01
 * 
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if phone is valid
 */
export function isValidBDPhone(phone: string): boolean {
  const phoneRegex = /^01[0-9]{9}$/;
  const cleanPhone = phone.replace(/\D/g, '');
  return phoneRegex.test(cleanPhone);
}

/**
 * Validates amount is a positive number
 * 
 * @param {number} amount - Amount to validate
 * @returns {boolean} True if amount is valid
 */
export function isValidAmount(amount: number): boolean {
  return amount > 0 && Number.isFinite(amount);
}

/**
 * Sanitizes and normalizes customer data
 * Removes extra whitespace and normalizes strings
 * 
 * @param {string} value - Value to sanitize
 * @returns {string} Sanitized value
 */
export function sanitizeString(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

/**
 * Validates required fields in payment initiation request
 * 
 * @param {Record<string, any>} data - Data to validate
 * @param {string[]} requiredFields - List of required field names
 * @returns {object} Validation result
 */
export function validateRequiredFields(
  data: Record<string, any>,
  requiredFields: string[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const field of requiredFields) {
    const value = data[field];
    if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
      errors.push(`${field} is required`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Formats amount for SSLCommerz (ensures 2 decimal places)
 * 
 * @param {number} amount - Amount to format
 * @returns {string} Formatted amount
 */
export function formatAmount(amount: number): string {
  return Number(amount).toFixed(2);
}

/**
 * Extracts and validates IPN request data
 * 
 * @param {Record<string, any>} body - IPN request body
 * @returns {object} Extracted IPN data
 */
export function extractIPNData(body: Record<string, any>): {
  tranId: string;
  valId: string;
  amount: string;
  status: string;
  rawData: Record<string, any>;
} {
  return {
    tranId: body.tran_id || '',
    valId: body.val_id || '',
    amount: body.amount || '',
    status: body.status || '',
    rawData: body
  };
}

/**
 * Builds redirect URLs for payment success/fail/cancel
 * 
 * @param {string} baseUrl - Base domain URL
 * @param {object} params - Query parameters
 * @returns {object} URLs object
 */
export function buildRedirectURLs(
  baseUrl: string,
  params?: { tran_id?: string; error?: string }
): { success_url: string; fail_url: string; cancel_url: string } {
  const baseUrlFormatted = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const queryString = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : '';

  return {
    success_url: `${baseUrlFormatted}/payment-success${queryString}`,
    fail_url: `${baseUrlFormatted}/payment-fail${queryString}`,
    cancel_url: `${baseUrlFormatted}/payment-cancel${queryString}`
  };
}

/**
 * Validates SSLCommerz response structure
 * 
 * @param {any} response - Response from SSLCommerz
 * @returns {boolean} True if response is valid
 */
export function isValidSSLCommerzResponse(response: any): boolean {
  return (
    response &&
    typeof response === 'object' &&
    (response.status === 'success' || response.status === 'failed') &&
    response.GatewayPageURL !== undefined
  );
}

/**
 * Logs payment events for monitoring and debugging
 * 
 * @param {string} eventType - Type of event (init/ipn/validate/error)
 * @param {Record<string, any>} data - Event data
 * @param {Function} logFn - Logger function
 */
export function logPaymentEvent(
  eventType: string,
  data: Record<string, any>,
  logFn?: (message: string) => void
): void {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${eventType.toUpperCase()}] ${JSON.stringify(data)}`;
  
  if (logFn) {
    logFn(logMessage);
  } else {
    console.log(logMessage);
  }
}

/**
 * Handles errors with consistent formatting
 * 
 * @param {Error | string} error - Error object or message
 * @param {string} context - Context where error occurred
 * @param {Function} errorFn - Error logging function
 * @returns {object} Formatted error response
 */
export function handleError(
  error: Error | string,
  context: string,
  errorFn?: (message: string) => void
): { success: boolean; error: string; statusCode: number } {
  const message = error instanceof Error ? error.message : String(error);
  const errorLog = `[${context}] ${message}`;

  if (errorFn) {
    errorFn(errorLog);
  } else {
    console.error(errorLog);
  }

  return {
    success: false,
    error: message,
    statusCode: 500
  };
}

/**
 * Converts ISO timestamp to readable format
 * 
 * @param {string} isoString - ISO format timestamp
 * @returns {string} Formatted date string
 */
export function formatTimestamp(isoString: string): string {
  try {
    return new Date(isoString).toLocaleString('en-BD');
  } catch {
    return isoString;
  }
}

/**
 * Masks sensitive information for logging
 * 
 * @param {string} value - Value to mask
 * @param {number} visibleChars - Number of visible characters from start
 * @returns {string} Masked value
 */
export function maskSensitive(value: string, visibleChars: number = 4): string {
  if (value.length <= visibleChars) return '*'.repeat(value.length);
  return value.substring(0, visibleChars) + '*'.repeat(value.length - visibleChars);
}

/**
 * Retry logic for API calls
 * 
 * @param {Function} fn - Function to retry
 * @param {number} maxAttempts - Maximum retry attempts
 * @param {number} delayMs - Delay between retries in milliseconds
 * @returns {Promise<any>} Result from function
 */
export async function retryAsync<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delayMs: number = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  throw new Error('Max retries exceeded');
}
