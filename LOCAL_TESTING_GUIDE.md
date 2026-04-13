# Local Testing Guide - SSLCommerz Payment Gateway

Quick guide to test the payment gateway locally at localhost:3000.

## 🚀 Quick Start (5 minutes)

### Step 1: Install Dependencies
```bash
cd functions/sslcommerz-api
npm install
```

### Step 2: Start Local Test Server
```bash
npm run test:local
```

You should see:
```
============================================================
🚀 Local Test Server Started
============================================================

📍 Server URL: http://localhost:3000

📚 Available Endpoints:
  ✅ GET    /health
  ✅ POST   /payment/init
  ✅ GET    /payment/status/:tranId
  ✅ GET    /payment/stats
  ⚙️  POST   /payment/test/mark-as-paid/:tranId (testing only)
```

### Step 3: Test Health Endpoint
```bash
curl http://localhost:3000/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "service": "SSLCommerz Payment Gateway",
  "environment": "local-test",
  "timestamp": "2026-04-13T10:30:45.123Z",
  "version": "1.0.0"
}
```

---

## 📝 Test Scenarios

### Scenario 1: Initialize Payment
**Initialize a new payment transaction**

```bash
curl -X POST http://localhost:3000/payment/init \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "customerPhone": "01712345678",
    "amount": 5000,
    "productName": "Car Parts",
    "productCategory": "parts"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Payment initialized successfully",
  "tran_id": "AS_LIVE_B2PVDH_6F7K2J",
  "redirectUrl": "https://sandbox.sslcommerz.com/gwprocess/testv4",
  "data": {
    "tran_id": "AS_LIVE_B2PVDH_6F7K2J",
    "amount": "5000.00",
    "currency": "BDT",
    "productName": "Car Parts",
    "redirectUrl": "https://sandbox.sslcommerz.com/gwprocess/testv4",
    "note": "In local test, use SSLCommerz sandbox. In production, real gateway will be used."
  }
}
```

**What to note:**
- Copy the `tran_id` from response
- Each request generates a unique `AS_LIVE_` prefixed ID
- Amount is returned as a formatted string

### Scenario 2: Check Payment Status
**Check if payment was successful**

```bash
# Replace AS_LIVE_B2PVDH_6F7K2J with your actual tran_id from above
curl http://localhost:3000/payment/status/AS_LIVE_B2PVDH_6F7K2J
```

**Expected Response (before payment):**
```json
{
  "success": true,
  "data": {
    "tran_id": "AS_LIVE_B2PVDH_6F7K2J",
    "status": "pending",
    "amount": 5000,
    "customerEmail": "john@example.com",
    "createdAt": "2026-04-13T10:30:45.123Z",
    "updatedAt": "2026-04-13T10:30:45.123Z"
  }
}
```

### Scenario 3: Simulate Payment Success
**Mark payment as paid (for testing)**

```bash
# Replace AS_LIVE_B2PVDH_6F7K2J with your actual tran_id
curl -X POST http://localhost:3000/payment/test/mark-as-paid/AS_LIVE_B2PVDH_6F7K2J
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Order marked as paid",
  "data": {
    "$id": "AS_LIVE_B2PVDH_6F7K2J",
    "tran_id": "AS_LIVE_B2PVDH_6F7K2J",
    "status": "paid",
    "amount": 5000,
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "customerPhone": "01712345678",
    "productName": "Car Parts",
    "productCategory": "parts",
    "createdAt": "2026-04-13T10:30:45.123Z",
    "updatedAt": "2026-04-13T10:30:46.456Z",
    "payment_method": "sslcommerz-test",
    "validation_id": "test_val_1702471245456"
  }
}
```

### Scenario 4: Check Updated Status
**Verify the payment status after marking as paid**

```bash
curl http://localhost:3000/payment/status/AS_LIVE_B2PVDH_6F7K2J
```

**Expected Response (after payment):**
```json
{
  "success": true,
  "data": {
    "tran_id": "AS_LIVE_B2PVDH_6F7K2J",
    "status": "paid",
    "amount": 5000,
    "customerEmail": "john@example.com",
    "createdAt": "2026-04-13T10:30:45.123Z",
    "updatedAt": "2026-04-13T10:30:46.456Z"
  }
}
```

### Scenario 5: Get Statistics
**View payment statistics**

```bash
curl http://localhost:3000/payment/stats
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "totalOrders": 1,
    "paidOrders": 1,
    "pendingOrders": 0,
    "failedOrders": 0,
    "cancelledOrders": 0,
    "totalAmount": "5000.00",
    "paidAmount": "5000.00"
  }
}
```

---

## ❌ Error Testing

### Test Missing Fields
```bash
curl -X POST http://localhost:3000/payment/init \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John Doe"
  }'
```

**Expected Error:**
```json
{
  "success": false,
  "error": "Missing required fields",
  "required": ["customerName", "customerEmail", "customerPhone", "amount", "productName"]
}
```

