# 🚀 PRODUCTION DEPLOYMENT CHECKLIST

**Goal**: Take your payment system from sandbox testing to live production with real payments.

**Timeline**: ~30 minutes to go live  
**Cost**: Still FREE (Vercel + Supabase free tier)

---

## 📋 Pre-Deployment Checklist (Do These First)

### ✅ Code Verification
- [ ] All payment tests passed locally
- [ ] Orders appearing in Supabase correctly
- [ ] No console errors in browser
- [ ] Proxy server working (npm run proxy)
- [ ] Frontend dev server working (npm run dev)
- [ ] Latest code committed to GitHub

### ✅ Environment Variables Verified
- [ ] Check `.env.local` has `VITE_PAYMENT_API_URL=https://autospark-one.vercel.app`
- [ ] Check Vercel env vars are set:
  ```
  STORE_ID=autos69cccc023b067
  STORE_PASS=autos69cccc023b067@ssl
  IS_LIVE=false (KEEP AS FALSE FOR NOW)
  SUPABASE_URL=https://hcdwfxnvmvvkbpeshbqk.supabase.co
  SUPABASE_ANON_KEY=sb_publishable_o4V4NsBTa1omeSCyl8GuuA_UppA17sl
  NODE_ENV=production
  ```

### ✅ Database Verified
- [ ] Supabase orders table exists
- [ ] RLS policies enabled
- [ ] Test orders visible in Supabase
- [ ] No data issues

### ✅ Payment Gateway Verified
- [ ] SSLCommerz sandbox account working
- [ ] Store ID: `autos69cccc023b067` ✅
- [ ] Store Password: `autos69cccc023b067@ssl` ✅
- [ ] Sandbox testing completed

---

## 🎯 Step 1: Get Live SSLCommerz Credentials (15 min)

**You need to contact SSLCommerz to activate live mode:**

1. **Email SSLCommerz Support**:
   ```
   Email: support@sslcommerz.com
   Subject: Activate Live Payment Mode
   Message:
   
   Dear SSLCommerz,
   
   I would like to activate live payment mode for my sandbox account.
   
   Store Name: testautosvs42
   Store ID: autos69cccc023b067
   Merchant ID: autos69cccbff392af
   Business: Auto Spark (Vehicle Sales & Services)
   Website: https://autosparkbd.com
   
   Please provide:
   - Live Store ID
   - Live Store Password (API Key)
   
   Thank you,
   Farhan Kabir
   ```

2. **Wait for response** (usually 24-48 hours)

3. **You'll receive**:
   - Live Store ID (e.g., `autos69cccc023b067`)
   - Live Store Password/API Key
   - Live gateway URLs

---

## 🔐 Step 2: Update Vercel Environment Variables (5 min)

**Once you have live credentials from SSLCommerz:**

1. Go to: https://vercel.com/dashboard
2. Click your project: `autospark-one`
3. Go to **Settings** → **Environment Variables**
4. **Update these variables**:

```
STORE_ID = [Your LIVE Store ID from SSLCommerz]
STORE_PASS = [Your LIVE Store Password from SSLCommerz]
IS_LIVE = true
```

5. **Redeploy** by clicking "Redeploy" in Deployments section

---

## 💳 Step 3: Test with Real Card (5 min)

**Test live credentials before going public:**

1. Visit your site: https://autosparkbd.com/#/payment
2. Fill in test payment:
   - Name: Test User
   - Email: your-email@example.com
   - Phone: Your phone
   - Product: Test Service
   - Amount: 100 BDT (small amount for testing)

3. Click "Pay Now"

4. On SSLCommerz live gateway, use a **real test card**:
   - Check SSLCommerz docs for test cards: https://sslcommerz.com/developer/
   - Or use your own card (you can check the transaction and cancel)

5. Complete the payment

6. **Verify in Supabase**:
   - Check orders table
   - Order status should change from "pending" to "paid" ✅

---

## 🌐 Step 4: Frontend Deployment to GitHub Pages (10 min)

**Deploy your updated frontend to production:**

```bash
# 1. Commit latest changes
git add -A
git commit -m "deploy: production payment system with live SSLCommerz"

# 2. Push to GitHub (triggers GitHub Pages auto-deploy)
git push origin main

# 3. Wait 1-2 minutes for GitHub Pages to rebuild
# Then visit: https://autosparkbd.com

# 4. Verify live payment form
# Visit: https://autosparkbd.com/#/payment
```

