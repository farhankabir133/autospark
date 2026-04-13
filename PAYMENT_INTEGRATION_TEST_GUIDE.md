# Payment Integration - Quick Testing Guide

**Date**: April 14, 2026  
**Status**: Ready for Testing

---

## Pre-Test Checklist

✅ Code deployed to main branch  
✅ Build successful (no errors)  
✅ Vercel deployment active  
✅ Environment variables configured  
✅ Live SSLCommerz credentials in place  
✅ Payment callback handlers created  

---

## Test Scenario 1: Complete Purchase Flow

### 1. Browse Accessories
```
URL: https://autospark-one.vercel.app/accessories
Action: Click on any accessory
Expected: Product detail shows
```

### 2. Add to Cart
```
Action: Click "Add to Cart" button
Expected: Item added, cart count increases
          Toast notification appears
```

### 3. View Cart
```
Action: Click cart icon in header
Expected: Drawer opens showing:
          - Product name
          - Quantity selector
          - Price
          - Total amount
          - "Proceed to Checkout" button
```

### 4. Fill Payment Form
```
URL: https://autospark-one.vercel.app/payment
Action: Fill form fields:
        - Name: Enter full name
        - Mobile: 01700000000 (valid BD format)
        - District: Select from dropdown
        - Thana: Auto-populated based on district
        - Address: Enter full address
Expected: Form validates real-time
          Button becomes enabled
```

### 5. Submit Payment
```
Action: Click "Confirm Order" button
Expected: Loading spinner appears
          After 2-3 seconds:
          - Redirected to SSLCommerz payment page
          - Can see payment options (card/mobile)
```

### 6. Complete Payment (Test)
```
Note: Use SSLCommerz test mode
Action: Choose payment method
        Complete test transaction
Expected: Get redirected back to success page
```

---

## Test Scenario 2: Error Handling

### Test Missing Fields
```
Action: Leave any field empty
        Click "Confirm Order"
Expected: Error message appears under field
          Form doesn't submit
          Visual feedback (red border)
```

### Test Invalid Mobile Number
```
Action: Enter: "12345678901" (wrong format)
        Click "Confirm Order"
Expected: Error: "Must be a valid 11-digit BD number"
          Form validation prevents submission
```

### Test Empty Cart
```
Action: Click "Proceed to Checkout" with empty cart
Expected: Error: "Your cart is empty..."
          Suggestion to add items first
```

---

## Test Scenario 3: Payment States

### Success Case
```
Action: Complete payment successfully
Expected: 
  - Redirected to /payment/success
  - See "Payment Successful!" message
  - Transaction ID displayed
  - Cart automatically cleared
  - "Continue Shopping" button available
```

### Failure Case
```
Action: Decline payment at gateway
Expected:
  - Redirected to /payment/fail
  - See "Payment Failed" message
  - "Try Again" button available
  - Cart items preserved
```

### Cancellation Case
```
Action: Close/cancel payment at gateway
Expected:
  - Redirected to /payment/cancel
  - See "Payment Cancelled" message
  - "Return to Cart" button available
  - Cart items preserved
```

---

## Test Scenario 4: Multiple Items

### Add Multiple Accessories
```
1. Go to /accessories
2. Add Item A (qty: 1) - 500 BDT
3. Add Item B (qty: 2) - 1000 BDT each
4. Go to cart
Expected:
  - Cart shows 2 items
  - Item A: 500 BDT × 1
  - Item B: 1000 BDT × 2
  - Total: 2500 BDT (correct calculation)
```

### Adjust Quantities
```
1. In cart drawer, change Item B qty to 3
Expected:
  - Total updates to: 500 + 3000 = 3500 BDT
  - No page reload needed
  - Smooth animation
```

### Remove Item
```
1. Click remove icon on Item A
Expected:
  - Item removed instantly
  - Total updates to 3000 BDT
  - Cart count decreases
```

---

## Test Scenario 5: Form Validation

### Test Each Field

#### Name Field
```
Input: "" (empty)
Expected: Error shown

Input: "A" (too short)
Expected: Error shown

Input: "John Doe Smith" (valid)
Expected: No error, field valid
```

#### Mobile Field
```
Input: "01700000000" (valid 11-digit)
Expected: Field valid

Input: "1700000000" (10 digits)
Expected: Error: "Must be a valid 11-digit BD number"

Input: "02700000000" (starts with 02)
Expected: Error: "Must be valid 11-digit BD number"
```

