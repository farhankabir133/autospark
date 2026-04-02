# 🚀 PAYMENT SYSTEM - MANUAL CONFIGURATION GUIDE

## Status: Code Deployed ✅ 
## Remaining: Environment Variable Configuration (Manual Steps)

---

## STEP 1: Configure Supabase Edge Function Secrets

**Why:** The Supabase edge function needs SSLCommerz credentials to work in production.

### Action:
1. Go to: **Supabase Dashboard** → **Project: hcdwfxnvmvvkbpeshbqk**
2. Click: **Edge Functions** (in left sidebar)
3. Find: **init-ssl-payment** function
4. Click: **Settings** or **Secrets** button
5. Add these secrets exactly as shown:

```
KEY:   SSLCOMMERZ_STORE_ID
VALUE: autos69cccc023b067

KEY:   SSLCOMMERZ_STORE_PASSWORD
VALUE: autos69cccc023b067@ssl

KEY:   SITE_URL
VALUE: https://autosparkbd.com
```

### Verify:
- After adding, click "Deploy" or restart the function
- Check that the function is **active/running**

---

## STEP 2: Update Vercel Environment Variables

**Why:** The Vercel API endpoint needs credentials to handle payment requests.

### Current Status (What You Showed):
- `STORE_ID` = ••••••••••• (WRONG NAME - should be SSLCOMMERZ_STORE_ID)
- `STORE_PASS` = autos69cccc023b067@ssl (WRONG NAME)
- `IS_LIVE` = false ✅
- `NODE_ENV` = production ✅
- `SITE_URL` = NOT SET ❌

### Action:
1. Go to: **Vercel Dashboard** → **Project: autospark-one**
2. Click: **Settings** → **Environment Variables**
3. Delete or update the old variables:
   - Delete: `STORE_ID` (old name)
   - Delete: `STORE_PASS` (old name)

4. Add new variables with correct names:

```
Name:  SSLCOMMERZ_STORE_ID
Value: autos69cccc023b067
Environments: All (Production, Preview, Development)

Name:  SSLCOMMERZ_STORE_PASSWORD
Value: autos69cccc023b067@ssl
Environments: All (Production, Preview, Development)

Name:  SITE_URL
Value: https://autosparkbd.com
Environments: All (Production, Preview, Development)
```

### What to keep:
- `IS_LIVE` = false ✅ (Keep - indicates sandbox mode)
- `NODE_ENV` = production ✅ (Keep - required by Vercel)

### Verify:
- After saving, Vercel will automatically redeploy
- Check that deployment is **successful**
- Go to Deployments tab to confirm new build completed

---

## STEP 3: Verify Frontend Environment Variables (Already Set)

**Status:** ✅ Already configured locally

Your `.env.local` has:
```
VITE_SUPABASE_URL=https://hcdwfxnvmvvkbpeshbqk.supabase.co ✅
VITE_SUPABASE_ANON_KEY=sb_publishable_o4V4NsBTa1omeSCyl8GuuA_UppA17sl ✅
VITE_PAYMENT_API_URL=https://autospark-one.vercel.app ✅
```

**Note:** These are frontend variables (VITE_ prefix) that are built into the JS bundle.

---

## STEP 4: Verify SSLCommerz Configuration

**Status:** ✅ Already correct

Your credentials are:
```
Store ID:       autos69cccc023b067
Store Password: autos69cccc023b067@ssl
Sandbox URL:    https://sandbox.sslcommerz.com/gwprocess/v4/api.php
Merchant Panel: https://sandbox.sslcommerz.com/manage/
```

**Test Account:**
- You can use SSLCommerz's test card information in sandbox

---

## PAYMENT FLOW ARCHITECTURE (After All Fixes)

```
┌─────────────────────────────────────────────────────────────┐
│ USER FILLS PAYMENT FORM ON FRONTEND                         │
│ (/payment page)                                             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │ Submit to Backend API  │ (fetch request)
         │ with payment data      │
         └───────────────┬───────┘
                         │
         ┌───────────────┴──────────────────┐
         │                                  │
         ▼                                  ▼
    ┌─────────────────┐        ┌──────────────────────┐
    │  SUPABASE API   │        │  VERCEL API (BACKUP) │
    │  Edge Function  │  ----->│  /api/payment/init   │
    │                 │ (if fails)                    │
    │ Uses:           │        │ Uses:                │
    │ - Env vars set  │        │ - Env vars from      │
    │   in Supabase   │        │   Vercel dashboard   │
    │   dashboard     │        │                      │
    └────────┬────────┘        └──────────┬───────────┘
             │                             │
             └──────────────┬──────────────┘
                            │
                            ▼
          ┌────────────────────────────────┐
          │ SSLCommerz Sandbox API          │
          │ https://sandbox.sslcommerz...   │
          │                                │
          │ Returns: GatewayPageURL         │
          └────────────────┬───────────────┘
                           │
                           ▼
          ┌────────────────────────────────┐
          │ Frontend Redirects User to       │
          │ SSLCommerz Payment Gateway      │
          │ (window.location.href =         │
          │  GatewayPageURL)                │
          └────────────────┬───────────────┘
                           │
                ┌──────────┴──────────┐
                │                     │
         (User Pays)            (User Cancels)
                │                     │
                ▼                     ▼
    ┌──────────────────┐    ┌─────────────────┐
    │ /payment/success  │    │ /payment/cancel │
    │ ?tran_id=...     │    │                 │
    └──────────────────┘    └─────────────────┘
           OR
    ┌──────────────────┐
    │ /payment/fail     │
    │                  │
    └──────────────────┘
```

