import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
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
      return response.status(400).json({
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
      return response.status(500).json({
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

    // Call SSLCommerz API
    const sslCommerzUrl = 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php';
    const sslResponse = await fetch(sslCommerzUrl, {
      method: 'POST',
      body: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!sslResponse.ok) {
      console.error('SSLCommerz API error:', sslResponse.status);
      return response.status(400).json({
        error: `SSLCommerz API error: ${sslResponse.status}`,
      });
    }

    const sslczData = await sslResponse.json();

    if (sslczData.status !== 'SUCCESS') {
      console.error('Payment initialization failed:', sslczData);
      return response.status(400).json({
        error: `Payment failed: ${sslczData.failedreason || 'Unknown error'}`,
        details: sslczData,
      });
    }

    // Return success response with gateway URL
    return response.status(200).json(sslczData);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('Payment API error:', errorMessage);
    return response.status(500).json({
      error: `Server error: ${errorMessage}`,
    });
  }
}
