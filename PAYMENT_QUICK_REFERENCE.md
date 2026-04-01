# 🎯 Payment Integration - Quick Reference

## Starting the Payment Server

```bash
cd /Users/farhankabir/Documents/a-s/autospark/next-sslcommerz
npm run dev
```

Server runs on: **http://localhost:3000**

---

## Testing Payment Flow

### 1️⃣ Initiate Payment
```bash
curl -X POST "http://localhost:3000/api/payment/initiate" \
  -H "Content-Type: application/json" \
  -d '{
    "total_amount": 1000,
    "cus_name": "Test User",
    "cus_email": "test@example.com",
    "cus_phone": "01700000000",
    "product_name": "Test Product"
  }'
```

**Response:** `{ "url": "https://sandbox.sslcommerz.com/...", "tran_id": "txn_..." }`

**What happens:** 
- ✅ Order saved to Supabase with status `pending`
- ✅ `tran_id` recorded for future reference

---

### 2️⃣ Check Supabase
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select project: `hcdwfxnvmvvkbpeshbqk`
3. Click **Table Editor** → **`orders`**
4. Verify new order appears with `status: pending`

---

### 3️⃣ Simulate Success (Testing Only)
```bash
curl -X POST "http://localhost:3000/api/payment/success" \
  -H "Content-Type: application/json" \
  -d '{
    "val_id": "test-val-id",
    "tran_id": "txn_...",
    "status": "VALID"
  }'
```

**In production:** SSLCommerz automatically POSTs to this endpoint

---

### 4️⃣ Simulate Failure (Testing)
```bash
curl -X POST "http://localhost:3000/api/payment/fail" \
  -H "Content-Type: application/json" \
  -d '{"tran_id": "txn_..."}'
```

---

### 5️⃣ Simulate Cancellation (Testing)
```bash
curl -X POST "http://localhost:3000/api/payment/cancel" \
  -H "Content-Type: application/json" \
  -d '{"tran_id": "txn_..."}'
```

---

## Key Files

| File | Purpose |
|------|---------|
| `lib/sslcommerz.ts` | SSLCommerz SDK initialization |
| `lib/supabase.ts` | Supabase client setup |
| `pages/api/payment/initiate.ts` | Create payment (INSERT order) |
| `pages/api/payment/success.ts` | Handle success (UPSERT order) |
| `pages/api/payment/fail.ts` | Handle failure (UPSERT order) |
| `pages/api/payment/cancel.ts` | Handle cancellation (UPSERT order) |
| `.env.local` | Secrets (SSLCommerz + Supabase) |

---

## Troubleshooting

### ❌ "Order not appearing in Supabase"
1. Check `.env.local` has correct Supabase credentials
2. Verify RLS policy is created and enabled
3. Check Next.js console for error messages: `console.error('Database error'...)`

### ❌ "Payment initiation returns 500 error"
1. Verify `STORE_ID` and `STORE_PASS` in `.env.local`
2. Check `.env.local` has all required variables
3. Restart server after updating `.env.local`

### ❌ "Can't connect to Supabase"
1. Verify internet connection
2. Check if Supabase is down: https://status.supabase.com
3. Test credentials in Supabase dashboard directly

---

## Order Status Lifecycle

```
PENDING → (Redirect to Gateway) → PAID ✅
                                 → FAILED ❌
                                 → CANCELLED ⏹️
```

---

## Environment Variables

### Required for SSLCommerz
```
STORE_ID=autos69cccc023b067
STORE_PASS=autos69cccc023b067@ssl
IS_LIVE=false
APP_URL=http://localhost:3000
```

### Required for Supabase
```
SUPABASE_URL=https://hcdwfxnvmvvkbpeshbqk.supabase.co
SUPABASE_ANON_KEY=sb_publishable_o4V4NsBTa1omeSCyl8GuuA_UppA17sl
```

---

## Production Checklist

- [ ] Get production `STORE_ID` and `STORE_PASS` from SSLCommerz
- [ ] Change `IS_LIVE=true` in `.env`
- [ ] Update `APP_URL` to your production domain
- [ ] Enable HTTPS/SSL certificate
- [ ] Update callback URLs in SSLCommerz dashboard
- [ ] Test with small payment amount
- [ ] Monitor Supabase orders table for real transactions
- [ ] Set up email notifications
- [ ] Enable Row Level Security (RLS) for production

---

## Success! 🎉

Your payment gateway is now integrated and orders are being saved to Supabase!

**Next:** Integrate payment form into your main Autospark website.
