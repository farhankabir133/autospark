# DigitalOcean Payment API Deployment Guide

## 📋 Prerequisites

- GitHub account with `autospark` repository
- DigitalOcean account (same account as your Agent API)
- SSLCommerz merchant account (Sandbox mode)
- Supabase project already configured

---

## 🚀 Step 1: Deploy Payment API to DigitalOcean App Platform

### 1.1 Login to DigitalOcean

1. Go to [DigitalOcean Console](https://cloud.digitalocean.com)
2. Sign in with your account
3. Click **"Create"** button (top right) → **"Apps"**

### 1.2 Create New App

1. **Select Source:** GitHub
2. **Authorize:** Connect your GitHub account if not already connected
3. **Select Repository:** `farhankabir133/autospark`
4. **Select Branch:** `main`
5. Click **"Next"**

### 1.3 Configure the App

**Step 1: Project Settings**
- **Name:** `autospark-payment`
- **Region:** Singapore (closest to Bangladesh)
- Click **"Next"**

**Step 2: Build and Run Settings**
- **Source Directory:** `next-sslcommerz` ← **IMPORTANT!**
- **Buildpack:** Node.js (auto-detected)
- **Build Command:** `npm run build`
- **Run Command:** `npm start`
- Click **"Next"**

**Step 3: Environment Variables**

Add these environment variables:

| Variable | Value | Notes |
|----------|-------|-------|
| `STORE_ID` | `autos69cccc023b067` | SSLCommerz Store ID |
| `STORE_PASS` | `autos69cccc023b067@ssl` | SSLCommerz Store Password |
| `IS_LIVE` | `false` | Sandbox mode (set to `true` for production) |
| `APP_URL` | `https://autospark-payment-xxx.ondigitalocean.app` | Will be generated after deployment |
| `SUPABASE_URL` | `https://hcdwfxnvmvvkbpeshbqk.supabase.co` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | `sb_publishable_o4V4NsBTa1omeSCyl8GuuA_UppA17sl` | Your Supabase anonymous key |
| `NODE_ENV` | `production` | Node environment |

Click **"Next"**

**Step 4: Finalize**
- Review all settings
- Click **"Create Resources"**

### 1.4 Wait for Deployment

The app will be deployed automatically. This usually takes **2-5 minutes**. You'll see:
- ✅ Build complete
- ✅ Container running
- ✅ App live

Once complete, you'll see your live app URL like:
```
https://autospark-payment-abc123def456.ondigitalocean.app
```

**Save this URL** - you'll need it for the next steps!

---

## 🔗 Step 2: Update Proxy Server Configuration

Your local proxy server (`server/proxy.cjs`) has already been updated with payment endpoints. You just need to set the environment variable.

### 2.1 Update `.env.local`

Add the DigitalOcean Payment API URL to your `.env.local`:

```bash
# .env.local

# Existing variables...
AGENT_API_KEY=your_agent_api_key

# Add this new variable (replace with your actual DigitalOcean app URL):
PAYMENT_API_URL=https://autospark-payment-abc123def456.ondigitalocean.app
```

Replace `abc123def456` with the actual subdomain from your DigitalOcean deployment.

### 2.2 Verify Proxy Server Configuration

The proxy server (`server/proxy.cjs`) now has endpoints for:
- ✅ `POST /api/payment/initiate` → forwards to DigitalOcean
- ✅ `POST /api/payment/success` → forwards to DigitalOcean
- ✅ `POST /api/payment/fail` → forwards to DigitalOcean
- ✅ `POST /api/payment/cancel` → forwards to DigitalOcean

No additional changes needed if you already have the updated `proxy.cjs`.

---

## 💳 Step 3: Payment Form is Ready

Your Autospark frontend already has the `PaymentPage` component:
- ✅ File: `src/pages/PaymentPage.tsx`
- ✅ Route: `/payment`
- ✅ Accessible at: `https://autosparkbd.com/payment` (production) or `http://localhost:5173/payment` (development)

The form:
- Collects customer details (name, email, phone, product, amount)
- Validates form input
- Calls `/api/payment/initiate` via your local proxy
- Redirects to SSLCommerz payment gateway
- Handles errors gracefully

---

## 🔐 Step 4: Update SSLCommerz Callback URLs

### 4.1 Access SSLCommerz Merchant Dashboard

1. Go to [SSLCommerz Merchant Portal](https://merchant.sslcommerz.com)
2. Login with your credentials
3. Navigate to **Settings** or **Merchant Account**

### 4.2 Update Callback URLs

Find the section for **Callback URLs** or **IPN Settings** and update:

| URL Type | Value |
|----------|-------|
| **Success URL** | `https://autospark-payment-abc123def456.ondigitalocean.app/api/payment/success` |
| **Fail URL** | `https://autospark-payment-abc123def456.ondigitalocean.app/api/payment/fail` |
| **Cancel URL** | `https://autospark-payment-abc123def456.ondigitalocean.app/api/payment/cancel` |
| **IPN URL** (optional) | `https://autospark-payment-abc123def456.ondigitalocean.app/api/payment/ipn` |

⚠️ **Remember to replace `abc123def456` with your actual DigitalOcean app subdomain!**

### 4.3 Save Changes

Click **"Save"** or **"Update"** to apply the changes.

---

## 🧪 Step 5: Test End-to-End Payment Flow

### 5.1 Test Locally (Development)

```bash
# Terminal 1: Start the proxy server
npm run proxy

# Output should show:
# Proxy running on port 8787
```

```bash
# Terminal 2: Start the Vite dev server
npm run dev

# Output should show:
# VITE v5.x ready in xxx ms
# http://localhost:5173/
```

Now test in your browser:
1. Navigate to `http://localhost:5173/payment`
2. Fill in the payment form:
   - Name: `Test User`
   - Email: `test@example.com`
   - Phone: `01700000000`
   - Product: `Test Payment`
   - Amount: `100`
3. Click **"💳 Pay Now"**
4. Check browser console for logs
5. Should redirect to SSLCommerz Sandbox

### 5.2 Monitor Supabase

While testing, monitor your Supabase orders table:

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Project: `autospark`
3. Table: `orders`
4. You should see:
   - ✅ New order created with `tran_id` when you initiate payment
   - ✅ Order updated to `paid` status after successful payment
   - ✅ All customer details captured

### 5.3 Check Logs

#### Local Proxy Logs
```bash
# You should see:
[proxy] POST /api/payment/initiate -> https://autospark-payment-xxx.ondigitalocean.app/api/payment/initiate
[proxy] payment/initiate response status: 200
```

#### DigitalOcean App Logs
1. Go to DigitalOcean Console → Your App
2. Click **"Logs"** tab
3. Check for payment API activity

### 5.4 Complete Test Checklist

- [ ] Payment form loads at `/payment`
- [ ] Form submission sends data to proxy
- [ ] Proxy forwards to DigitalOcean Payment API
- [ ] New order appears in Supabase (status: `pending`)
- [ ] Redirect to SSLCommerz gateway succeeds
- [ ] SSLCommerz sandbox payment gateway loads
- [ ] After completion, order updates in Supabase
- [ ] Callback redirects user correctly

---

## 📊 Architecture After Deployment

```
┌────────────────────────────────────────────┐
│ Autospark Frontend                         │
│ https://autosparkbd.com/payment            │
│ (GitHub Pages + Vite React)                │
└────────────────────────────────────────────┘
                    ↓
        (1. Form submission)
                    ↓
┌────────────────────────────────────────────┐
│ Local Proxy Server (Dev only)              │
│ localhost:8787                             │
│ server/proxy.cjs                           │
└────────────────────────────────────────────┘
                    ↓
        (2. Forward to backend)
                    ↓
┌────────────────────────────────────────────┐
│ DigitalOcean App Platform                  │
│ https://autospark-payment-xxx.ondigitalocean.app │
│ (Next.js Backend)                          │
└────────────────────────────────────────────┘
                    ↓
        (3. Initiate payment)
                    ↓
┌────────────────────────────────────────────┐
│ SSLCommerz Payment Gateway                 │
│ https://sandbox.sslcommerz.com             │
│ (Secure payment processing)                │
└────────────────────────────────────────────┘
                    ↓
        (4. POST callback)
                    ↓
┌────────────────────────────────────────────┐
│ DigitalOcean App Platform                  │
│ /api/payment/success|fail|cancel           │
│ (Process callback)                         │
└────────────────────────────────────────────┘
                    ↓
        (5. Update database)
                    ↓
┌────────────────────────────────────────────┐
│ Supabase PostgreSQL                        │
│ orders table                               │
│ (Order status updated)                     │
└────────────────────────────────────────────┘
```

---

## 🐛 Troubleshooting

### Issue: Proxy returns "Payment API URL not configured"
**Solution:** Make sure `PAYMENT_API_URL` is set in `.env.local`

### Issue: "CORS error" or "Blocked by CORS"
**Solution:** DigitalOcean App Platform should handle CORS. Check:
1. Request is going through proxy (not directly to DigitalOcean)
2. Content-Type header is `application/json`

### Issue: "No order appears in Supabase"
**Solution:**
1. Check DigitalOcean app logs for errors
2. Verify Supabase credentials in payment API env vars
3. Check Supabase RLS policies on `orders` table

### Issue: "Redirect fails" or loops
**Solution:**
1. Verify SSLCommerz callback URLs are correct
2. Make sure you're using the CORRECT DigitalOcean app URL
3. Check firewall/DNS settings (unlikely but possible)

---

## ✅ Deployment Checklist

- [ ] Push latest code to GitHub (`git push origin main`)
- [ ] Create DigitalOcean App with source directory `next-sslcommerz`
- [ ] Add all environment variables to DigitalOcean App
- [ ] Wait for deployment to complete
- [ ] Copy the DigitalOcean App URL
- [ ] Update `PAYMENT_API_URL` in `.env.local`
- [ ] Verify proxy server has payment routes (check `server/proxy.cjs`)
- [ ] PaymentPage.tsx exists at `src/pages/PaymentPage.tsx`
- [ ] Payment route added to `src/App.tsx`
- [ ] Update SSLCommerz callback URLs to DigitalOcean App URL
- [ ] Test locally with proxy server running
- [ ] Verify orders appear in Supabase
- [ ] Test complete flow end-to-end

---

## 🎉 Next Steps

Once everything is working locally:
1. Deploy the main Autospark frontend to production
2. Test payment flow on production domain `https://autosparkbd.com/payment`
3. Switch SSLCommerz from sandbox to LIVE mode (if ready for production)
4. Monitor orders in Supabase dashboard

---

## 📞 Support

For issues or questions:
- Check DigitalOcean App logs
- Check local proxy logs
- Check SSLCommerz merchant dashboard
- Verify Supabase table and RLS policies
- Review this guide again carefully

