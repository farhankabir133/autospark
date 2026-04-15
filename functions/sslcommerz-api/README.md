# Auto Spark SSLCommerz Payment Gateway Integration

Production-ready payment integration for Auto Spark using **SSLCommerz Live** gateway with **TypeScript**, **Node.js**, and **Appwrite Functions**.

## 📋 Overview

This module provides a complete server-side payment processing solution with:

- ✅ **Transaction Initialization** - Generate unique transaction IDs with `AS_LIVE_` prefix
- ✅ **Payment Gateway Integration** - Full SSLCommerz Live support
- ✅ **IPN Validation** - Server-to-server callback validation
- ✅ **Database Integration** - Appwrite Databases for order management
- ✅ **Type Safety** - Full TypeScript definitions
- ✅ **Error Handling** - Comprehensive error management and logging
- ✅ **Production Ready** - Security best practices and environment variable management

## 🚀 Quick Start

### 1. Installation

```bash
cd functions/sslcommerz-api
npm install
```

### 2. Configuration

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

**Required Environment Variables:**

```env
SSLCZ_STORE_ID=autosparkbd0live
SSLCZ_STORE_PASSWD=69DBB19BAB55E48107
APPWRITE_API_ENDPOINT=https://sgp.cloud.appwrite.io/v1
APPWRITE_API_KEY=your_api_key
APPWRITE_PROJECT_ID=your_project_id
APPWRITE_ORDERS_DATABASE_ID=orders_db
APPWRITE_ORDERS_COLLECTION_ID=orders_collection
BASE_URL=https://autosparkbd.com
APPWRITE_FUNCTION_ENDPOINT=https://your-function-url
```

### 3. Build

```bash
npm run build
```

### 4. Deploy to Appwrite

```bash
appwrite functions deploy sslcommerz-api
```

### 5. If deployment fails with `tar: short read`

Use these checks before retrying:

1. In Appwrite Console, make sure function **Root Directory** is exactly:

```
functions/sslcommerz-api
```

2. Keep function archive minimal (this folder includes a `.appwriteignore`).
3. If using Git deployment in Appwrite, avoid using repo root as function source.
4. Re-run deployment after activating the latest deployment.

This project has many frontend assets and assistant tooling files at repo root; deploying from root can create a very large archive and trigger build-side tar/archive errors.

## 📚 API Endpoints

### 1. Initialize Payment
**POST** `/payment/init`

Initiates a payment transaction with SSLCommerz.

**Request Body:**
```json
{
  "total_amount": 50000,
  "cus_name": "John Doe",
  "cus_email": "john@example.com",
  "cus_phone": "01711111111",
  "product_name": "Vehicle Purchase",
  "product_category": "automotive",
  "order_id": "ORDER_123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "redirectUrl": "https://securepay.sslcommerz.com/gwprocess/v4/gw.php?Q3...",
    "tranId": "AS_LIVE_1713012345678_a7f3k9m2",
    "amount": 50000
  }
}
```

**Error Response (400/500):**
```json
{
  "success": false,
  "error": "Invalid email format"
}
```

### 2. Handle IPN Callback
**POST** `/payment/ipn`

Receives and validates payment notifications from SSLCommerz.

**Request Body (from SSLCommerz):**
```json
{
  "tran_id": "AS_LIVE_1713012345678_a7f3k9m2",
  "val_id": "2407271141277R70GDSD3C",
  "amount": "50000.00",
  "currency": "BDT",
  "status": "VALID",
  "card_type": "Visa",
  "card_issuer": "Dhaka Bank"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "tranId": "AS_LIVE_1713012345678_a7f3k9m2",
    "valid": true
  }
}
```

### 3. Check Order Status
**GET** `/payment/status/:tranId`

Retrieves the current status of an order.

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "tranId": "AS_LIVE_1713012345678_a7f3k9m2",
    "status": "paid",
    "amount": 50000,
    "currency": "BDT",
    "createdAt": "2024-07-27T10:30:00Z",
    "paidAt": "2024-07-27T10:35:00Z"
  }
}
```

### 4. Get Payment Statistics
**GET** `/payment/stats`

Returns payment statistics and order counts.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "total": 150,
    "pending": 25,
    "paid": 120,
    "failed": 4,
    "cancelled": 1
  }
}
```

### 5. Health Check
**GET** `/` or **GET** `/health`

Service health check endpoint.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "service": "autospark-payment-gateway",
    "version": "1.0.0",
    "environment": "production"
  }
}
```

## 🔐 Security Features

### Environment Variables
All sensitive credentials are loaded from environment variables:
- Store credentials never hardcoded
- API keys secured via Appwrite environment variables
- Secrets logged only when masked

### Input Validation
- Email format validation
- Bangladesh phone number format validation
- Amount validation (positive numbers only)
- String sanitization
- Required field validation

### Payment Validation
- SSLCommerz response structure validation
- IPN signature validation via `sslcz.validate()`
- Transaction ID verification
- Amount verification

### CORS Protection
- Configurable CORS origin
- Method whitelisting (GET, POST, OPTIONS, PUT)
- Header validation

## 📊 Database Schema

### Orders Collection

Create this collection in your Appwrite Database:

```
Document ID: String (tran_id)

