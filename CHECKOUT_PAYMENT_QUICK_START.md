# 🚀 Checkout → Payment Integration - Quick Start Guide

## ⚡ Quick Test (5 minutes)

### 1. **Start the App**
```bash
npm run dev
```

### 2. **Add Items to Cart**
- Go to `/accessories`
- Click on a product
- View product details
- Click "Add to Cart" (enter quantity)
- Do this 2-3 times with different products

### 3. **Go to Cart**
- Click cart icon or navigate to `/cart`
- Verify all items shown
- Edit quantities if needed
- Click "Proceed to Checkout"

### 4. **Complete Checkout**

**Step 1: Customer Information**
```
First Name: Ahmed
Last Name: Rahman
Email: ahmed@example.com
Phone: 01234567890
```
→ Click "Next"

**Step 2: Delivery Address**
```
Street Address: 123 Main Street
City: Dhaka
Division: Dhaka
Postal Code: 1100
```
→ Click "Next"

**Step 3: Shipping & Payment**
- Select "Inside Dhaka (2-3 days) - ৳100" (or Outside)
- Select "Credit/Debit Card" (or any option)
- Review order summary
→ Click "Next"

**Step 4: Order Review**
- Verify all information
- See subtotal, shipping, and total
→ Click "Proceed to Payment"

### 5. **Payment Page Auto-fills**

You should see:
- ✅ Name: "Ahmed Rahman" (auto-filled)
- ✅ Email: "ahmed@example.com" (auto-filled)
- ✅ Phone: "01234567890" (auto-filled)
- ✅ Product: "Item 1 (2x), Item 2 (1x), ..." (auto-populated)
- ✅ Amount: "৳5150" (auto-calculated with shipping)

### 6. **Submit Payment**
- Click "Pay with SSLCommerz"
- You'll be redirected to SSLCommerz sandbox

### 7. **Complete in SSLCommerz Sandbox**
- You'll see payment options
- Use test credentials from SSLCommerz docs
- Payment should succeed
- Return to app with confirmation

---

## 🎯 What to Verify

### ✅ Checkout Page Works

| Item | Status |
|------|--------|
| 4-step form appears | ✓ |
| Step indicators update | ✓ |
| Form validation works | ✓ |
| Previous/Next buttons work | ✓ |
| Order summary shows correct total | ✓ |
| Shipping cost added (+৳100 or +৳200) | ✓ |
| Button says "Proceed to Payment" | ✓ |

### ✅ Data Transfer Works

| Item | Status |
|------|--------|
| sessionStorage has checkout data | ✓ |
| Payment page receives data | ✓ |
| Name auto-filled | ✓ |
| Email auto-filled | ✓ |
| Phone auto-filled | ✓ |
| Products auto-populated | ✓ |
| Total amount correct | ✓ |

### ✅ Payment Integration Works

| Item | Status |
|------|--------|
| Form submits | ✓ |
| API /api/payment/initiate called | ✓ |
| Gets SSLCommerz URL back | ✓ |
| Redirects to SSLCommerz | ✓ |
| Can complete payment | ✓ |

---

## 🔍 Debug Checklist

### If checkout page doesn't load:
```javascript
// Check in browser console
console.log(window.location.pathname); // Should be /checkout
```

### If data not auto-filled in payment:
```javascript
// Check in browser console
JSON.parse(sessionStorage.getItem('checkoutData'));
// Should show: { customer: {...}, address: {...}, ... }
```

### If payment submission fails:
```javascript
// Check browser network tab
// POST to /api/payment/initiate
// Should return: { "url": "https://sandbox.sslcommerz.com/..." }
```

### If stuck on checkout step:
```javascript
// Check validation errors in page
// All fields marked with red border are required
// Try to proceed to see what's missing
```

---

## 📱 Mobile Testing

### Test on different screen sizes:

```bash
# Desktop (1920px)
✓ 3-column grid for form + summary
✓ Large buttons
✓ Full text labels

# Tablet (768px)
✓ 1-2 column layout
✓ Responsive buttons
✓ Stacked summary

# Mobile (375px)
✓ Single column
✓ Full-width inputs
✓ Touch-friendly buttons
✓ Scrollable form
```

---

## 🌐 Multi-language Test

### Toggle Language in App

**English:**
```
Checkout → Next → Previous → Proceed to Payment
```

**Bengali:**
```
চেকআউট → পরবর্তী → আগেরটা → পেমেন্টে যান
```

All labels, buttons, and messages should translate.

---

## 🔧 Advanced Testing

### Test Form Validation

1. **Try empty First Name**
   - Click Next
   - Should show: "This field is required"
   - Cannot proceed

2. **Try invalid email format**
   - Cart may not have validation yet
   - Payment page validates properly

3. **Try skipping steps**
   - Click on step 3 while on step 1
   - Should not allow (must complete step 1 first)
   - Only completed steps are clickable

### Test Cart Integration

1. **Change cart before checkout**
   - Start checkout
   - Go back to cart (back button)
   - Modify quantities
   - Checkout again
   - Payment page should show updated total

