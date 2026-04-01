# 💳 Payment API Integration - Using Your Existing DigitalOcean Setup

## Your Current Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│ GitHub Pages (Frontend - Static)                                 │
│ https://autosparkbd.com (Vite + React)                           │
└─────────────────────────────────────────────────────────────────┘
                          ↓
                    Via Proxy Server
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│ Local Dev Proxy (localhost:8787)                                 │
│ /api/agent → https://epbmkschwzip4c6atjl2tgbu.agents.do-ai.run   │
│ server/proxy.cjs - Node.js express server                        │
└─────────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│ DigitalOcean AI Agent                                            │
│ https://epbmkschwzip4c6atjl2tgbu.agents.do-ai.run                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Integrated Payment Architecture (Proposed)

We'll add payment API to your **DigitalOcean App Platform** alongside the Agent:

```
GitHub Pages (Frontend)
https://autosparkbd.com
    │
    ├─→ /api/agent → localhost:8787 → DigitalOcean Agent API
    │
    └─→ /api/payment/initiate → localhost:8787 → DigitalOcean App Platform
        ↓
        https://autospark-payment.ondigitalocean.app/api/payment/initiate
        (Next.js Backend + Supabase Database)
```

---

## 📋 Step-by-Step Implementation

### STEP 1: Deploy Payment Backend to DigitalOcean App Platform

#### 1.1: Create DigitalOcean Account (if not done)
- Go to https://digitalocean.com
- Sign up with email/GitHub
- Add payment method
- Get $200 free credit

#### 1.2: Create New App in App Platform

1. Click **"Create"** → **"Apps"**
2. **Select Source:** GitHub
3. **Authorize:** Connect your GitHub account
4. **Select Repository:** `farhankabir133/autospark`
5. **Select Branch:** `main`
6. Click **"Next"**

#### 1.3: Configure the App

**Project Settings:**
- Name: `autospark-payment`
- Region: Singapore (closest to Bangladesh)

**Source Settings:**
- Repository: `farhankabir133/autospark`
- Branch: `main`
- **Source Directory:** `next-sslcommerz` ← IMPORTANT!

**Build Configuration:**
- Buildpack: **Node.js**
- Build Command: `npm run build`
- Run Command: `npm start`
- HTTP Routes:
  - Path: `/`
  - Source: `next-sslcommerz`

**Environment Variables:**
```
STORE_ID=autos69cccc023b067
STORE_PASS=autos69cccc023b067@ssl
IS_LIVE=false
APP_URL=https://autospark-payment-xxx.ondigitalocean.app
SUPABASE_URL=https://hcdwfxnvmvvkbpeshbqk.supabase.co
SUPABASE_ANON_KEY=sb_publishable_o4V4NsBTa1omeSCyl8GuuA_UppA17sl
NODE_ENV=production
```

#### 1.4: Deploy
1. Review configuration
2. Click **"Create Resources"**
3. Wait for deployment (2-5 minutes)
4. Get your URL: `https://autospark-payment-xxx.ondigitalocean.app`

---

### STEP 2: Add Payment Proxy to Your Existing Proxy Server

Update your existing `server/proxy.cjs` to handle payment endpoints:

**Add this code to `server/proxy.cjs` (around line 100, before the `/api/agent` handler):**

```javascript
// Payment API proxy - forward to DigitalOcean App Platform
const PAYMENT_API_URL = process.env.PAYMENT_API_URL || 'https://autospark-payment-xxx.ondigitalocean.app';

app.post('/api/payment/initiate', async (req, res) => {
  try {
    const response = await fetch(`${PAYMENT_API_URL}/api/payment/initiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error('[proxy] payment/initiate error', err);
    res.status(500).json({ error: 'Payment initiation failed' });
  }
});

