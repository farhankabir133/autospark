# Auto Spark eCommerce Implementation Checklist
**Status:** Ready for Development  
**Target Completion:** 8-9 weeks  
**Last Updated:** April 1, 2026

---

## Phase 1: Critical Foundations (Weeks 1-2)
*These 4 features make your site a real eCommerce store*

### ✓ Task 1: Enhanced Product Detail Pages
**Objective:** Replace "Add to Cart" cards with proper product detail pages  
**Files to Create:**
- [ ] `src/pages/ProductDetailPage.tsx`
- [ ] `src/components/ProductImageGallery.tsx`
- [ ] `src/components/ProductSpecifications.tsx`
- [ ] `src/components/RelatedProducts.tsx`

**Database Changes:**
- [ ] Add `detailed_description` field to accessories table
- [ ] Add `specifications` JSON field (e.g., `{"type": "Oil", "viscosity": "10W40"}`)
- [ ] Add `category_id` foreign key
- [ ] Ensure `images` table has proper relationships

**Implementation Checklist:**
- [ ] Create `/product/:id` route in App.tsx
- [ ] Build image gallery with zoom functionality
- [ ] Display product specs in table format
- [ ] Show stock status prominently
- [ ] Add "Related Products" section
- [ ] Include "Add to Wishlist" button
- [ ] Show social sharing buttons
- [ ] Mobile responsive layout
- [ ] Add breadcrumb navigation
- [ ] Link from product cards to detail pages

**Testing:**
- [ ] Click product card → Detail page loads
- [ ] Image gallery zoom works
- [ ] All specs display correctly
- [ ] Mobile layout is responsive
- [ ] Related products load
- [ ] Add to cart from detail page works

**Estimated Time:** 3-4 days

---

### ✓ Task 2: Dedicated Cart Page
**Objective:** Move from drawer-only to full cart page  
**Files to Create:**
- [ ] `src/pages/CartPage.tsx`
- [ ] `src/components/CartItemRow.tsx`
- [ ] `src/components/CartSummary.tsx`

**Implementation Checklist:**
- [ ] Create `/cart` route
- [ ] Display cart items as table/list
- [ ] Quantity increase/decrease buttons
- [ ] Remove item functionality
- [ ] Real-time total recalculation
- [ ] "Continue Shopping" button
- [ ] Coupon code input field (UI only for now)
- [ ] Shipping cost estimation
- [ ] Subtotal, tax, shipping breakdown
- [ ] "Proceed to Checkout" button
- [ ] Empty cart state with suggestions
- [ ] Mobile optimized layout

**New Features:**
- [ ] Implement localStorage persistence
  - Save cart when items updated
  - Load cart on page refresh
  - Clear on checkout completion
- [ ] Add product images to cart items
- [ ] Show original vs. discounted price
- [ ] Highlight low-stock items

**Testing:**
- [ ] Add items to cart → CartPage shows them
- [ ] Increase/decrease quantity → Total updates
- [ ] Remove item → Cart updates
- [ ] Refresh page → Cart persists
- [ ] Empty cart shows empty state
- [ ] Mobile layout is readable

**Estimated Time:** 2-3 days

---

### ✓ Task 3: Comprehensive Checkout Flow
**Objective:** Create one-page checkout with address, delivery, payment selection  
**Files to Create:**
- [ ] `src/pages/CheckoutPage.tsx` (replace PaymentPage use for this)
- [ ] `src/components/CheckoutCustomerInfo.tsx`
- [ ] `src/components/CheckoutDeliveryMethod.tsx`
- [ ] `src/components/CheckoutPaymentMethod.tsx`
- [ ] `src/components/CheckoutOrderReview.tsx`

**Database Changes:**
- [ ] Add `delivery_method` field to orders table
- [ ] Add `shipping_cost` field to orders table
- [ ] Create `delivery_zones` table (inside Dhaka, outside, express)
- [ ] Update order schema to track delivery address

**Implementation Checklist:**
- [ ] Create `/checkout` route
- [ ] Section 1: Customer Information
  - [ ] Name field
  - [ ] Email field
  - [ ] Phone field
  - [ ] "Use saved address" option (if logged in)
  - [ ] Form validation
