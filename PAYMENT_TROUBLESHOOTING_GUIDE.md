# Payment Integration Troubleshooting Guide

## Issue: Still Seeing Raw JSON Response

### Diagnosis
If you're still seeing the JSON response instead of being redirected to SSLCommerz:

1. **Check Network Tab**
   - Open DevTools → Network tab
   - Click "Confirm Order"
   - Look for the fetch request to `init-ssl-payment`

2. **Check Response**
   - Is the response status 200?
   - Does it contain `GatewayPageURL`?

### Solutions

#### Solution 1: Verify Supabase Function is Running
```bash
# Check if function is deployed
supabase functions list

# Should show: init-ssl-payment
```

#### Solution 2: Check Environment Variables
In DigitalOcean/Vercel, ensure these are set:
```
SSLCOMMERZ_STORE_ID=autos69cccc023b067
SSLCOMMERZ_STORE_PASSWORD=autos69cccc023b067@ssl
SITE_URL=https://yourdomain.com
```

#### Solution 3: Clear Browser Cache
```javascript
// In browser console
localStorage.clear();
sessionStorage.clear();
// Reload page
```

#### Solution 4: Check Console Logs
Look for errors in:
- Browser console (DevTools)
- Supabase functions logs
- Application backend logs

---

## Issue: "No payment gateway URL found in response"

### Cause
The response from Supabase function doesn't contain `GatewayPageURL`

### Fix
1. Check if `SSLCOMMERZ_STORE_ID` is correct
2. Check if `SSLCOMMERZ_STORE_PASSWORD` is correct
3. Verify the credentials are for the **sandbox** environment (not production)

---

## Issue: CORS Errors

### Cause
Cross-origin request blocked

### Fix
The Supabase function already has CORS headers configured:
```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};
```

If still getting CORS errors:
1. Clear browser cache
2. Check that requests are going to `https://bxwdhsglvbftnhhxnkdv.supabase.co`

---

## Issue: "Payment initialization failed" with no details

### Cause
The Supabase function is throwing an error

### Debug Steps
1. Check Supabase function logs:
   ```
   Supabase Dashboard → Edge Functions → init-ssl-payment → Logs
   ```

2. Common issues:
   - Missing `SSLCOMMERZ_STORE_ID` environment variable
   - Missing `SSLCOMMERZ_STORE_PASSWORD` environment variable
   - Invalid credentials
   - SSLCommerz API is down

3. Check the exact error:
   - Look at the error message in Supabase logs
   - It will tell you which field is missing/invalid

---

## Debugging Checklist

- [ ] Supabase function `init-ssl-payment` is deployed
- [ ] Environment variables are set in production
- [ ] SSLCommerz credentials are correct (sandbox)
- [ ] SITE_URL environment variable points to your domain
- [ ] Cart items are properly formatted
- [ ] Total amount is a valid number
- [ ] Customer data (name, mobile, address, thana, district) is provided
- [ ] Network request to Supabase function succeeds (200 status)
- [ ] Response contains `GatewayPageURL`

---

## Test Payment Flow

### Step-by-Step Test
1. Go to Accessories page
2. Add an item to cart
3. Open DevTools → Network tab
4. Click "Checkout"
5. Fill in form:
   - Name: Test User
   - Mobile: 01700000000
   - District: Dhaka
   - Thana: Dhanmondi
   - Address: Test Address
6. Click "Confirm Order"
7. **Check Network Tab**:
   - Request to `init-ssl-payment` should show 200 status
   - Response should have `GatewayPageURL` with a URL

8. **Expected Behavior**:
   - Browser should redirect to SSLCommerz gateway URL
   - You should see payment method options (Card, Mobile Banking, etc.)

---

## Common Error Messages & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "Missing required payment information" | Cart items or total amount missing | Ensure cart is populated before checkout |
| "Payment gateway not configured" | SSLCOMMERZ credentials missing | Set env variables in deployment |
| "No payment gateway URL found in response" | Invalid SSLCommerz credentials | Verify store ID and password |
| "Payment initialization failed" | SSLCommerz API error | Check Supabase function logs |
| CORS error | Origin not allowed | Browser cache issue, try incognito mode |

---

## Production Deployment

### Before Going Live
1. [ ] Update SSLCOMMERZ_STORE_ID (production credentials)
2. [ ] Update SSLCOMMERZ_STORE_PASSWORD (production credentials)
3. [ ] Update SITE_URL to your production domain
4. [ ] Test payment flow with test card
5. [ ] Verify success/fail/cancel redirect URLs

### Environment Variables to Set
```
SSLCOMMERZ_STORE_ID=your_production_store_id
SSLCOMMERZ_STORE_PASSWORD=your_production_password
SITE_URL=https://www.autosparkbd.com
```

---

## Quick Links

- [Supabase Dashboard](https://supabase.com/dashboard)
- [SSLCommerz Sandbox](https://sandbox.sslcommerz.com)
- [Test Card Numbers](https://sandbox.sslcommerz.com/test-card)
- [Payment Config File](./src/config/payment.ts)
- [Payment Page](./src/pages/PaymentPage.tsx)
- [Backend Function](./supabase/functions/init-ssl-payment/index.ts)

---

## Still Not Working?

1. Check the complete error in browser DevTools Console
2. Check Supabase function logs
3. Verify network request in Network tab is reaching Supabase
4. Ensure all environment variables are correctly set
5. Try in incognito mode to clear cache
6. Check that Supabase project URL matches in config file

If still stuck, review the [PAYMENT_OPTIMIZATION_FIX.md](./PAYMENT_OPTIMIZATION_FIX.md) for the complete architecture.
