# Supabase Integration Setup Guide

## ✅ Completed Setup

Your Supabase account has been created and your AutoSpark app is now connected to the database.

### Your Supabase Project Details

| Item | Value |
|------|-------|
| **Project URL** | https://hcdwfxnvmvvkbpeshbqk.supabase.co |
| **Anon Key** | sb_publishable_o4V4NsBTa1omeSCyl8GuuA_UppA17sl |
| **Region** | Asia-Pacific |
| **Plan** | Free |

---

## 📁 Files Updated

### Main App (`/`)
- ✅ **`.env.local`** (created)
  - Added `VITE_SUPABASE_URL`
  - Added `VITE_SUPABASE_ANON_KEY`

### Payment Example (`/next-sslcommerz`)
- ✅ **`.env.local`** (updated)
  - Added `SUPABASE_URL`
  - Added `SUPABASE_ANON_KEY`
  - Kept existing SSLCommerz credentials

- ✅ **`.env.local.example`** (updated)
  - Added Supabase section with placeholders
  - Now documents all required environment variables

- ✅ **`lib/supabase.ts`** (already created)
  - Exports `getSupabase()` helper function
  - Reads `SUPABASE_URL` and `SUPABASE_ANON_KEY` from environment

- ✅ **`pages/api/payment/success.ts`** (activated)
  - Uncommented Supabase integration code
  - Now updates order status to `'paid'` in database after validation
  - Includes error handling (logs error but proceeds to redirect)

- ✅ **`pages/api/payment/fail.ts`** (activated)
  - Now updates order status to `'failed'` in database
  - Records failure reason and timestamp

- ✅ **`pages/api/payment/cancel.ts`** (activated)
  - Now updates order status to `'cancelled'` in database
  - Records cancellation timestamp

---

## 🗄️ Database Setup Instructions

### 1. Create Orders Table in Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: **hcdwfxnvmvvkbpeshbqk**
3. Go to **SQL Editor** → Click **+ New Query**
4. Paste this SQL to create your orders table:

```sql
CREATE TABLE public.orders (
  id BIGSERIAL PRIMARY KEY,
  tran_id TEXT NOT NULL UNIQUE,
  val_id TEXT,
  status TEXT DEFAULT 'pending' (pending | paid | failed | cancelled),
  total_amount DECIMAL(10, 2) NOT NULL,
  cus_name TEXT,
  cus_email TEXT,
  cus_phone TEXT,
  product_name TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  validated_at TIMESTAMP,
  failed_at TIMESTAMP,
  failed_reason TEXT,
  cancelled_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index on tran_id for faster lookups
CREATE INDEX idx_orders_tran_id ON public.orders(tran_id);
CREATE INDEX idx_orders_status ON public.orders(status);
```

5. Click **Run** to execute the SQL

### 2. Enable Row Level Security (Optional but Recommended)

1. In Supabase Dashboard, go to **Authentication** → **Policies**
2. Click on **orders** table
3. Enable **Row Level Security** for additional security

### 3. Test the Integration

The payment routes will now automatically:
- ✅ Create/update orders in Supabase on successful payment
- ✅ Mark orders as failed if payment is declined
- ✅ Mark orders as cancelled if user cancels

---

## 🧪 Testing the Full Payment Flow

### Using the Payment Example (`localhost:3001`)

```bash
# 1. Navigate to payment example
cd /Users/farhankabir/Documents/a-s/autospark/next-sslcommerz

# 2. Start the dev server
npm run dev

# 3. Open browser
open http://localhost:3001

# 4. Fill in the form and click "Pay with SSLCommerz"
# You'll be redirected to SSLCommerz sandbox

# 5. Complete payment in sandbox (test credentials provided)

# 6. SSLCommerz will POST to /api/payment/success
# Server will:
#   - Validate the transaction with SSLCommerz
#   - Update order status in Supabase to 'paid'
#   - Redirect to /dashboard/payment-success
```

### Verify in Supabase Dashboard

1. Go to **Supabase Dashboard** → Your Project
2. Navigate to **Table Editor** → **orders**
3. You should see your new order with:
   - `status: 'paid'`
   - `val_id: [SSLCommerz validation ID]`
   - `validated_at: [timestamp]`
   - All customer information

---

## 🔐 Security Notes

### Public vs Secret Keys

| Key | Type | Safe in Frontend? | Safe in Backend? |
|-----|------|-------------------|------------------|
| **VITE_SUPABASE_URL** | Public | ✅ Yes | ✅ Yes |
| **VITE_SUPABASE_ANON_KEY** | Public | ✅ Yes | ✅ Yes |
| **Service Role Key** | Secret | ❌ No | ✅ Yes only |

### Environment Variable Naming

- **Vite (React)**: Use `VITE_` prefix for client-side variables
  - Example: `VITE_SUPABASE_URL`
  
- **Next.js**: Use `NEXT_PUBLIC_` for client-side variables
  - Example: `NEXT_PUBLIC_SUPABASE_URL`
  
- **Server-only**: No prefix needed (stays in `.env.local`)
  - Example: `SUPABASE_ANON_KEY` in Next.js API routes

---

## 📝 Next Steps

### For Production Deployment

1. **Add Supabase credentials to your hosting provider:**
   - Vercel: Go to Project Settings → Environment Variables
   - GitHub Pages: Not applicable (Supabase is backend-only)
   - Other: Follow your provider's env vars documentation

2. **Update success/fail/cancel redirect URLs:**
   - In payment routes, change redirect paths to match your production URLs
   - Example: `/dashboard/payment-success` → `/payment-success`

3. **Enable Row Level Security (RLS) for production:**
   - Restrict who can read/write order data
   - Only allow users to see their own orders

4. **Enable API authentication:**
   - Require JWT tokens for API access
   - Configure CORS policies

### Optional Enhancements

- Add email notifications when payment status changes
- Create a dashboard to view order history
- Implement order cancellation/refund workflows
- Add payment status webhooks

---

## 📚 Useful Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

## ⚠️ Troubleshooting

### Orders Table Not Updating

1. Check `.env.local` has correct credentials
2. Verify table name is `orders` (case-sensitive)
3. Check Supabase Dashboard → SQL Editor for any errors
4. Review console logs in Next.js dev server for database errors

### Payment Validation Failing

1. Ensure SSLCommerz sandbox mode is active (`IS_LIVE=false`)
2. Check that `val_id` is being received from SSLCommerz callback
3. Review console logs for validation response details

### Environment Variables Not Loading

1. Restart Next.js dev server after updating `.env.local`
2. For Vite: Restart `npm run dev` in main app
3. Make sure `.env.local` is in root directory, not in `src/` or `public/`

---

**Your Supabase integration is now complete and ready to use!** 🎉