- [ ] Section 2: Delivery Address
  - [ ] Street address field
  - [ ] City selector (dropdown)
  - [ ] Postal code field
  - [ ] "Save as default" checkbox
  - [ ] Form validation
- [ ] Section 3: Delivery Method
  - [ ] Inside Dhaka (48h, +৳100)
  - [ ] Outside Dhaka (5-7d, +৳200)
  - [ ] Express (24h, +৳350)
  - [ ] Show selected cost dynamically
- [ ] Section 4: Payment Method
  - [ ] Card (Visa/Mastercard) - default
  - [ ] bKash (placeholder for now)
  - [ ] Nagad (placeholder for now)
  - [ ] Rocket (placeholder for now)
  - [ ] Cash on Delivery option
  - [ ] Radio button selection
- [ ] Order Review Section
  - [ ] Display all items from cart
  - [ ] Show quantities and prices
  - [ ] Subtotal calculation
  - [ ] Shipping cost
  - [ ] Tax (if applicable)
  - [ ] Grand total prominently
  - [ ] All-in-one summary
- [ ] "Place Order" button
  - [ ] Validation of all fields
  - [ ] Loading state
  - [ ] Error handling
- [ ] Mobile responsive layout
- [ ] Progress indicator (optional)

**Integration Requirements:**
- [ ] Get cart from CartContext
- [ ] Pre-fill customer info if logged in
- [ ] Submit order to backend
- [ ] Handle success/error responses
- [ ] Redirect to confirmation page

**Testing:**
- [ ] Fill checkout form → All sections valid
- [ ] Select delivery method → Cost updates
- [ ] Select payment method → Option saved
- [ ] Submit order → Validation works
- [ ] Mobile layout readable on small screens
- [ ] Error messages clear

**Estimated Time:** 3-4 days

---

### ✓ Task 4: Inventory Management System
**Objective:** Display stock status and prevent overselling  
**Files to Create:**
- [ ] `src/components/StockStatus.tsx`
- [ ] `src/hooks/useInventory.ts`
- [ ] (Admin) `src/pages/admin/InventoryPage.tsx` (basic version)

**Database Changes:**
- [ ] Update accessories table:
  - [ ] Ensure `stock_quantity` field is accurate
  - [ ] Add `stock_status` computed field (in-stock, low, out-of-stock)
  - [ ] Add `reorder_level` field

**Implementation Checklist:**
- [ ] Display stock status on product cards
  - [ ] ✅ "In Stock" (green) - stock > 5
  - [ ] ⚠️ "Low Stock (2)" (orange) - stock 1-5
  - [ ] ❌ "Out of Stock" (red) - stock = 0
- [ ] Display stock status on detail page
- [ ] Add stock warning in checkout
  - [ ] "Only 3 left in stock!"
- [ ] Validate during cart operations
  - [ ] Can't add more than available
  - [ ] Show error if item becomes unavailable
- [ ] Update stock on checkout (reserve)
  - [ ] Decrease stock quantity when order placed
  - [ ] Release if payment fails
- [ ] Basic admin inventory view
  - [ ] Table showing all products and stock
  - [ ] Edit button to adjust stock
  - [ ] Bulk update option

**Product Card Appearance:**
```
Before:
┌──────────────┐
│ Item         │
│ Price        │
│ + Add to Cart│
└──────────────┘

After:
┌──────────────┐
│ Item         │
│ Price        │
│ ✅ In Stock  │  ← New status
│ + Add to Cart│
└──────────────┘
```

**Testing:**
- [ ] Product with stock shows ✅ In Stock
- [ ] Product with 1-5 items shows ⚠️ Low Stock
- [ ] Out of stock product shows ❌ Out of Stock
- [ ] Can't add more than available
- [ ] Stock updates after order
- [ ] Admin can update stock

**Estimated Time:** 2-3 days

---

## Phase 1 Completion Checklist
- [ ] All 4 features implemented
- [ ] Code compiles without errors
- [ ] No TypeScript errors
- [ ] All tests passing
- [ ] Responsive on mobile and desktop
- [ ] Deployed to staging
- [ ] End-to-end testing completed
- [ ] Team review passed
- [ ] Ready for Phase 2

---

