/**
 * Auto Spark - SSLCommerz Payment Integration
 * IPN (Instant Payment Notification) Handler
 * 
 * Processes and validates payment notifications from SSLCommerz.
 */

import type { SSLCommerzIPNRequest, SSLCommerzValidationResponse } from './types';
import { extractIPNData, logPaymentEvent, handleError, maskSensitive } from './utils';

/**
 * IPNValidator class handles IPN validation from SSLCommerz
 */
export class IPNValidator {
  private storeId: string;
  private storePasswd: string;
  private isLive: boolean = true;
  private logFn?: (message: string) => void;
  private errorFn?: (message: string) => void;

  /**
   * Initialize the IPNValidator
   * 
   * @param {string} storeId - SSLCommerz Store ID
   * @param {string} storePasswd - SSLCommerz Store Password
   * @param {object} options - Additional options
   */
  constructor(
    storeId: string,
    storePasswd: string,
    options?: {
      isLive?: boolean;
      logFn?: (message: string) => void;
      errorFn?: (message: string) => void;
    }
  ) {
    this.storeId = storeId;
    this.storePasswd = storePasswd;
    this.isLive = options?.isLive ?? true;
    this.logFn = options?.logFn;
    this.errorFn = options?.errorFn;
  }

  /**
   * Validates IPN request data structure
   * 
   * @param {Record<string, any>} data - IPN request body
   * @returns {object} Validation result
   */
  private validateIPNStructure(data: Record<string, any>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const requiredFields = ['tran_id', 'val_id', 'amount', 'status'];

    for (const field of requiredFields) {
      if (!data[field]) {
        errors.push(`Missing required field: ${field}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Validates payment with SSLCommerz using val_id
   * 
   * @param {string} valId - Validation ID from SSLCommerz
   * @param {any} SSLCommerzPaymentClass - SSLCommerzPayment class from sslcommerz-lts
   * @returns {Promise<object>} Validation result
   * 
   * @example
   * const result = await validator.validateWithSSLCommerz(valId, SSLCommerzPayment);
   * // Returns: { valid: true, result: 'VALID', card_type: 'Visa', ... }
   */
  async validateWithSSLCommerz(
    valId: string,
    SSLCommerzPaymentClass: any
  ): Promise<{
    valid: boolean;
    result?: string;
    data?: Record<string, any>;
    error?: string;
    transactionId?: string;
  }> {
    try {
      if (!valId) {
        return {
          valid: false,
          error: 'Validation ID is required'
        };
      }

      logPaymentEvent('ipn_validation_start', { val_id: maskSensitive(valId) }, this.logFn);

      // Initialize SSLCommerz and call validate
      const sslcz = new SSLCommerzPaymentClass(this.storeId, this.storePasswd, this.isLive);
      const validationResponse = await sslcz.validate(valId);

      logPaymentEvent('ipn_validation_response', {
        val_id: maskSensitive(valId),
        result: validationResponse.result,
        status: validationResponse.status
      }, this.logFn);

      // Check if validation was successful
      const isValid = validationResponse.result === 'VALID' || validationResponse.status === 'VALID';

      if (!isValid) {
        logPaymentEvent('ipn_validation_failed', {
          val_id: maskSensitive(valId),
          result: validationResponse.result,
          tran_id: validationResponse.tran_id
        }, this.errorFn);
      }

      return {
        valid: isValid,
        result: validationResponse.result,
        data: validationResponse,
        transactionId: validationResponse.tran_id
      };
    } catch (error) {
      logPaymentEvent('ipn_validation_error', {
        val_id: maskSensitive(valId),
        error: error instanceof Error ? error.message : String(error)
      }, this.errorFn);

      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Validation failed'
      };
    }
  }

  /**
   * Processes IPN request from SSLCommerz
   * 
   * @param {Record<string, any>} ipnBody - IPN request body
   * @param {any} SSLCommerzPaymentClass - SSLCommerzPayment class
   * @returns {Promise<object>} Processing result
   * 
   * @example
   * const result = await validator.processIPN(req.body, SSLCommerzPayment);
   * // Returns: { success: true, tranId: 'AS_LIVE_...', valid: true, ... }
   */
  async processIPN(
    ipnBody: Record<string, any>,
    SSLCommerzPaymentClass: any
  ): Promise<{
    success: boolean;
    tranId?: string;
    valid?: boolean;
    validationData?: Record<string, any>;
    error?: string;
  }> {
    try {
      // Validate IPN structure
      const structureValidation = this.validateIPNStructure(ipnBody);
      if (!structureValidation.valid) {
        logPaymentEvent('ipn_structure_invalid', {
          errors: structureValidation.errors
        }, this.errorFn);

        return {
          success: false,
          error: 'Invalid IPN structure: ' + structureValidation.errors.join('; ')
        };
      }

      // Extract IPN data
      const ipnData = extractIPNData(ipnBody);
      logPaymentEvent('ipn_received', {
        tran_id: ipnData.tranId,
        val_id: maskSensitive(ipnData.valId),
        amount: ipnData.amount,
        status: ipnData.status
      }, this.logFn);

      // Validate with SSLCommerz
      const validationResult = await this.validateWithSSLCommerz(ipnData.valId, SSLCommerzPaymentClass);

      if (!validationResult.valid) {
        logPaymentEvent('ipn_validation_failed', {
          tran_id: ipnData.tranId,
          val_id: maskSensitive(ipnData.valId),
          error: validationResult.error
        }, this.errorFn);

        return {
          success: false,
          tranId: ipnData.tranId,
          valid: false,
          error: validationResult.error || 'Payment validation failed'
        };
      }

      logPaymentEvent('ipn_processing_success', {
        tran_id: ipnData.tranId,
        val_id: maskSensitive(ipnData.valId),
        amount: ipnData.amount
      }, this.logFn);

      return {
        success: true,
        tranId: ipnData.tranId,
        valid: true,
        validationData: validationResult.data
      };
    } catch (error) {
      return handleError(error as Error | string, 'IPNValidator.processIPN', this.errorFn) as any;
    }
  }

  /**
   * Extracts payment information from validated IPN data
   * 
   * @param {Record<string, any>} validationData - Validated data from SSLCommerz
   * @returns {object} Extracted payment info
   */
  extractPaymentInfo(validationData: Record<string, any>): {
    transactionId: string;
    amount: string;
    cardType?: string;
    cardIssuer?: string;
    validationId: string;
  } {
    return {
      transactionId: validationData.tran_id || '',
      amount: validationData.amount || '0',
      cardType: validationData.card_type,
      cardIssuer: validationData.card_issuer,
      validationId: validationData.valid_id || validationData.val_id || ''
    };
  }

  /**
   * Checks if payment status is valid for order completion
   * 
   * @param {string} status - Payment status from IPN
   * @returns {boolean} True if payment should be marked as completed
   */
  isPaymentSuccessful(status: string): boolean {
    const successStatuses = ['VALID', 'valid', 'SUCCESS', 'success', 'COMPLETED'];
    return successStatuses.includes(status);
  }
}