Fields:
- tran_id (String, required): Transaction ID
- status (String, enum: pending|paid|failed|cancelled)
- amount (Number, required): Payment amount
- currency (String): BDT
- customer_name (String): Full name
- customer_email (String): Email address
- customer_phone (String): Phone number
- created_at (String): ISO timestamp
- paid_at (String, nullable): Paid timestamp
- validation_id (String, nullable): SSLCommerz validation ID
- payment_method (String): Card type or payment method
- metadata (Object): Additional data
```

## 🔄 Payment Flow

```
1. Client initiates payment via /payment/init
   ↓
2. Server creates order with 'pending' status
   ↓
3. Server redirects to SSLCommerz Gateway
   ↓
4. Customer completes payment on SSLCommerz
   ↓
5. SSLCommerz calls IPN endpoint with validation data
   ↓
6. Server validates with SSLCommerz via sslcz.validate()
   ↓
7. Server updates order status to 'paid' or 'failed'
   ↓
8. Customer redirected to success/fail page
```

## 📝 TypeScript Types

All types are defined in `src/types.ts`:

- `PaymentInitiationRequest` - Payment initiation payload
- `SSLCommerzInitData` - Data sent to SSLCommerz
- `SSLCommerzInitResponse` - Gateway response
- `SSLCommerzIPNRequest` - IPN callback data
- `SSLCommerzValidationResponse` - Validation response
- `Order` - Order document type
- `APIResponse<T>` - API response wrapper
- `AppwriteConfig` - Configuration interface

## 🛠️ Utility Functions

The `utils.ts` module provides:

- `generateTransactionId()` - Unique tran_id generation
- `isValidEmail()` - Email validation
- `isValidBDPhone()` - Bangladesh phone validation
- `isValidAmount()` - Amount validation
- `sanitizeString()` - String sanitization
- `validateRequiredFields()` - Field validation
- `formatAmount()` - Amount formatting
- `logPaymentEvent()` - Event logging
- `handleError()` - Error handling
- `maskSensitive()` - Sensitive data masking
- `retryAsync()` - Retry logic with exponential backoff

## 📦 Classes

### PaymentInitializer
Handles payment transaction initialization.

```typescript
const initializer = new PaymentInitializer(storeId, storePasswd, baseUrl);
const result = await initializer.initializePayment(request, SSLCommerzPayment);
```

### IPNValidator
Handles IPN validation from SSLCommerz.

```typescript
const validator = new IPNValidator(storeId, storePasswd);
const result = await validator.processIPN(ipnBody, SSLCommerzPayment);
```

### AppwriteOrderManager
Manages order documents in Appwrite.

```typescript
const manager = new AppwriteOrderManager(client, databaseId, collectionId);
await manager.createOrder(tranId, orderData);
await manager.markOrderAsPaid(tranId, validationData);
```

## 🧪 Testing

### Test Payment Credentials (Sandbox)
```
Card Number: 4111111111111111
Expiry: 12/25
CVV: 123
```

### Test Transaction ID
The system automatically generates IDs like: `AS_LIVE_1713012345678_a7f3k9m2`

### Manual Testing
```bash
# Health check
curl https://autosparkbd.com/api/payment/health

# Initialize payment
curl -X POST https://autosparkbd.com/api/payment/init \
  -H "Content-Type: application/json" \
  -d '{
    "total_amount": 1000,
    "cus_name": "Test User",
    "cus_email": "test@example.com",
    "cus_phone": "01711111111"
  }'

# Check status
curl https://autosparkbd.com/api/payment/status/AS_LIVE_1713012345678_a7f3k9m2

# Get stats
curl https://autosparkbd.com/api/payment/stats
```

## 📈 Logging & Monitoring

All payment events are logged with timestamps:
- `payment_init_start` - Initialization started
- `payment_init_success` - Payment initialized
- `payment_init_failed` - Initialization failed
- `ipn_received` - IPN callback received
- `ipn_validation_start` - Validation started
- `ipn_validation_success` - Validation succeeded
- `order_created` - Order document created
- `order_marked_paid` - Order marked as paid

View logs in Appwrite Dashboard under Functions → Logs.

## 🐛 Debugging

Enable debug logging by setting `DEBUG=true` in environment variables.

Sensitive data is automatically masked in logs:
- Only first 4 characters of val_id shown
- Full phone numbers replaced with asterisks
- Error messages sanitized

## ⚠️ Error Codes

| Status | Error | Solution |
|--------|-------|----------|
| 400 | Invalid email format | Check email format |
| 400 | Invalid phone number | Use 11-digit BD format (01...) |
| 400 | Invalid IPN structure | Ensure all required fields present |
| 500 | Missing environment variables | Check .env configuration |
| 502 | SSLCommerz gateway error | Check store credentials |
| 504 | Database connection error | Check Appwrite configuration |

## 📞 Support

For issues or questions:
1. Check Appwrite Function logs
2. Verify environment variables
3. Test with manual curl requests
4. Review SSLCommerz documentation

## 📄 License

Auto Spark © 2024. All rights reserved.

## 🔗 References

- [SSLCommerz Integration Guide](https://docs.sslcommerz.com)
- [Appwrite Functions Documentation](https://appwrite.io/docs/functions)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