## Phase 2: Market Expansion (Weeks 3-4)
*These features make you competitive and drive conversions*

### ✓ Task 5: Multiple Payment Methods (Critical for BD Market)
**Objective:** Add bKash, Nagad, Rocket alongside card payments  
**Priority:** HIGH - 60% of Bangladesh uses mobile banking

**Implementation Plan:**

#### Option A: Use SSLCommerz (Easiest)
SSLCommerz already supports bKash, Nagad, Rocket
- [ ] Keep existing SSLCommerz integration
- [ ] Update payment form to show all methods
- [ ] SSLCommerz handles the rest

#### Option B: Add Multiple Providers
For flexibility and better rates
- [ ] bKash: Integrate bKash API
- [ ] Nagad: Integrate Nagad API  
- [ ] Rocket: Integrate Rocket API
- [ ] Add COD: Simple order confirmation

**Files to Create:**
- [ ] `src/components/PaymentMethodSelector.tsx`
- [ ] `src/services/paymentService.ts` (routing logic)
- [ ] `src/contexts/PaymentContext.tsx` (payment state)

**Database Changes:**
- [ ] Add `payment_method` field to orders table
- [ ] Add `payment_provider` field (sslcommerz, bkash, nagad, rocket, cod)
- [ ] Create `payment_settings` table for API keys

**Implementation Checklist:**
- [ ] Update checkout to show all payment methods
- [ ] Card payment (keep existing SSLCommerz)
- [ ] bKash payment option
  - [ ] Route through SSLCommerz or direct API
  - [ ] Handle bKash-specific response
  - [ ] Store transaction ID
- [ ] Nagad payment option
  - [ ] Route through SSLCommerz or direct API
  - [ ] Handle Nagad-specific response
  - [ ] Store transaction ID
- [ ] Rocket payment option
  - [ ] Route through SSLCommerz or direct API
  - [ ] Handle Rocket-specific response
  - [ ] Store transaction ID
- [ ] Cash on Delivery (COD)
  - [ ] Simple order confirmation
  - [ ] No payment processing
  - [ ] Mark as "pending payment"
  - [ ] Set reminder for collection
- [ ] Payment method icons/labels
- [ ] Clear instructions for each method
- [ ] Mobile optimized payment selection

**Testing:**
- [ ] All payment methods visible in checkout
- [ ] Card payment works (existing flow)
- [ ] bKash payment redirects correctly
- [ ] Nagad payment redirects correctly
- [ ] Rocket payment redirects correctly
- [ ] COD order creates without payment
- [ ] Mobile layout shows all options

**Estimated Time:** 3-4 days

---

### ✓ Task 6: Customer Account System
**Objective:** Enable user registration, login, and account dashboard  
**Files to Create:**
- [ ] `src/pages/LoginPage.tsx`
- [ ] `src/pages/RegisterPage.tsx`
- [ ] `src/pages/AccountPage.tsx`
- [ ] `src/pages/AccountOrderHistoryPage.tsx`
- [ ] `src/pages/AccountAddressesPage.tsx`
- [ ] `src/contexts/AuthContext.tsx`
- [ ] `src/hooks/useAuth.ts`

**Database Changes:**
- [ ] Create `users` table (id, email, password_hash, phone, created_at)
- [ ] Create `user_addresses` table (id, user_id, type, street, city, postal_code)
- [ ] Add `user_id` foreign key to orders table
- [ ] Update accessories to track user's wishlist

**Implementation Checklist:**

**Registration Page:**
- [ ] Email field with validation
- [ ] Password field (with strength indicator)
- [ ] Confirm password field
- [ ] Phone number field
- [ ] "I agree to terms" checkbox
- [ ] Sign up button
- [ ] Link to login page
- [ ] Form validation with error messages
- [ ] Success message and redirect to dashboard

**Login Page:**
- [ ] Email field
- [ ] Password field
- [ ] "Remember me" checkbox
- [ ] Login button
- [ ] "Forgot password" link
- [ ] Link to registration page
- [ ] Error handling for invalid credentials
- [ ] Session management (localStorage)

**Account Dashboard:**
- [ ] Welcome greeting with user name
- [ ] My Orders section
  - [ ] List recent orders
  - [ ] Order #, date, status, total
  - [ ] Link to order details