---

## ✅ Step 5: Final Verification (5 min)

### Test Production Payment Flow

- [ ] Visit: https://autosparkbd.com/#/payment
- [ ] Form loads without errors
- [ ] Submit test payment with real card
- [ ] Redirected to SSLCommerz live gateway
- [ ] Complete payment successfully
- [ ] Check Supabase - order status: "paid"
- [ ] No console errors

### Check All Endpoints

```bash
# Test payment API is working
curl https://autospark-one.vercel.app/api/payment/initiate \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"total_amount": 100, "cus_name": "Test", "cus_email": "test@test.com", "cus_phone": "01234567890", "product_name": "Test"}'

# Should return: {"url":"https://www.sslcommerz.com/...","tran_id":"txn_..."}
```

---

## 🔒 Security Checklist

Before going live, verify:

- [ ] STORE_ID and STORE_PASS are ONLY in Vercel env vars (not in code)
- [ ] `.env.local` not committed to GitHub
- [ ] HTTPS enforced on all endpoints
- [ ] Supabase RLS policies enabled
- [ ] No sensitive data logged to console
- [ ] API validates all input server-side
- [ ] Database credentials not exposed

---

## 📊 Monitoring Setup

### Check Orders Daily

1. **Supabase Dashboard**:
   ```
   https://supabase.com/dashboard → Orders Table
   ```
   - Monitor order status updates
   - Check for failed payments
   - Track daily revenue

2. **Vercel Logs**:
   ```
   https://vercel.com/dashboard → Project → Logs
   ```
   - Monitor API errors
   - Check response times
   - Track payment requests

### Alert Setup (Optional)

Set up alerts for:
- Payment failures
- API errors
- High payment volume
- Unusual patterns

---

## 🚨 Troubleshooting Production Issues

### Issue: Payment redirects to sandbox instead of live
**Solution**: Check IS_LIVE=true in Vercel env vars

### Issue: Orders not updating to "paid"
**Solution**: 
- Check SSLCommerz callback URLs are correct
- Verify Supabase credentials in Vercel
- Check Vercel logs for errors

### Issue: Card declined
**Solution**:
- Use valid test card from SSLCommerz docs
- Check amount is in correct format
- Verify merchant account is active

### Issue: Redirect loop
**Solution**:
- Clear browser cache
- Check callback URLs match exactly
- Verify domain is whitelisted in SSLCommerz

---

## 📞 Support Contacts

| Issue | Contact |
|-------|---------|
| SSLCommerz Issues | support@sslcommerz.com |
| Supabase Issues | support@supabase.io |
| Vercel Issues | support@vercel.com |
| Payment Failures | Check SSLCommerz merchant dashboard |

---

## ✨ You're Almost Live!

```
Progress: ████████████████████ (20/20 tasks)

✅ Payment API built & deployed
✅ Frontend form created
✅ Database configured
✅ SSLCommerz integrated
✅ Testing completed
✅ Sandbox testing passed
⏳ Get live SSLCommerz credentials (contact them)
⏳ Update environment variables
⏳ Deploy to production
⏳ Monitor orders
```

---

## 🎉 Once You're Live

You'll have:
- ✅ Accept REAL payments from customers
- ✅ Orders tracked in real-time
- ✅ Automatic payment validation
- ✅ Zero cost (Vercel + Supabase free tier)
- ✅ Global availability
- ✅ Instant notifications (with email setup)

---

## 📋 Quick Reference: Live vs Sandbox

| Aspect | Sandbox | Live |
|--------|---------|------|
| **Store ID** | autos69cccc023b067 | [From SSLCommerz] |
| **Store Password** | autos69cccc023b067@ssl | [From SSLCommerz] |
| **IS_LIVE** | false | true |
| **Gateway** | sandbox.sslcommerz.com | www.sslcommerz.com |
| **Test Cards** | 4111 1111 1111 1111 | Real cards only |
| **Real Money** | No | Yes |
| **Customer Transactions** | Fake | Real |

---

**Next Step**: Email SSLCommerz to get live credentials, then follow this checklist! 🚀
