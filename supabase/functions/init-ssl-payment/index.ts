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
    const body = await req.json();
    const { cart, total_amount, customer_name, mobile, address, thana, district } = body;

    // Get environment variables
    const SSLCOMMERZ_STORE_ID = Deno.env.get('SSLCOMMERZ_STORE_ID');
    const SSLCOMMERZ_STORE_PASSWORD = Deno.env.get('SSLCOMMERZ_STORE_PASSWORD');
    const SITE_URL = Deno.env.get('SITE_URL') || 'https://autosparkbd.com';

    console.log('Received payment request:', {
      total_amount,
      customer_name,
      mobile,
      has_store_id: !!SSLCOMMERZ_STORE_ID,
      has_store_password: !!SSLCOMMERZ_STORE_PASSWORD,
      site_url: SITE_URL,
    });

    // Validate required inputs
    if (!cart || !total_amount || !customer_name || !mobile || !address || !thana || !district) {
      console.error('Missing required fields:', { cart: !!cart, total_amount, customer_name, mobile, address, thana, district });
      return new Response(
        JSON.stringify({ error: 'Missing required payment information' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate Store ID and Password
    if (!SSLCOMMERZ_STORE_ID || !SSLCOMMERZ_STORE_PASSWORD) {
      console.error('Missing SSLCommerz credentials');
      return new Response(
        JSON.stringify({ error: 'Payment gateway not configured. Missing credentials.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const tran_id = `autospark-${Date.now()}`;
    const product_name = Array.isArray(cart) 
      ? cart.map((item: any) => item.name || 'Item').join(', ')
      : 'Order';

    // Create URLSearchParams for SSLCommerz (FormData may not work in Deno environment)
    const params = new URLSearchParams();
    params.append('store_id', SSLCOMMERZ_STORE_ID);
    params.append('store_passwd', SSLCOMMERZ_STORE_PASSWORD);
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

    console.log('Calling SSLCommerz API with transaction ID:', tran_id);
    
    const sslCommerzUrl = 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php';
    const response = await fetch(sslCommerzUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    console.log('SSLCommerz response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('SSLCommerz API error:', errorText);
      return new Response(
        JSON.stringify({ error: `SSLCommerz API error: ${response.status}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const sslczResponse = await response.json();
    console.log('SSLCommerz response:', sslczResponse);

    if (sslczResponse.status !== 'SUCCESS') {
      console.error('Payment initialization failed:', sslczResponse);
      return new Response(
        JSON.stringify({ 
          error: `Payment failed: ${sslczResponse.failedreason || 'Unknown error'}`,
          details: sslczResponse
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(sslczResponse),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('Payment function exception:', errorMessage);
    return new Response(
      JSON.stringify({ error: `Server error: ${errorMessage}` }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});


