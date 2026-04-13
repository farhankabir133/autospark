# 🚀 Appwrite Integration - Next Steps Checklist

## Your Appwrite Credentials Are Ready! ✅

**Status:**
- ✅ Appwrite account created
- ✅ Project created (Auto Spark)
- ✅ API Key generated
- ✅ Credentials added to `.env`

---

## DO THIS NOW (Take 15 minutes)

### Step 1: Install Appwrite SDK

```bash
npm install appwrite
```

**Expected output:** "added 1 package"

---

### Step 2: Create Payment Service File

Create: `src/services/appwriteService.ts`

See **APPWRITE_CONFIG_COMPLETE.md** for the complete code to copy.

---

### Step 3: Start Dev Server

```bash
npm run dev
```

Should start at `http://localhost:5173`

---

## THEN DO THESE (In Order)

### ✋ Step 4: Update PaymentPage.tsx

Follow **APPWRITE_SETUP_GUIDE.md** → "Phase 5: Update PaymentPage.tsx"

Key points:
- Import service: `import { savePaymentRequest } from '../services/appwriteService';`
- Modify form submission to use `savePaymentRequest()`
- Send document ID to payment API

---

### ✋ Step 5: Create Callback Pages

Follow **APPWRITE_SETUP_GUIDE.md** → "Phase 7: Create Callback Pages"

Create these 3 files:
- `src/pages/PaymentSuccessPage.tsx`
- `src/pages/PaymentFailPage.tsx`
- `src/pages/PaymentCancelPage.tsx`

---

### ✋ Step 6: Add Routes

Update `src/App.tsx` to include new routes:

```typescript
<Route path="/payment-success" element={<PaymentSuccessPage />} />
<Route path="/payment-fail" element={<PaymentFailPage />} />
<Route path="/payment-cancel" element={<PaymentCancelPage />} />
```

---

### ✋ Step 7: Test Locally

1. Open `http://localhost:5173` in browser
2. Go to Accessories page
3. Add items to cart
4. Click "Proceed to Checkout"
5. Fill payment form with test data:
   - Name: Test User
   - Mobile: 01911223344
   - Address: Test Address
   - District: Dhaka
   - Thana: Mirpur
6. Click Submit

**Check:**
- Does form submit?
- Do you see console messages?
- Does it redirect somewhere?

---

## THEN BEFORE GOING LIVE

### ✋ Step 8: Check Appwrite Database

1. Go to https://cloud.appwrite.io
2. Open your project
3. Go to Databases → autospark_db → payments
4. You should see documents with status "pending"

If you don't see documents:
- Check browser console for errors
- Check .env has correct credentials
- Check Appwrite API key has correct scopes

---

### ✋ Step 9: Create Database Schema (If Not Done)

If you haven't created the "payments" collection yet:

**In Appwrite Console:**
1. Databases → autospark_db
2. Click "Create Collection"
3. Name: `payments`
4. Add these attributes:
   - `customer_name` (String, 255)
   - `mobile` (String, 20)
   - `email` (String, 255)
   - `address` (String, 500)
   - `thana` (String, 100)
   - `district` (String, 100)
   - `total_amount` (Float)
   - `cart_items` (String, 5000)
   - `session_id` (String, 255)
   - `transaction_id` (String, 255)
   - `status` (String, 50)
   - `created_at` (DateTime)
   - `updated_at` (DateTime)

See **APPWRITE_SETUP_GUIDE.md** → "Phase 2: Create Database in Appwrite" for detailed steps

---

### ✋ Step 10: Update API Endpoint

Create or update your payment API endpoint to call SSLCommerz.

See **APPWRITE_SETUP_GUIDE.md** → "Phase 6: Update Payment API Endpoint"

---

### ✋ Step 11: Deploy to Production

When ready:

```bash
npm run build
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

Set environment variables on Netlify with your Appwrite credentials.

---

## Reference Documents

📄 **APPWRITE_SETUP_GUIDE.md** - Complete step-by-step guide (10 phases)
📄 **APPWRITE_CONFIG_COMPLETE.md** - What's done and what's next
📄 **APPWRITE_API_KEY_SCOPES.md** - What scopes to select

---

## Troubleshooting

### "Appwrite connection error"
- Check `.env` has correct endpoint
- Restart dev server: `npm run dev`
- Check internet connection

### "Collection not found"
- Verify `autospark_db` database exists in Appwrite
- Verify `payments` collection exists
- Check `.env` has correct database and collection IDs

### "Document save failed"
- Check browser console for error message
- Verify API key has correct scopes (database.read, database.write, database.update, collections.read)
- Check all form fields are filled

### "No redirect to SSLCommerz"
- Check payment API endpoint is correct
- Check SSLCommerz credentials in `.env`
- Check browser console for errors

---

## Quick Summary

**What you have:**
✅ Appwrite credentials
✅ Payment service template
✅ Complete documentation

**What you need to do:**
⏳ Install Appwrite SDK: `npm install appwrite`
⏳ Create appwriteService.ts
⏳ Update PaymentPage.tsx
⏳ Create callback pages
⏳ Add routes
⏳ Test locally
⏳ Deploy

**Estimated time:** 2-3 hours

---

## Get Help

**All instructions are in:**
- APPWRITE_SETUP_GUIDE.md (main reference)
- APPWRITE_CONFIG_COMPLETE.md (what's done, what's next)
- APPWRITE_API_KEY_SCOPES.md (about API key permissions)

**Start with:** `npm install appwrite` 🚀
