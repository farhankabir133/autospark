# Payment Testing Checklist

## 🧪 What We Just Did

### Test 1: Payment Initiation ✅
**Endpoint:** POST `/api/payment/initiate`  
**Port:** 3000 (NOT 3001)  
**Status:** Working ✅

```bash
curl -X POST "http://localhost:3000/api/payment/initiate" \
  -H "Content-Type: application/json" \
  -d '{
    "total_amount": 1000,
    "cus_name": "Farhan Test",
    "cus_email": "farhan@test.com",
    "cus_phone": "01700000000",
    "product_name": "Test Order"
  }'
```

**Response:**
```json
{
  "url": "https://sandbox.sslcommerz.com/EasyCheckOut/testcde02b610f5002d2896cdf4abf3867cc09",
  "tran_id": "txn_1775038098510"
}
```

### Test 2: Payment Success Callback ✅
**Endpoint:** POST `/api/payment/success`  
**Status:** Server receiving requests ✅

The server returns `HTTP 307 /payment-failed` because:
- We used a fake `val_id` (test-val-id-final)
- SSLCommerz validation SDK returns INVALID_TRANSACTION for fake IDs
- This is **EXPECTED behavior** ✅

---

## 📊 Next: Check Supabase Orders Table

**Now you need to check if the order was recorded in Supabase:**

1. Go to **[Supabase Dashboard](https://supabase.com/dashboard)**
2. Select your project: **hcdwfxnvmvvkbpeshbqk**
3. Click **Table Editor** (left sidebar)
4. Click **`orders`** table
5. Look for a row with:
   - `tran_id`: `txn_1775038098510`
   - `cus_name`: `Farhan Test`
   - `cus_email`: `farhan@test.com`
   - `status`: Should be `pending` (since validation failed)

---

## ❓ If No Orders Appear in Supabase

Check these issues:

### Issue 1: RLS Policy Not Enabled
**Fix:** Go to Supabase → Authentication → Policies → `orders` table
- Make sure you have a policy created (e.g., "Enable all operations for testing")
- The policy should use `PERMISSIVE` and `ALL` operations
- Policy expression should be `true`

### Issue 2: `.env.local` Missing Supabase Credentials
**Fix:** Check the file:
```bash
cat /Users/farhankabir/Documents/a-s/autospark/next-sslcommerz/.env.local
```

Should contain:
```
SUPABASE_URL=https://hcdwfxnvmvvkbpeshbqk.supabase.co
SUPABASE_ANON_KEY=sb_publishable_o4V4NsBTa1omeSCyl8GuuA_UppA17sl
```

### Issue 3: Wrong Table Name or Schema
**Fix:** Verify the table:
- Go to Supabase → SQL Editor
- Run: `SELECT * FROM public.orders;`
- Should return any rows you've created

### Issue 4: Server Logs Show Error
**Fix:** Look for database error messages in Next.js console when running the curl command

---

## ✅ If Orders DO Appear in Supabase

**Congratulations! Your full integration is working!** 🎉

The flow is:
1. ✅ Client calls `/api/payment/initiate`
2. ✅ Server returns SSLCommerz GatewayPageURL
3. ✅ User completes payment on SSLCommerz
4. ✅ SSLCommerz POSTs to `/api/payment/success`
5. ✅ Server updates order in Supabase
6. ✅ User is redirected to success page

---

## 🎯 Next Test: Try the Fail Route

Once you confirm orders are being saved, test the fail route:

```bash
curl -X POST "http://localhost:3000/api/payment/fail" \
  -H "Content-Type: application/json" \
  -d '{
    "tran_id": "txn_fail_test_456",
    "status": "failed",
    "error": "Insufficient funds"
  }'
```

Then check Supabase for a new order with `status: failed` and `failed_reason: Insufficient funds`

---

## 🔍 Real Payment Testing (Production)

When ready to test with real SSLCommerz sandbox:

1. You'll need real sandbox credentials (not test data)
2. Update `.env.local`:
   - `STORE_ID` and `STORE_PASS` with actual sandbox credentials
   - `IS_LIVE=false` to stay in sandbox mode
3. Access the payment form at `http://localhost:3000`
4. Complete payment in SSLCommerz sandbox
5. Callback will automatically POST to `/api/payment/success`
6. Order will be saved to Supabase

---

**What did you see in Supabase? Do you have any orders in the table?**