app.post('/api/payment/success', async (req, res) => {
  try {
    const response = await fetch(`${PAYMENT_API_URL}/api/payment/success`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const location = response.headers.get('location');
    if (location) {
      res.redirect(response.status, location);
    } else {
      res.status(response.status).json(await response.json());
    }
  } catch (err) {
    console.error('[proxy] payment/success error', err);
    res.redirect('/payment-failed');
  }
});

app.post('/api/payment/fail', async (req, res) => {
  try {
    const response = await fetch(`${PAYMENT_API_URL}/api/payment/fail`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const location = response.headers.get('location');
    if (location) {
      res.redirect(response.status, location);
    } else {
      res.status(response.status).json(await response.json());
    }
  } catch (err) {
    console.error('[proxy] payment/fail error', err);
    res.redirect('/payment-failed');
  }
});

app.post('/api/payment/cancel', async (req, res) => {
  try {
    const response = await fetch(`${PAYMENT_API_URL}/api/payment/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const location = response.headers.get('location');
    if (location) {
      res.redirect(response.status, location);
    } else {
      res.status(response.status).json(await response.json());
    }
  } catch (err) {
    console.error('[proxy] payment/cancel error', err);
    res.redirect('/payment-cancelled');
  }
});
```

**Update your `.env.local` to include:**
```
PAYMENT_API_URL=https://autospark-payment-xxx.ondigitalocean.app
```

---

### STEP 3: Create Payment Page in Autospark Frontend

**Create `src/pages/PaymentPage.tsx`:**

```typescript
'use client';
import { useState } from 'react';

export default function PaymentPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      total_amount: parseFloat(formData.get('amount') as string),
      cus_name: formData.get('name') as string,
      cus_email: formData.get('email') as string,
      cus_phone: formData.get('phone') as string,
      product_name: formData.get('product') as string,
    };

    try {
      // Call your local proxy which forwards to DigitalOcean
      const response = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.url) {
        // Redirect to SSLCommerz gateway
        window.location.href = result.url;
      } else {
        setError(result.error || 'Payment initiation failed');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err instanceof Error ? err.message : 'Error processing payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">Make Payment</h1>
        <p className="text-center text-gray-600 mb-6">Secure payment powered by SSLCommerz</p>
        
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handlePayment} className="space-y-4">
          <div>
            <label className="block font-semibold mb-2 text-gray-700">Full Name *</label>
            <input
              type="text"
              name="name"
              required
              placeholder="John Doe"
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2 text-gray-700">Email Address *</label>
            <input
              type="email"
              name="email"
              required
              placeholder="john@example.com"
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2 text-gray-700">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              required
              placeholder="01700000000"
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2 text-gray-700">Product/Service *</label>
            <input
              type="text"
              name="product"
              required
              placeholder="Car Maintenance Package"
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2 text-gray-700">Amount (BDT) *</label>
            <input
              type="number"
              name="amount"
              step="0.01"
              min="1"
              required
              placeholder="1000"
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
          >
            {loading ? 'Processing...' : '💳 Pay Now'}
          </button>
        </form>
      </div>
    </div>
  );
}
```

---

### STEP 4: Add Route to Your Main App Router

**Update your router** (wherever you manage routes - likely `src/App.tsx` or a router file):

```typescript
import PaymentPage from './pages/PaymentPage';

// Add to your routes
<Route path="/payment" element={<PaymentPage />} />
```

Or if using a routes configuration:

```typescript
export const routes = [
  // ... existing routes
  {
    path: '/payment',
    component: () => import('./pages/PaymentPage'),
    name: 'Payment',
  },
];
```

---

### STEP 5: Update SSLCommerz Callback URLs

1. Go to **SSLCommerz Merchant Portal** (https://merchant.sslcommerz.com)
2. Login with your credentials
3. Go to **Settings** → **API Credentials** or **Callback URLs**
4. Update callback URLs to point to your DigitalOcean backend:

```
Success: https://autospark-payment-xxx.ondigitalocean.app/api/payment/success
Fail:    https://autospark-payment-xxx.ondigitalocean.app/api/payment/fail
Cancel:  https://autospark-payment-xxx.ondigitalocean.app/api/payment/cancel
IPN:     https://autospark-payment-xxx.ondigitalocean.app/api/payment/ipn (optional)
```

⚠️ **Note:** Replace `xxx` with your actual DigitalOcean app subdomain

---

### STEP 6: Test Complete Payment Flow

#### Test 1: Test Payment Initiation Locally
```bash
# Start your local proxy server
npm run proxy

# In another terminal, test the payment endpoint
curl -X POST "http://localhost:8787/api/payment/initiate" \
  -H "Content-Type: application/json" \
  -d '{
    "total_amount": 500,
    "cus_name": "Test User",
    "cus_email": "test@example.com",
    "cus_phone": "01700000000",
    "product_name": "Test Order"
  }'

# Should return:
# {
#   "url": "https://sandbox.sslcommerz.com/EasyCheckOut/...",
#   "tran_id": "txn_..."
# }
```

#### Test 2: Test from Browser
1. Go to `http://localhost:5173/payment` (your local dev server)
2. Fill in payment form
3. Click "Pay Now"
4. Should redirect to SSLCommerz sandbox
5. Check Supabase dashboard → orders table for new order

#### Test 3: Test Payment Success Callback
```bash
curl -X POST "http://localhost:8787/api/payment/success" \
  -H "Content-Type: application/json" \
  -d '{
    "val_id": "test-val-id",
    "tran_id": "txn_...",
    "status": "VALID"
  }'

# Should redirect to /payment-failed (expected for fake val_id)
# But order should be in Supabase
```

---

## 📊 Architecture Summary

```
┌──────────────────────────────────────────────────────────────────┐
│ Frontend: GitHub Pages (https://autosparkbd.com)                 │
│ - PaymentPage.tsx                                                │
│ - Calls: /api/payment/initiate                                   │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│ Proxy Server (localhost:8787)                                     │
│ - server/proxy.cjs                                               │
│ - Routes /api/payment/* to DigitalOcean                          │
│ - Routes /api/agent to Agent API                                 │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│ DigitalOcean App Platform (https://autospark-payment-xxx.do.app) │
│ - Next.js Backend (next-sslcommerz)                              │
│ - Payment Routes (/api/payment/*)                                │
│ - Supabase Integration                                           │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│ Supabase PostgreSQL (orders table)                                │
│ - Payment records stored                                         │
└──────────────────────────────────────────────────────────────────┘
```

---

## ✅ Checklist

- [ ] Deploy `next-sslcommerz` to DigitalOcean App Platform
- [ ] Get your DigitalOcean App URL (autospark-payment-xxx.ondigitalocean.app)
- [ ] Update `server/proxy.cjs` with payment routes
- [ ] Add PAYMENT_API_URL to `.env.local`
- [ ] Create `src/pages/PaymentPage.tsx`
- [ ] Add payment route to your app router
- [ ] Update SSLCommerz callback URLs to DigitalOcean backend
- [ ] Test locally: `npm run proxy` + payment form
- [ ] Test from `https://autosparkbd.com/payment` (after deployment)
- [ ] Verify orders appear in Supabase

---

## 🚀 Next Action

**Tell me the DigitalOcean App URL** you get after deployment, and I'll:
1. Help you update the proxy server
2. Create the PaymentPage component
3. Walk you through testing

Ready to start? 🎯
