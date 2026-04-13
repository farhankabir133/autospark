import type { VercelRequest, VercelResponse } from '@vercel/node';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return response.status(200).setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type')
      .end();
  }

  // Only allow POST requests
  if (request.method !== 'POST') {
    return response
      .status(405)
      .setHeader('Access-Control-Allow-Origin', '*')
      .json({ error: 'Method not allowed' });
  }

  try {
    const {
      cart,
      total_amount,
      customer_name,
      mobile,
      address,
      thana,
      district,
    } = request.body;

    // Validate required fields
    if (
      !cart ||
      !total_amount ||
      !customer_name ||
      !mobile ||
      !address ||
      !thana ||
      !district
    ) {
      return response
        .status(400)
        .setHeader('Access-Control-Allow-Origin', '*')
        .json({
          error: 'Missing required fields',
        });
    }

    // Get SSLCommerz credentials from environment variables
    const STORE_ID = process.env.SSLCOMMERZ_STORE_ID || process.env.STORE_ID;
    const STORE_PASSWORD =
      process.env.SSLCOMMERZ_STORE_PASSWORD || process.env.STORE_PASS;
    const SITE_URL = process.env.SITE_URL || 'https://autosparkbd.com';

    // Validate credentials are available
    if (!STORE_ID || !STORE_PASSWORD) {
      console.error('Missing SSLCommerz credentials in environment');
      return response
        .status(500)
        .setHeader('Access-Control-Allow-Origin', '*')
        .json({
          error: 'Payment gateway not configured. Missing credentials.',
        });
    }

    // Generate transaction ID
    const tran_id = `autospark-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Prepare product name from cart
    const product_name = Array.isArray(cart)
      ? cart.map((item: any) => item.name || 'Item').join(', ')
      : 'Order';

    // Build FormData for SSLCommerz
    const params = new URLSearchParams();
    params.append('store_id', STORE_ID);
    params.append('store_passwd', STORE_PASSWORD);
    params.append('total_amount', String(total_amount));
    params.append('currency', 'BDT');
    params.append('tran_id', tran_id);
    params.append('success_url', `${SITE_URL}/payment/success?tran_id=${tran_id}`);
    params.append('fail_url', `${SITE_URL}/payment/fail`);
    params.append('cancel_url', `${SITE_URL}/payment/cancel`);
    params.append('product_name', product_name);
    params.append('product_category', 'Automotive');
    params.append('product_profile', 'general');

    // Customer details
    params.append('cus_name', customer_name);
    params.append('cus_email', 'customer@autosparkbd.com');
    params.append('cus_add1', address);
    params.append('cus_city', thana);
    params.append('cus_state', district);
    params.append('cus_postcode', '1200');
    params.append('cus_country', 'Bangladesh');
    params.append('cus_phone', mobile);

    // Shipping details
    params.append('shipping_method', 'Courier');
    params.append('ship_name', customer_name);
    params.append('ship_add1', address);
    params.append('ship_city', thana);
    params.append('ship_state', district);
    params.append('ship_postcode', '1200');
    params.append('ship_country', 'Bangladesh');

    // Call SSLCommerz API - USE LIVE ENDPOINT FOR PRODUCTION
    const sslCommerzUrl = 'https://securepay.sslcommerz.com/gwprocess/v4/api.php';
    
    console.log('🔄 Initiating SSLCommerz payment...');
    console.log('Store ID:', STORE_ID);
    console.log('Transaction ID:', tran_id);
    console.log('Total Amount:', total_amount);
    
    let sslResponse;
    try {
      sslResponse = await fetch(sslCommerzUrl, {
        method: 'POST',
        body: params,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
    } catch (fetchError) {
      console.error('❌ Network error calling SSLCommerz:', fetchError);
      return response
        .status(503)
        .setHeader('Access-Control-Allow-Origin', '*')
        .json({
          error: 'Failed to connect to payment gateway',
          details: fetchError instanceof Error ? fetchError.message : 'Unknown network error',
        });
    }

    if (!sslResponse.ok) {
      console.error('❌ SSLCommerz API error:', sslResponse.status);
      const responseText = await sslResponse.text();
      console.error('Response body:', responseText.substring(0, 200));
      return response
        .status(400)
        .setHeader('Access-Control-Allow-Origin', '*')
        .json({
          error: `SSLCommerz API error: ${sslResponse.status}`,
          statusText: sslResponse.statusText,
        });
    }

    let sslczData;
    try {
      const contentType = sslResponse.headers.get('content-type');
      console.log('Response content-type:', contentType);
      
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await sslResponse.text();
        console.error('❌ Invalid response format. Expected JSON, got:', responseText.substring(0, 300));
        return response
          .status(400)
          .setHeader('Access-Control-Allow-Origin', '*')
          .json({
            error: 'Invalid response from payment gateway - expected JSON',
            hint: 'Check SSLCommerz credentials and endpoint',
          });
      }
      
      sslczData = await sslResponse.json();
      console.log('✅ SSLCommerz response:', sslczData);
    } catch (parseError) {
      console.error('❌ Failed to parse SSLCommerz response:', parseError);
      const responseText = await sslResponse.text();
      console.error('Response text:', responseText.substring(0, 500));
      return response
        .status(400)
        .setHeader('Access-Control-Allow-Origin', '*')
        .json({
          error: 'Failed to parse payment gateway response',
          details: parseError instanceof Error ? parseError.message : 'Unknown parse error',
        });
    }

    if (!sslczData.status) {
      console.error('❌ No status in SSLCommerz response:', sslczData);
      return response
        .status(400)
        .setHeader('Access-Control-Allow-Origin', '*')
        .json({
          error: 'Invalid response from payment gateway',
          response: sslczData,
        });
    }

    if (sslczData.status !== 'SUCCESS') {
      console.error('❌ Payment initialization failed:', sslczData);
      return response
        .status(400)
        .setHeader('Access-Control-Allow-Origin', '*')
        .json({
          error: `Payment failed: ${sslczData.failedreason || 'Unknown error'}`,
          details: sslczData,
        });
    }

    console.log('✅ Gateway URL obtained:', sslczData.GatewayPageURL ? 'Yes' : 'No');

    // Return success response with gateway URL
    return response
      .status(200)
      .setHeader('Access-Control-Allow-Origin', '*')
      .json(sslczData);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('Payment API error:', errorMessage);
    return response
      .status(500)
      .setHeader('Access-Control-Allow-Origin', '*')
      .json({
        error: `Server error: ${errorMessage}`,
      });
  }
}
