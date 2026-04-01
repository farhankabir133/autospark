# 💳 Payment on Custom Domain Setup Guide

## Overview

To accept payments on your custom domain (e.g., `autospark.com`), you need to:

1. ✅ **Deploy the payment backend** (Next.js API routes)
2. ✅ **Configure SSLCommerz callback URLs** (production endpoints)
3. ✅ **Update environment variables** (production credentials)
4. ✅ **Set up HTTPS/SSL certificate** (SSLCommerz requirement)
5. ✅ **Integrate payment form** into your main website

---

## 🔧 Step 1: Current Domain/Hosting Setup

**What domain are you using?**
- Custom domain? (e.g., `autospark.com`)
- Vercel? (auto HTTPS)
- GitHub Pages? (only static, no API)
- Self-hosted server?
- Other hosting?

Please tell me your hosting setup so I can provide specific instructions.

---

## 📋 Step 2: Deployment Options

### Option A: Deploy to Vercel (Recommended)
**Pros:** 
- Easy deployment
- Auto HTTPS
- Serverless API routes
- Free tier available

**Steps:**
```bash
1. Push code to GitHub (already done ✅)
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Auto-deploy on push
```

### Option B: Deploy to AWS/Google Cloud
**Pros:**
- Full control
- Scalable
- Pay per use

**Requires:** Server configuration, Docker, databases setup

### Option C: Self-hosted on Your Server
**Pros:**
- Complete control
- No vendor lock-in

