# SSLCommerz Payment Integration - Quick Start Guide

**Get your payment gateway live in 5 minutes!**

## 📋 Prerequisites

- ✅ Appwrite Cloud account
- ✅ SSLCommerz Live credentials (Store ID & Password)
- ✅ Node.js 18+
- ✅ Appwrite CLI installed

## ⚡ 5-Minute Setup

### Step 1: Prepare Environment Variables (1 min)

```bash
cd functions/sslcommerz-api
cp .env.example .env
```

Edit `.env` with your values:
```env
SSLCZ_STORE_ID=autosparkbd0live
SSLCZ_STORE_PASSWD=69DBB19BAB55E48107
APPWRITE_API_KEY=<your_api_key>
APPWRITE_PROJECT_ID=69d09ead0018cd1663a7
APPWRITE_ORDERS_DATABASE_ID=<database_id>
APPWRITE_ORDERS_COLLECTION_ID=<collection_id>
```

### Step 2: Install & Build (2 min)

```bash
npm install
npm run build
```

### Step 3: Deploy (1 min)

```bash
appwrite functions deploy sslcommerz-api --activate
appwrite functions get sslcommerz-api
```

Copy the function URL returned.

### Step 4: Configure IPN (1 min)

1. Go to SSLCommerz Merchant Panel
2. Settings → IPN Settings
3. Paste: `https://your-function-endpoint/payment/ipn`
4. Save

**Done! Your payment gateway is live! 🎉**

---

## 🧪 Test It

```bash
# Test initialization
curl -X POST https://your-function-endpoint/payment/init \
  -H "Content-Type: application/json" \
  -d '{
    "total_amount": 1000,
    "cus_name": "John Doe",
    "cus_email": "john@example.com",
    "cus_phone": "01711111111"
  }'
```

You'll get a `redirectUrl` - that's your payment gateway link!

---

## 📱 Use in Frontend

```typescript
// Simple payment service
class PaymentService {
  async pay(amount: number, name: string, email: string, phone: string) {
    const res = await fetch(`${API}/payment/init`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        total_amount: amount,
        cus_name: name,
        cus_email: email,
        cus_phone: phone
      })
    });
    
    const data = await res.json();
    window.location.href = data.data.redirectUrl; // Redirect to payment
  }
}
```

---

## ✅ Verification

After payment:
- ✅ Customer redirected to success page
- ✅ SSLCommerz sends IPN callback
- ✅ Order status updated to 'paid'
- ✅ All logged in Appwrite

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| 500 error | Check env vars in Appwrite Dashboard |
| No IPN callbacks | Verify IPN URL in SSLCommerz |
| Gateway redirects to fail | Check Store ID/Password |
| Database error | Create orders collection first |

---

## 📚 Full Documentation

- **API Details:** `functions/sslcommerz-api/README.md`
- **Deployment:** `SSLCOMMERZ_DEPLOYMENT_GUIDE.md`
- **Code Examples:** `SSLCOMMERZ_INTEGRATION_EXAMPLES.md`
- **Architecture:** `SSLCOMMERZ_PAYMENT_INTEGRATION.md`

---

## 🔐 Security Note

Never commit `.env` files! They're in `.gitignore`.

---

**Ready to accept payments? Let's go! 🚀**
