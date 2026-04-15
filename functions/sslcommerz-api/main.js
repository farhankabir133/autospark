import 'dotenv/config';
import SSLCommerzPayment from 'sslcommerz-lts';
import crypto from 'node:crypto';
import { Client, Databases, Query } from 'node-appwrite';

const DEFAULT_EXECUTION_ENDPOINT =
  'https://sgp.cloud.appwrite.io/v1/functions/sslcommerz-api/executions';

const getStoreCredentials = () => ({
  storeId: process.env.SSL_STORE_ID || process.env.SSLCZ_STORE_ID || '',
  storePassword: process.env.SSL_STORE_PASSWORD || process.env.SSLCZ_STORE_PASSWD || '',
});

const getMissingEnvKeys = () => {
  const { storeId, storePassword } = getStoreCredentials();
  const missing = [];

  if (!storeId) missing.push('SSL_STORE_ID (or SSLCZ_STORE_ID)');
  if (!storePassword) missing.push('SSL_STORE_PASSWORD (or SSLCZ_STORE_PASSWD)');
  if (!process.env.APPWRITE_API_ENDPOINT) missing.push('APPWRITE_API_ENDPOINT');
  if (!process.env.APPWRITE_PROJECT_ID) missing.push('APPWRITE_PROJECT_ID');
  if (!process.env.APPWRITE_API_KEY) missing.push('APPWRITE_API_KEY');

  return missing;
};

const normalizeBaseUrl = (url) => (url || '').replace(/\/$/, '');

const isRouteExecutionEndpoint = (url) => url.includes('/executions');

const callbackUrls = (executionEndpoint, frontendBaseUrl) => {
  const endpoint = normalizeBaseUrl(executionEndpoint) || DEFAULT_EXECUTION_ENDPOINT;
  const customDomain = normalizeBaseUrl(frontendBaseUrl || 'https://autosparkbd.com') || 'https://autosparkbd.com';

  return {
    success_url: `${customDomain}/payment-success`,
    fail_url: `${customDomain}/payment-fail`,
    cancel_url: `${customDomain}/checkout`,
    ipn_url: `${endpoint}/payment/ipn`,
  };
};

const resolveFrontendBaseUrl = () =>
  normalizeBaseUrl(process.env.FRONTEND_BASE_URL || process.env.BASE_URL || 'https://autosparkbd.com');

