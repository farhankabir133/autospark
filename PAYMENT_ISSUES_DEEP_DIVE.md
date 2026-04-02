# 🔴 CRITICAL PAYMENT ISSUES - DEEP DIVE ANALYSIS

## Issues Found

### 🔥 CRITICAL ISSUE #1: Supabase Edge Function Environment Variables Not Set in Production

**Problem:**
- The Supabase edge function reads from `Deno.env.get('SSLCOMMERZ_STORE_ID')` and `Deno.env.get('SSLCOMMERZ_STORE_PASSWORD')`
- These variables are ONLY set in `supabase/.env.local` (for local development)
- When deployed to Supabase in production, these env vars are NOT available
- Result: The function fails with "Missing SSLCommerz credentials" error

**Current Supabase `.env.local`:**
```
SSLCOMMERZ_STORE_ID=autos69cccc023b067
SSLCOMMERZ_STORE_PASSWORD=autos69cccc023b067@ssl
SITE_URL=http://localhost:5173
SUPABASE_URL=http://localhost:54321
```

**Issue:** These are LOCAL ONLY. They need to be set in Supabase dashboard.

---

### 🔥 CRITICAL ISSUE #2: Supabase Edge Function SITE_URL Points to Local Development

**Problem:**
- `SITE_URL=http://localhost:5173` in `supabase/.env.local`
- This is hardcoded for local development
- In production, SSLCommerz will redirect to `http://localhost:5173/payment/success` (invalid)
- The actual production URL should be: `https://autosparkbd.com` (based on your Registered URL)

**Impact:**
- Payment gateway returns success, but redirects to wrong URL
- User sees "page not found" instead of success confirmation

---

### ⚠️ ISSUE #3: Vercel API Has Fallback Env Variables with Hardcoded Values

**Problem in `/api/payment/init.ts`:**
```typescript
const STORE_ID = process.env.SSLCOMMERZ_STORE_ID || 'autos69cccc023b067';
const STORE_PASSWORD = process.env.SSLCOMMERZ_STORE_PASSWORD || 'autos69cccc023b067@ssl';
const SITE_URL = process.env.SITE_URL || 'https://autosparkbd.com';
```

- The code has hardcoded fallbacks
- These fallbacks WORK but they're hardcoded (not ideal)
- The `SITE_URL` fallback is correct (`https://autosparkbd.com`) ✅

**Better approach:** Remove fallbacks, require env vars in production

---

### ⚠️ ISSUE #4: Vercel Environment Variables Not Set

**Problem:**
- From your email, Vercel has these env vars:
  - `STORE_ID` (set, but NAME is wrong)
  - `STORE_PASS` (set, but NAME is wrong)
  - `IS_LIVE` = false
  - `NODE_ENV` = production

**Issue:**
- Your Vercel env var names are:
  - `STORE_ID` and `STORE_PASS`
- But your code expects:
  - `SSLCOMMERZ_STORE_ID` and `SSLCOMMERZ_STORE_PASSWORD`
- The names don't match! ❌

---

### ⚠️ ISSUE #5: SITE_URL Not Set in Vercel

**Problem:**
- `SITE_URL` environment variable is not configured in Vercel
- The fallback `https://autosparkbd.com` will be used
- But it might be better to have it explicitly configured

---

### ⚠️ ISSUE #6: FormData vs URLSearchParams Inconsistency

**Problem:**
- Supabase function uses `FormData()` 
- Vercel API uses `URLSearchParams()`
- FormData might not work correctly with fetch in Deno environment
- URLSearchParams is more reliable for `application/x-www-form-urlencoded`

---

### ⚠️ ISSUE #7: Missing SITE_URL in Supabase Production Config

**Problem:**
- The Supabase function needs SITE_URL for redirects
- It's not set in Supabase dashboard secrets
- Falls back to hardcoded development value

---

## Summary Table

