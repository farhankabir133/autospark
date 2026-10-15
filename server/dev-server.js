import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

try {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
} catch (e) {
  console.warn('[dev-server] .env load skipped:', e.message);
}

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
  const STORE_ID = process.env.SSLCOMMERZ_STORE_ID;
  const STORE_PASSWORD = process.env.SSLCOMMERZ_STORE_PASSWORD;
  if (!STORE_ID || !STORE_PASSWORD) throw new Error('Missing SSLCommerz credentials');
  
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

// --- SparkPilot → Groq proxy (keeps GROQ_API_KEY server-side) ---
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const SALES_SYSTEM_PROMPT = `You are SparkPilot, a polished senior automotive sales consultant for AutoSpark (Rajshahi, Bangladesh) — specialists in Japanese cars, Japan pre-orders/auction import, financing guidance, and servicing.
PERSONA: Warm, confident, consultative, premium-dealership tone. Concise (40-90 words typical), scannable. Match customer language (English/Bangla/mixed). Use ৳ lakh formatting. End with ONE clear next step/question.
PLAYBOOK: 1) Discover budget/use/body-type/fuel/brand/timeline. 2) Recommend only from provided vehicle context. 3) Handle objections (price→TCO+EMI, battery→health-check, auction→inspection story). 4) Close softly (expert call/WhatsApp +880 1760-401605, pre-order steps, EMI calc). 5) Never invent stock/prices/mileage/grades/dates/approvals. If unsure: "I don't have verified information on that yet — an AutoSpark expert can confirm." Never pressure or create false urgency.`;

async function handleSparkPilot(req, res) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'GROQ_API_KEY not set in server env (.env).' });
    const { messages, prefs, context } = req.body ?? {};
    if (!Array.isArray(messages) || !messages.length) return res.status(400).json({ error: 'messages[] required' });
    const slim = messages.slice(-12).map((m) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: String(m.content || '').slice(0, 2000) }));
    const model = process.env.GROQ_MODEL || 'openai/gpt-oss-20b';
    const groqRes = await fetch(GROQ_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model, temperature: 0.6, max_tokens: 700,
        messages: [
          { role: 'system', content: SALES_SYSTEM_PROMPT },
          ...(context ? [{ role: 'system', content: `Verified vehicle context (never claim beyond this list):\n${String(context).slice(0, 4000)}` }] : []),
          ...(prefs ? [{ role: 'system', content: `Known customer prefs: ${JSON.stringify(prefs).slice(0, 800)}` }] : []),
          ...slim,
        ],
      }),
    });
    if (!groqRes.ok) {
      const t = await groqRes.text().catch(() => '');
      console.error('[sparkai] groq http', groqRes.status, t.slice(0, 300));
      return res.status(502).json({ error: 'AI provider error' });
    }
    const data = await groqRes.json();
    const text = data?.choices?.[0]?.message?.content?.trim() || '';
    if (!text) return res.status(502).json({ error: 'Empty AI response' });
    return res.json({ text, model: data?.model || model });
  } catch (e) {
    console.error('[sparkai] error', e.message);
    return res.status(500).json({ error: e.message });
  }
}
app.post('/api/sparkai/chat', handleSparkPilot);
app.post('/api/agent', handleSparkPilot);

app.post('/api/lead/submit', (req, res) => {
  const { name, whatsapp, language, interest, budgetRange, timeline, notes, consent } = req.body ?? {};
  if (!name || name.trim().length < 2) return res.status(400).json({ error: 'Name is required' });
  if (!whatsapp || whatsapp.trim().length < 10) return res.status(400).json({ error: 'Valid WhatsApp number is required' });
  if (!interest || interest.trim().length < 2) return res.status(400).json({ error: 'Interest/vehicle is required' });
  if (!budgetRange) return res.status(400).json({ error: 'Budget range is required' });
  if (!timeline) return res.status(400).json({ error: 'Timeline is required' });
  if (!consent) return res.status(400).json({ error: 'Consent is required' });
  const reference = `SPARK-${Date.now().toString(36).toUpperCase()}`;
  console.log('Lead submitted:', { name, whatsapp, interest, budgetRange, timeline, reference });
  return res.status(200).json({ ok: true, reference });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Local payment server running on http://localhost:${PORT}`);
  console.log('✅ Ready to proxy payment API requests from Vite dev server');
});
