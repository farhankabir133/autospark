# 🧪 Payment API Testing Guide

## Quick Test Commands

### Test 1: Test Proxy Server

```bash
# Start proxy server
npm run proxy

# Expected output:
# Proxy running on port 8787
```

### Test 2: Test Payment Initiation

```bash
# In a new terminal, test the payment endpoint
curl -X POST "http://localhost:8787/api/payment/initiate" \
  -H "Content-Type: application/json" \
  -d '{
    "total_amount": 500,
    "cus_name": "Test User",
    "cus_email": "test@example.com",
    "cus_phone": "01700000000",
    "product_name": "Test Order"
  }'

# Expected response:
# {
#   "status": "success",
#   "url": "https://sandbox.sslcommerz.com/EasyCheckOut/...",
#   "tran_id": "txn_1234567890"
# }
```

### Test 3: Check Supabase

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Table Editor** → `orders`
4. Look for the order you just created
5. Verify fields:
   - `tran_id`: matches response from Test 2
   - `status`: `pending`
   - `cus_name`: `Test User`
   - `cus_email`: `test@example.com`
   - `cus_phone`: `01700000000`
   - `total_amount`: `500`

### Test 4: Browser Test (Development)

```bash
# Terminal 1: Start proxy
npm run proxy

# Terminal 2: Start dev server
npm run dev
```

Then in browser:
1. Navigate to `http://localhost:5173/payment`
2. Fill form:
   ```
   Name: Test User
   Email: test@example.com
   Phone: 01700000000
   Product: Test Item
   Amount: 100
   ```
3. Click "💳 Pay Now"
4. Should redirect to SSLCommerz (you'll see browser console logs)
5. Check Supabase - new order should appear

### Test 5: View Proxy Logs

```bash
# While proxy is running, you should see logs like:
[proxy] POST /api/payment/initiate -> https://autospark-payment-xxx.ondigitalocean.app/api/payment/initiate
[proxy] payment/initiate response status: 200
```

### Test 6: View DigitalOcean App Logs

1. Go to DigitalOcean Console
2. Click your `autospark-payment` app
3. Click **"Logs"** tab
4. Should show:
   ```
   POST /api/payment/initiate 200 123ms
   [payment] Order created in Supabase: txn_1234567890
   ```

---

## Expected Behavior Flow

```
User fills payment form
        ↓
Form submitted to /api/payment/initiate
        ↓
Proxy receives request
        ↓
Proxy logs: [proxy] POST /api/payment/initiate
        ↓
Proxy forwards to DigitalOcean App
        ↓
DigitalOcean App creates order in Supabase
        ↓
DigitalOcean App returns SSLCommerz gateway URL
        ↓
Proxy returns response to browser
        ↓
Browser redirects to SSLCommerz
        ↓
User completes payment in SSLCommerz
        ↓
SSLCommerz POST callback to /api/payment/success
        ↓
DigitalOcean App validates with SSLCommerz
        ↓
DigitalOcean App updates order status to "paid"
        ↓
User redirected back to payment page
        ↓
Order status in Supabase = "paid" ✅
```

---

## Debugging Tips

### Check if Proxy is Forwarding

```bash
# Add this to see exactly what's being sent:
curl -X POST "http://localhost:8787/api/payment/initiate" \
  -H "Content-Type: application/json" \
  -v \
  -d '{...}'

# Look for:
# Connected to localhost (127.0.0.1) port 8787
# > POST /api/payment/initiate HTTP/1.1
# > Host: localhost:8787
```

### Check DigitalOcean App Health

```bash
# In browser, try to reach the app directly (if public):
curl https://autospark-payment-xxx.ondigitalocean.app/api/payment/initiate \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"total_amount": 100, "cus_name": "Test", ...}'

# Should get 400 (missing fields) or 200 (success)
# If you get 502/503, the app may not be running
```

### Check Supabase Connectivity

```bash
# From DigitalOcean app logs, look for:
# ✓ Connected to Supabase
# OR
# ✗ Failed to connect to Supabase: ...

# If connection fails, verify:
# 1. SUPABASE_URL is correct
# 2. SUPABASE_ANON_KEY is correct
# 3. Supabase project is active
# 4. Network can reach supabase.co
```

### Check SSLCommerz Connection

```bash
# From DigitalOcean app logs, look for:
# Payment gateway initialized: STORE_ID=autos69cccc023b067
# OR
# Failed to initialize SSLCommerz: ...

# If initialization fails, verify:
# 1. STORE_ID is correct
# 2. STORE_PASS is correct
# 3. IS_LIVE is set to false (sandbox) or true (production)
```

---

## Common Errors and Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `Cannot POST /api/payment/initiate` | Route not in proxy | Check `server/proxy.cjs` has payment routes |
| `ECONNREFUSED localhost:8787` | Proxy not running | Run `npm run proxy` |
| `502 Bad Gateway` | DigitalOcean app offline | Check DigitalOcean console, may need restart |
| `SUPABASE_URL not configured` | Missing env var | Check DigitalOcean app environment variables |
| `No URL returned` | SSLCommerz failed | Check SSLCommerz credentials in app env vars |
| `Order not in Supabase` | Database insert failed | Check Supabase RLS policies |
| `CORS error` | Wrong API URL | Verify `PAYMENT_API_URL` in `.env.local` matches DigitalOcean app URL |

---

## Test Checklist

- [ ] Proxy server starts without errors (`npm run proxy`)
- [ ] Curl request returns SSLCommerz URL
- [ ] Order appears in Supabase after payment initiation
- [ ] Order has correct data (name, email, phone, amount, etc.)
- [ ] Payment form page loads at `/payment`
- [ ] Form submission redirects to SSLCommerz
- [ ] Browser console shows no errors
- [ ] DigitalOcean app logs show successful requests
- [ ] Supabase shows order with `pending` status initially

---

## Next Steps

Once all tests pass:
1. ✅ Push all code to GitHub
2. ✅ Deploy frontend to GitHub Pages
3. ✅ Update SSLCommerz callback URLs to production
4. ✅ Test on production domain `https://autosparkbd.com/payment`
5. ✅ Switch SSLCommerz to LIVE mode if ready for production

