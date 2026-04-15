/**
 * Auto Spark - SSLCommerz Payment Integration
 * Payment Initialization Module
 * 
 * Handles transaction initialization and SSLCommerz gateway setup.
 */

import type { PaymentInitiationRequest, SSLCommerzInitData, SSLCommerzInitResponse } from './types';
import {
  generateTransactionId,
  isValidEmail,
  isValidBDPhone,
  isValidAmount,
  sanitizeString,
  validateRequiredFields,
  formatAmount,
  buildRedirectURLs,
  isValidSSLCommerzResponse,
  logPaymentEvent,
  handleError
} from './utils';

/**
 * PaymentInitializer class handles transaction creation and SSLCommerz initialization
 */
export class PaymentInitializer {
  private storeId: string;
  private storePasswd: string;
  private baseUrl: string;
  private functionPublicBaseUrl?: string;
  private isLive: boolean = true;
  private logFn?: (message: string) => void;
  private errorFn?: (message: string) => void;

  /**
   * Initialize the PaymentInitializer
   * 
   * @param {string} storeId - SSLCommerz Store ID
   * @param {string} storePasswd - SSLCommerz Store Password
   * @param {string} baseUrl - Auto Spark domain base URL
   * @param {object} options - Additional options
   */
  constructor(
    storeId: string,
    storePasswd: string,
    baseUrl: string,
    options?: {
      isLive?: boolean;
      logFn?: (message: string) => void;
      errorFn?: (message: string) => void;
      functionPublicBaseUrl?: string;
    }
  ) {
    this.storeId = storeId;
    this.storePasswd = storePasswd;
    this.baseUrl = baseUrl;
    this.functionPublicBaseUrl = options?.functionPublicBaseUrl;
    this.isLive = options?.isLive ?? true;
    this.logFn = options?.logFn;
    this.errorFn = options?.errorFn;
  }

  /**
   * Validates payment initiation request
   * 
   * @param {PaymentInitiationRequest} request - Payment initiation request
   * @returns {object} Validation result
   */
  private validateRequest(request: PaymentInitiationRequest): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate required fields
    const requiredFields = ['total_amount', 'cus_name', 'cus_email', 'cus_phone'];
    const validation = validateRequiredFields(request as Record<string, any>, requiredFields);
    if (!validation.valid) {
      errors.push(...validation.errors);
    }

    // Validate amount
    if (!isValidAmount(request.total_amount)) {
      errors.push('total_amount must be a positive number');
    }

    // Validate email
    if (!isValidEmail(request.cus_email)) {
      errors.push('Invalid email format');
    }

    // Validate phone
    if (!isValidBDPhone(request.cus_phone)) {
      errors.push('Invalid Bangladesh phone number format (must be 11 digits starting with 01)');
    }

