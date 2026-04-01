# 🚀 VERCEL DEPLOYMENT - STEP-BY-STEP (You're Almost Done!)

## 📍 You're on Vercel.com - Here's What To Do Next

### STEP 1: Create Your Account (1 minute)

**If you don't have a Vercel account yet:**
1. Click **"Sign Up"** button (top right)
2. Choose **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub
4. Click **"Authorize vercel"**
5. Confirm your email (check inbox)
6. ✅ Done! You're logged in.

**If you already have account:**
→ Skip to STEP 2

---

## 🎯 STEP 2: Create New Project (1 minute)

**Once logged in to Vercel dashboard:**

1. Click **"New Project"** button (top of page)
2. You'll see: **"Select a Git Repository"**
3. In the search box, type: **`autospark`**
4. Click on **`farhankabir133/autospark`** when it appears
5. Click **"Import"** button

✅ Your repo is imported!

---

## ⚙️ STEP 3: Configure Project Settings (2 minutes)

**You'll see "Configure Project" page:**

### 3.1: Set Root Directory
- Look for **"Root Directory"** dropdown
- Click it and select **`next-sslcommerz`** ← **VERY IMPORTANT!**
- This tells Vercel which folder to deploy

### 3.2: Framework Settings
- Framework: Should auto-detect as **"Next.js"** ✓
- Build Command: `npm run build` ✓
- Output Directory: `.next` ✓
- Install Command: `npm install` ✓

**All these should be automatic, don't change them!**

### 3.3: Click "Continue"
Click the blue **"Continue"** button

✅ Now you're at Environment Variables page

---

## 🔑 STEP 4: Add Environment Variables (2 minutes)

**You'll see "Environment Variables" section:**

**Add these 6 variables exactly as shown:**

### Variable 1:
- Name: `STORE_ID`
- Value: `autos69cccc023b067`
- Click **"Add"**

### Variable 2:
- Name: `STORE_PASS`
- Value: `autos69cccc023b067@ssl`
- Click **"Add"**

### Variable 3:
- Name: `IS_LIVE`
- Value: `false`
- Click **"Add"**

### Variable 4:
- Name: `SUPABASE_URL`
- Value: `https://hcdwfxnvmvvkbpeshbqk.supabase.co`
- Click **"Add"**

### Variable 5:
- Name: `SUPABASE_ANON_KEY`
- Value: `sb_publishable_o4V4NsBTa1omeSCyl8GuuA_UppA17sl`
- Click **"Add"**

### Variable 6:
- Name: `NODE_ENV`
- Value: `production`
- Click **"Add"**

✅ All 6 variables added!

---

## 🎬 STEP 5: Deploy! (1-2 minutes)

**Now you'll see the deploy confirmation:**

1. Review all settings:
   - ✓ Root Directory: `next-sslcommerz`
   - ✓ 6 Environment variables: All added
   - ✓ Framework: Next.js

2. Click the blue **"Deploy"** button

**Wait... The deployment is happening!**

You'll see:
```
✓ Building...
✓ Analyzing...
✓ Installing dependencies...
✓ Building project...
✓ Optimizing...
✓ Creating deployment...

🎉 Congratulations! Your project has been successfully deployed!
```

---

## 🎊 STEP 6: Get Your Deployment URL (1 minute)

**After deployment completes:**

You'll see a big **"Visit"** button or your URL displayed:

```
https://autospark-payment.vercel.app
```

**Copy this URL** - you'll need it for the next steps!

Or if Vercel gave you a different URL like:
```
https://autospark-payment-abc123.vercel.app
```

**That's fine too!** It's your unique URL.

---

## ✅ Congratulations! You're DONE with Deployment! 🎉

Your payment API is now **LIVE on the internet!**

---

## 📋 What Happens Next?

### After you have your Vercel URL:

1. **Update Your .env.local File**
   ```bash
   PAYMENT_API_URL=https://autospark-payment.vercel.app
   ```
   (Replace with your actual Vercel URL if different)

2. **Update SSLCommerz Callbacks**
   In SSLCommerz merchant dashboard, update:
   - Success: `https://autospark-payment.vercel.app/api/payment/success`
   - Fail: `https://autospark-payment.vercel.app/api/payment/fail`
   - Cancel: `https://autospark-payment.vercel.app/api/payment/cancel`

3. **Test Locally**
   ```bash
   npm run proxy
   npm run dev
   ```
   Visit: `http://localhost:5173/payment`

4. **Test Payment Flow**
   Fill out the form and test

5. **Verify in Supabase**
   Check if orders appear in your Supabase dashboard

---

## 🚨 If Something Goes Wrong

### If you see an error during deployment:

1. **Check the logs** - Vercel shows them in red
2. **Common issues:**
   - ❌ "Cannot find next.js" → Root directory not set to `next-sslcommerz`
   - ❌ "Build failed" → Environment variables missing
   - ❌ "Module not found" → Dependencies not installed

3. **Solution:** Go back and check:
   - Root Directory is `next-sslcommerz`
   - All 6 environment variables are added correctly
   - Names and values are exact (no typos!)

4. **Redeploy:** Click the **"Redeploy"** button after fixing

---

## 🎯 Summary of What You Just Did

✅ Created Vercel account (or used existing)  
✅ Imported your GitHub repository  
✅ Set root directory to `next-sslcommerz`  
✅ Added 6 environment variables  
✅ Deployed your payment API  
✅ Got your live deployment URL  

**Your payment API is now LIVE and accessible worldwide!** 🌍

---

## 📞 Next Action

**After deployment is complete:**

1. Copy your Vercel URL from the deployment page
2. Share it with me (optional, but helpful for next steps)
3. Follow the remaining guides for:
   - Updating SSLCommerz
   - Testing the payment flow
   - Verifying orders in Supabase

---

## ⚡ Quick Reference

| Step | What To Do | Time |
|------|-----------|------|
| 1 | Sign up on Vercel | 1 min |
| 2 | Create new project | 1 min |
| 3 | Set root to `next-sslcommerz` | 1 min |
| 4 | Add 6 env variables | 2 min |
| 5 | Click Deploy | Auto |
| 6 | Get URL | 1 min |
| **Total** | | **5-7 min** |

---

## 🎉 You're Almost There!

Deployment is the hardest part, and you're doing it right now!

Once the green checkmark appears, your payment API is **LIVE!** 🚀

---

**Status: DEPLOYMENT IN PROGRESS** ✅  
**Next: Copy URL → Update SSLCommerz → Test**

Good luck! You've got this! 💪

