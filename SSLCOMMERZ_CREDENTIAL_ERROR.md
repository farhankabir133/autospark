# ❌ SSLCommerz Credential Error

## The Error
```
"Store Credential Error Or Store is De-active"
```

## Root Cause
The payment system is using **live SSLCommerz credentials** but needs **sandbox credentials** for testing.

### Current Setup
- Store ID: `autosparkbd0live`
- Mode: Live (production)
- Status: Store is inactive or credentials are wrong

### What We Need
For local development and testing, you need **SSLCommerz sandbox credentials**:
1. A sandbox Store ID (usually starts with `testbox` or similar)
2. A sandbox Store Password
3. Sandbox API endpoint: `https://sandbox.sslcommerz.com/...`

---

## How to Get Sandbox Credentials

### Option 1: Use SSLCommerz Test Credentials (Most Common)
SSLCommerz provides test/demo credentials for sandbox:
```
Store ID: testbox
Store Password: testbox
API URL: https://sandbox.sslcommerz.com/gwprocess/v4/api.php
```

### Option 2: Create Your Own Sandbox Account
1. Go to https://sslcommerz.com
2. Sign up for a developer account
3. Create a sandbox store
4. Get your sandbox Store ID and Password
5. Use sandbox API endpoint

---

## How to Fix

### Step 1: Update .env File
Change from live to sandbox credentials:

**Before (Live - ❌ Not working):**
```
VITE_SSLCOMMERZ_STORE_ID=autosparkbd0live
VITE_SSLCOMMERZ_STORE_PASSWORD=69DBB19BAB55E48107
VITE_SSLCOMMERZ_LIVE_MODE=true
```

**After (Sandbox - ✅ For testing):**
```
VITE_SSLCOMMERZ_STORE_ID=testbox
VITE_SSLCOMMERZ_STORE_PASSWORD=testbox
VITE_SSLCOMMERZ_LIVE_MODE=false
```

### Step 2: Restart Dev Server
```bash
npm run dev:full
```

### Step 3: Test Payment
- Go to http://localhost:5174
- Fill payment form
- Submit
- Should work with sandbox!

---

## SSLCommerz Sandbox Test Cards

After fixing credentials, use these test cards:

### Visa Card (Approved)
```
Card Number: 4111111111111111
Expiry: 12/25
CVV: 123
```

### Visa Card (Declined)
```
Card Number: 4012888888881881
Expiry: 12/25
CVV: 123
```

### Mastercard (Approved)
```
Card Number: 5555555555554444
Expiry: 12/25
CVV: 123
```

---

## Alternative: Use Live Account (If Activated)

If you have an **active** live SSLCommerz account:

1. **Verify Store is Active:**
   - Log in to SSLCommerz dashboard
   - Check store status is "Active"
   - Verify credentials are correct

2. **Check IP Whitelist:**
   - SSLCommerz may require IP whitelisting
   - Add your IP to SSLCommerz settings

3. **Use Correct Store ID:**
   - Make sure `autosparkbd0live` is your actual store ID
   - Check in SSLCommerz dashboard

---

## Recommended for Development

Use **sandbox credentials** for:
- ✅ Local testing (http://localhost:5174)
- ✅ Staging environment
- ✅ Development and debugging

Use **live credentials** for:
- ✅ Production deployment only
- ✅ Real customer transactions

---

## Next Steps

1. Update `.env` with sandbox credentials
2. Restart dev server
3. Test payment flow
4. Verify success/fail/cancel pages work
5. When ready for production, switch to live credentials

---

**Choose sandbox or verify live account!** 🔐
