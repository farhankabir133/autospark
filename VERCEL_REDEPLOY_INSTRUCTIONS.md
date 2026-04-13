# How to Redeploy on Vercel

Since we updated the `vercel.json` configuration, we need to trigger a clean rebuild.

## Option 1: Via Vercel Dashboard (Easiest)

1. Go to https://vercel.com/dashboard
2. Click your "autospark" project
3. Go to **Deployments** tab
4. Find the latest deployment
5. Click the **3-dot menu** (•••)
6. Click **Redeploy**
7. Confirm when prompted
8. Wait for the green checkmark ✅

**Expected time:** 1-2 minutes

## Option 2: Via CLI

If you have Vercel CLI installed:

```bash
vercel --prod
```

This will:
- Clean rebuild with new configuration
- Deploy to production
- Show real-time logs

## Option 3: Force GitHub Redeploy

Make an empty commit and push:

```bash
git commit --allow-empty -m "chore: trigger vercel rebuild"
git push origin main
```

This forces Vercel to detect a new commit and rebuild.

---

## What We Fixed

Updated `vercel.json` to:
1. ✅ Explicitly configure Vite build
2. ✅ Tell Vercel where output is (`dist/`)
3. ✅ **NEW:** Configure API functions
4. ✅ **NEW:** Add rewrite rules for `/api/*` routes

## After Redeploy

Once the deployment shows green checkmark, test with:

```bash
curl -X POST https://autospark-one.vercel.app/api/payment/init \
  -H "Content-Type: application/json" \
  -d '{
    "cart": [{"id": "test", "name": "Test", "price": 1000}],
    "total_amount": 1000,
    "customer_name": "Test",
    "mobile": "01700000000",
    "address": "Test",
    "thana": "Dhaka",
    "district": "Dhaka"
  }'
```

Should return JSON with `GatewayPageURL`, not a 404 error.

---

**Priority:** Do the redeploy ASAP - this is critical for the payment gateway to work!
