# 🚀 Payment API Integration - QUICK START

## ✅ What's Been Completed

### 1. **Proxy Server Updated** ✅
- `server/proxy.cjs` now has 4 payment routes:
  - `POST /api/payment/initiate`
  - `POST /api/payment/success`
  - `POST /api/payment/fail`
  - `POST /api/payment/cancel`
- Routes forward to DigitalOcean App Platform

### 2. **Payment Page Created** ✅
- File: `src/pages/PaymentPage.tsx`
- Route: `/payment`
- Form collects: name, email, phone, product, amount
- Validates input and handles errors
- Redirects to SSLCommerz on success

### 3. **Frontend Route Added** ✅
- Updated `src/App.tsx`
- PaymentPage lazy-loaded for performance
- Route is accessible at: `https://autosparkbd.com/payment`

### 4. **Documentation Complete** ✅
- `PAYMENT_API_DEPLOYMENT_STEPS.md` - Full deployment guide
- `PAYMENT_TESTING_GUIDE.md` - Testing procedures
- `PAYMENT_API_INTEGRATION_WITH_DO.md` - Architecture overview

### 5. **All Changes Pushed** ✅
- Committed to GitHub with message: "feat: payment API integration..."

---

## 📋 Your Next Action: Deploy to DigitalOcean

### Choose Your Deployment Option

**Option A: DigitalOcean App Platform** (RECOMMENDED ⭐)
- Easiest to set up
- Auto-deployed from GitHub
- No server management
- ~$12/month

**Option B: DigitalOcean Droplet**
- More control
- Need to manage manually
- Cheaper but requires work

### 👉 NEXT STEP: Deploy `next-sslcommerz` to DigitalOcean

Follow **Step 1** in `PAYMENT_API_DEPLOYMENT_STEPS.md`:

1. Go to DigitalOcean Console
2. Click "Create" → "Apps"
3. Connect to GitHub and select `autospark` repository
4. Set source directory to **`next-sslcommerz`** (⚠️ IMPORTANT!)
5. Add environment variables:
   - `STORE_ID`: `autos69cccc023b067`
   - `STORE_PASS`: `autos69cccc023b067@ssl`
   - `IS_LIVE`: `false`
   - `SUPABASE_URL`: Your Supabase URL
   - `SUPABASE_ANON_KEY`: Your Supabase key
   - `NODE_ENV`: `production`
6. Deploy and wait 2-5 minutes
7. Copy the URL you get (e.g., `https://autospark-payment-abc123.ondigitalocean.app`)

---

## 🔧 After Getting Your DigitalOcean App URL

Once you have the URL, complete these 3 steps:

### Step 1: Update Environment Variable
```bash
# Edit .env.local
PAYMENT_API_URL=https://autospark-payment-abc123def456.ondigitalocean.app
```

### Step 2: Test Locally
```bash
# Terminal 1
npm run proxy

# Terminal 2
npm run dev

# Browser: http://localhost:5173/payment
```

### Step 3: Update SSLCommerz Callbacks
In SSLCommerz Merchant Dashboard, update:
- Success URL: `https://autospark-payment-abc123.ondigitalocean.app/api/payment/success`
- Fail URL: `https://autospark-payment-abc123.ondigitalocean.app/api/payment/fail`
- Cancel URL: `https://autospark-payment-abc123.ondigitalocean.app/api/payment/cancel`

---

## 🧪 Quick Test

```bash
# 1. Start proxy (keep running)
npm run proxy

# 2. In new terminal, test endpoint
curl -X POST "http://localhost:8787/api/payment/initiate" \
  -H "Content-Type: application/json" \
  -d '{
    "total_amount": 100,
    "cus_name": "Test User",
    "cus_email": "test@example.com",
    "cus_phone": "01700000000",
    "product_name": "Test Order"
  }'

# 3. Check Supabase - order should appear
# 4. Response should include SSLCommerz URL
```

---

## 📊 Current Architecture

