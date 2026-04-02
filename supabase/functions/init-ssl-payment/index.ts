import "@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { cart, total_amount, customer_name, mobile, address, thana, district } = await req.json();

    const SSLCOMMERZ_STORE_ID = Deno.env.get('SSLCOMMERZ_STORE_ID');
    const SSLCOMMERZ_STORE_PASSWORD = Deno.env.get('SSLCOMMERZ_STORE_PASSWORD');
    const SITE_URL = Deno.env.get('SITE_URL') || 'https://autosparkbd.com';
    const SSLCOMMERZ_API_URL = 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php';

    // Validate required inputs
    if (!cart || !total_amount || !customer_name || !mobile || !address || !thana || !district) {
      return new Response(
        JSON.stringify({ error: 'Missing required payment information' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate Store ID and Password
    if (!SSLCOMMERZ_STORE_ID || !SSLCOMMERZ_STORE_PASSWORD) {
      console.error('Missing SSLCommerz credentials in environment');
      return new Response(
        JSON.stringify({ error: 'Payment gateway not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const tran_id = `autospark-${Date.now()}`;
    const product_name = Array.isArray(cart) 
      ? cart.map((item: any) => item.name).join(', ')
      : 'Order';

    const formData = new FormData();
    formData.append('store_id', SSLCOMMERZ_STORE_ID);
    formData.append('store_passwd', SSLCOMMERZ_STORE_PASSWORD);
    formData.append('total_amount', total_amount.toString());
    formData.append('currency', 'BDT');
    formData.append('tran_id', tran_id);
    formData.append('success_url', `${SITE_URL}/payment/success?tran_id=${tran_id}`);
    formData.append('fail_url', `${SITE_URL}/payment/fail`);
    formData.append('cancel_url', `${SITE_URL}/payment/cancel`);
    formData.append('ipn_url', `${SITE_URL}/api/payment-ipn`);
    formData.append('product_name', product_name);
    formData.append('product_category', 'Automotive');
    formData.append('product_profile', 'general');
    
    // Customer details
    formData.append('cus_name', customer_name);
    formData.append('cus_email', 'customer@autosparkbd.com');
    formData.append('cus_add1', address);
    formData.append('cus_city', thana);
    formData.append('cus_state', district);
    formData.append('cus_postcode', '1200');
    formData.append('cus_country', 'Bangladesh');
    formData.append('cus_phone', mobile);

    // Shipping details
    formData.append('shipping_method', 'Courier');
    formData.append('ship_name', customer_name);
    formData.append('ship_add1', address);
    formData.append('ship_city', thana);
    formData.append('ship_state', district);
    formData.append('ship_postcode', '1200');
    formData.append('ship_country', 'Bangladesh');

    console.log('Calling SSLCommerz API:', SSLCOMMERZ_API_URL);
    const response = await fetch(SSLCOMMERZ_API_URL, {
      method: 'POST',
      body: formData,
    });

    const sslczResponse = await response.json();
    console.log('SSLCommerz response:', sslczResponse);

    if (sslczResponse.status !== 'SUCCESS') {
      return new Response(
        JSON.stringify({ error: `SSLCommerz error: ${sslczResponse.failedreason || 'Unknown error'}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(sslczResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Payment function error:', error);
    return new Response(
      JSON.stringify({ error: `Server error: ${error.message}` }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