    // Validate customer name
    if (request.cus_name.length < 2 || request.cus_name.length > 100) {
      errors.push('Customer name must be between 2 and 100 characters');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Prepares payment data for SSLCommerz
   * 
   * @param {PaymentInitiationRequest} request - Payment request
   * @param {string} tranId - Transaction ID
   * @returns {SSLCommerzInitData} Data ready for SSLCommerz
   */
  private preparePaymentData(
    request: PaymentInitiationRequest,
    tranId: string
  ): SSLCommerzInitData {
    // Build redirect URLs with transaction ID
    const urls = buildRedirectURLs(this.baseUrl, { tran_id: tranId });

    const functionBase = this.functionPublicBaseUrl?.endsWith('/')
      ? this.functionPublicBaseUrl.slice(0, -1)
      : this.functionPublicBaseUrl;

    const ipnBase = functionBase || this.baseUrl;

    const data: SSLCommerzInitData = {
      tran_id: tranId,
      total_amount: Number(formatAmount(request.total_amount)),
      currency: 'BDT',
      success_url: urls.success_url,
      fail_url: urls.fail_url,
      cancel_url: urls.cancel_url,
      ipn_url: `${ipnBase}/payment/ipn`,
      cus_name: sanitizeString(request.cus_name),
      cus_email: request.cus_email.toLowerCase(),
      cus_phone: request.cus_phone,
      cus_add1: sanitizeString(request.cus_add1 || 'Dhaka'),
      cus_city: sanitizeString(request.cus_city || 'Dhaka'),
      cus_postcode: request.cus_postcode || '1000',
      cus_country: sanitizeString(request.cus_country || 'Bangladesh'),
      ship_name: sanitizeString(request.cus_name),
      ship_add1: sanitizeString(request.ship_add1 || request.cus_add1 || 'Dhaka'),
      ship_city: sanitizeString(request.ship_city || request.cus_city || 'Dhaka'),
      ship_postcode: request.ship_postcode || request.cus_postcode || '1000',
      ship_country: sanitizeString(request.ship_country || request.cus_country || 'Bangladesh'),
      shipping_method: request.shipping_method || 'Courier',
      product_name: sanitizeString(request.product_name || 'Auto Spark Services'),
      product_category: sanitizeString(request.product_category || 'vehicle_service'),
      product_profile: 'general'
    };

    return data;
  }

  /**
   * Initializes a payment transaction with SSLCommerz
   * 
   * @param {PaymentInitiationRequest} request - Payment initiation request
   * @param {any} SSLCommerzPaymentClass - SSLCommerzPayment class from sslcommerz-lts
   * @returns {Promise<object>} Initialization result with redirect URL
   * 
   * @example
   * const result = await initializer.initializePayment(request, SSLCommerzPayment);
   * // Returns: { success: true, redirectUrl: 'https://...', tranId: 'AS_LIVE_...' }
   */
  async initializePayment(
    request: PaymentInitiationRequest,
    SSLCommerzPaymentClass: any
  ): Promise<{
    success: boolean;
    redirectUrl?: string;
    tranId?: string;
    error?: string;
    statusCode: number;
  }> {
    try {
      // Validate request
      const validation = this.validateRequest(request);
      if (!validation.valid) {
        return {
          success: false,
          error: validation.errors.join('; '),
          statusCode: 400
        };
      }

      // Generate unique transaction ID
      const tranId = generateTransactionId();
      logPaymentEvent('payment_init_start', { tranId, amount: request.total_amount }, this.logFn);

      // Prepare payment data
      const paymentData = this.preparePaymentData(request, tranId);

      // Initialize SSLCommerz
      const sslcz = new SSLCommerzPaymentClass(this.storeId, this.storePasswd, this.isLive);
      const apiResponse = await sslcz.init(paymentData);

      // Validate SSLCommerz response
      if (!isValidSSLCommerzResponse(apiResponse)) {
        logPaymentEvent('payment_init_failed', { tranId, response: apiResponse }, this.errorFn);
        return {
          success: false,
          error: 'Failed to initialize payment gateway',
          statusCode: 502
        };
      }

      logPaymentEvent('payment_init_success', {
        tranId,
        sessionkey: apiResponse.sessionkey,
        amount: request.total_amount
      }, this.logFn);

      return {
        success: true,
        redirectUrl: apiResponse.GatewayPageURL,
        tranId,
        statusCode: 200
      };
    } catch (error) {
      return {
        ...handleError(error as Error | string, 'PaymentInitializer.initializePayment', this.errorFn),
        statusCode: 500
      };
    }
  }

  /**
   * Creates an order document data from payment request
   * 
   * @param {PaymentInitiationRequest} request - Payment request
   * @param {string} tranId - Transaction ID
   * @returns {object} Order document data
   */
  createOrderData(request: PaymentInitiationRequest, tranId: string): Record<string, any> {
    return {
      tran_id: tranId,
      status: 'pending',
      amount: request.total_amount,
      currency: 'BDT',
      customer_name: request.cus_name,
      customer_email: request.cus_email,
      customer_phone: request.cus_phone,
      created_at: new Date().toISOString(),
      paid_at: null,
      validation_id: null,
      payment_method: null,
      metadata: {
        product_name: request.product_name,
        product_category: request.product_category,
        order_id: request.order_id,
        customer_address: request.cus_add1,
        customer_city: request.cus_city
      }
    };
  }
}
