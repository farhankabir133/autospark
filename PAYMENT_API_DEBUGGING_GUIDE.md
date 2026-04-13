# Payment API Debugging Guide

**Issue**: "Unexpected token '<', "<html> <he"... is not valid JSON" error

**Root Cause**: The API endpoint is returning HTML instead of JSON (usually an error page).

---

## Quick Diagnostic Steps

### Step 1: Check Vercel Environment Variables

Open Vercel dashboard and verify these variables are set:

```
SSLCOMMERZ_STORE_ID=autosparkbd0live
SSLCOMMERZ_STORE_PASSWORD=69DBB19BAB55E48107
STORE_ID=autosparkbd0live
STORE_PASS=69DBB19BAB55E48107
SITE_URL=https://autospark-one.vercel.app
```

**To Check**:
1. Go to https://vercel.com/dashboard
2. Select your project "autospark"
3. Click "Settings" → "Environment Variables"
4. Verify all 5 variables are there
5. If missing, add them

### Step 2: Check Browser Console for API Details

When you get the error:

1. Open Browser DevTools (F12)
2. Go to "Network" tab
3. Click "Confirm Order" again
4. Look for the request to `/api/payment/init`
5. Click on it and check:
   - **Status**: Should be 200 OK
   - **Response**: Should show JSON like:
     ```json
     {
       "status": "SUCCESS",
       "GatewayPageURL": "https://securepay.sslcommerz.com/...",
       "sessionkey": "..."
     }
     ```
   - **If it shows HTML**: That's the problem!

### Step 3: Check Vercel Function Logs

1. Go to https://vercel.com/dashboard
2. Select "autospark" project
3. Go to "Functions" or "Deployments"
4. Find the latest deployment
5. Click on it
6. Look for logs containing your payment request
7. Look for messages like:
   - `Missing SSLCommerz credentials` ← Credentials not set
   - `SSLCommerz API error` ← Gateway connection failed
   - `Invalid response format` ← Gateway returned HTML

---

## Common Issues & Solutions

### Issue 1: Missing Environment Variables

**Error in Logs**: `Missing SSLCommerz credentials in environment`

**Fix**:
1. Go to Vercel dashboard → Settings → Environment Variables
2. Add these variables:
   ```
   SSLCOMMERZ_STORE_ID=autosparkbd0live
   SSLCOMMERZ_STORE_PASSWORD=69DBB19BAB55E48107
   STORE_ID=autosparkbd0live
   STORE_PASS=69DBB19BAB55E48107
   SITE_URL=https://autospark-one.vercel.app
   ```
3. Redeploy: Go to Deployments → Click "Redeploy"
4. Wait for deployment to finish
5. Test again

### Issue 2: Wrong Credentials

**Error in Logs**: `SSLCommerz API error: 400` or `Invalid credentials`

**Fix**:
1. Verify credentials are exactly:
   ```
   Store ID: autosparkbd0live
   Store Password: 69DBB19BAB55E48107
   ```
2. No extra spaces or characters
3. If changed in SSLCommerz portal, update Vercel variables
4. Redeploy

### Issue 3: SSLCommerz Gateway Down

**Error**: `Failed to connect to payment gateway`

**Fix**:
1. Wait 5-10 minutes
2. SSLCommerz maintenance happens occasionally
3. Try again
4. Contact SSLCommerz: integration@sslcommerz.com

### Issue 4: CORS or Network Issues

**Error**: `Failed to connect` or `Network error`

**Fix**:
1. Check internet connection
2. Try from different network
3. Check browser console for specific error
4. Contact us with the exact error message

---

## Testing the API Directly

### Using curl (from terminal):

```bash
curl -X POST https://autospark-one.vercel.app/api/payment/init \
  -H "Content-Type: application/json" \
  -d '{
    "cart": [{"id": "test", "name": "Test Item", "price": 1000}],
    "total_amount": 1000,
    "customer_name": "Test User",
    "mobile": "01700000000",
    "address": "Test Address",
    "thana": "Dhaka",
    "district": "Dhaka"
  }'
```

**Expected Response**:
```json
{
  "status": "SUCCESS",
  "GatewayPageURL": "https://securepay.sslcommerz.com/gwprocess/v4/gw.php?q=...",
  "sessionkey": "..."
}
```

**If you get HTML**: Check Vercel logs to see what the problem is.

---

## Browser Console Debugging

The updated code now logs detailed information. Check:

```
1. Open DevTools (F12)
2. Go to Console tab
3. Click "Confirm Order"
4. Look for messages like:
   - "🔄 Initiating SSLCommerz payment..."
   - "✅ SSLCommerz response: {...}"
   - "❌ Network error..."
   - "❌ Invalid response format..."
```

These will tell you exactly what's happening.

---

## Step-by-Step Fix Procedure

### If Getting JSON Parse Error:

**Step 1**: Check Vercel Logs
- Go to vercel.com dashboard
- Select autospark project
- Look at deployment logs
- Find error messages

**Step 2**: Verify Environment Variables
- Are all 5 variables set?
- Any typos?
- Spaces at beginning/end?

**Step 3**: Redeploy
- Go to Deployments
- Click "Redeploy" on latest
- Wait for green checkmark

**Step 4**: Test Again
- Clear browser cache (Ctrl+Shift+Delete)
- Go to /accessories
- Add item to cart
- Click "Proceed to Checkout"
- Fill form
- Click "Confirm Order"

**Step 5**: If Still Failing
- Check browser console (F12 → Console)
- Check Vercel logs again
- Look for the actual error message
- Report it with the error

---

## What Each Error Means

| Error | Meaning | Fix |
|-------|---------|-----|
| `Invalid response format` | API returned HTML instead of JSON | Check credentials in Vercel |
| `Missing SSLCommerz credentials` | Environment variables not set | Add variables to Vercel |
| `SSLCommerz API error: 400` | Bad request to SSLCommerz | Check credential format |
| `SSLCommerz API error: 500` | SSLCommerz server error | Wait and retry |
| `Network error` | Can't reach SSLCommerz | Check internet, try again |
| `Unexpected token '<'` | Parsing HTML as JSON | Credentials issue or gateway down |

---

## Files That Handle Payment

If you need to make changes:

1. **Frontend Form**: `src/pages/PaymentPage.tsx`
   - Collects customer info
   - Sends to `/api/payment/init`
   - Handles responses

2. **Backend API**: `api/payment/init.ts`
   - Receives payment request
   - Validates credentials
   - Calls SSLCommerz
   - Returns gateway URL

3. **Configuration**: `.env` or Vercel Environment Variables
   - Store credentials
   - Site URL

---

## Next Steps

1. **Check Vercel Environment Variables** (Most Common Issue)
2. **Check Vercel Logs** for actual error
3. **Clear Browser Cache** and test again
4. **Contact SSLCommerz** if credentials are correct but still failing

---

## Support Contacts

**If above doesn't work:**

- **Your Merchant**: autosparkbd@gmail.com | 01760401605
- **SSLCommerz**: integration@sslcommerz.com | +88096122 26969
- **Tell them**: 
  - Error message from browser
  - Response from `/api/payment/init` endpoint
  - Store ID: autosparkbd0live

---

**Important**: Do NOT share your store password publicly. Only include it in Vercel environment variables (they're encrypted).
