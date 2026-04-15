import 'dotenv/config';
import SSLCommerzPayment from 'sslcommerz-lts';
import { Client, Databases, ID } from 'node-appwrite';

const requiredEnvKeys = [
  'SSLCZ_STORE_ID',
  'SSLCZ_STORE_PASSWD',
  'APPWRITE_API_ENDPOINT',
  'APPWRITE_PROJECT_ID',
  'APPWRITE_API_KEY',
  'APPWRITE_ORDERS_DATABASE_ID',
  'APPWRITE_ORDERS_COLLECTION_ID',
  'BASE_URL',
];

const getMissingEnvKeys = () => requiredEnvKeys.filter((key) => !process.env[key]);

const normalizeBaseUrl = (url) => (url || '').replace(/\/$/, '');

const callbackUrls = (baseUrl, tranId) => {
  const root = normalizeBaseUrl(baseUrl) || 'https://autosparkbd.com';
  const qs = new URLSearchParams({ tran_id: tranId }).toString();

  return {
    success_url: `${root}/#/payment-success?${qs}`,
    fail_url: `${root}/#/payment-fail?${qs}`,
    cancel_url: `${root}/#/payment-cancel?${qs}`,
  };
};

const mapPayloadToGatewayFields = (body = {}) => {
  const customerName = String(body.customer_name || body.cus_name || 'Customer').trim();
  const mobile = String(body.mobile || body.cus_phone || '').trim();
  const district = String(body.district || body.cus_city || 'Dhaka').trim() || 'Dhaka';
  const address = String(body.address || body.cus_add1 || 'Dhaka').trim() || 'Dhaka';

  const fallbackEmail = mobile
    ? `customer_${mobile.replace(/\D/g, '')}@autosparkbd.com`
    : 'customer@autosparkbd.com';

  const total_amount = Number(body.total_amount ?? body.amount ?? 0);

  return {
    total_amount,
    cus_name: customerName,
    cus_email: String(body.cus_email || body.customer_email || fallbackEmail).trim().toLowerCase(),
    cus_phone: mobile,
    cus_add1: address,
    cus_city: district,
    cus_postcode: String(body.postcode || body.cus_postcode || '1000'),
    cus_country: String(body.country || body.cus_country || 'Bangladesh'),
    ship_name: customerName,
    ship_add1: address,
    ship_city: district,
    ship_postcode: String(body.postcode || body.ship_postcode || '1000'),
    ship_country: String(body.country || body.ship_country || 'Bangladesh'),
    product_name: String(body.product_name || 'Auto Spark Accessories'),
    product_category: String(body.product_category || 'automotive'),
    shipping_method: String(body.shipping_method || 'Courier'),
    cart_items: body.cart_items || '',
  };
};

const createDatabasesClient = () => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_API_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  return new Databases(client);
};

const ok = (res, payload, headers = {}) => res.json(payload, 200, headers);
const error = (res, payload, code = 500, headers = {}) => res.json(payload, code, headers);