- [ ] Saved Addresses section
  - [ ] List saved addresses
  - [ ] Edit/delete buttons
  - [ ] Add new address button
- [ ] Wishlist section
  - [ ] Show saved items
  - [ ] Quick add to cart
  - [ ] Remove from wishlist
- [ ] Account Settings
  - [ ] Change email
  - [ ] Change password
  - [ ] Logout button

**Order History:**
- [ ] List all orders
- [ ] Filter by status
- [ ] Search by order #
- [ ] Click to see details
- [ ] Reorder button

**Address Management:**
- [ ] List all saved addresses
- [ ] Edit address form
- [ ] Delete address
- [ ] Set default address
- [ ] Type selector (Home, Work, Other)

**Auth Context Requirements:**
- [ ] `isLoggedIn` state
- [ ] `currentUser` object
- [ ] `login(email, password)` function
- [ ] `register(email, password, phone)` function
- [ ] `logout()` function
- [ ] Session persistence (localStorage)
- [ ] Redirect to login if not authenticated

**Integration:**
- [ ] Link navbar login button to LoginPage
- [ ] Show user name in navbar when logged in
- [ ] Use user info to pre-fill checkout
- [ ] Save addresses during checkout

**Testing:**
- [ ] Register new user → Account created
- [ ] Login with correct credentials → Logged in
- [ ] Login with wrong credentials → Error message
- [ ] Add address → Saved to database
- [ ] Previous orders visible → Show in history
- [ ] Logout → Redirect to home
- [ ] Pre-fill checkout with saved address when logged in

**Estimated Time:** 4-5 days

---

### ✓ Task 7: Product Filtering System
**Objective:** Enable customers to filter by category, brand, price, availability  
**Files to Create:**
- [ ] `src/components/ProductFilter.tsx`
- [ ] `src/hooks/useProductFilter.ts`
- [ ] `src/types/filter.types.ts`

**Database Changes:**
- [ ] Create `categories` table (id, name_en, name_bn, slug)
- [ ] Update accessories table with `category_id` foreign key
- [ ] Add `brand` field to accessories table
- [ ] Ensure `stock_quantity` is accurate for availability filter

**Implementation Checklist:**
- [ ] Build filter sidebar
  - [ ] Category checkboxes
    - [ ] Engine Parts
    - [ ] Lights & Electrical
    - [ ] Interior
    - [ ] Exterior
    - [ ] Safety
  - [ ] Brand checkboxes
    - [ ] Toyota
    - [ ] Generic
    - [ ] Bosch
    - [ ] Others
  - [ ] Price range slider
    - [ ] Min: ৳100
    - [ ] Max: ৳10,000
  - [ ] Availability checkboxes
    - [ ] In Stock
    - [ ] Low Stock
    - [ ] Out of Stock
- [ ] Filter products by selected criteria
- [ ] Show result count
- [ ] Display active filters as badges
- [ ] "Clear Filters" button
- [ ] Mobile: Collapsible filter panel
- [ ] Sort options
  - [ ] Popular
  - [ ] Price: Low to High
  - [ ] Price: High to Low
  - [ ] Newest
  - [ ] Best Rating (when reviews added)

**Filter Logic:**
```typescript
// Example filter logic
const filtered = products.filter(p => {
  if (selectedCategories.length && !selectedCategories.includes(p.category_id)) return false;
  if (selectedBrands.length && !selectedBrands.includes(p.brand)) return false;
  if (p.price < priceRange.min || p.price > priceRange.max) return false;
  if (filterInStock && p.stock_quantity === 0) return false;
  return true;
});
```

**UI Updates:**
- [ ] Add filter panel to AccessoriesPage
- [ ] Show active filters above products
- [ ] Update URL with filter params (for sharing)
- [ ] Responsive layout (sidebar on desktop, modal on mobile)

**Testing:**
- [ ] Select category → Shows only that category
- [ ] Select price range → Shows products in range
- [ ] Select "In Stock" → Hides out-of-stock items
- [ ] Multiple filters → AND logic (category AND price AND stock)
- [ ] Clear filters → Shows all products
- [ ] Mobile filter panel opens/closes
- [ ] URL changes with filters (shareable link)