### Test Invalid Email
```bash
curl -X POST http://localhost:3000/payment/init \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John Doe",
    "customerEmail": "invalid-email",
    "customerPhone": "01712345678",
    "amount": 5000,
    "productName": "Car Parts"
  }'
```

**Expected Error:**
```json
{
  "success": false,
  "error": "Invalid email format"
}
```

### Test Invalid Phone
```bash
curl -X POST http://localhost:3000/payment/init \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "customerPhone": "123456",
    "amount": 5000,
    "productName": "Car Parts"
  }'
```

**Expected Error:**
```json
{
  "success": false,
  "error": "Invalid BD phone number"
}
```

### Test Invalid Amount
```bash
curl -X POST http://localhost:3000/payment/init \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "customerPhone": "01712345678",
    "amount": -100,
    "productName": "Car Parts"
  }'
```

**Expected Error:**
```json
{
  "success": false,
  "error": "Invalid amount. Must be between 0.01 and 999999999"
}
```

### Test Non-Existent Order
```bash
curl http://localhost:3000/payment/status/INVALID_TRAN_ID
```

**Expected Error:**
```json
{
  "success": false,
  "error": "Order not found",
  "tran_id": "INVALID_TRAN_ID"
}
```

---

## 🧪 Testing in Postman/Insomnia

### Import Collection
You can import these endpoints into Postman or Insomnia:

**Base URL:** `http://localhost:3000`

**Endpoints:**

| Method | Endpoint | Body |
|--------|----------|------|
| GET | `/health` | None |
| POST | `/payment/init` | See Scenario 1 |
| GET | `/payment/status/:tranId` | None |
| GET | `/payment/stats` | None |
| POST | `/payment/test/mark-as-paid/:tranId` | None |

---

## 📊 Understanding Validation Rules

### Email Validation
✅ `john@example.com`  
✅ `user.name@company.co.uk`  
❌ `invalid-email`  
❌ `@example.com`  
❌ `user@`  

### Phone Number Validation (Bangladesh)
✅ `01712345678` (11 digits)  
✅ `8801712345678` (with country code)  
✅ `+8801712345678` (with + prefix)  
✅ `017 1234 5678` (with spaces - spaces are removed)  
❌ `123456` (too short)  
❌ `02712345678` (wrong prefix)  

### Amount Validation
✅ `1` (minimum)  
✅ `5000`  
✅ `999999999` (maximum)  
✅ `999999999.99`  
❌ `0` (zero)  
❌ `-100` (negative)  
❌ `9999999999` (exceeds max)  

---

## 🔍 Logs & Debugging

The local test server logs all events to console:

```
[2026-04-13T10:30:45.123Z] PAYMENT_INIT: {
  "tran_id": "AS_LIVE_B2PVDH_6F7K2J",
  "amount": 5000,
  "customer": "john@example.com",
  "status": "success"
}

[2026-04-13T10:30:50.456Z] PAYMENT_STATUS_CHECK: {
  "tran_id": "AS_LIVE_B2PVDH_6F7K2J",
  "status": "pending"
}
```

This helps you understand the flow and debug issues.

---

## 🔗 Next Steps

### After Successful Local Testing:
1. ✅ All endpoints working locally
2. ✅ Validation rules working correctly
3. ✅ Transaction IDs being generated with AS_LIVE_ prefix
4. ⏭️ **Next:** Follow [SSLCOMMERZ_DEPLOYMENT_GUIDE.md](SSLCOMMERZ_DEPLOYMENT_GUIDE.md) to deploy to Appwrite

### When Ready for Production:
1. Stop local server (`Ctrl+C`)
2. Build TypeScript: `npm run build`
3. Deploy to Appwrite: `appwrite functions deploy sslcommerz-api`
4. Configure IPN URL in SSLCommerz dashboard
5. Test with real SSLCommerz sandbox credentials

---

## 📞 Troubleshooting

### "Cannot find module 'express'"
```bash
# Run this in functions/sslcommerz-api directory
npm install
```

### "Port 3000 already in use"
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port - edit local-test-server.ts and change:
# const PORT = 3000;  →  const PORT = 3001;
```

### "ts-node: not found"
```bash
npm install --save-dev ts-node
```

### Endpoints not responding
- Make sure you're in `functions/sslcommerz-api` directory
- Make sure server is running (`npm run test:local`)
- Check that port 3000 is correct in your curl command
- Verify JSON format in request body

---

## ✅ Checklist

- [ ] Run `npm install` in functions/sslcommerz-api
- [ ] Start server with `npm run test:local`
- [ ] Test health endpoint
- [ ] Initialize a payment
- [ ] Check payment status
- [ ] Mark payment as paid
- [ ] Verify statistics
- [ ] Test validation errors
- [ ] Review server logs
- [ ] Ready to deploy!

**Happy testing! 🎉**
