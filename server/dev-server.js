import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 8787;

// Middleware
app.use(cors());
app.use(express.json());

// Mock database for storing payment records
const paymentRecords = new Map();

// Helper function to initialize SSLCommerz payment
async function initializeSSLCommerz(paymentData) {
  const SSLCOMMERZ_API_URL = 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php';
  const STORE_ID = process.env.VITE_SSLCOMMERZ_STORE_ID || 'autosparkbd0live';
  const STORE_PASSWORD = process.env.VITE_SSLCOMMERZ_PASSWORD || '69DBB19BAB55E48107';
  
  // Auto-detect the frontend port (default to 5173, but fallback to 5174 if 5173 is in use)
  const FRONTEND_PORT = process.env.FRONTEND_PORT || '5174';
  const FRONTEND_URL = `http://localhost:${FRONTEND_PORT}`;

  const params = new URLSearchParams();
  params.append('store_id', STORE_ID);
  params.append('store_passwd', STORE_PASSWORD);
  params.append('total_amount', paymentData.total_amount);
  params.append('currency', 'BDT');
  params.append('tran_id', paymentData.session_id);
  params.append('cus_name', paymentData.customer_name);
  params.append('cus_phone', paymentData.mobile);
  params.append('cus_email', paymentData.email || 'noemail@example.com');
  params.append('cus_addr1', paymentData.address);
  params.append('cus_city', paymentData.thana);
  params.append('cus_state', paymentData.district);
  params.append('cus_postcode', '1000');
  params.append('cus_country', 'Bangladesh');
  params.append('shipping_method', 'NO');
  params.append('product_name', 'Auto Parts');
  params.append('product_category', 'Auto');
  params.append('product_profile', 'general');
  params.append('value_a', paymentData.payment_record_id);

  // Callback URLs - use dynamic frontend URL
  params.append('success_url', `${FRONTEND_URL}/payment/success`);
  params.append('fail_url', `${FRONTEND_URL}/payment/fail`);
  params.append('cancel_url', `${FRONTEND_URL}/payment/cancel`);

  try {
    console.log('🔗 Calling SSLCommerz API...');
    const response = await fetch(SSLCOMMERZ_API_URL, {
      method: 'POST',
      body: params,
    });

    const text = await response.text();
    console.log('📨 SSLCommerz Raw Response (first 500 chars):', text.substring(0, 500));
    console.log('📨 Full Response:', text);

    // Check if response contains error
    if (text.includes('FAILED') || text.includes('INVALID')) {
      console.error('❌ SSLCommerz returned error:', text);
      return {
        status: 'FAIL',
        error: `SSLCommerz Error: ${text}`,
      };
    }

    // Parse redirect URL from response - try multiple patterns
    let redirectMatch = text.match(/GatewayPageURL=(.+?)(?:\n|&|$)/);
    if (!redirectMatch) {
      redirectMatch = text.match(/GatewayPageURL=([^\s&]+)/);
    }
    if (!redirectMatch) {
      redirectMatch = text.split('GatewayPageURL=')[1];
    }

    if (redirectMatch) {
      const gatewayUrl = redirectMatch[1] || redirectMatch;
      console.log('✅ Gateway URL found:', gatewayUrl.trim());
      return {
        status: 'SUCCESS',
        GatewayPageURL: gatewayUrl.toString().trim(),
      };
    }

    console.error('❌ Could not parse SSLCommerz response. Expected GatewayPageURL in response.');
    return {
      status: 'FAIL',
      error: 'Could not parse SSLCommerz response. No GatewayPageURL found.',
      response: text,
    };
  } catch (error) {
    console.error('❌ SSLCommerz API Error:', error.message);
    return {
      status: 'FAIL',
      error: error.message,
    };
  }
}

// Payment initialization endpoint
app.post('/api/payment/init', async (req, res) => {
  try {
    const {
      cart,
      total_amount,
      customer_name,
      mobile,
      address,
      thana,
      district,
      payment_record_id,
    } = req.body;

    // Validate required fields
    if (!customer_name || !mobile || !address || !thana || !district || !total_amount) {
      return res.status(400).json({
        error: 'Missing required fields',
      });
    }

    console.log('📝 Payment Init Request:', {
      customer_name,
      mobile,
      total_amount,
      payment_record_id,
    });

    // Store payment record locally
    paymentRecords.set(payment_record_id, {
      ...req.body,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });

    // Initialize SSLCommerz payment
    const sslczResponse = await initializeSSLCommerz({
      session_id: payment_record_id,
      customer_name,
      mobile,
      email: req.body.email || '',
      address,
      thana,
      district,
      total_amount,
      payment_record_id,
    });

    console.log('✅ SSLCommerz Response:', sslczResponse);

    res.json(sslczResponse);
  } catch (error) {
    console.error('❌ Payment init error:', error.message);
    res.status(500).json({
      status: 'FAIL',
      error: error.message,
    });
  }
});

// Payment success endpoint
app.post('/api/payment/success', async (req, res) => {
  try {
    const { value_a: paymentRecordId, tran_id: transactionId, bank_tran_id } = req.body;

    console.log('✅ Payment Success:', { paymentRecordId, transactionId });

    if (paymentRecords.has(paymentRecordId)) {
      const record = paymentRecords.get(paymentRecordId);
      record.status = 'success';
      record.transaction_id = transactionId;
      record.updatedAt = new Date().toISOString();
    }

    res.json({ status: 'success' });
  } catch (error) {
    console.error('❌ Payment success error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Payment fail endpoint
app.post('/api/payment/fail', async (req, res) => {
  try {
    const { value_a: paymentRecordId, tran_id: transactionId } = req.body;

    console.log('❌ Payment Failed:', { paymentRecordId, transactionId });

    if (paymentRecords.has(paymentRecordId)) {
      const record = paymentRecords.get(paymentRecordId);
      record.status = 'failed';
      record.transaction_id = transactionId;
      record.updatedAt = new Date().toISOString();
    }

    res.json({ status: 'failed' });
  } catch (error) {
    console.error('❌ Payment fail error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Payment cancel endpoint
app.post('/api/payment/cancel', async (req, res) => {
  try {
    const { value_a: paymentRecordId } = req.body;

    console.log('⏸️ Payment Cancelled:', { paymentRecordId });

    if (paymentRecords.has(paymentRecordId)) {
      const record = paymentRecords.get(paymentRecordId);
      record.status = 'cancelled';
      record.updatedAt = new Date().toISOString();
    }

    res.json({ status: 'cancelled' });
  } catch (error) {
    console.error('❌ Payment cancel error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', port: PORT });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Local payment server running on http://localhost:${PORT}`);
  console.log('✅ Ready to proxy payment API requests from Vite dev server');
});