| Issue | Severity | Location | Impact | Fix |
|-------|----------|----------|--------|-----|
| Missing Supabase env vars | 🔥 CRITICAL | Supabase Dashboard | Payment fails | Set SSLCOMMERZ_STORE_ID, SSLCOMMERZ_STORE_PASSWORD, SITE_URL |
| Wrong SITE_URL in Supabase | 🔥 CRITICAL | `supabase/.env.local` | Redirects to localhost | Update to production URL |
| Vercel env var names wrong | 🔴 HIGH | Vercel Dashboard | Payment fails silently | Rename STORE_ID → SSLCOMMERZ_STORE_ID, STORE_PASS → SSLCOMMERZ_STORE_PASSWORD |
| Missing SITE_URL in Vercel | ⚠️ MEDIUM | Vercel Dashboard | Uses fallback | Add SITE_URL env var |
| FormData in Deno | ⚠️ MEDIUM | `supabase/functions/` | May not work correctly | Use URLSearchParams instead |

---

## Fixes Required

### FIX 1: Update Supabase Environment Variables (Production Dashboard)

In Supabase Dashboard → Project Settings → Edge Functions Secrets:

```
SSLCOMMERZ_STORE_ID = autos69cccc023b067
SSLCOMMERZ_STORE_PASSWORD = autos69cccc023b067@ssl
SITE_URL = https://autosparkbd.com
```

### FIX 2: Update Vercel Environment Variables

In Vercel Dashboard → Autospark Project → Settings → Environment Variables:

**Rename/Update existing:**
- `STORE_ID` → `SSLCOMMERZ_STORE_ID` = `autos69cccc023b067`
- `STORE_PASS` → `SSLCOMMERZ_STORE_PASSWORD` = `autos69cccc023b067@ssl`

**Add new:**
- `SITE_URL` = `https://autosparkbd.com`

### FIX 3: Update Supabase Edge Function Code

Change FormData to URLSearchParams for reliability:

```typescript
// OLD (FormData)
const formData = new FormData();
formData.append('store_id', SSLCOMMERZ_STORE_ID);
// ... more appends

const response = await fetch(sslCommerzUrl, {
  method: 'POST',
  body: formData,  // ❌ May not work in Deno
});

// NEW (URLSearchParams)
const params = new URLSearchParams();
params.append('store_id', SSLCOMMERZ_STORE_ID);
// ... more appends

const response = await fetch(sslCommerzUrl, {
  method: 'POST',
  body: params,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});
```

### FIX 4: Update Local Supabase Environment

In `supabase/.env.local`:
```bash
SSLCOMMERZ_STORE_ID=autos69cccc023b067
SSLCOMMERZ_STORE_PASSWORD=autos69cccc023b067@ssl
SITE_URL=https://autosparkbd.com  # Production URL for testing
SUPABASE_URL=http://localhost:54321
```

### FIX 5: Remove Hardcoded Fallbacks (Optional but Better)

In `api/payment/init.ts`:
```typescript
// BEFORE:
const STORE_ID = process.env.SSLCOMMERZ_STORE_ID || 'autos69cccc023b067';
const STORE_PASSWORD = process.env.SSLCOMMERZ_STORE_PASSWORD || 'autos69cccc023b067@ssl';

// AFTER (more secure):
const STORE_ID = process.env.SSLCOMMERZ_STORE_ID;
const STORE_PASSWORD = process.env.SSLCOMMERZ_STORE_PASSWORD;

if (!STORE_ID || !STORE_PASSWORD) {
  return response.status(500).json({
    error: 'SSLCommerz credentials not configured',
  });
}
```

---

## Action Plan

1. ✅ Update code (FormData → URLSearchParams)
2. ✅ Update Vercel environment variables
3. ⏳ Update Supabase environment variables (manual in dashboard)
4. ✅ Update local .env files
5. ✅ Build and deploy
6. 🧪 Test payment flow

