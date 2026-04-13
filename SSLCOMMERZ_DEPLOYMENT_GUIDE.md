# SSLCommerz Payment Gateway - Deployment Guide

Complete production deployment instructions for Auto Spark's SSLCommerz payment integration.

## 🎯 Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] TypeScript compiled successfully
- [ ] Appwrite database and collection created
- [ ] SSLCommerz Live credentials verified
- [ ] IPN callback URL configured in SSLCommerz dashboard
- [ ] CORS settings configured
- [ ] SSL certificate valid for autosparkbd.com
- [ ] Backup of current production code

## 📋 Step-by-Step Deployment

### Step 1: Prepare Appwrite Database

**Create Database:**
1. Go to Appwrite Console → Databases
2. Click "Create Database"
3. Name: `orders_db`
4. Note the Database ID

**Create Collection:**
1. Inside the database, click "Create Collection"
2. Name: `orders_collection`
3. Note the Collection ID

**Create Attributes:**

```
Attribute Name        | Type      | Required | Size
----------------------|-----------|----------|-------
tran_id              | String    | Yes      | 100
status               | String    | Yes      | 50
amount               | Number    | Yes      | -
currency             | String    | Yes      | 3
customer_name        | String    | Yes      | 200
customer_email       | String    | Yes      | 255
customer_phone       | String    | Yes      | 20
created_at           | DateTime  | Yes      | -
paid_at              | DateTime  | No       | -
validation_id        | String    | No       | 100
payment_method       | String    | No       | 50
metadata             | JSON      | No       | -
```

**Set Document ID:**
- Set `tran_id` as Document ID (under Index settings)

### Step 2: Create Appwrite API Key

1. Go to Appwrite Console → Settings → API Keys
2. Click "Create API Key"
3. Name: `SSLCommerz Payment Gateway`
4. Scopes: Select all database and document permissions
5. Copy the key and add to `.env` as `APPWRITE_API_KEY`

### Step 3: Prepare Function Directory

```bash
# Navigate to function directory
cd functions/sslcommerz-api

# Install dependencies
npm install

# Create .env file with your credentials
cp .env.example .env
# Edit .env with your actual values
```

### Step 4: Configure Environment Variables

Edit `.env` with your actual credentials:

```env
# SSLCommerz
SSLCZ_STORE_ID=autosparkbd0live
SSLCZ_STORE_PASSWD=69DBB19BAB55E48107

# Appwrite
APPWRITE_API_ENDPOINT=https://sgp.cloud.appwrite.io/v1
APPWRITE_API_KEY=<your_api_key>
APPWRITE_PROJECT_ID=69d09ead0018cd1663a7
APPWRITE_ORDERS_DATABASE_ID=<database_id_from_step_1>
APPWRITE_ORDERS_COLLECTION_ID=<collection_id_from_step_1>

# Auto Spark
BASE_URL=https://autosparkbd.com
APPWRITE_FUNCTION_ENDPOINT=https://your-function-endpoint
CORS_ORIGIN=https://autosparkbd.com
```

### Step 5: Build TypeScript

```bash
npm run build
```

Output should be in `dist/` directory with no errors.

### Step 6: Deploy with Appwrite CLI

```bash
# Install Appwrite CLI (if not already installed)
npm install -g appwrite

# Login to Appwrite
appwrite login

# Initialize project
appwrite init

# Deploy function
appwrite functions deploy sslcommerz-api --activate

# Get function endpoint
appwrite functions get sslcommerz-api
```

Copy the function URL returned (e.g., `https://your-project.appwrite.io/v1/functions/sslcommerz-api`)

### Step 7: Configure SSLCommerz Dashboard

1. Log in to SSLCommerz Merchant Panel
2. Go to Settings → IPN Settings
3. Set IPN Listener URL:
   ```
   https://your-function-endpoint/payment/ipn
   ```
4. Enable "Instantly listen to IPN"
5. Save and test IPN

### Step 8: Update Frontend Configuration

Update your React/Frontend code to use the function endpoint:

```typescript
// In your checkout page or payment service
const PAYMENT_API = 'https://your-function-endpoint';

async function initializePayment(paymentData) {
  const response = await fetch(`${PAYMENT_API}/payment/init`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paymentData)
  });
  
  const result = await response.json();
  if (result.success) {
    window.location.href = result.data.redirectUrl;
  }
}
```

### Step 9: Update Success/Fail/Cancel URLs

Update your payment handling pages to accept `tran_id` parameter:

```typescript
// payment-success.tsx
const params = new URLSearchParams(location.search);
const tranId = params.get('tran_id');

// Verify payment status
const response = await fetch(`${PAYMENT_API}/payment/status/${tranId}`);
const order = await response.json();
```

### Step 10: Test Deployment

