# 🚀 Deploy Payment API to Vercel (GitHub Pages Frontend)

## Your Current Setup

- **Frontend:** GitHub Pages + Vite (React) → `https://autosparkbd.com`
- **Backend:** Separate Next.js payment API in `next-sslcommerz/`
- **Database:** Supabase (already configured)

## Deployment Strategy

```
GitHub Pages (Frontend)           Vercel (Backend API)
https://autosparkbd.com    ←→    https://api-payment.vercel.app
    (Vite/React)                      (Next.js API routes)
    (Static HTML/CSS/JS)              (Payment processing)
```

---

## 📋 Step-by-Step Deployment

### Step 1: Prepare Payment Backend for Vercel

Vercel expects a `vercel.json` config file. Let me create that:

```json
// next-sslcommerz/vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install"
}
```

The Next.js project already has the right structure. ✅

### Step 2: Create GitHub Repository for Backend (Optional)

**Option A: Use existing repo** (Recommended)
- Backend is already in same repo (`next-sslcommerz/` folder)
- Deploy from there

**Option B: Separate repo**
- Create new repo: `autospark-payment-api`
- Push only `next-sslcommerz/` contents

Let's use **Option A** (same repo).

### Step 3: Deploy to Vercel

1. **Go to https://vercel.com**
2. **Sign in with GitHub** (if not already)
3. **Click "Add New..." → "Project"**
4. **Select your repo:** `autospark` (or `farhankabir133/autospark`)
5. **Configure Project:**
   - Root Directory: `next-sslcommerz`
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. **Add Environment Variables:**
   ```
   STORE_ID=autos69cccc023b067
   STORE_PASS=autos69cccc023b067@ssl
   IS_LIVE=false  (or true for production)
   APP_URL=https://api-payment-xxx.vercel.app  (Vercel will give you this)
   SUPABASE_URL=https://hcdwfxnvmvvkbpeshbqk.supabase.co
   SUPABASE_ANON_KEY=sb_publishable_o4V4NsBTa1omeSCyl8GuuA_UppA17sl
   ```
7. **Click "Deploy"**

Vercel will:
- Build the Next.js project
- Deploy to a URL like: `https://next-sslcommerz.vercel.app`
- Give you your API endpoint: `https://next-sslcommerz.vercel.app/api/payment/initiate`

### Step 4: Update SSLCommerz Callback URLs

In SSLCommerz merchant portal:
```
Success URL: https://next-sslcommerz.vercel.app/api/payment/success
Fail URL:    https://next-sslcommerz.vercel.app/api/payment/fail
Cancel URL:  https://next-sslcommerz.vercel.app/api/payment/cancel
```

---

## 🔗 Step 5: Integrate Frontend with Backend

Update your Autospark Vite app to call the Vercel backend API.

Create payment page in main app:

**`src/pages/PaymentPage.tsx`:**

```typescript
'use client';
import { useState } from 'react';

const API_URL = 'https://next-sslcommerz.vercel.app'; // Change to your Vercel URL

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
      // Call Vercel backend API
      const response = await fetch(`${API_URL}/api/payment/initiate`, {
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
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-6 text-center">Make Payment</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handlePayment} className="space-y-4">
        <div>
          <label className="block font-semibold mb-2">Full Name *</label>
          <input
            type="text"
            name="name"
            required
            placeholder="John Doe"
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">Email Address *</label>
          <input
            type="email"
            name="email"
            required
            placeholder="john@example.com"
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">Phone Number *</label>
          <input
            type="tel"
            name="phone"
            required
            placeholder="01700000000"
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">Product/Service *</label>
          <input
            type="text"
            name="product"
            required
            placeholder="Car Maintenance Package"
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">Amount (BDT) *</label>
          <input
            type="number"
            name="amount"
            step="0.01"
            min="1"
            required
            placeholder="1000"
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Processing...' : '💳 Pay Now'}
        </button>
      </form>

      <p className="text-sm text-gray-500 mt-4 text-center">
        Secure payment powered by SSLCommerz
      </p>
    </div>
  );
}
```

### Step 6: Add Payment Page Route

Update your router (assuming React Router):

**`src/App.tsx`** (or wherever your routes are):

```typescript
import PaymentPage from './pages/PaymentPage';

// Add to your routes:
<Route path="/payment" element={<PaymentPage />} />
```

### Step 7: Update Your Environment (Optional)

If you want the API URL configurable:

**`.env.local`:**
```
VITE_API_URL=https://next-sslcommerz.vercel.app
```

**Update PaymentPage.tsx:**
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'https://next-sslcommerz.vercel.app';
```

---

## ✅ Testing Checklist

- [ ] Deploy `next-sslcommerz` to Vercel
- [ ] Get Vercel URL (e.g., `https://next-sslcommerz.vercel.app`)
- [ ] Update SSLCommerz callback URLs
- [ ] Add payment form to Autospark frontend
- [ ] Test payment initiation from `https://autosparkbd.com/payment`
- [ ] Verify order appears in Supabase
- [ ] Verify callback URLs work

---

## 🚀 Complete Flow After Deployment

```
1. User visits: https://autosparkbd.com/payment
2. Fills payment form (GitHub Pages frontend)
3. Clicks "Pay Now"
4. Frontend calls: https://next-sslcommerz.vercel.app/api/payment/initiate
5. Vercel backend creates order in Supabase
6. Returns: { url: "https://sandbox.sslcommerz.com/...", tran_id: "..." }
7. Frontend redirects user to SSLCommerz gateway
8. User completes payment on SSLCommerz
9. SSLCommerz POSTs to: https://next-sslcommerz.vercel.app/api/payment/success
10. Vercel validates with SSLCommerz SDK
11. Updates order status in Supabase to "paid"
12. Redirects user back to success page
```

---

## ⚙️ Configuration Summary

| Setting | Value |
|---------|-------|
| **Frontend Host** | GitHub Pages (`autosparkbd.com`) |
| **Backend Host** | Vercel (your Vercel URL) |
| **Database** | Supabase (shared instance) |
| **Payment Gateway** | SSLCommerz Sandbox |
| **Frontend Repo** | Main repo, branch `main` |
| **Backend Repo** | Same repo, folder `next-sslcommerz` |

---

## 🎯 Next Action

**Tell me once you:**
1. Create a Vercel account
2. Deploy `next-sslcommerz` to Vercel
3. Get your Vercel URL

Then I'll help you integrate the payment form into your main website! ✅
