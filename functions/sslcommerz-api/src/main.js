const SSLCommerzPayment = require('sslcommerz-lts');

module.exports = async ({ req, res, log, error }) => {
  // Config from Appwrite Environment Variables
  const store_id = process.env.SSLCZ_STORE_ID;
  const store_passwd = process.env.SSLCZ_STORE_PASSWD;
  const is_live = true; // Set to true to use the REAL LIVE production gateway

  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

  // Parse CORS for web client access
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };

  if (req.method === 'OPTIONS') {
    return res.text('', 204, corsHeaders);
  }

  // Route: /init
  if (req.path === '/init' && req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const data = {
        total_amount: body.total_amount,
        currency: 'BDT',
        tran_id: `REF${Date.now()}`, 
        success_url: `${req.headers.origin || process.env.BASE_URL}/payment-success`,
        fail_url: `${req.headers.origin || process.env.BASE_URL}/payment-fail`,
        cancel_url: `${req.headers.origin || process.env.BASE_URL}/payment-cancel`,
        ipn_url: `${process.env.APPWRITE_FUNCTION_ENDPOINT}/ipn`,
        shipping_method: 'Courier',
        product_name: 'Autospark Products',
        product_category: 'Electronic',
        product_profile: 'general',
        cus_name: body.cus_name || 'Customer Name',
        cus_email: body.cus_email || 'cust@example.com',
        cus_add1: 'Dhaka',
        cus_city: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: body.cus_phone || body.mobile || '01711111111',
        ship_name: body.cus_name || 'Customer Name',
        ship_add1: 'Dhaka',
        ship_city: 'Dhaka',
        ship_postcode: '1000',
        ship_country: 'Bangladesh',
      };

      const apiResponse = await sslcz.init(data);
      log('SSLCommerz Initialised. Response: ' + JSON.stringify(apiResponse));
      return res.json({ redirectUrl: apiResponse.GatewayPageURL }, 200, corsHeaders);
    } catch (err) {
      error(`Init Error: ${err.message}`);
      return res.json({ error: 'Failed to initialize payment' }, 500, corsHeaders);
    }
  }

  // Route: /ipn (Server-to-server callback)
  if (req.path === '/ipn' && req.method === 'POST') {
    // Validate IPN response and update your Appwrite database here
    log("IPN received: " + JSON.stringify(req.body));
    return res.json({ status: 'IPN Processed' }, 200, corsHeaders);
  }

  return res.json({ error: 'Not found' }, 404, corsHeaders);
};
