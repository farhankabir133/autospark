# SSLCommerz Callback URL Configuration

## 🔧 Quick Setup (5 minutes)

Your payment API is now live at **https://autospark-one.vercel.app**

You need to update 3 callback URLs in your SSLCommerz merchant dashboard.

---

## ✅ Step-by-Step Instructions

### 1. Log into SSLCommerz Merchant Portal
- Go to: https://merchant.sslcommerz.com
- Login with your credentials
- Navigate to **API Credentials** or **Settings**

### 2. Update the 3 Callback URLs

Find the section for **Payment Gateway URLs** or **Callback URLs** and update:

| URL Type | New URL |
|----------|---------|
| **Success URL** | `https://autospark-one.vercel.app/api/payment/success` |
| **Fail URL** | `https://autospark-one.vercel.app/api/payment/fail` |
| **Cancel URL** | `https://autospark-one.vercel.app/api/payment/cancel` |

### 3. Save Changes
- Click **Save** or **Update**
- You should see a confirmation message

---

## 📝 What Each URL Does

- **Success URL**: Called by SSLCommerz when customer completes payment ✅
  - Records order as "paid" in Supabase
  - Returns success JSON response

- **Fail URL**: Called when payment fails ❌
  - Records order as "failed" in Supabase
  - Returns failure JSON response

- **Cancel URL**: Called when customer cancels payment 🚫
  - Records order as "cancelled" in Supabase
  - Returns cancellation JSON response

---

## 🧪 Testing After Configuration

1. **Start proxy server:**
   ```bash
   npm run proxy
   ```

2. **Start frontend (new terminal):**
   ```bash
   npm run dev
   ```

3. **Open payment form:**
   - Visit: `http://localhost:5173/payment`

4. **Submit test payment:**
   - Fill in form with test data
   - Click "Pay Now"
   - You should be redirected to SSLCommerz sandbox

5. **Verify in Supabase:**
   - Go to: https://supabase.com/dashboard
   - Project: `hcdwfxnvmvvkbpeshbqk`
   - Table: `orders`
   - Check for new order record with `status: 'pending'`

---

## 🔍 Troubleshooting

### Issue: "Payment initiation failed"
- Check SSLCommerz STORE_ID and STORE_PASS in Vercel environment variables
- Verify IS_LIVE is set correctly (should be "true" or "false")

### Issue: "Order not appearing in Supabase"
- Check Vercel logs: https://vercel.com/dashboard
- Verify Supabase credentials in Vercel env vars
- Check database RLS policies are enabled

### Issue: "Redirect to SSLCommerz not working"
- Verify PAYMENT_API_URL is set in `.env.local`
- Check proxy server is running on port 8787
- Check browser console for errors

---

## 📞 Support

- SSLCommerz Docs: https://sslcommerz.com/developer/
- Vercel Deployment: https://autospark-one.vercel.app
- Supabase Project: https://hcdwfxnvmvvkbpeshbqk.supabase.co

---

## ✨ Architecture Overview

```
Frontend (GitHub Pages)
    ↓
Local Proxy Server (:8787)
    ↓
Vercel Payment API (https://autospark-one.vercel.app)
    ↓
SSLCommerz Sandbox/Live
    ↓
Supabase Database
```

All 4 payment routes are configured and ready!
