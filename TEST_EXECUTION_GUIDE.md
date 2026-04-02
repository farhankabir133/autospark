# TEST EXECUTION GUIDE - Payment Optimization

**Status**: ✅ TEST READY  
**Date**: April 2, 2026  
**Environment**: Production  

---

## Quick Start Testing

**Total Time**: 20-30 minutes  
**Prerequisites**: 5 minutes  
**Execution**: 15-25 minutes  

---

## Pre-Testing Setup (5 minutes)

### 1. Open Browser DevTools
```
Chrome/Firefox/Edge:
  Press F12 or Ctrl+Shift+I (Windows/Linux)
  Press Cmd+Option+I (Mac)

Go to these tabs:
  ✅ Console (for error messages)
  ✅ Network (for API requests)
  ✅ Sources (optional, for debugging)
```

### 2. Navigate to Your Site
```
https://yourdomain.com
(Replace with your actual domain)
```

### 3. Prepare Test Data
```
Name: Test User
Mobile: 01700000000
District: Dhaka
Thana: Dhanmondi
Address: Test Address
```

---

## Test 1: Complete Purchase Flow (7 minutes)

### Test 1A: Add Item to Cart

**Step 1**: Go to Accessories Page
```
Click: Main menu → Accessories
Or: Go to https://yourdomain.com/accessories
```

**Step 2**: Select Product
```
Click: Any product (e.g., "Belt 1150")
Verify: Product details page loads
```

**Step 3**: Add to Cart
```
Select: Quantity (default 1)
Click: "Add to Cart" button
Verify: 
  ✅ Button shows confirmation
  ✅ Cart icon updates with count
  ✅ No errors in console
```

**Expected**: 
```
✅ Product added to cart
✅ Cart count shows 1
✅ No console errors
```

**Result**: [PASS / FAIL]

---

### Test 1B: Proceed to Checkout

**Step 1**: Open Cart
```
Click: Cart icon (top right)
Verify: Cart drawer/panel opens
```

**Step 2**: Verify Cart Contents
```
Check:
  ✅ Product listed in cart
  ✅ Quantity shows correctly
  ✅ Price displayed
  ✅ Total calculated
  ✅ Checkout button visible
```

**Step 3**: Click Checkout
```
Click: "Checkout" or "Proceed to Checkout" button
Verify: Navigation to payment page
Expected URL: /payment or /checkout
```

**Expected**: 
```
✅ Payment page loads
✅ Form fields visible
✅ Cart items shown on right side
✅ Total amount displayed
```

**Result**: [PASS / FAIL]

---

### Test 1C: Fill Billing Form

**Step 1**: Full Name
```
Click: "Full Name" field
Type: Test User
Verify: Text appears in field
```

**Step 2**: Mobile Number
```
Click: "Mobile Number" field
Type: 01700000000
Verify: 
  ✅ Text appears
  ✅ No validation error
```

**Step 3**: District
```
Click: "District" dropdown
Select: Dhaka
Verify: 
  ✅ "Dhaka" shows selected
  ✅ Thana dropdown becomes enabled
```

**Step 4**: Thana
```
Click: "Thana" dropdown (should be enabled now)
Select: Dhanmondi
Verify: 
  ✅ "Dhanmondi" shows selected
```

**Step 5**: Address
```
Click: "Full Address" field
Type: Test Address
Verify: 
  ✅ Text appears in field
  ✅ All required fields filled
```

**Expected**:
```
✅ All form fields filled
✅ No validation errors
✅ Submit button enabled
```

**Result**: [PASS / FAIL]

---

### Test 1D: Submit Order

**Step 1**: Open Network Tab
```
Click: DevTools → Network tab
Clear: Previous requests (Click trash icon)
Keep: DevTools open and Network tab active
```

**Step 2**: Submit Form
```
Click: "Confirm Order" button
Observe: 
  ✅ Button may show loading state
  ✅ Watch Network tab for requests
```

**Step 3**: Monitor Network Request
```
In Network tab, look for:
  URL: init-ssl-payment
  Method: POST
  Status: Should be 200 or similar
  
Check Response:
  Click: The init-ssl-payment request
  Click: Response tab
  Verify: JSON response includes "GatewayPageURL"
```

**Step 4**: Verify Redirect
```
After request completes:
  ✅ Page should redirect automatically
  ✅ URL should change to sandbox.sslcommerz.com
  ✅ SSLCommerz payment gateway should load
  
Visual verification:
  ✅ Payment method options visible
  ✅ Card, Mobile Banking, Internet Banking options shown
  ✅ Amount displayed at top
```

