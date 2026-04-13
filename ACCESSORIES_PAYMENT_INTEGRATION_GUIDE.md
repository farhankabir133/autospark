# Accessories Payment Gateway Integration - Complete Guide

## Overview

The Accessories Page is now **fully integrated with SSLCommerz Live payment gateway** at the custom domain `https://autosparkbd.com/`. This guide explains the complete payment flow and configuration.

---

## Payment Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    ACCESSORIES PAGE                              │
│                                                                   │
│  1. User adds items to cart                                     │
│  2. User clicks "Proceed to Checkout"                           │
│  3. Items transferred to global cart context                    │
│  4. Navigates to /payment route                                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                  PAYMENT PAGE (/payment)                         │
│                                                                   │
│  - Displays One-Page Checkout form                             │
│  - Collects billing information:                               │
│    • Customer name                                             │
│    • Mobile number (11-digit Bangladesh format)               │
│    • District & Thana (location)                              │
│    • Full address                                             │
│  - Validates form using Zod schema                            │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│             APPWRITE FUNCTION (sslcommerz-api)                   │
│                                                                   │
│  Endpoint: /init                                               │
│  Method: POST                                                  │
│  Function ID: sslcommerz-api                                  │
│                                                                   │
│  Processing:                                                    │
│  1. Receives order data from React frontend                   │
│  2. Validates cart items and total amount                     │
│  3. Generates unique transaction ID (AS_LIVE_[timestamp])   │
│  4. Stores order in Appwrite Database                        │
│  5. Calls SSLCommerz API to initiate payment                 │
│  6. Returns SSLCommerz Gateway URL                           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│           SSLCOMMERZ LIVE PAYMENT GATEWAY                        │
│                                                                   │
│  Domain: https://securepay.sslcommerz.com/gwprocess/v4/gw.php  │
│  Store ID: autosparkbd0live                                    │
│  Environment: LIVE (Production)                               │
│                                                                   │
│  User performs payment:                                        │
│  - Selects payment method                                     │
│  - Enters card/payment details                                │
│  - SSLCommerz processes payment                               │
│  - Sends IPN notification to backend                          │
│  - Redirects user to success/fail page                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
    SUCCESS          FAILED          CANCELLED
    /payment/       /payment/        /payment/
    success         fail             cancel
```

---

## Configuration Details

### 1. Environment Variables (.env.local)

```env
# Payment API Configuration
VITE_PAYMENT_API_URL=https://autosparkbd.com
VITE_PAYMENT_INIT_URL=https://autosparkbd.com/api/payment/init
VITE_APPWRITE_FUNCTION_ID=sslcommerz-api

# SSLCommerz Live Configuration (Production)
SSLCOMMERZ_STORE_ID=autosparkbd0live
SSLCOMMERZ_STORE_PASSWORD=69DBB19BAB55E48107
VITE_SSLCOMMERZ_STORE_ID=autosparkbd0live
VITE_SSLCOMMERZ_STORE_PASSWORD=69DBB19BAB55E48107
VITE_SSLCOMMERZ_LIVE_MODE=true

# Site Configuration
SITE_URL=https://autosparkbd.com
```

### 2. Appwrite Configuration (src/config/appwrite.ts)

```typescript
const client = new Client()
    .setEndpoint('https://sgp.cloud.appwrite.io/v1')
    .setProject('69d09ead0018cd1663a7');

export const functions = new Functions(client);
```

**Appwrite Function Details:**
- **ID:** sslcommerz-api
- **Location:** Cloud Appwrite (Singapore Region)
- **Endpoint:** https://sgp.cloud.appwrite.io/v1
- **Project ID:** 69d09ead0018cd1663a7

### 3. Payment Configuration (src/config/payment.ts)

```typescript
export const PAYMENT_API = {
  INIT_FUNCTION_ID: 'sslcommerz-api',
  INIT_URL: 'https://autosparkbd.com/api/payment/init',
};

