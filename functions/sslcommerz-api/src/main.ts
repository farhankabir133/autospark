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

const normalizePaymentRequest = (raw: Record<string, any>): PaymentInitiationRequest => {
  const cus_phone = String(raw.cus_phone || raw.mobile || raw.phone || '').trim();
  const cus_name = String(raw.cus_name || raw.customer_name || raw.customerName || '').trim();
  const fallbackEmail = cus_phone ? `customer_${cus_phone.replace(/\D/g, '')}@autosparkbd.com` : 'customer@autosparkbd.com';

  const totalAmountRaw = raw.total_amount ?? raw.amount ?? 0;
  const total_amount = typeof totalAmountRaw === 'number' ? totalAmountRaw : Number(totalAmountRaw);

  return {
    total_amount,
    cus_name,
    cus_email: String(raw.cus_email || raw.customer_email || raw.email || fallbackEmail).trim().toLowerCase(),
    cus_phone,
    order_id: raw.order_id || raw.orderId,
    product_name: raw.product_name || raw.productName || 'Auto Spark Services',
    product_category: raw.product_category || raw.productCategory || 'vehicle_service',
    cus_add1: raw.cus_add1 || raw.address || raw.customer_address || 'Dhaka',
    cus_city: raw.cus_city || raw.district || raw.city || 'Dhaka',
    cus_postcode: raw.cus_postcode || raw.postcode || '1000',
    cus_country: raw.cus_country || raw.country || 'Bangladesh',
    ship_add1: raw.ship_add1 || raw.address || raw.customer_address || 'Dhaka',
    ship_city: raw.ship_city || raw.district || raw.city || 'Dhaka',
    ship_postcode: raw.ship_postcode || raw.postcode || '1000',
    ship_country: raw.ship_country || raw.country || 'Bangladesh',
    shipping_method: raw.shipping_method || 'Courier',
  };
};

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
  const FUNCTION_PUBLIC_BASE_URL = process.env.FUNCTION_PUBLIC_BASE_URL || '';

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
    {
      isLive: true,
      logFn: log,
      errorFn: error,
      functionPublicBaseUrl: FUNCTION_PUBLIC_BASE_URL,
    }
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

        const normalizedRequest = normalizePaymentRequest(body as Record<string, any>);

        // Initialize payment
        const initResult = await paymentInitializer.initializePayment(
          normalizedRequest,
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
          normalizedRequest,
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
              amount: normalizedRequest.total_amount
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
            tranId: getResult.data?.tran_id || getResult.data?.$id,
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