**Step 5**: Check Console
```
Open: DevTools → Console tab
Verify: No error messages in red
Expected: Console should be clean (no errors)
```

**Expected**:
```
✅ Network request sent to init-ssl-payment
✅ Request returns 200 status
✅ Response contains GatewayPageURL
✅ User auto-redirected to SSLCommerz
✅ Payment gateway loads
✅ No JavaScript errors
```

**Result**: [PASS / FAIL]

---

## Test 2: Form Validation (5 minutes)

### Test 2A: Empty Form Submission

**Setup**: Back on payment page
```
Refresh page if needed: https://yourdomain.com/payment
Verify: Form is empty (all fields blank)
```

**Step 1**: Try to Submit
```
Click: "Confirm Order" button (without filling form)
```

**Expected**:
```
✅ Form does NOT submit
✅ Validation errors appear:
   - "Full name is required"
   - "Must be a valid 11-digit BD number"
   - "District is required"
   - "Thana is required"
   - "Full address is required"
✅ No API request sent (check Network tab)
✅ Errors shown in red
```

**Result**: [PASS / FAIL]

---

### Test 2B: Invalid Phone Number

**Setup**: Fill form except phone
```
Name: Test User
District: Dhaka
Thana: Dhanmondi
Address: Test Address
Mobile: (leave blank or invalid)
```

**Step 1**: Try Invalid Phone
```
Test 1: Type: 123 (too short)
Test 2: Type: 98765432100 (wrong format)
Test 3: Type: abc (not a number)

Try submitting after each
```

**Expected**:
```
✅ Validation error appears:
   "Must be a valid 11-digit BD number"
✅ Form does not submit
✅ Error shows in red near field
✅ Can correct and resubmit
```

**Result**: [PASS / FAIL]

---

## Test 3: Error Handling (5 minutes)

### Test 3A: Network Error

**Setup**: DevTools open, Network tab visible

**Step 1**: Simulate Offline
```
In DevTools Network tab:
  Find: Dropdown that says "No throttling"
  Click: It
  Select: "Offline"
```

**Step 2**: Try to Submit
```
Fill form with valid data:
  Name: Test User
  Mobile: 01700000000
  District: Dhaka
  Thana: Dhanmondi
  Address: Test Address

Click: "Confirm Order"
```

**Expected**:
```
✅ Error message appears:
   "Network error" or "Failed to connect"
✅ User-friendly error, not technical
✅ User can see dismiss button
✅ Can try again
```

**Step 3**: Restore Connection
```
In DevTools Network tab:
  Click: "Offline" dropdown
  Select: "No throttling"
```

**Step 4**: Retry
```
Click: "Confirm Order" again
Expected: Should now work and redirect
```

**Result**: [PASS / FAIL]

---

### Test 3B: API Error Response

**Setup**: Network tab open

**Step 1**: Submit with Invalid Data
```
Try to trigger an API error by using invalid data
(Exact method depends on backend validation)
```

**Step 2**: Observe Error
```
In Network tab:
  Check: init-ssl-payment response
  Look for: error field or failedreason
  
In UI:
  Error message should appear
  Should be user-friendly
  Should explain what went wrong
```

**Expected**:
```
✅ Error message displayed
✅ Message is clear and helpful
✅ User can retry
✅ No technical jargon
✅ No white screen
```

**Result**: [PASS / FAIL]

---

## Test 4: Browser Compatibility (3 minutes)

**Test in**:
- [x] Chrome/Chromium
- [x] Firefox
- [x] Safari (if on Mac)
- [x] Edge (if on Windows)

**For each browser**:
```
1. Open Developer Tools
2. Test: Add to cart
3. Test: Proceed to checkout
4. Test: Fill form
5. Test: Submit

Expected: ✅ Works in all browsers
```

**Result**: [PASS / FAIL]

---

## Test 5: Mobile Responsiveness (3 minutes)

### Test 5A: Mobile Device Simulation

**Setup**: DevTools open
```
Press: F12 (DevTools)
Press: Ctrl+Shift+M (Toggle device toolbar)
Or: Click device icon in DevTools
```

**Select**: Mobile Device
```
iPhone 12 / Pixel 5 / etc.
```

**Test**:
```
1. Navigate: https://yourdomain.com/accessories
2. Add: Item to cart
3. Click: Checkout
4. Fill: Form fields
5. Submit: "Confirm Order"

Verify:
  ✅ Form is readable
  ✅ Buttons are tappable
  ✅ No overflow issues
  ✅ Error messages visible
  ✅ Redirect works
```