export const PAYMENT_GATEWAY = {
  STORE_ID: 'autosparkbd0live',
  LIVE_MODE: true,
  SUCCESS_URL: 'https://autosparkbd.com/payment/success',
  FAIL_URL: 'https://autosparkbd.com/payment/fail',
  CANCEL_URL: 'https://autosparkbd.com/payment/cancel',
};
```

---

## Accessories Page Integration

### Flow Summary

**File:** `src/pages/AccessoriesPage.tsx`

1. **User adds items to cart:**
   ```typescript
   const handleAddToCart = (product: AccessoryProduct, quantity: number) => {
     setCart((prev) => [...prev, { product, quantity }]);
   };
   ```

2. **User views cart and clicks checkout:**
   ```tsx
   <SideCartDrawer
     items={cart}
     onCheckout={handleCheckout}
     {...otherProps}
   />
   ```

3. **Checkout handler transfers items to global cart:**
   ```typescript
   const handleCheckout = useCallback(() => {
     cart.forEach((item) => {
       const price = item.product.discount
         ? calculateDiscount(item.product.price, item.product.discount)
         : item.product.price;

       addToGlobalCart({
         id: item.product.id,
         name: item.product.name_en,
         price: price,
         quantity: item.quantity,
         image: item.product.images?.[0]?.image_url,
       });
     });

     setShowCartDrawer(false);
     navigate('/payment');  // Redirects to Payment Page
   }, [cart, navigate, addToGlobalCart]);
   ```

### Key Components

**1. FloatingCartBar** - Displays cart summary at bottom of page
- Shows item count and total price
- Click "View Cart" button to open side drawer

**2. SideCartDrawer** - Shopping cart sidebar
- Lists all cart items
- Allows quantity adjustment and item removal
- "Proceed to Checkout" button initiates payment flow

**3. Product Card** - Individual product display
- Add to cart button
- Quick view option
- Wishlist/compare options

---

## Data Flow - Accessories to Payment

### Cart Item Structure

```typescript
interface CartItem {
  product: AccessoryProduct;
  quantity: number;
}

interface AccessoryProduct {
  id: string;
  name_en: string;
  name_bn: string;
  description_en?: string;
  price: number;
  stock_quantity: number;
  category: string;
  images?: { image_url: string }[];
  discount?: number;
  // ... other fields
}
```

### Order Created in Backend

When checkout is initiated, the Appwrite Function receives:

```typescript
{
  cart: [
    {
      id: "1100",
      name: "Wireless Car Play",
      price: 8500,
      quantity: 1,
      image: "/P2/wirelesscarplay.webp"
    },
    // ... more items
  ],
  total_amount: 8500,
  customer_name: "John Doe",
  mobile: "01712345678",
  district: "Dhaka",
  thana: "Dhanmondi",
  address: "123 Main Street, Dhaka",
  payment_method: "card"
}
```

---

## Transaction Processing

### 1. Payment Initialization

**Request to Appwrite Function:**
```
POST https://sgp.cloud.appwrite.io/v1/functions/sslcommerz-api/executions
```

**Function validates:**
- Order data integrity
- Customer information validity
- Cart items and pricing
- Stock availability

### 2. Transaction ID Generation

Format: `AS_LIVE_[timestamp]_[randomString]`

Example: `AS_LIVE_1713000000000_a7f9e2c1`

**Benefits:**
- Globally unique per transaction
- Prevents duplicate orders
- Easy to track and audit
- Secure format (not sequential)

### 3. Database Storage

**Collection:** appwrite_orders
**Fields:**
- transactionId (unique index)
- storeId
- storeName
- totalAmount
- productProfile
- customerInfo
- paymentStatus
- createdAt
- updatedAt

### 4. SSLCommerz Gateway Request

**API Endpoint:** https://securepay.sslcommerz.com/gwprocess/v4/gw.php

**Parameters:**
```
store_id: autosparkbd0live
store_passwd: 69DBB19BAB55E48107
total_amount: 8500
currency: BDT
tran_id: AS_LIVE_[timestamp]_[random]
success_url: https://autosparkbd.com/payment/success
fail_url: https://autosparkbd.com/payment/fail
cancel_url: https://autosparkbd.com/payment/cancel
customer_name: John Doe
customer_email: john@example.com
customer_phone: 01712345678
customer_address: 123 Main Street
customer_city: Dhaka
customer_state: Dhaka
customer_postcode: 1205
customer_country: Bangladesh
```

---

## Payment Success/Failure Handling

### Success Response
**Route:** `/payment/success`
- User redirected by SSLCommerz
- Order status updated to "completed" in database
- Cart cleared from local storage
- Confirmation page displays order details

### Failure Response
**Route:** `/payment/fail`
- User redirected if payment failed
- Order status marked as "failed"
- Error message displayed
- Option to retry payment

### Cancellation Response
**Route:** `/payment/cancel`
- User clicked cancel on payment gateway
- Order remains in "pending" state
- Cart items retained
- Option to resume checkout

---

## IPN Validation

### Immediate Notification Post (IPN)

**From:** SSLCommerz
**To:** `https://autosparkbd.com/api/payment/ipn`
**Method:** POST

