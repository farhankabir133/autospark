# Phase 1 Implementation - Quick Reference Guide

## 📍 New Routes Added

| Route | Component | Purpose |
|-------|-----------|---------|
| `/product/:id` | ProductDetailPage.tsx | View detailed product information |
| `/cart` | CartPage.tsx | Manage shopping cart items |
| `/checkout` | CheckoutPage.tsx | Multi-step checkout process |
| `/inventory-management` | InventoryManagementPage.tsx | Manage inventory & stock |

---

## 🔧 Quick Integration Checklist

### For Navigation Links
```tsx
// Navigate to product detail
<Link to={`/product/${product.id}`}>View Details</Link>

// Navigate to cart
<Link to="/cart">Shopping Cart</Link>

// Navigate to checkout
<Link to="/checkout">Proceed to Checkout</Link>

// Navigate to inventory
<Link to="/inventory-management">Manage Inventory</Link>
```

### For useNavigate Hook
```tsx
const navigate = useNavigate();

navigate(`/product/${productId}`);
navigate('/cart');
navigate('/checkout');
navigate('/inventory-management');
```

---

## 📦 Context Usage

### CartContext
```tsx
import { useCart } from '../contexts/CartContext';

const { cartItems, cartTotal, addToCart, removeFromCart, updateQuantity, clearCart } = useCart();
```

### ThemeContext
```tsx
import { useTheme } from '../contexts/ThemeContext';

const { theme, toggleTheme } = useTheme();
const isDark = theme === 'dark';
```

### LanguageContext
```tsx
import { useLanguage } from '../contexts/LanguageContext';

const { language, setLanguage } = useLanguage();
// language is 'en' or 'bn'
```

---

## 🎨 Styling Quick Tips

### Dark Mode Conditional
```tsx
// Use this pattern throughout
className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
```

### Responsive Breakpoints
```tsx
// Mobile first approach
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
//        mobile         tablet          desktop
```

### Animations with Framer Motion
```tsx
import { motion } from 'framer-motion';

<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={handleClick}
>
  Click Me
</motion.button>
```

---

## 💾 File Structure

```
src/
├── pages/
│   ├── ProductDetailPage.tsx          (412 lines) NEW ✨
│   ├── CartPage.tsx                   (380 lines) NEW ✨
│   ├── CheckoutPage.tsx               (670 lines) NEW ✨
│   ├── InventoryManagementPage.tsx    (360 lines) NEW ✨
│   └── [existing pages...]
├── lib/
│   ├── inventoryUtils.ts              (100+ lines) NEW ✨
│   ├── supabase.ts                    (existing)
│   └── [other utils...]
├── contexts/
│   ├── CartContext.tsx                (using for cart ops)
│   ├── ThemeContext.tsx               (using for dark mode)
│   └── LanguageContext.tsx            (using for translations)
└── App.tsx                            (4 routes added)
```

---

## 🚀 Testing Tips

### Test Product Detail Page
1. Go to `/accessories`
2. Click any product card
3. Should navigate to `/product/{id}`
4. Test image zoom, stock status, add to cart

### Test Cart Page
1. Add items from any product page
2. Navigate to `/cart`
3. Test quantity +/-, coupon (WELCOME10), remove item
4. Try different shipping methods

### Test Checkout
1. Have items in cart
2. Go to `/cart` → Click "Proceed to Checkout"
3. Fill in customer info (Step 1) → Next
4. Fill in address (Step 2) → Next
5. Choose shipping & payment (Step 3) → Next
6. Review order (Step 4) → Place Order
7. See success message

### Test Inventory
1. Navigate to `/inventory-management`
2. Use search to find products
3. Filter by stock status
4. Edit stock quantity and save

---

## 📝 Common Customizations

### Change Stock Status Thresholds
Edit `src/lib/inventoryUtils.ts`:
```tsx
export const getStockStatus = (quantity: number): StockInfo => {
  // Change these numbers
  if (quantity <= 0) { ... }
  if (quantity <= 10) { ... }  // Change 10 to desired low stock level
  return { ... }
};
```

### Add/Remove Coupon Codes
Edit `src/pages/CartPage.tsx`:
```tsx
const coupons: { [key: string]: number } = {
  'WELCOME10': 0.10,      // 10% discount
  'SAVE15': 0.15,         // 15% discount
  'SUMMER20': 0.20,       // 20% discount
  'GIFT50': 50,           // ৳50 fixed discount
  // Add more coupons here
};
```

### Add/Remove Payment Methods
Edit `src/pages/CheckoutPage.tsx`:
```tsx
{[
  { id: 'card', label: t('creditCard'), icon: <CreditCard size={18} /> },
  { id: 'bkash', label: t('bkash'), icon: <Zap size={18} /> },
  { id: 'nagad', label: t('nagad'), icon: <DollarSign size={18} /> },
  { id: 'rocket', label: t('rocket'), icon: <Zap size={18} /> },
  { id: 'cod', label: t('cod'), icon: <Truck size={18} /> },
  // Add/remove methods here
].map((method) => (...))}
```

### Modify Shipping Costs
Edit `src/pages/CheckoutPage.tsx`:
```tsx
{[
  { id: 'dhaka', label: t('dhakaShipping'), cost: 100 },   // Change 100
  { id: 'outside', label: t('outsideShipping'), cost: 200 }, // Change 200
].map((method) => (...))}
```

---

## 🔍 Debug Mode

