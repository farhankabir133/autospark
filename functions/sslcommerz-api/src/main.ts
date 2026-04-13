/**
 * Auto Spark - SSLCommerz Payment Integration
 * Main Appwrite Function Handler
 * 
 * Production-ready payment gateway integration using TypeScript.
 * Endpoints:
 * - POST /payment/init - Initialize payment transaction
 * - POST /payment/ipn - Handle IPN callbacks from SSLCommerz
 * - GET /payment/status/:tranId - Check order status
 * - GET /payment/stats - Get payment statistics
 */

import { Client, Databases, Models } from 'appwrite';
import SSLCommerzPayment from 'sslcommerz-lts';
import type { PaymentInitiationRequest, APIResponse } from './types';
import { PaymentInitializer } from './payment-initializer';
import { IPNValidator } from './ipn-validator';
import { AppwriteOrderManager } from './appwrite-order-manager';
import { logPaymentEvent, handleError } from './utils';

/**
 * Main Appwrite Function Handler
 */
export default async (context: any): Promise<any> => {
  const { req, res, log, error } = context;

  // CORS Headers for web clients
  const corsHeaders = {
    'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  };

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.text('', 204, corsHeaders);
  }

  // Load environment variables
  const SSLCZ_STORE_ID = process.env.SSLCZ_STORE_ID || '';
  const SSLCZ_STORE_PASSWD = process.env.SSLCZ_STORE_PASSWD || '';
  const APPWRITE_API_ENDPOINT = process.env.APPWRITE_API_ENDPOINT || '';
  const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY || '';
  const APPWRITE_PROJECT_ID = process.env.APPWRITE_PROJECT_ID || '';
  const APPWRITE_ORDERS_DATABASE_ID = process.env.APPWRITE_ORDERS_DATABASE_ID || '';
  const APPWRITE_ORDERS_COLLECTION_ID = process.env.APPWRITE_ORDERS_COLLECTION_ID || '';
  const BASE_URL = process.env.BASE_URL || 'https://autosparkbd.com';

  // Validate required environment variables
  const missingEnvVars = [];
  if (!SSLCZ_STORE_ID) missingEnvVars.push('SSLCZ_STORE_ID');
  if (!SSLCZ_STORE_PASSWD) missingEnvVars.push('SSLCZ_STORE_PASSWD');
  if (!APPWRITE_API_ENDPOINT) missingEnvVars.push('APPWRITE_API_ENDPOINT');
  if (!APPWRITE_API_KEY) missingEnvVars.push('APPWRITE_API_KEY');
  if (!APPWRITE_PROJECT_ID) missingEnvVars.push('APPWRITE_PROJECT_ID');
  if (!APPWRITE_ORDERS_DATABASE_ID) missingEnvVars.push('APPWRITE_ORDERS_DATABASE_ID');
  if (!APPWRITE_ORDERS_COLLECTION_ID) missingEnvVars.push('APPWRITE_ORDERS_COLLECTION_ID');

  if (missingEnvVars.length > 0) {
    const errorMsg = `Missing environment variables: ${missingEnvVars.join(', ')}`;
    error(errorMsg);
    return res.json(
      { success: false, error: errorMsg } as APIResponse,
      500,
      corsHeaders
    );
  }

  // Initialize Appwrite Client
  const appwriteClient = new Client()
    .setEndpoint(APPWRITE_API_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);
  
  // Set API key via header (for Appwrite Functions context)
  (appwriteClient as any).headers['X-Appwrite-Key'] = APPWRITE_API_KEY;

  const orderManager = new AppwriteOrderManager(
    appwriteClient,
    APPWRITE_ORDERS_DATABASE_ID,
    APPWRITE_ORDERS_COLLECTION_ID,
    { logFn: log, errorFn: error }
  );

  const paymentInitializer = new PaymentInitializer(
    SSLCZ_STORE_ID,
    SSLCZ_STORE_PASSWD,
    BASE_URL,
    { isLive: true, logFn: log, errorFn: error }
  );

  const ipnValidator = new IPNValidator(
    SSLCZ_STORE_ID,
    SSLCZ_STORE_PASSWD,
    { isLive: true, logFn: log, errorFn: error }
  );

  try {
    // =============================================
    // Route: POST /payment/init
    // Initialize a new payment transaction
    // =============================================
    if (req.path === '/payment/init' && req.method === 'POST') {
      logPaymentEvent('route_payment_init', { method: 'POST', path: req.path }, log);

      try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

        // Validate request body
        if (!body || typeof body !== 'object') {
          return res.json(
            { success: false, error: 'Invalid request body' } as APIResponse,
            400,
            corsHeaders
          );
        }

        // Initialize payment
        const initResult = await paymentInitializer.initializePayment(
          body as PaymentInitiationRequest,
          SSLCommerzPayment
        );

        if (!initResult.success) {
          return res.json(
            { success: false, error: initResult.error } as APIResponse,
            initResult.statusCode,
            corsHeaders
          );
        }

        // Create order document in Appwrite
        const orderData = paymentInitializer.createOrderData(
          body as PaymentInitiationRequest,
          initResult.tranId!
        );

        const createOrderResult = await orderManager.createOrder(initResult.tranId!, orderData);

        if (!createOrderResult.success) {
          error(`Failed to create order: ${createOrderResult.error}`);
          // Still return success to redirect to payment gateway
          // Order can be created later from IPN
        }

        logPaymentEvent('payment_init_response', {
          tranId: initResult.tranId,
          redirectUrl: initResult.redirectUrl?.substring(0, 50) + '...'
        }, log);

        return res.json(
          {
            success: true,
            data: {
              redirectUrl: initResult.redirectUrl,
              tranId: initResult.tranId,
              amount: body.total_amount
            }
          } as APIResponse,
          200,
          corsHeaders
        );
      } catch (err) {
        const errorResult = handleError(err as Error | string, 'Route: /payment/init', error);
        return res.json(
          {
            success: false,
            error: errorResult.error
          } as APIResponse,
          errorResult.statusCode,
          corsHeaders
        );
      }
    }

    // =============================================
    // Route: POST /payment/ipn
    // Handle IPN callbacks from SSLCommerz
    // =============================================
    if (req.path === '/payment/ipn' && req.method === 'POST') {
      logPaymentEvent('route_payment_ipn', { method: 'POST', path: req.path }, log);

      try {
        const ipnBody = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

        // Process IPN
        const ipnResult = await ipnValidator.processIPN(ipnBody, SSLCommerzPayment);

        if (!ipnResult.success) {
          error(`IPN processing failed: ${ipnResult.error}`);
          return res.json(
            { success: false, error: ipnResult.error } as APIResponse,
            400,
            corsHeaders
          );
        }

        // Update order status based on validation result
        if (ipnResult.valid) {
          const paymentInfo = ipnValidator.extractPaymentInfo(ipnResult.validationData!);
          const updateResult = await orderManager.markOrderAsPaid(ipnResult.tranId!, {
            validation_id: paymentInfo.validationId,
            payment_method: paymentInfo.cardType || 'unknown'
          });

          if (!updateResult.success) {
            error(`Failed to update order: ${updateResult.error}`);
          }

          logPaymentEvent('ipn_order_updated', {
            tran_id: ipnResult.tranId,
            status: 'paid'
          }, log);
        } else {
          const failResult = await orderManager.markOrderAsFailed(
            ipnResult.tranId!,
            ipnResult.error || 'Payment validation failed'
          );

          if (!failResult.success) {
            error(`Failed to mark order as failed: ${failResult.error}`);
          }

          logPaymentEvent('ipn_order_failed', {
            tran_id: ipnResult.tranId,
            error: ipnResult.error
          }, log);
        }

        return res.json(
          {
            success: true,
            data: {
              tranId: ipnResult.tranId,
              valid: ipnResult.valid
            }
          } as APIResponse,
          200,
          corsHeaders
        );
      } catch (err) {
        const errorResult = handleError(err as Error | string, 'Route: /payment/ipn', error);
        return res.json(
          {
            success: false,
            error: errorResult.error
          } as APIResponse,
          errorResult.statusCode,
          corsHeaders
        );
      }
    }

    // =============================================
    // Route: GET /payment/status/:tranId
    // Get order status
    // =============================================
    if (req.path.startsWith('/payment/status/') && req.method === 'GET') {
      const tranId = req.path.split('/payment/status/')[1];

      if (!tranId) {
        return res.json(
          { success: false, error: 'Transaction ID is required' } as APIResponse,
          400,
          corsHeaders
        );
      }

      const getResult = await orderManager.getOrder(tranId);

      if (!getResult.success) {
        return res.json(
          { success: false, error: getResult.error } as APIResponse,
          404,
          corsHeaders
        );
      }

      return res.json(
        {
          success: true,
          data: {
            tranId: getResult.data?.$id,
            status: getResult.data?.status,
            amount: getResult.data?.amount,
            currency: getResult.data?.currency,
            createdAt: getResult.data?.created_at,
            paidAt: getResult.data?.paid_at
          }
        } as APIResponse,
        200,
        corsHeaders
      );
    }

    // =============================================
    // Route: GET /payment/stats
    // Get payment statistics
    // =============================================
    if (req.path === '/payment/stats' && req.method === 'GET') {
      const statsResult = await orderManager.getOrderStats();

      if (!statsResult.success) {
        return res.json(
          { success: false, error: statsResult.error } as APIResponse,
          500,
          corsHeaders
        );
      }

      return res.json(
        {
          success: true,
          data: statsResult.stats
        } as APIResponse,
        200,
        corsHeaders
      );
    }

    // =============================================
    // Route: Health Check
    // =============================================
    if ((req.path === '/' || req.path === '/health') && req.method === 'GET') {
      return res.json(
        {
          success: true,
          data: {
            status: 'ok',
            service: 'autospark-payment-gateway',
            version: '1.0.0',
            environment: 'production'
          }
        } as APIResponse,
        200,
        corsHeaders
      );
    }

    // =============================================
    // Route: Not Found
    // =============================================
    return res.json(
      {
        success: false,
        error: `Route not found: ${req.method} ${req.path}`
      } as APIResponse,
      404,
      corsHeaders
    );
  } catch (err) {
    const errorResult = handleError(err as Error | string, 'Main Handler', error);
    return res.json(
      {
        success: false,
        error: errorResult.error
      } as APIResponse,
      errorResult.statusCode,
      corsHeaders
    );
  }
};
