# Accessories Payment Integration Guide

## Overview

The accessories page is now fully integrated with the SSLCommerz payment gateway. Users can add accessories to their cart and proceed directly to payment checkout.

## Complete Flow

### 1. **Accessories Page** (`src/pages/AccessoriesPage.tsx`)
- Users browse and search accessories
- Add items to the shopping cart
- View cart with item quantities, prices, and total
- Click **"Proceed to Checkout"** button

### 2. **Cart Context** (`src/contexts/CartContext.tsx`)
- Global state management for cart items
- Persists cart data across page navigation
- Available throughout the app via `useCart()` hook
- Methods: `addToCart()`, `removeFromCart()`, `updateQuantity()`, `clearCart()`

### 3. **Checkout Handler** (in `AccessoriesPage`)
```typescript
const handleCheckout = useCallback(() => {
  if (cart.length === 0) return;

  // Transfer cart items to global cart context
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

  // Close cart drawer and navigate to payment
  setShowCartDrawer(false);
  navigate('/payment');
}, [cart, navigate, addToGlobalCart]);
```

### 4. **Payment Page** (`src/pages/PaymentPage.tsx`)
- Reads cart items from `CartContext`
- Displays **Order Summary** sidebar with all items and total
- Auto-fills payment form:
  - `product`: Combined product names and quantities
  - `amount`: Total cart value
- User enters customer details (name, email, phone)
- Submits payment form to SSLCommerz gateway

### 5. **SSLCommerz Payment Gateway**
- Secure payment processing (sandbox or live)
- Handles card/payment method processing
- Redirects to success/fail/cancel pages
- Creates order in Supabase database
- Sends email notifications (if configured)

## User Journey

```
Accessories Page
    ↓ [Browse & Add Items]
Cart Drawer
    ↓ [Click "Proceed to Checkout"]
Payment Page
    ↓ [Enter Customer Details]
SSLCommerz Gateway
    ↓ [Complete Payment]
Supabase Database (Order Created)
    ↓ [Email Notification]
Customer Email / Dashboard
```

## Technical Architecture

### Component Hierarchy
```
App
├── CartProvider (global cart state)
├── ThemeProvider
├── LanguageProvider
│   └── Routes
│       ├── AccessoriesPage (local cart state, adds to global cart on checkout)
│       └── PaymentPage (reads from global cart context)
```

### Data Flow
1. **Local → Global Cart**: Accessories adds items to local state, then transfers to global context on checkout
2. **Context Passing**: CartProvider makes cart available to all pages
3. **Form Prefill**: PaymentPage reads context and auto-fills form
4. **Payment Processing**: Form submitted to `/api/payment/initiate` endpoint

## Features

### Accessories Cart
- ✅ Add items with quantity
- ✅ Update quantities in-place
- ✅ Remove items
- ✅ See real-time total
- ✅ Discount calculations
- ✅ Side drawer UI (don't lose browsing context)

### Payment Form
- ✅ Auto-filled with cart data
- ✅ Clear cart summary showing all items
- ✅ Responsive design (full width on mobile, sidebar on desktop)
- ✅ Customer validation
- ✅ Payment processing with loading states
- ✅ Error handling and user feedback

### Order Management
- ✅ Orders saved to Supabase
- ✅ Transaction IDs tracked
- ✅ Order status (pending → paid)
- ✅ Customer information stored
- ✅ Email notifications sent (if configured)

## API Integration

### Endpoint: `/api/payment/initiate`
**Request:**
```json
{
  "total_amount": 5000,
  "cus_name": "John Doe",
  "cus_email": "john@example.com",
  "cus_phone": "01700000000",
  "product_name": "Phone Case (2x), Screen Protector (1x)"
}
```

**Response:**
```json
{
  "url": "https://sandbox.sslcommerz.com/gateways/payment/...",
  "tranId": "txn_1234567890123"
}
```

## Files Modified

1. **`src/contexts/CartContext.tsx`** (NEW)
   - Global cart state management
   - Cart operations (add, remove, update, clear)

2. **`src/pages/AccessoriesPage.tsx`**
   - Added `useNavigate` import
   - Added `useCart` hook import
   - Created `handleCheckout` function
   - Added checkout handler to cart drawer button
   - Transfers local cart to global context

3. **`src/pages/PaymentPage.tsx`**
   - Added `useCart` hook import
   - Auto-fill form from cart data
   - Display order summary sidebar
   - Responsive grid layout

4. **`src/App.tsx`**
   - Added `CartProvider` import
   - Wrapped app with `<CartProvider>`

## Testing the Flow

### Step 1: Test Local
```bash
npm run dev
```

### Step 2: Add to Cart
1. Navigate to `/accessories`
2. Click on products to see details
3. Click "Add to Cart" button
4. Verify items appear in cart drawer
5. Update quantities as needed

### Step 3: Proceed to Checkout
1. Click "Proceed to Checkout" button
2. Verify cart drawer closes
3. Verify you're redirected to `/payment`

### Step 4: Verify Payment Form
1. Check order summary shows correct items
2. Check form fields are auto-filled with correct data
3. Verify total amount matches cart total
4. Enter customer details (if not pre-filled)

### Step 5: Submit Payment
1. Click "Pay Now" button
2. Verify you're redirected to SSLCommerz gateway
3. Complete test payment (sandbox mode)
4. Check Supabase for new order entry

## Environment Variables

Ensure these are set in Vercel:

```env
STORE_ID=<your-store-id>
STORE_PASS=<your-store-password>
IS_LIVE=false  # Use sandbox for testing
SUPABASE_URL=<your-supabase-url>
SUPABASE_KEY=<your-supabase-key>
```

And in `.env.local` for local development:

```env
VITE_PAYMENT_API_URL=https://autospark-one.vercel.app
```

## Production Checklist

- [ ] Test complete flow in staging environment
- [ ] Verify all cart calculations (discounts, quantities, totals)
- [ ] Test with various product combinations
- [ ] Verify email notifications send correctly
- [ ] Test on mobile devices (responsive design)
- [ ] Get live SSLCommerz credentials from merchant
- [ ] Update `IS_LIVE=true` in Vercel
- [ ] Run final payment test with real transaction
- [ ] Deploy to production
- [ ] Monitor order creation in Supabase
- [ ] Check email delivery

## Troubleshooting

### Cart not showing items
- Check CartProvider is wrapping the app in `App.tsx`
- Verify `useCart()` is called in both `AccessoriesPage` and `PaymentPage`
- Check browser console for errors

### Payment form not prefilled
- Ensure cart items are transferred before navigation
- Check `useEffect` in PaymentPage is running
- Verify cart data structure matches expected format

### Order not created in Supabase
- Check network tab for API response
- Verify Supabase credentials in Vercel env vars
- Check RLS policies on orders table
- Review server logs on Vercel

### Redirect to SSLCommerz not working
- Check API response includes `url` field
- Verify SSLCommerz credentials are valid
- Check `window.location.href` assignment is not blocked

## Future Enhancements

1. **Cart Persistence**: Save cart to localStorage for multi-session experience
2. **Cart Sharing**: Share cart via URL for gift requests
3. **Wishlist Integration**: Move wishlist items to cart
4. **Bulk Orders**: Bulk pricing for large quantities
5. **Order History**: Show previous orders in dashboard
6. **Payment Methods**: Additional payment options (bKash, Nagad, etc.)
7. **Coupon Codes**: Apply discount codes at checkout
8. **Analytics**: Track conversion rates and abandoned carts

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review server logs in Vercel
3. Check Supabase database for data
4. Review browser console for errors
5. Contact SSLCommerz support for payment issues