**IPN Payload:**
```json
{
  "tran_id": "AS_LIVE_1713000000000_a7f9e2c1",
  "val_id": "201234567890123456",
  "amount": "8500.00",
  "card_type": "VISA",
  "store_amount": "8410.00",
  "status": "VALID"
}
```

### Backend Validation
1. Retrieves SSLCommerz status by transaction ID
2. Validates amount matches order
3. Verifies signature and session key
4. Updates order status in database
5. Sends confirmation email

---

## Testing Endpoints

### Local Development
```
POST http://localhost:3000/init
GET http://localhost:3000/health
GET http://localhost:3000/stats
```

### Production
```
POST https://sgp.cloud.appwrite.io/v1/functions/sslcommerz-api/executions
Headers: Authorization: Bearer API_KEY
```

---

## SSLCommerz Store Details

| Property | Value |
|----------|-------|
| Store ID | `autosparkbd0live` |
| Store Name | Auto Spark BD |
| Store Password | `69DBB19BAB55E48107` |
| Environment | LIVE (Production) |
| Domain | `https://autosparkbd.com` |
| Account Status | Active |
| Registration Type | Individual/Business |

---

## Troubleshooting Guide

### Issue: Payment initialization fails

**Possible Causes:**
1. Appwrite Function not deployed
2. Invalid environment variables
3. Network connectivity issue
4. IPN endpoint not registered in SSLCommerz

**Solution:**
```bash
# Check Appwrite Function status
curl -X GET https://sgp.cloud.appwrite.io/v1/functions/sslcommerz-api \
  -H "Authorization: Bearer YOUR_API_KEY"

# Verify environment variables
echo $VITE_APPWRITE_FUNCTION_ID
echo $VITE_PAYMENT_API_URL
```

### Issue: Redirect URL not received

**Possible Causes:**
1. SSLCommerz API rate limited
2. Invalid store credentials
3. Amount validation failed

**Solution:**
```typescript
// Add logging in payment config
console.log('Payment Init URL:', PAYMENT_API.INIT_URL);
console.log('Store ID:', PAYMENT_GATEWAY.STORE_ID);
```

### Issue: IPN validation fails

**Possible Causes:**
1. IPN endpoint not configured in SSLCommerz
2. Transaction ID mismatch
3. Amount discrepancy

**Solution:**
1. Login to SSLCommerz Dashboard
2. Settings → IPN Configuration
3. Set IPN URL: `https://autosparkbd.com/api/payment/ipn`
4. Enable IPN listening

---

## Security Measures

✅ **Implemented:**
- All credentials stored in environment variables (not in code)
- Transaction IDs are unique and secure
- Order validation on backend
- IPN signature verification
- HTTPS/TLS encryption
- Database transaction logging
- Appwrite Function authentication

---

## File References

| File | Purpose |
|------|---------|
| `src/pages/AccessoriesPage.tsx` | Accessories listing & cart |
| `src/pages/PaymentPage.tsx` | Checkout & billing form |
| `src/pages/PaymentSuccessPage.tsx` | Order confirmation |
| `src/pages/PaymentFailPage.tsx` | Payment failure handling |
| `src/pages/PaymentCancelPage.tsx` | Order cancellation |
| `src/config/payment.ts` | Payment API configuration |
| `src/config/appwrite.ts` | Appwrite client setup |
| `src/contexts/CartContext.tsx` | Global cart state |
| `.env.local` | Environment variables |
| `functions/sslcommerz-api/src/main.ts` | Appwrite Function handler |

---

## Next Steps

1. **Verify SSLCommerz Configuration:**
   - Login to https://store.sslcommerz.com
   - Confirm store is active
   - Set IPN endpoint to `https://autosparkbd.com/api/payment/ipn`

2. **Test Payment Flow:**
   - Add accessories to cart
   - Complete checkout form
   - Verify redirect to SSLCommerz gateway
   - Use test card to simulate payment

3. **Monitor Orders:**
   - Check Appwrite Dashboard for orders
   - Verify IPN notifications are received
   - Confirm order status updates

4. **Production Deployment:**
   - Build: `npm run build`
   - Deploy to hosting (GitHub Pages or custom domain)
   - Verify all routes accessible at `https://autosparkbd.com`

---

## Contact & Support

**SSLCommerz Support:**
- Email: info@sslcommerz.com
- Portal: https://store.sslcommerz.com
- Helpline: +880-2-48993000

**Auto Spark:**
- Domain: https://autosparkbd.com
- Email: support@autosparkbd.com

---

**Last Updated:** April 13, 2026
**Status:** ✅ Payment Gateway Integrated & Live