**Requires:** 
- Node.js installed
- PM2 or systemd for process management
- Nginx/Apache for reverse proxy
- SSL certificate (Let's Encrypt free)

---

## 🌐 Step 3: Configure Payment URLs

Once deployed, update these URLs in SSLCommerz dashboard:

```
Success URL:  https://yourdomain.com/api/payment/success
Fail URL:     https://yourdomain.com/api/payment/fail
Cancel URL:   https://yourdomain.com/api/payment/cancel
IPN URL:      https://yourdomain.com/api/payment/ipn
```

**In your `.env` file:**
```
APP_URL=https://yourdomain.com  # Change from localhost:3000
```

---

## 🔑 Step 4: Production SSLCommerz Credentials

Currently using **Sandbox credentials:**
```
STORE_ID=autos69cccc023b067
STORE_PASS=autos69cccc023b067@ssl
IS_LIVE=false  # ← Sandbox mode
```

For production, you need **Real credentials:**
```
STORE_ID=your_production_store_id
STORE_PASS=your_production_store_pass
IS_LIVE=true   # ← Production mode
```

**To get production credentials:**
1. Contact SSLCommerz support
2. Provide business documents
3. Get approved for production access
4. Receive production STORE_ID and STORE_PASS

---

## 🔐 Step 5: HTTPS/SSL Certificate

**SSLCommerz requires HTTPS.** Options:

### Free Option: Let's Encrypt
```bash
# Using certbot
sudo certbot certonly --standalone -d yourdomain.com
```

### Paid Option: Commercial SSL
- Comodo, DigiCert, etc.
- Usually $30-100/year

### Automatic: Vercel/Netlify
- Auto HTTPS if deployed there
- No additional setup needed

---

## 📝 Integration Steps

### 1. Create Payment Page/Form

Add to your main Autospark website (`src/pages/PaymentPage.tsx`):

```typescript
'use client';
import { useState } from 'react';

export default function PaymentPage() {
  const [loading, setLoading] = useState(false);

  const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      total_amount: parseFloat(formData.get('amount') as string),
      cus_name: formData.get('name') as string,
      cus_email: formData.get('email') as string,
      cus_phone: formData.get('phone') as string,
      product_name: formData.get('product') as string,
    };

    try {
      // Call payment API (could be same domain or external)
      const response = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (result.url) {
        // Redirect to SSLCommerz gateway
        window.location.href = result.url;
      } else {
        alert('Payment initiation failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error processing payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Make Payment</h1>
      
      <form onSubmit={handlePayment} className="space-y-4">
        <div>
          <label className="block font-semibold">Name</label>
          <input
            type="text"
            name="name"
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Email</label>
          <input
            type="email"
            name="email"
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Phone</label>
          <input
            type="tel"
            name="phone"
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Product</label>
          <input
            type="text"
            name="product"
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Amount (BDT)</label>
          <input
            type="number"
            name="amount"
            step="0.01"
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
    </div>
  );
}
```

### 2. Add Routes to Next.js

Move payment routes to your main Next.js app:

```bash
# Copy from payment example to main app
cp -r next-sslcommerz/pages/api/payment src/pages/api/payment
cp -r next-sslcommerz/lib/sslcommerz.ts src/lib/
cp -r next-sslcommerz/lib/supabase.ts src/lib/
```

### 3. Add Environment Variables

In your main app's `.env.local`:

```
# SSLCommerz
VITE_STORE_ID=your_production_store_id
VITE_STORE_PASS=your_production_store_pass
VITE_IS_LIVE=true

# Supabase (already have these)
VITE_SUPABASE_URL=https://hcdwfxnvmvvkbpeshbqk.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...

# App URL
VITE_APP_URL=https://yourdomain.com
```

---

## 🚀 Deployment Walkthrough

### For Vercel Deployment:

```bash
1. Push all changes to GitHub
   git add .
   git commit -m "feat: integrate payment gateway into main app"
   git push origin main

2. Go to vercel.com → Import Project
   - Connect your GitHub repo
   - Select your project
   - Click "Import"

3. Set Environment Variables:
   - Go to Project Settings → Environment Variables
   - Add all variables from .env.local
   - Click "Save"

4. Click "Deploy"
   - Vercel builds and deploys automatically
   - You get a URL like: https://autospark.vercel.app

5. Connect Custom Domain:
   - Go to Project Settings → Domains
   - Add your custom domain (e.g., autospark.com)
   - Add DNS records as Vercel instructs

6. Configure SSLCommerz:
   - Login to SSLCommerz merchant portal
   - Update callback URLs:
     - Success: https://autospark.com/api/payment/success
     - Fail: https://autospark.com/api/payment/fail
     - Cancel: https://autospark.com/api/payment/cancel
```

---

## ✅ Testing on Custom Domain

```bash
# Test payment initiation
curl -X POST "https://yourdomain.com/api/payment/initiate" \
  -H "Content-Type: application/json" \
  -d '{
    "total_amount": 100,
    "cus_name": "Test User",
    "cus_email": "test@example.com",
    "cus_phone": "01700000000",
    "product_name": "Test Product"
  }'

# Expected response:
# {
#   "url": "https://sandbox.sslcommerz.com/...",
#   "tran_id": "txn_..."
# }
```

---

## 🔄 Local Testing with Custom Domain

If you want to test locally with your custom domain:

```bash
# Add to /etc/hosts (macOS/Linux)
127.0.0.1 autospark.local

# Then access locally:
http://autospark.local:3000

# But SSLCommerz won't be able to reach localhost
# (callbacks require public domain)
```

**Better approach:** Deploy to staging server or Vercel preview

---

## 📋 Checklist for Custom Domain Payments

- [ ] Domain registered and DNS configured
- [ ] HTTPS/SSL certificate obtained
- [ ] Next.js app deployed to custom domain
- [ ] Environment variables configured on hosting
- [ ] SSLCommerz callback URLs updated
- [ ] Production STORE_ID and STORE_PASS obtained
- [ ] `IS_LIVE=true` enabled
- [ ] Test payment with small amount
- [ ] Verify order appears in Supabase
- [ ] Email notifications working
- [ ] Order confirmation page created

---

## 🎯 What's Your Hosting Setup?

To provide specific instructions, please tell me:

1. **Current hosting**: Vercel, AWS, self-hosted, GitHub Pages, other?
2. **Custom domain**: Do you own a domain?
3. **Database**: Want to use same Supabase instance?
4. **Timeline**: When do you need this live?

Once I know your setup, I can create step-by-step deployment instructions! 🚀