### Check CartContext Items
```tsx
const { cartItems } = useCart();
console.log('Cart Items:', cartItems);
console.log('Cart Total:', cartTotal);
```

### Check Theme
```tsx
const { theme } = useTheme();
console.log('Current Theme:', theme); // 'light' or 'dark'
```

### Check Language
```tsx
const { language } = useLanguage();
console.log('Current Language:', language); // 'en' or 'bn'
```

---

## 🐛 Common Issues & Solutions

### Issue: Product Detail Page not loading
**Solution**: Ensure product ID matches product in database
```tsx
// Check console for product ID
console.log('Product ID:', productId);
```

### Issue: Cart not updating
**Solution**: Make sure using CartContext correctly
```tsx
const { addToCart } = useCart();
addToCart({ id: product.id, name: product.name_en, price: product.price, quantity: 1 });
```

### Issue: Checkout form validation not working
**Solution**: Ensure all required fields are filled with valid data
```tsx
// Valid email format required: xxx@xxx.xxx
// Valid phone format required: minimum 10 digits
```

### Issue: Dark mode not applying
**Solution**: Use `isDark` variable correctly
```tsx
const { theme } = useTheme();
const isDark = theme === 'dark'; // Don't forget this line!
```

### Issue: Language switching not working
**Solution**: Ensure using `t()` function from `useLanguage`
```tsx
const { language } = useLanguage();
const translations = { en: {...}, bn: {...} };
const t = (key) => language === 'en' ? translations.en[key] : translations.bn[key];
```

---

## 📊 Performance Optimizations

### Already Implemented ✅
- Lazy loading of pages with Suspense
- Code splitting via dynamic imports
- Memoization where needed
- Efficient re-renders

### Additional Optimization Tips
1. **Image Optimization**: Consider WebP format for images
2. **Caching**: Enable browser caching for static assets
3. **Database Queries**: Add indexing for frequently searched fields
4. **Bundle Size**: Monitor bundle size in build output

---

## 🔐 Security Considerations

### Form Validation ✅
- Email validation implemented
- Phone number validation implemented
- Required field validation implemented

### XSS Protection
- React's built-in XSS protection via JSX
- No dangerouslySetInnerHTML usage

### CSRF Protection
- Add CSRF tokens when implementing API calls

### Data Validation
- Always validate on backend too
- Don't rely on frontend validation alone

---

## 🌐 Internationalization (i18n)

### Adding New Translations
```tsx
const translations = {
  en: {
    key: 'English translation',
  },
  bn: {
    key: 'বাংলা অনুবাদ',
  },
};

const t = (key) => language === 'en' ? translations.en[key] : translations.bn[key];
```

### Using Translations
```tsx
<h1>{t('checkout')}</h1>      // Shows "Checkout" or "চেকআউট"
<button>{t('placeOrder')}</button> // Shows "Place Order" or "অর্ডার প্লেস করুন"
```

---

## 📱 Mobile Optimization Checklist

- ✅ Responsive layouts (mobile-first)
- ✅ Touch-friendly buttons (min 44x44px)
- ✅ Optimized images
- ✅ Fast page load
- ✅ Readable font sizes
- ✅ Proper spacing on mobile
- ✅ No horizontal scroll
- ✅ Working in portrait/landscape

---

## 🎯 Next Phase Integration Points

### For Payment Integration (Phase 2)
- CheckoutPage already has payment method selector
- Order data structure ready for payment processing
- IPN webhook URL can be added to payment handler

### For User Authentication (Phase 2)
- CartContext should be enhanced with user ID
- Order history can be stored with user reference
- User profile page can fetch saved addresses

### For Email Notifications (Phase 2)
- Order confirmation email: use checkout data
- Order shipment email: add tracking integration
- Promotional emails: use subscriber list

---

## 🔗 Related Files & Dependencies

### Key Dependencies Used
```json
{
  "framer-motion": "^10.x",        // Animations
  "react-router-dom": "^6.x",      // Routing
  "lucide-react": "^0.x",          // Icons
  "@supabase/supabase-js": "^2.x", // Database
  "tailwindcss": "^3.x"            // Styling
}
```

### Import Patterns
```tsx
// Theme & Language
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

// Cart Management
import { useCart } from '../contexts/CartContext';

// Navigation
import { useNavigate } from 'react-router-dom';

// Animations
import { motion, AnimatePresence } from 'framer-motion';

// Icons
import { ShoppingCart, ArrowRight, Check } from 'lucide-react';

// Utilities
import { getStockStatus } from '../lib/inventoryUtils';
```

---

## 📞 Support & Resources

### File Locations for Quick Access
- ProductDetailPage: `src/pages/ProductDetailPage.tsx`
- CartPage: `src/pages/CartPage.tsx`
- CheckoutPage: `src/pages/CheckoutPage.tsx`
- InventoryMgmt: `src/pages/InventoryManagementPage.tsx`
- Inventory Utils: `src/lib/inventoryUtils.ts`
- Main App Routes: `src/App.tsx` (lines 75-92)

### Documentation Links
- Framer Motion: https://www.framer.com/motion/
- React Router: https://reactrouter.com/
- Tailwind CSS: https://tailwindcss.com/
- Lucide Icons: https://lucide.dev/
- Supabase: https://supabase.com/docs

---

**Last Updated**: April 2026  
**Version**: 1.0  
**Status**: Phase 1 Complete ✅