**Estimated Time:** 2-3 days

---

### ✓ Task 8: Shipping & Delivery System
**Objective:** Calculate shipping costs based on location and delivery speed  
**Files to Create:**
- [ ] `src/services/shippingService.ts`
- [ ] `src/components/ShippingCalculator.tsx`
- [ ] `src/data/shippingZones.ts`

**Database Changes:**
- [ ] Create `shipping_zones` table
  ```sql
  id | name | area_coverage | delivery_days | cost_bdt | is_active
  1  | Inside Dhaka | All DCC | 2 | 100 | true
  2  | Outside Dhaka | All upazilas | 5 | 200 | true
  3  | Express | Dhaka only | 1 | 350 | true
  ```

**Implementation Checklist:**
- [ ] Define shipping zones
  - [ ] Inside Dhaka: 48 hours, +৳100
  - [ ] Outside Dhaka: 5-7 days, +৳200
  - [ ] Express: 24 hours, +৳350
- [ ] Build shipping calculator
  - [ ] Get delivery address from checkout
  - [ ] Match to zone (Dhaka vs. outside)
  - [ ] Calculate delivery cost
  - [ ] Estimate delivery date
- [ ] Show in checkout
  - [ ] Delivery method selector
  - [ ] Cost for each option
  - [ ] Selected cost in total
- [ ] Show in cart summary
  - [ ] "Shipping will be calculated at checkout"
  - [ ] Or show estimated range
- [ ] Show in order confirmation
  - [ ] Actual delivery cost
  - [ ] Estimated delivery date
- [ ] Tracking integration (basic)
  - [ ] Show estimated delivery date
  - [ ] Update when shipped

**Testing:**
- [ ] Select Inside Dhaka → +৳100
- [ ] Select Outside Dhaka → +৳200
- [ ] Select Express → +৳350
- [ ] Total updates correctly
- [ ] Estimated date calculated
- [ ] Works on mobile

**Estimated Time:** 2-3 days

---

## Phase 2 Completion Checklist
- [ ] Payment methods working (card, bKash, Nagad, Rocket, COD)
- [ ] User registration/login functional
- [ ] Account dashboard with order history
- [ ] Address management working
- [ ] Product filters functional
- [ ] Shipping costs calculating
- [ ] All tests passing
- [ ] End-to-end flow tested
- [ ] Mobile optimized
- [ ] Ready for Phase 3

---

## Phase 3: Polish & Scale (Weeks 5+)
*These features build brand loyalty and operational scale*

### ✓ Task 9: Product Reviews & Ratings
**Objective:** Build social proof with customer reviews  
**Priority:** MEDIUM - Increases conversion by 15-25%

**Files to Create:**
- [ ] `src/pages/ReviewsPage.tsx`
- [ ] `src/components/RatingDisplay.tsx`
- [ ] `src/components/ReviewForm.tsx`
- [ ] `src/components/ReviewList.tsx`

**Database Changes:**
- [ ] Create `reviews` table (id, product_id, user_id, rating, title, text, verified_purchase, created_at)
- [ ] Create `review_photos` table (id, review_id, image_url)

**Implementation:**
- [ ] Display average rating on product page
- [ ] Show rating distribution (5⭐: 98, 4⭐: 24, etc.)
- [ ] List individual reviews with photos
- [ ] Verified purchase badge
- [ ] Helpful/unhelpful voting
- [ ] Review submission form (post-purchase)
- [ ] Admin review moderation

**Estimated Time:** 3-4 days

---

### ✓ Task 10: Order Tracking & Management
**Objective:** Give customers visibility into order status  
**Priority:** MEDIUM - Reduces support inquiries by 30%

**Files to Create:**
- [ ] `src/pages/OrderTrackingPage.tsx`
- [ ] `src/pages/admin/OrderManagementPage.tsx`
- [ ] `src/components/OrderTimeline.tsx`

**Database Changes:**
- [ ] Create `order_status_history` table (id, order_id, status, timestamp, note)
- [ ] Create `deliveries` table (id, order_id, tracking_number, driver_name, driver_phone)