```
Autospark Frontend
    ↓ (calls /api/payment/*)
Proxy Server (localhost:8787)
    ↓ (forwards to)
DigitalOcean App Platform
    ↓ (creates order in)
Supabase PostgreSQL
    ↓ (initiates payment with)
SSLCommerz Gateway
```

---

## 📁 Files Modified/Created

### New Files
- `src/pages/PaymentPage.tsx` - Payment form component
- `PAYMENT_API_DEPLOYMENT_STEPS.md` - Step-by-step guide
- `PAYMENT_TESTING_GUIDE.md` - Testing procedures

### Modified Files
- `server/proxy.cjs` - Added payment routes (4 new endpoints)
- `src/App.tsx` - Added `/payment` route
- `.env.local` - Will add `PAYMENT_API_URL` after DigitalOcean deployment

### Unchanged (Ready)
- `next-sslcommerz/` - All API routes (initiate, success, fail, cancel)
- Supabase `orders` table - Already configured

---

## 🎯 Complete Flow

```
1. User goes to https://autosparkbd.com/payment
   ↓
2. Fills form and clicks "Pay Now"
   ↓
3. Form posts to /api/payment/initiate
   ↓
4. Proxy forwards to DigitalOcean app
   ↓
5. App creates order in Supabase (status: pending)
   ↓
6. App returns SSLCommerz gateway URL
   ↓
7. Frontend redirects to SSLCommerz payment page
   ↓
8. User completes payment
   ↓
9. SSLCommerz POSTs callback to /api/payment/success
   ↓
10. DigitalOcean app validates and updates order status to "paid"
    ↓
11. User redirected back to app
    ↓
12. Order confirmed in Supabase ✅
```

---

## ⚠️ Important Notes

1. **Source Directory**: When deploying, set source directory to `next-sslcommerz` (not root!)
2. **Environment Variables**: All 6 env vars are required
3. **Supabase Credentials**: Must match your actual Supabase project
4. **SSLCommerz URLs**: Update ALL 3 URLs (success, fail, cancel)
5. **Sandbox Mode**: IS_LIVE=false for testing, change to true for production

---

## 🆘 Troubleshooting

### "Cannot POST /api/payment/initiate"
→ Proxy not running or not updated. Run `npm run proxy` and check `server/proxy.cjs`

### "Payment API URL not configured"
→ Missing `PAYMENT_API_URL` in `.env.local`. Add it with your DigitalOcean URL.

### "No order in Supabase"
→ Check:
1. DigitalOcean app logs (may have error)
2. Supabase credentials in DigitalOcean app env vars
3. RLS policies on `orders` table (should be permissive)

### "DigitalOcean app fails to build"
→ Check:
1. Source directory is `next-sslcommerz` ✓
2. Build command is `npm run build` ✓
3. Run command is `npm start` ✓
4. All dependencies installed (`package.json` exists) ✓

---

## 📞 Reference Files

- **Deployment Guide**: `PAYMENT_API_DEPLOYMENT_STEPS.md`
- **Testing Guide**: `PAYMENT_TESTING_GUIDE.md`
- **Architecture Overview**: `PAYMENT_API_INTEGRATION_WITH_DO.md`
- **Payment Form Code**: `src/pages/PaymentPage.tsx`
- **Proxy Routes**: `server/proxy.cjs` (search for "Payment API Routes")
- **App Routes**: `src/App.tsx` (search for "PaymentPage")

---

## 🎉 Success Criteria

You'll know everything is working when:

- [ ] DigitalOcean app deployed and URL available
- [ ] `npm run proxy` starts without errors
- [ ] `npm run dev` loads the app
- [ ] `/payment` route loads the form
- [ ] Form submission redirects to SSLCommerz
- [ ] New order appears in Supabase after submission
- [ ] Order has correct customer data
- [ ] Browser console shows no errors

---

## 🚀 Ready?

**Your task**: Deploy `next-sslcommerz` to DigitalOcean App Platform following the steps in `PAYMENT_API_DEPLOYMENT_STEPS.md` (Section 1: Steps 1.1-1.4)

Once you have the URL, I'll help you complete the remaining setup! 🎯

