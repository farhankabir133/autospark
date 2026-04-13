# ✅ Local Development Payment Server Setup

## The Problem
The Vite dev server was trying to proxy `/api/payment` requests to `http://localhost:8787`, but no backend server was running, causing:
```
[vite] http proxy error: /api/payment/init
AggregateError [ECONNREFUSED]
```

## The Solution
Created a local Express.js server (`server/dev-server.js`) that:
- ✅ Runs on port 8787
- ✅ Handles payment API endpoints locally
- ✅ Proxies requests to SSLCommerz
- ✅ Works with Vite's proxy configuration

---

## How to Run

### Option 1: Run Both Servers Together (Recommended)
```bash
npm run dev:full
```

This will start:
1. **Frontend:** Vite dev server at `http://localhost:5173`
2. **API:** Local payment server at `http://localhost:8787`

Both run in parallel!

### Option 2: Run API Server Separately
Terminal 1:
```bash
npm run dev:api
```

Terminal 2:
```bash
npm run dev
```

---

## What the Server Does

### `/api/payment/init` (POST)
- Receives payment form data
- Saves to local memory
- Initializes SSLCommerz payment
- Returns payment gateway URL

### `/api/payment/success` (POST)
- Receives SSLCommerz success callback
- Updates payment status to "success"
- Stores transaction ID

### `/api/payment/fail` (POST)
- Receives SSLCommerz failure callback
- Updates payment status to "failed"

### `/api/payment/cancel` (POST)
- Receives SSLCommerz cancellation callback
- Updates payment status to "cancelled"

### `/health` (GET)
- Health check endpoint
- Returns `{ status: 'ok', port: 8787 }`

---

## Test Now

1. **Start both servers:**
   ```bash
   npm run dev:full
   ```

2. **Open browser** at http://localhost:5173

3. **Fill payment form** and submit

4. **Should see:**
   - `📝 Payment Init Request` in server console
   - Redirect to SSLCommerz payment gateway
   - Form works without "ECONNREFUSED" errors!

---

## Key Features

✅ Express.js API server for local development
✅ CORS enabled for cross-origin requests
✅ Error handling and logging
✅ Payment data storage in memory
✅ Direct SSLCommerz integration
✅ Works with Vite proxy configuration
✅ Easy to run with `npm run dev:full`

---

## Files Created/Modified

| File | Change |
|------|--------|
| `server/dev-server.js` | ✨ NEW - Local payment API server |
| `package.json` | Added `dev:full` and `dev:api` scripts |
| `package.json` | Added `express`, `cors`, `concurrently` dependencies |

---

## Next Steps

1. ✅ Run `npm run dev:full`
2. ✅ Test payment form submission
3. ✅ Verify Appwrite saves payment records
4. ✅ Test SSLCommerz payment flow
5. ✅ Deploy to production with Vercel

---

**Ready to test!** 🚀