```bash
# Test health endpoint
curl https://your-function-endpoint/health

# Test payment initialization
curl -X POST https://your-function-endpoint/payment/init \
  -H "Content-Type: application/json" \
  -d '{
    "total_amount": 1000,
    "cus_name": "Test User",
    "cus_email": "test@example.com",
    "cus_phone": "01711111111"
  }'

# Check payment status (use tranId from init response)
curl https://your-function-endpoint/payment/status/AS_LIVE_xxx_xxx

# Get statistics
curl https://your-function-endpoint/payment/stats
```

## 🔐 Production Security Checklist

- [ ] Environment variables NOT committed to git
- [ ] `.env` file added to `.gitignore`
- [ ] API keys rotated (create new key in Appwrite)
- [ ] CORS origin restricted to autosparkbd.com
- [ ] Database permissions limited (least privilege)
- [ ] Payment amounts validated on both client and server
- [ ] HTTPS enabled for all endpoints
- [ ] Appwrite function logs monitored
- [ ] Error messages don't expose sensitive data
- [ ] Rate limiting configured (if available)

## 🚨 Troubleshooting

### Function Returns 500 Error

**Check:**
1. Appwrite function logs: `appwrite functions logs sslcommerz-api`
2. Environment variables are set in Appwrite Dashboard
3. Appwrite project credentials are correct
4. Network connectivity to Appwrite endpoint

**Fix:**
```bash
# Restart function
appwrite functions delete sslcommerz-api
appwrite functions deploy sslcommerz-api --activate
```

### IPN Not Receiving Callbacks

**Check:**
1. IPN URL configured in SSLCommerz dashboard (Settings → IPN Settings)
2. URL is publicly accessible (HTTPS)
3. Appwrite function is active
4. Firewall allows incoming requests from SSLCommerz

**Test IPN:**
1. In SSLCommerz dashboard, use "Send Test IPN"
2. Check Appwrite function logs for incoming request

### Database Operations Failing

**Check:**
1. Database ID and Collection ID are correct in `.env`
2. API key has database permissions
3. Collection attributes are correctly defined
4. Document ID is set to `tran_id`

**Fix:**
```bash
# Verify database
appwrite databases list

# Verify collection
appwrite databases list-collections <database_id>

# Check API key permissions
appwrite teams list-memberships
```

### Payment Gateway Errors

**Check SSLCommerz Credentials:**
- Store ID: `autosparkbd0live`
- Store Password: `69DBB19BAB55E48107`
- Is Live mode enabled: `true`

**Test credentials:**
```bash
# Using curl to test SSLCommerz API
curl -X POST https://securepay.sslcommerz.com/gwprocess/v4/api.php \
  -d "store_id=autosparkbd0live&store_passwd=69DBB19BAB55E48107&status=check"
```

### CORS Issues

If receiving CORS errors on frontend:

1. Check `CORS_ORIGIN` in `.env` matches your domain
2. Verify Appwrite function has CORS headers set
3. Test with curl (no CORS issues with curl)

## 📊 Monitoring

### Enable Detailed Logging

Add to `.env`:
```env
DEBUG=true
LOG_LEVEL=debug
```

### View Logs

```bash
# Real-time logs
appwrite functions logs sslcommerz-api --follow

# Last 100 logs
appwrite functions logs sslcommerz-api --limit=100
```

### Monitor Orders

```bash
# Get payment statistics
curl https://your-function-endpoint/payment/stats

# Check specific order
curl https://your-function-endpoint/payment/status/<tran_id>
```

## 📈 Performance Optimization

### Database Indexes

Create indexes for faster queries:

```
- tran_id (Primary)
- status (For filtering paid/pending orders)
- created_at (For date range queries)
- customer_email (For customer lookups)
```

### Caching

For frequently accessed data:
- Cache order stats for 5 minutes
- Cache successful validations temporarily
- Use Appwrite cache headers

## 🔄 Rollback Plan

If issues arise in production:

```bash
# Revert to previous version
git log --oneline functions/sslcommerz-api/
git checkout <previous_commit> -- functions/sslcommerz-api/

# Rebuild and redeploy
cd functions/sslcommerz-api
npm run build
appwrite functions deploy sslcommerz-api --activate
```

## ✅ Post-Deployment Verification

1. **Health Check** - Service responds to health endpoint
2. **Payment Initialization** - Can create payment transactions
3. **Database** - Orders created successfully
4. **IPN Callback** - Receiving and processing callbacks
5. **Order Status** - Can retrieve order status
6. **Error Handling** - Proper error responses
7. **Logging** - All events logged to Appwrite
8. **Security** - No sensitive data in logs
9. **CORS** - Working from frontend domain
10. **SSL** - HTTPS working for all endpoints

## 📞 Support & Documentation

- SSLCommerz Docs: https://docs.sslcommerz.com
- Appwrite Docs: https://appwrite.io/docs
- TypeScript Docs: https://www.typescriptlang.org/docs

---

**Deployment Date:** _____________
**Deployed By:** _____________
**Version:** _____________