**Result**: [PASS / FAIL]

---

## Test Results Summary

### Test Execution

| Test # | Test Name | Status | Issues | Time |
|--------|-----------|--------|--------|------|
| 1 | Complete Purchase | [ ] | | |
| 1A | Add to Cart | [ ] | | |
| 1B | Checkout | [ ] | | |
| 1C | Fill Form | [ ] | | |
| 1D | Submit & Redirect | [ ] | | |
| 2 | Form Validation | [ ] | | |
| 2A | Empty Form | [ ] | | |
| 2B | Invalid Phone | [ ] | | |
| 3 | Error Handling | [ ] | | |
| 3A | Network Error | [ ] | | |
| 3B | API Error | [ ] | | |
| 4 | Browser Compat | [ ] | | |
| 5 | Mobile | [ ] | | |

---

## Testing Checklist

### Critical Path (Must Pass)
- [ ] Add item to cart works
- [ ] Checkout button works
- [ ] Form validation works
- [ ] Form submission works
- [ ] Auto-redirect works
- [ ] No console errors

### Important (Should Pass)
- [ ] Error messages are clear
- [ ] Network errors handled
- [ ] Mobile works
- [ ] Browser compatible

### Nice to Have (Can Pass)
- [ ] Loading states visible
- [ ] Animations smooth
- [ ] UI responsive

---

## Issues Found

### Issue #1
```
Description: [Describe any issues found]
Severity: [Critical / High / Medium / Low]
Steps to Reproduce: [Steps to reproduce]
Expected: [Expected behavior]
Actual: [Actual behavior]
Solution: [Suggested fix]
```

### Issue #2
```
Description: [Describe any issues found]
Severity: [Critical / High / Medium / Low]
Steps to Reproduce: [Steps to reproduce]
Expected: [Expected behavior]
Actual: [Actual behavior]
Solution: [Suggested fix]
```

---

## Final Sign-Off

### Overall Status

**All Tests Passed**: [ ] YES [ ] NO

If NO, critical issues must be fixed before production.

### Quality Score

| Aspect | Score |
|--------|-------|
| Functionality | [ ]/10 |
| User Experience | [ ]/10 |
| Error Handling | [ ]/10 |
| Performance | [ ]/10 |
| Compatibility | [ ]/10 |
| **AVERAGE** | [ ]/10 |

### Recommendation

- [ ] **PASS** - Ready for production
- [ ] **PASS WITH NOTES** - Ready, but monitor issues
- [ ] **FAIL** - Not ready, needs fixes

### Tester Information

```
Name: ___________________
Date: ___________________
Environment: Production
Browser: ___________________
Device: ___________________
```

---

## Troubleshooting During Testing

### Issue: Payment page doesn't load
```
Solution:
1. Hard refresh: Ctrl+Shift+R
2. Clear cache: DevTools → Application → Clear storage
3. Try incognito mode
4. Check URL is correct
```

### Issue: Form won't submit
```
Check:
1. All fields filled?
2. Phone number valid? (01XXXXXXXXX)
3. Console errors? (DevTools → Console)
4. Network errors? (DevTools → Network)
```

### Issue: Doesn't redirect to SSLCommerz
```
Check:
1. Network request successful? (200 status)
2. Response has GatewayPageURL? (Network → Response tab)
3. Browser blocked redirect? (Check console)
4. Popup blocked? (Check browser address bar)
```

### Issue: Strange behavior
```
Steps:
1. Hard refresh the page
2. Clear all browser cache
3. Try in incognito mode
4. Try in different browser
5. Check console for errors
```

---

## Success Criteria

All of the following must be true:

```
✅ Add to cart works
✅ Checkout page loads
✅ Form validates properly
✅ Form submission works
✅ Auto-redirect to SSLCommerz works
✅ No JavaScript errors
✅ Error messages are clear
✅ Works on mobile
✅ Works in multiple browsers
✅ Network requests look correct
```

If all checks pass, testing is **COMPLETE** ✅

---

## Celebrate! 🎉

When testing passes:

✅ **PAYMENT SYSTEM SUCCESSFULLY FIXED**

Customers can now:
- Browse accessories
- Add to cart
- Fill checkout form
- Complete payment

All without seeing raw JSON! 🎉

---

**Testing Guide Complete**

Follow this guide step-by-step. Each test should take 3-5 minutes.

**Total Testing Time: 20-30 minutes**

After testing passes, deployment is confirmed successful!