export default async ({ req, res, log }) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') {
    return res.text('', 204, corsHeaders);
  }

  const missing = getMissingEnvKeys();
  if (missing.length) {
    return error(
      res,
      { success: false, error: `Missing environment variables: ${missing.join(', ')}` },
      500,
      corsHeaders
    );
  }

  const databases = createDatabasesClient();
  const dbId = process.env.APPWRITE_ORDERS_DATABASE_ID;
  const collectionId = process.env.APPWRITE_ORDERS_COLLECTION_ID;
  const baseUrl = normalizeBaseUrl(process.env.BASE_URL || 'https://autosparkbd.com');
  const functionPublicBase = normalizeBaseUrl(process.env.FUNCTION_PUBLIC_BASE_URL || '');

  // Health routes
  if ((req.path === '/' || req.path === '/health') && req.method === 'GET') {
    return ok(
      res,
      {
        success: true,
        data: { status: 'ok', service: 'sslcommerz-api', mode: 'production' },
      },
      corsHeaders
    );
  }

  // POST /payment/init
  if (req.path === '/payment/init' && req.method === 'POST') {
    try {
      // 1) Safe parser for Appwrite body (string/object)
      let payload;
      if (typeof req.body === 'string') {
        try {
          payload = JSON.parse(req.body);
        } catch {
          payload = req.body;
        }
      } else {
        payload = req.body;
      }

      // 2) Debug logs to inspect incoming payload in Appwrite logs
      log('Incoming Payload:', payload);
      console.log('Incoming Payload:', payload);

      const safePayload = payload && typeof payload === 'object' ? payload : {};

      // 3) Extract and default required transactions fields
      const {
        customer_name,
        mobile,
        address,
        thana,
        district,
        total_amount,
        cart_items = '[]',
        session_id = `sess_${Date.now()}`,
        status = 'pending',
      } = safePayload;

      // 4) Validation before database call
      if (!mobile || !customer_name) {
        return error(
          res,
          {
            success: false,
            error: `Validation failed: mobile is ${mobile}, name is ${customer_name}`,
          },
          400,
          corsHeaders
        );
      }

      const parsedTotalAmount = Number.parseFloat(String(total_amount ?? 0));
      if (!Number.isFinite(parsedTotalAmount) || parsedTotalAmount <= 0) {
        return error(res, { success: false, error: 'Invalid total_amount' }, 400, corsHeaders);
      }

      const documentData = {
        customer_name: String(customer_name || ''),
        mobile: String(mobile || ''),
        address: String(address || ''),
        thana: String(thana || ''),
        district: String(district || ''),
        total_amount: parsedTotalAmount,
        cart_items:
          typeof cart_items === 'string' ? cart_items : JSON.stringify(cart_items || []),
        session_id: String(session_id || `sess_${Date.now()}`),
        status: String(status || 'pending'),
      };

      log('Final Document Data:', documentData);
      console.log('Final Document Data:', documentData);

      // Create transaction document first and use its document id as tran_id
      let created;
      try {
        created = await databases.createDocument(dbId, collectionId, ID.unique(), documentData);
      } catch (dbError) {
        log('Database Error Detail:', dbError?.message || dbError);
        return error(
          res,
          { success: false, error: dbError?.message || 'Database createDocument failed' },
          500,
          corsHeaders
        );
      }

      const tranId = created.$id;

      const mapped = mapPayloadToGatewayFields({
        ...safePayload,
        customer_name: documentData.customer_name,
        mobile: documentData.mobile,
        address: documentData.address,
        district: documentData.district,
        total_amount: documentData.total_amount,
        cart_items: documentData.cart_items,
      });

      const urls = callbackUrls(baseUrl, tranId);
      const ipnBase = functionPublicBase || baseUrl;

      const sslcz = new SSLCommerzPayment(
        process.env.SSLCZ_STORE_ID,
        process.env.SSLCZ_STORE_PASSWD,
        true
      );

      const gatewayPayload = {
        tran_id: tranId,
        total_amount: mapped.total_amount,
        currency: 'BDT',
        ...urls,
        ipn_url: `${ipnBase}/payment/ipn`,
        shipping_method: mapped.shipping_method,
        product_name: mapped.product_name,
        product_category: mapped.product_category,
        product_profile: 'general',
        cus_name: mapped.cus_name,
        cus_email: mapped.cus_email,
        cus_add1: mapped.cus_add1,
        cus_city: mapped.cus_city,
        cus_postcode: mapped.cus_postcode,
        cus_country: mapped.cus_country,
        cus_phone: mapped.cus_phone,
        ship_name: mapped.ship_name,
        ship_add1: mapped.ship_add1,
        ship_city: mapped.ship_city,
        ship_postcode: mapped.ship_postcode,
        ship_country: mapped.ship_country,
      };

      const gateway = await sslcz.init(gatewayPayload);
      if (!gateway?.GatewayPageURL) {
        return error(
          res,
          { success: false, error: gateway?.failedreason || 'Failed to initialize payment gateway' },
          502,
          corsHeaders
        );
      }

      return ok(
        res,
        {
          success: true,
          data: {
            redirectUrl: gateway.GatewayPageURL,
            tranId,
            amount: mapped.total_amount,
          },
        },
        corsHeaders
      );
    } catch (e) {
      log(`payment/init error: ${e?.message || e}`);
      return error(res, { success: false, error: e?.message || 'Internal error' }, 500, corsHeaders);
    }
  }

  // POST /payment/ipn
  if (req.path === '/payment/ipn' && req.method === 'POST') {
    try {
      const ipn = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const tranId = ipn.tran_id;

      if (!tranId) {
        return error(res, { success: false, error: 'tran_id is required' }, 400, corsHeaders);
      }

      let isValid = false;
      try {
        const sslcz = new SSLCommerzPayment(
          process.env.SSLCZ_STORE_ID,
          process.env.SSLCZ_STORE_PASSWD,
          true
        );

        if (ipn.val_id) {
          const validated = await sslcz.validate({ val_id: ipn.val_id });
          const first = Array.isArray(validated) ? validated[0] : validated;
          const validationStatus = String(first?.status || first?.APIConnect || '').toUpperCase();
          isValid = validationStatus === 'VALID' || validationStatus === 'VALIDATED' || validationStatus === 'DONE';
        }
      } catch {
        // fallback below when validate API call fails
      }

      if (!isValid) {
        const ipnStatus = String(ipn.status || '').toUpperCase();
        isValid = ipnStatus === 'VALID' || ipnStatus === 'VALIDATED';
      }

      await databases.updateDocument(dbId, collectionId, tranId, {
        status: isValid ? 'paid' : 'failed',
        paid_at: isValid ? new Date().toISOString() : null,
        validation_id: ipn.val_id || ipn.validation_id || null,
        payment_method: ipn.card_type || ipn.card_brand || null,
      });

      return ok(res, { success: true, data: { tranId, valid: isValid } }, corsHeaders);
    } catch (e) {
      return error(res, { success: false, error: e?.message || 'IPN processing failed' }, 500, corsHeaders);
    }
  }

  // GET /payment/status/:tranId
  if (req.path.startsWith('/payment/status/') && req.method === 'GET') {
    try {
      const tranId = req.path.split('/payment/status/')[1];
      if (!tranId) {
        return error(res, { success: false, error: 'tran_id is required' }, 400, corsHeaders);
      }

      const doc = await databases.getDocument(dbId, collectionId, tranId);
      return ok(
        res,
        {
          success: true,
          data: {
            tranId: doc.tran_id || doc.$id,
            status: doc.status,
            amount: doc.amount,
            currency: doc.currency,
            createdAt: doc.created_at,
            paidAt: doc.paid_at,
          },
        },
        corsHeaders
      );
    } catch (e) {
      return error(res, { success: false, error: e?.message || 'Order not found' }, 404, corsHeaders);
    }
  }

  return error(res, { success: false, error: `Route not found: ${req.method} ${req.path}` }, 404, corsHeaders);
};