const htmlEscape = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const buildFrontendCallbackRedirectUrl = (frontendBaseUrl, callbackPath, payload = {}) => {
  const url = new URL(callbackPath, `${frontendBaseUrl}/`);

  const forwardedKeys = [
    'tran_id',
    'status',
    'val_id',
    'amount',
    'currency',
    'bank_tran_id',
    'card_type',
    'error',
  ];

  forwardedKeys.forEach((key) => {
    const value = payload?.[key];
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
};

const buildRedirectHtml = (redirectUrl) => {
  const safeRedirectUrl = htmlEscape(redirectUrl);
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="refresh" content="0;url=${safeRedirectUrl}" />
    <title>Redirecting to Auto Spark</title>
  </head>
  <body>
    <p>Redirecting to Auto Spark payment page...</p>
    <p><a href="${safeRedirectUrl}">Continue</a></p>
    <script>window.location.replace(${JSON.stringify(redirectUrl)});</script>
  </body>
</html>`;
};

const parseIncomingBody = (body) => {
  if (!body) return {};
  if (typeof body === 'object') return body;
  if (typeof body !== 'string') return {};

  const trimmed = body.trim();
  if (!trimmed) return {};

  try {
    return JSON.parse(trimmed);
  } catch {
    const params = new URLSearchParams(trimmed);
    if (![...params.keys()].length) return { raw: trimmed };
    return Object.fromEntries(params.entries());
  }
};

const getRouteFromPayload = (payload = {}) => {
  const explicitRoute = String(payload.route || payload.path || payload.callback || '').trim();
  if (explicitRoute) {
    if (explicitRoute.startsWith('/payment/')) return explicitRoute;
    return `/payment/${explicitRoute.replace(/^\/+/, '')}`;
  }

  const status = String(payload.status || payload.gateway_status || '').toUpperCase();
  if (payload.val_id || payload.validation_id) return '/payment/ipn';
  if (status === 'VALID' || status === 'VALIDATED' || status === 'DONE') return '/payment/success';
  if (status === 'FAILED' || status === 'FAIL') return '/payment/fail';
  if (status === 'CANCELLED' || status === 'CANCELED') return '/payment/cancel';

  return '';
};

const verifySslCommerzHash = (payload, storePassword) => {
  const verifySign = String(payload.verify_sign || '').trim().toLowerCase();
  const verifyKey = String(payload.verify_key || '').trim();

  if (!verifySign || !verifyKey) {
    return { valid: false, reason: 'verify_sign or verify_key missing' };
  }

  const keys = verifyKey
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean);

  if (!keys.length) {
    return { valid: false, reason: 'verify_key empty' };
  }

  const passwordMd5 = crypto.createHash('md5').update(String(storePassword)).digest('hex');
  const verifyPayload = { store_passwd: passwordMd5 };

  keys.forEach((key) => {
    if (payload[key] !== undefined && payload[key] !== null) {
      verifyPayload[key] = String(payload[key]);
    }
  });

  const sorted = Object.keys(verifyPayload)
    .sort()
    .map((key) => `${key}=${verifyPayload[key]}`)
    .join('&');

  const calculated = crypto.createHash('md5').update(sorted).digest('hex').toLowerCase();
  return {
    valid: calculated === verifySign,
    calculated,
    verifySign,
  };
};

const validateGatewayByValId = async (sslcz, payload) => {
  const valId = payload.val_id || payload.validation_id;
  if (!valId) {
    return { valid: false, reason: 'val_id missing' };
  }

  try {
    const validated = await sslcz.validate({ val_id: valId });
    const first = Array.isArray(validated) ? validated[0] : validated;
    const status = String(first?.status || first?.APIConnect || '').toUpperCase();
    const valid = status === 'VALID' || status === 'VALIDATED' || status === 'DONE';
    return { valid, details: first || null, status };
  } catch (err) {
    return {
      valid: false,
      reason: err?.message || 'SSLCommerz validation failed',
    };
  }
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

const findTransactionDocumentId = async (databases, dbId, collectionId, tranId) => {
  const normalizedTranId = String(tranId || '').trim();
  if (!normalizedTranId) return null;

  try {
    const list = await databases.listDocuments(dbId, collectionId, [
      Query.equal('$id', [normalizedTranId]),
      Query.limit(1),
    ]);

    if (list.documents?.[0]?.$id) {
      return list.documents[0].$id;
    }
  } catch {
    // fall through to optional tran_id lookup
  }

  try {
    const list = await databases.listDocuments(dbId, collectionId, [
      Query.equal('tran_id', [normalizedTranId]),
      Query.limit(1),
    ]);

    return list.documents?.[0]?.$id || null;
  } catch {
    return null;
  }
};

const safeUpdateTransaction = async (databases, dbId, collectionId, docId, updatePayload) => {
  try {
    return await databases.updateDocument(dbId, collectionId, docId, updatePayload);
  } catch (err) {
    const message = String(err?.message || err);
    if (!/Unknown attribute|Invalid document structure|missing required/i.test(message)) {
      throw err;
    }

    const narrowed = {
      status: updatePayload.status,
      ...(updatePayload.gateway_status ? { gateway_status: updatePayload.gateway_status } : {}),
    };

    try {
      return await databases.updateDocument(dbId, collectionId, docId, narrowed);
    } catch {
      return await databases.updateDocument(dbId, collectionId, docId, { status: updatePayload.status });
    }
  }
};

const generateTransactionId = () =>
  `txn_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

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
  const { storeId, storePassword } = getStoreCredentials();
  const dbId = process.env.APPWRITE_ORDERS_DATABASE_ID || '69dd576a00019558df4d';
  const collectionId = process.env.APPWRITE_ORDERS_COLLECTION_ID || 'transactions';
  const callbackExecutionEndpoint = normalizeBaseUrl(
    process.env.FUNCTION_EXECUTION_ENDPOINT ||
      process.env.FUNCTION_PUBLIC_BASE_URL ||
      DEFAULT_EXECUTION_ENDPOINT
  );
  const frontendBaseUrl = resolveFrontendBaseUrl();
  const sslcz = new SSLCommerzPayment(storeId, storePassword, true);

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

  const parsedBody = parseIncomingBody(req.body);
  const resolvedRouteFromPayload = req.path === '/' && req.method === 'POST' ? getRouteFromPayload(parsedBody) : '';
  const effectivePath = resolvedRouteFromPayload || req.path;

  // POST /payment/init
  if (effectivePath === '/payment/init' && req.method === 'POST') {
    try {
      const payload = parsedBody;

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
        status: 'pending',
      };

      log('Final Document Data:', documentData);
      console.log('Final Document Data:', documentData);

      // Create transaction document first and use its document id as tran_id
  const tranId = generateTransactionId();

      let created;
      try {
        created = await databases.createDocument(dbId, collectionId, tranId, documentData);
      } catch (dbError) {
        log('Database Error Detail:', dbError?.message || dbError);
        return error(
          res,
          { success: false, error: dbError?.message || 'Database createDocument failed' },
          500,
          corsHeaders
        );
      }

      const createdTranId = String(created?.$id || '').trim();
      if (!createdTranId) {
        return error(
          res,
          {
            success: false,
            error: 'Failed to resolve persisted transaction document ID',
          },
          500,
          corsHeaders
        );
      }

      const mapped = mapPayloadToGatewayFields({
        ...safePayload,
        customer_name: documentData.customer_name,
        mobile: documentData.mobile,
        address: documentData.address,
        district: documentData.district,
        total_amount: documentData.total_amount,
        cart_items: documentData.cart_items,
      });

  const urls = callbackUrls(callbackExecutionEndpoint, frontendBaseUrl);

      const gatewayPayload = {
        tran_id: createdTranId,
        total_amount: mapped.total_amount,
        currency: 'BDT',
        ...urls,
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
          {
            success: false,
            error: gateway?.failedreason || 'Failed to initialize payment gateway',
            details: gateway || null,
          },
          502,
          corsHeaders
        );
      }

      return ok(
        res,
        {
          success: true,
          redirectUrl: gateway.GatewayPageURL,
          data: {
            redirectUrl: gateway.GatewayPageURL,
            tranId: createdTranId,
            amount: mapped.total_amount,
            success_url: urls.success_url,
            fail_url: urls.fail_url,
            cancel_url: urls.cancel_url,
            ipn_url: urls.ipn_url,
          },
        },
        corsHeaders
      );
    } catch (e) {
      log(`payment/init error: ${e?.message || e}`);
      return error(
        res,
        {
          success: false,
          error: e?.message || 'Internal error',
          details: e?.stack || null,
        },
        500,
        corsHeaders
      );
    }
  }

  const processTransactionCallback = async ({ mode, payload }) => {
    const tranId = String(payload.tran_id || payload.tranId || '').trim();
    if (!tranId) {
      return {
        statusCode: 400,
        body: { success: false, error: 'tran_id is required' },
      };
    }

    let documentId = tranId;

    const hashCheck = verifySslCommerzHash(payload, storePassword);
    const gatewayValidation = await validateGatewayByValId(sslcz, payload);
    const payloadStatus = String(payload.status || '').toUpperCase();

    let updatePayload = {
      status: 'failed',
      gateway_status: 'FAILED',
    };

    if (mode === 'success') {
      const successByStatus = payloadStatus === 'VALID' || payloadStatus === 'VALIDATED' || payloadStatus === 'DONE';
      const validated = hashCheck.valid && (gatewayValidation.valid || successByStatus);

      updatePayload = {
        status: validated ? 'complete' : 'failed',
        gateway_status: validated ? 'VALIDATED' : hashCheck.valid ? 'VALIDATION_FAILED' : 'HASH_INVALID',
      };
    }

    if (mode === 'fail') {
      updatePayload = {
        status: 'failed',
        gateway_status: hashCheck.valid ? 'FAILED' : 'HASH_INVALID',
      };
    }

    if (mode === 'cancel') {
      updatePayload = {
        status: 'cancelled',
        gateway_status: hashCheck.valid ? 'CANCELLED' : 'HASH_INVALID',
      };
    }

    if (mode === 'ipn') {
      const validated = hashCheck.valid && gatewayValidation.valid;
      updatePayload = {
        status: validated ? 'complete' : 'failed',
        gateway_status: validated ? 'VALIDATED' : hashCheck.valid ? 'VALIDATION_FAILED' : 'HASH_INVALID',
      };
    }

    try {
      await safeUpdateTransaction(databases, dbId, collectionId, documentId, updatePayload);
    } catch (directUpdateError) {
      const fallbackDocId = await findTransactionDocumentId(databases, dbId, collectionId, tranId);
      if (!fallbackDocId) {
        return {
          statusCode: 404,
          body: {
            success: false,
            error: `Transaction not found for tran_id: ${tranId}`,
            details: directUpdateError?.message || String(directUpdateError),
          },
        };
      }

      documentId = fallbackDocId;
      await safeUpdateTransaction(databases, dbId, collectionId, documentId, updatePayload);
    }

    return {
      statusCode: 200,
      body: {
        success: true,
        data: {
          tranId,
          mode,
          status: updatePayload.status,
          gateway_status: updatePayload.gateway_status,
          hashValid: hashCheck.valid,
          validated: gatewayValidation.valid,
        },
      },
    };
  };

  if (
    req.method === 'POST' &&
    ['/payment/success', '/payment/fail', '/payment/cancel', '/payment/ipn'].includes(effectivePath)
  ) {
    try {
      const routeMap = {
        '/payment/success': 'success',
        '/payment/fail': 'fail',
        '/payment/cancel': 'cancel',
        '/payment/ipn': 'ipn',
      };

      const mode = routeMap[effectivePath];
      const result = await processTransactionCallback({ mode, payload: parsedBody });

      if (mode !== 'ipn' && result.statusCode >= 200 && result.statusCode < 300) {
        const redirectPathByMode = {
          success: '/payment/success',
          fail: '/payment/fail',
          cancel: '/payment/cancel',
        };

        const redirectUrl = buildFrontendCallbackRedirectUrl(
          frontendBaseUrl,
          redirectPathByMode[mode] || '/payment/fail',
          parsedBody
        );

        return res.text(buildRedirectHtml(redirectUrl), 200, {
          ...corsHeaders,
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        });
      }

      return res.json(result.body, result.statusCode, corsHeaders);
    } catch (e) {
      return error(
        res,
        { success: false, error: e?.message || 'Callback processing failed' },
        500,
        corsHeaders
      );
    }
  }

  // POST /payment/ipn
  // GET /payment/status/:tranId
  if (effectivePath.startsWith('/payment/status/') && req.method === 'GET') {
    try {
      const tranId = effectivePath.split('/payment/status/')[1];
      if (!tranId) {
        return error(res, { success: false, error: 'tran_id is required' }, 400, corsHeaders);
      }

      let doc;
      try {
        const byId = await databases.listDocuments(dbId, collectionId, [
          Query.equal('$id', [tranId]),
          Query.limit(1),
        ]);

        if (!byId.documents?.length) {
          throw new Error('Document not found by id');
        }

        doc = byId.documents[0];
      } catch (primaryError) {
        try {
          const list = await databases.listDocuments(dbId, collectionId, [
            Query.equal('tran_id', [tranId]),
            Query.limit(1),
          ]);

          if (!list.documents?.length) {
            throw primaryError;
          }

          doc = list.documents[0];
        } catch {
          throw primaryError;
        }
      }

      return ok(
        res,
        {
          success: true,
          data: {
            tranId: doc.tran_id || doc.$id,
            status: doc.status,
            amount: doc.total_amount ?? doc.amount,
            currency: doc.currency,
            createdAt: doc.created_at || doc.$createdAt,
            paidAt: doc.paid_at,
          },
        },
        corsHeaders
      );
    } catch (e) {
      return error(res, { success: false, error: e?.message || 'Order not found' }, 404, corsHeaders);
    }
  }

  if (req.path === '/' && req.method === 'POST' && isRouteExecutionEndpoint(callbackExecutionEndpoint)) {
    return error(
      res,
      {
        success: false,
        error:
          'Callback payload did not match any payment route. Ensure SSLCommerz posts tran_id and status/val_id.',
      },
      400,
      corsHeaders
    );
  }

  return error(
    res,
    { success: false, error: `Route not found: ${req.method} ${effectivePath || req.path}` },
    404,
    corsHeaders
  );
};