**Implementation:**
- [ ] Order confirmation email with tracking link
- [ ] Tracking page shows status timeline
- [ ] Admin interface to update order status
- [ ] Auto-email customer on status change
- [ ] Estimated delivery date
- [ ] Driver contact info (when shipped)

**Estimated Time:** 2-3 days

---

### ✓ Task 11: Admin Dashboard
**Objective:** Comprehensive admin interface for operations  
**Priority:** HIGH - Required to scale

**Files to Create:**
- [ ] `src/pages/admin/AdminDashboard.tsx`
- [ ] `src/pages/admin/ProductManagementPage.tsx`
- [ ] `src/pages/admin/OrderManagementPage.tsx`
- [ ] `src/pages/admin/InventoryPage.tsx`
- [ ] `src/pages/admin/CustomerManagementPage.tsx`
- [ ] `src/components/admin/StatsCard.tsx`
- [ ] `src/components/admin/DataTable.tsx`

**Database Changes:**
- [ ] Create `admin_users` table (id, email, role, permissions)
- [ ] Add `deleted_at` field to products for soft deletes
- [ ] Create `admin_logs` table for audit trail

**Implementation:**
- [ ] Sales analytics dashboard
- [ ] Product management (CRUD)
- [ ] Order management (view, update status)
- [ ] Inventory management
- [ ] Customer management
- [ ] Payment/refund processing
- [ ] Reports and exports
- [ ] User management (roles)

**Estimated Time:** 5-7 days

---

### ✓ Task 12: Mobile Optimization
**Objective:** Ensure perfect experience on phones (60% of traffic)  
**Priority:** HIGH - Ongoing

**Checklist:**
- [ ] Checkout mobile layout
- [ ] Payment form mobile optimized
- [ ] Cart page mobile responsive
- [ ] Product detail page scrollable
- [ ] Filter panel collapsible
- [ ] Touch targets 44px minimum
- [ ] Font sizes readable
- [ ] Forms easy to fill
- [ ] No horizontal scroll
- [ ] Images optimized for mobile
- [ ] Test on iPhone, Android devices
- [ ] Lighthouse score >90

**Estimated Time:** 3-4 days (ongoing)

---

## Overall Project Timeline

```
Week 1-2: Phase 1 (Product Pages, Cart, Checkout, Inventory)
Week 3-4: Phase 2 (Payments, Auth, Filters, Shipping)
Week 5-6: Phase 3a (Reviews, Order Tracking, Admin)
Week 7-8: Phase 3b (Mobile Optimization, Testing)
Week 9+:  Go-Live & Continuous Improvement
```

---

## Success Criteria

### Minimum Viable eCommerce (After Phase 1)
- ✅ Users can browse products
- ✅ Add to cart
- ✅ Complete checkout with address
- ✅ Pay via card
- ✅ See order confirmation
- ✅ See inventory status

### Competitive eCommerce (After Phase 2)
- ✅ Multiple payment methods (matching market)
- ✅ User accounts with order history
- ✅ Smart filtering for discovery
- ✅ Clear shipping options with costs
- ✅ Mobile optimized
- ✅ Comparable to major BD eCommerce sites

### World-Class eCommerce (After Phase 3)
- ✅ Customer reviews building trust
- ✅ Order tracking reducing support
- ✅ Admin dashboard enabling scale
- ✅ Analytics for optimization
- ✅ Loyalty features
- ✅ Competitive advantage

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Payment API failures | HIGH | Test thoroughly, have fallback (COD) |
| Database schema issues | HIGH | Plan carefully, test migrations |
| Mobile UX problems | HIGH | Test early and often on real devices |
| Performance degradation | MEDIUM | Monitor metrics, optimize queries |
| Scope creep | MEDIUM | Stick to phase priorities |
| Team bandwidth | MEDIUM | Focus on Phase 1 first |

---

## Sign-Off Criteria

After each phase, verify:
- [ ] All features implemented
- [ ] Code reviewed and approved
- [ ] Tests passing (>90% coverage)
- [ ] No critical bugs
- [ ] Responsive on mobile/desktop
- [ ] Performance acceptable
- [ ] Documentation updated
- [ ] Ready for next phase

---

**Document Version:** 1.0  
**Created:** April 1, 2026  
**Status:** Ready for Development  
**Next Review:** End of Phase 1