2. **Empty cart during checkout**
   - Not typical scenario
   - Should show "No Items in Cart" message
   - Cannot proceed

### Test Shipping Calculation

1. **Select Dhaka shipping**
   - Total should be: (cartTotal + ৳100)

2. **Select Outside Dhaka**
   - Total should be: (cartTotal + ৳200)

3. **Change in review step**
   - Going back to step 3 should allow re-selection
   - Total updates immediately

---

## 📊 Data Flow Verification

### Step-by-step with browser tools:

**1. On Checkout Page (Step 1)**
```javascript
// In console
// Should see order data being collected
document.querySelector('input[name="firstName"]').value;
// → "Ahmed"
```

**2. After Clicking "Proceed to Payment"**
```javascript
// In console
// Should see sessionStorage populated
sessionStorage.getItem('checkoutData');
// → Full JSON object with customer, address, etc.
```

**3. On Payment Page (auto-load)**
```javascript
// In console
// Should see form auto-filled
document.querySelector('input[name="name"]').value;
// → "Ahmed Rahman"

document.querySelector('input[name="amount"]').value;
// → "5150.00"
```

**4. Network Inspector**
- Click "Pay with SSLCommerz"
- Look in Network tab for POST request
- Should go to: `/api/payment/initiate`
- Request body should have: total_amount, cus_name, cus_email, cus_phone, product_name

---

## 🚨 Common Issues & Solutions

### Issue: "No Items in Cart" on checkout page
**Solution:** 
- Go back to `/accessories`
- Add items to cart
- Then proceed to checkout

### Issue: Form not clearing between tests
**Solution:**
- Form shows data from current cart
- Clear cart or add new items
- Form will update

### Issue: Payment page shows empty form
**Solution:**
- Verify CartContext has items
- Check browser console for errors
- Ensure JSON.parse(sessionStorage.getItem('checkoutData')) works

### Issue: Stuck on same step in checkout
**Solution:**
- Check required fields (red borders)
- Fill all fields completely
- Look for error message below form
- Try clicking Next again

### Issue: Can't click "Proceed to Payment" button
**Solution:**
- Button disabled = still validating form
- Check for error messages
- Fill any missing required fields
- Wait a moment and try again

---

## 🎬 Full Test Scenario

### Real-world Test Path

```
1. Fresh app start
   ↓
2. Browse to /accessories
   ↓
3. Click product → ProductDetailPage
   ↓
4. Change quantity to 2 → Click "Add to Cart"
   ↓
5. Go back to /accessories
   ↓
6. Click another product → ProductDetailPage
   ↓
7. Add 1 item to cart
   ↓
8. Click cart icon → /cart (CartPage)
   ↓
9. Verify items shown (2x Product A, 1x Product B)
   ↓
10. Click "Proceed to Checkout" → /checkout (CheckoutPage)
    ↓
11. Fill Customer Info (Step 1) → Next
    ↓
12. Fill Address (Step 2) → Next
    ↓
13. Select Dhaka shipping (Step 3) → Next
    ↓
14. Review order (Step 4) → "Proceed to Payment"
    ↓
15. Payment page opens → /payment (PaymentPage)
    ↓
16. Verify auto-filled: name, email, phone
    ↓
17. Verify products shown
    ↓
18. Verify total = cartTotal + ৳100
    ↓
19. Click "Pay with SSLCommerz"
    ↓
20. Redirected to SSLCommerz (blue popup or new page)
    ↓
21. Complete test payment (use sandbox credentials)
    ↓
22. Redirected back to success/fail page
    ↓
23. Verify payment processed
```

**Expected Time:** 5-10 minutes depending on SSLCommerz response

---

## ✅ Final Verification Checklist

- [ ] Checkout page loads without errors
- [ ] All 4 steps visible and functional
- [ ] Form validation prevents incomplete submission
- [ ] Order summary shows correct total
- [ ] Shipping selection updates total
- [ ] "Proceed to Payment" button navigates correctly
- [ ] Payment page auto-fills customer info
- [ ] Products auto-populated from cart
- [ ] Total amount correct (includes shipping)
- [ ] Payment form submits to /api/payment/initiate
- [ ] Redirects to SSLCommerz gateway
- [ ] Both languages work (English & Bengali)
- [ ] Mobile layout is responsive
- [ ] No console errors

---

## 📞 Quick Help

**Blank form on Payment page?**
→ Make sure you have items in cart before checkout

**Wrong total on Payment page?**
→ Check shipping was selected in Step 3

**Can't get to Payment page?**
→ Complete all 4 checkout steps, verify no red error messages

**SSLCommerz shows "Invalid Amount"?**
→ Ensure amount is ≥ 1 BDT

---

## 🎉 Success Indicators

You'll know it's working when:

✅ Checkout page shows 4 steps with progress bar  
✅ Form validates and prevents skipping  
✅ Payment page has customer name already filled  
✅ Order total includes shipping cost  
✅ SSLCommerz gateway opens with correct amount  

**Congrats! Integration is working! 🚀**