#### District/Thana
```
Action: Select district
Expected: Thana dropdown updates
          Previous thana selection cleared

Action: Change district
Expected: Thana field resets
          New thanas loaded
```

#### Address Field
```
Input: "123" (too short)
Expected: Error: "Full address is required"

Input: "123 Main Street, Dhaka" (valid)
Expected: Field valid
```

---

## Test Scenario 6: Network/Error Conditions

### Test Network Error
```
Action: Disable internet
        Click "Confirm Order"
Expected: Error message
          "Connection error..."
          "Please check your internet..."
```

### Test Invalid Response
```
Action: (Manual) Monitor network tab
Expected: POST to /api/payment/init
          Response status: 200
          Response body contains GatewayPageURL
```

---

## Expected API Calls

```
1. Payment Form Submit
   POST /api/payment/init
   Body: { cart, total_amount, customer_name, mobile, address, ... }
   Response: { status: 'SUCCESS', GatewayPageURL: '...' }

2. SSLCommerz Redirect
   Redirect to: https://securepay.sslcommerz.com/gwprocess/v4/gw.php?...

3. Payment Completion
   GET /api/payment/success?tran_id=...&val_id=...
   OR
   GET /api/payment/fail?tran_id=...&error=...
   OR
   GET /api/payment/cancel?tran_id=...

4. Browser Redirect
   Final page: /payment/success or /payment/fail or /payment/cancel
```

---

## Browser DevTools Checklist

### Network Tab
- [ ] POST /api/payment/init - 200 OK
- [ ] Response contains GatewayPageURL
- [ ] Redirect to SSLCommerz gateway works
- [ ] Callback redirects back to success/fail page

### Console Tab
- [ ] No JavaScript errors
- [ ] No 404 errors for resources
- [ ] Payment error messages logged

### Application Tab
- [ ] Cart items in CartContext
- [ ] Session storage cleaned after success
- [ ] No sensitive data exposed

---

## Performance Targets

```
Form Load: < 500ms
Form Submission: < 1500ms
SSLCommerz Redirect: Immediate
Success Page Load: < 1000ms
```

---

## Known Test Data

### Test Mobile Numbers (Valid Format)
```
01700000000
01712345678
01900000000
01611111111
```

### Test Districts
```
Dhaka, Chittagong, Khulna, Rajshahi,
Barisal, Sylhet, Rangpur, Mymensingh
```

---

## Troubleshooting During Test

### Issue: "Cannot GET /api/payment/init"

**Cause**: Vercel function not deployed

**Fix**:
1. Check `api/payment/init.ts` exists
2. Verify file syntax
3. Rebuild and redeploy
4. Check Vercel function logs

### Issue: "GatewayPageURL missing in response"

**Cause**: SSLCommerz response error

**Fix**:
1. Check store ID and password in .env
2. Verify live endpoint URL
3. Check SSLCommerz merchant account status

### Issue: "Payment page not accessible"

**Cause**: Route not configured

**Fix**:
1. Check `/src/App.tsx` has payment route
2. Verify PaymentPage.tsx exists
3. Check router configuration

---

## Success Criteria

### All Tests Pass When:

✅ Can add items to cart  
✅ Can fill payment form without errors  
✅ Form validates correctly  
✅ Redirects to SSLCommerz gateway  
✅ Can complete payment  
✅ Success page shows transaction ID  
✅ Cart is cleared after success  
✅ Fail/cancel pages work correctly  
✅ Error messages display properly  
✅ Network requests show in DevTools  

---

## Next Steps After Testing

1. **If Tests Pass**:
   - [ ] Document test results
   - [ ] Verify with stakeholders
   - [ ] Plan Phase 2 features

2. **If Tests Fail**:
   - [ ] Check error logs in Vercel
   - [ ] Verify environment variables
   - [ ] Review API response
   - [ ] Contact SSLCommerz support if needed

---

## Quick Commands

### Check Deployment
```bash
curl https://autospark-one.vercel.app
# Should return 200 OK
```

### Check Payment API
```bash
curl -X POST https://autospark-one.vercel.app/api/payment/init \
  -H "Content-Type: application/json" \
  -d '{
    "cart": [{"id": "1", "name": "Item", "price": 1000}],
    "total_amount": 1000,
    "customer_name": "Test User",
    "mobile": "01700000000",
    "address": "Test Address",
    "thana": "Dhaka",
    "district": "Dhaka"
  }'
```

### View Vercel Logs
```bash
vercel logs --prod
```

---

**Ready to Start Testing! 🚀**

Good luck with your payment integration!