---

## TESTING CHECKLIST

After completing all configuration steps:

### Test 1: Local Testing
```bash
npm run dev
# Navigate to /accessories
# Add item to cart
# Click "Confirm Order"
# Fill form:
  - Name: Test User
  - Mobile: 01712345678
  - District: Dhaka
  - Thana: Dhanmondi
  - Address: Test Address
# Click Submit

Expected:
✅ Redirect to SSLCommerz payment gateway (NOT error)
✅ Payment form appears
```

### Test 2: Production Testing
```
1. Go to: https://autosparkbd.com/accessories
2. Add item to cart
3. Go to checkout
4. Fill form with real details
5. Submit

Expected:
✅ Redirect to SSLCommerz payment gateway
✅ Can enter card details
✅ Process test payment
✅ Redirected to /payment/success page
```

### Test 3: Error Handling
```
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try payment
4. Look for POST request to:
   - /api/payment/init (Vercel) OR
   - /functions/v1/init-ssl-payment (Supabase)
5. Check response:
   - Should see GatewayPageURL ✅ OR
   - Error message if credentials wrong ❌
```

---

## TROUBLESHOOTING

### Error: "Payment initialization failed"

**Cause:** One of the endpoints is not responding

**Fix:**
1. Check browser console (F12) for exact error message
2. Check Network tab for response from API
3. Verify Supabase dashboard shows secrets are set
4. Verify Vercel dashboard shows env vars are set
5. Verify Vercel deployment completed successfully

### Error: "Missing required fields"

**Cause:** Frontend not sending all required data

**Fix:**
1. Fill out ALL form fields completely
2. Check form validation messages
3. Don't leave any field empty

### Error: "Missing SSLCommerz credentials"

**Cause:** Backend doesn't have store ID or password

**Fix:**
1. For Supabase: Go to Edge Functions → init-ssl-payment → Settings → Check Secrets
2. For Vercel: Go to Settings → Environment Variables → Check SSLCOMMERZ variables
3. Make sure they're deployed/saved
4. Trigger a redeployment

### Redirects to localhost instead of success page

**Cause:** SITE_URL is set to localhost

**Fix:**
1. For Supabase: Update SITE_URL secret to https://autosparkbd.com
2. For Vercel: Update SITE_URL env var to https://autosparkbd.com
3. Both must be production URL

---

## SUMMARY OF CHANGES MADE

### Code Changes (✅ Already Deployed):
1. **Supabase Edge Function** - Changed FormData to URLSearchParams
2. **Vercel API** - Added credential validation and legacy env var support
3. **Frontend Config** - Removed hardcoded fallback credentials
4. **Environment Files** - Updated with correct variable names

### Manual Configuration (⏳ You Need To Do):
1. **Supabase Dashboard** - Set 3 secrets in Edge Functions
2. **Vercel Dashboard** - Update env var names and add SITE_URL

---

## QUICK REFERENCE

| Component | Type | Credentials Used | How Set |
|-----------|------|------------------|---------|
| Supabase Edge Function | Backend | From Supabase Secrets | Supabase Dashboard |
| Vercel API (/api/payment/init) | Backend | From Vercel Env Vars | Vercel Dashboard |
| Frontend (React) | Frontend | From .env.local (VITE_*) | Already configured locally |
| SSLCommerz | External | Store ID + Password | Sent by backend to SSLCommerz |

---

## NEXT STEPS

1. ✅ Code deployed → Complete
2. ⏳ Configure Supabase secrets → **DO THIS FIRST**
3. ⏳ Configure Vercel env vars → **DO THIS SECOND**
4. 🧪 Test local payment flow
5. 🧪 Test production payment flow
6. ✅ Monitor success/failure rates

**Estimated Time to Complete All Config:** 10-15 minutes

