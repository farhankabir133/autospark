# 🔍 PAYMENT ERROR TROUBLESHOOTING

## Error You're Seeing
```
"Payment initialization failed"
"Dismiss"
```

## Quick Diagnosis

### Step 1: Open Browser DevTools
1. Press `F12` or `Cmd+Option+I`
2. Go to **Console** tab
3. Try the payment again
4. Look for error message

### Step 2: Check Network Tab
1. Go to **Network** tab
2. Filter for "payment" or "init"
3. Look at the failed request
4. Check the **Response** tab

### Step 3: Common Issues & Fixes

---

## 🔴 Error: "Cannot reach payment API"

### Problem
The payment endpoint is not accessible.

### Check
```bash
# Test if API is reachable
curl https://autospark-one.vercel.app/api/payment/init
```

### Fix
- [ ] Verify `.env.local` has `VITE_PAYMENT_API_URL=https://autospark-one.vercel.app`
- [ ] Check if Vercel deployment is live
- [ ] Restart dev server: `npm run dev`

---

## 🔴 Error: "401 Unauthorized"

### Problem
Authentication headers are wrong.

### Check
```bash
# Verify Supabase key is set
echo $VITE_SUPABASE_ANON_KEY
```

### Fix
- [ ] Check `.env.local` for correct `VITE_SUPABASE_ANON_KEY`
- [ ] Key should start with `sb_publishable_`
- [ ] Restart dev server

---

## 🔴 Error: "404 Not Found"

### Problem
The endpoint doesn't exist.

### Possible Causes
- [ ] Supabase function not deployed
- [ ] API path is wrong
- [ ] Wrong domain in URL

### Fix

**For Supabase:**
```bash
supabase functions deploy init-ssl-payment
```

**For Vercel API:**
- Check that `/api/payment/init` endpoint exists
- Verify in Vercel project settings

---

## 🔴 Error: "No payment gateway URL found in response"

### Problem
API returned successfully but without `GatewayPageURL`.

### Check
The API response should have:
```json
{
  "GatewayPageURL": "https://sandbox.sslcommerz.com/...",
  "status": "SUCCESS"
}
```

### Fix
- [ ] Check if SSLCommerz credentials are correct
- [ ] Verify `SSLCOMMERZ_STORE_ID` is set
- [ ] Verify `SSLCOMMERZ_STORE_PASSWORD` is set
- [ ] Check Supabase logs: `supabase functions logs init-ssl-payment --tail`

---

## 🟡 Error: "Payment initialization failed" (Generic)

### Could Be Any Of Above

### Step-by-Step Debug

1. **Check browser console**
   - What's the exact error?
   - Is it a network error or API error?

2. **Check Network tab**
   - What's the response status? (200, 400, 401, 404, 500?)
   - What's in the response body?

3. **Check Supabase logs** (if using Supabase)
   ```bash
   supabase functions logs init-ssl-payment --tail
   ```

4. **Check Vercel logs** (if using Vercel API)
   - Go to Vercel dashboard
   - Project: autospark-one
   - Functions tab
   - Look for recent errors

---

## ✅ Everything Working

When payment works, you should see:

1. Form validates ✅
2. Loading spinner appears ✅
3. (Brief moment of processing)
4. Redirect to SSLCommerz gateway ✅
5. See actual payment page (not error) ✅

---

## 🛠️ Manual Testing

### Test 1: Check API Directly
```bash
curl -X POST https://autospark-one.vercel.app/api/payment/init \
  -H "Content-Type: application/json" \
  -d '{
    "cart": [{"id": 1, "name": "Test", "price": 100, "quantity": 1}],
    "total_amount": 100,
    "customer_name": "Test User",
    "mobile": "01712345678",
    "address": "Test Address",
    "thana": "Test",
    "district": "Dhaka"
  }'
```

If successful, you should get a JSON response with `GatewayPageURL`.

### Test 2: Check Supabase Edge Function
```bash
supabase functions serve init-ssl-payment
```

Then test locally:
```bash
curl -X POST http://localhost:54321/functions/v1/init-ssl-payment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{ ... }'
```

---

## 📝 What Changed to Fix This

### Change 1: Fallback API Endpoint
```typescript
// Now tries Payment API first, falls back to Supabase
INIT_PAYMENT: import.meta.env.VITE_PAYMENT_API_URL 
  ? `${import.meta.env.VITE_PAYMENT_API_URL}/api/payment/init`
  : `${SUPABASE_CONFIG.URL}/functions/v1/init-ssl-payment`,
```

### Change 2: Smart Headers
```typescript
// Uses correct headers for each endpoint type
const isSupabase = PAYMENT_GATEWAY_URLS.INIT_PAYMENT.includes('supabase');
const headers = isSupabase
  ? getSupabaseAuthHeader()
  : { 'Content-Type': 'application/json' };
```

---

## 🚀 Next Steps

1. **Check browser console** for exact error
2. **Check Network tab** for response details
3. **Use debugging steps above** to identify issue
4. **Fix the specific problem**
5. **Test again**

If you share the exact error message from the console, I can help more specifically!

---

**Build is updated and deployed. Ready to test!** ✅
