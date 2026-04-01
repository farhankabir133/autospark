import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Tag,
  Lock,
} from 'lucide-react';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  
  const isDark = theme === 'dark';
  const [appliedCoupon, setAppliedCoupon] = useState<string>('');
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [shippingCost, setShippingCost] = useState<number>(100);
  const [shippingMethod, setShippingMethod] = useState<'dhaka' | 'outside'>('dhaka');

  // Translations
  const translations = {
    en: {
      cart: 'Shopping Cart',
      emptyCart: 'Your cart is empty',
      emptyCartDesc: 'Add some products to get started',
      continueShop: 'Continue Shopping',
      product: 'Product',
      price: 'Price',
      quantity: 'Quantity',
      total: 'Total',
      remove: 'Remove',
      checkout: 'Proceed to Checkout',
      orderSummary: 'Order Summary',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      discount: 'Discount',
      grandTotal: 'Grand Total',
      dhakaShipping: 'Inside Dhaka (2-3 days)',
      outsideShipping: 'Outside Dhaka (5-7 days)',
      couponCode: 'Coupon Code',
      applyCoupon: 'Apply',
      secureBadge: 'Secure Checkout',
      estimatedDelivery: 'Estimated Delivery',
      freeShipping: 'Free Shipping',
      removeItem: 'Remove Item',
      quantityError: 'Invalid quantity',
    },
    bn: {
      cart: 'শপিং কার্ট',
      emptyCart: 'আপনার কার্ট খালি',
      emptyCartDesc: 'শুরু করতে কিছু পণ্য যোগ করুন',
      continueShop: 'কেনাকাটা চালিয়ে যান',
      product: 'পণ্য',
      price: 'মূল্য',
      quantity: 'পরিমাণ',
      total: 'মোট',
      remove: 'অপসারণ করুন',
      checkout: 'চেকআউট এ এগিয়ে যান',
      orderSummary: 'অর্ডার সারসংক্ষেপ',
      subtotal: 'উপমোট',
      shipping: 'শিপিং',
      discount: 'ছাড়',
      grandTotal: 'গ্র্যান্ড টোটাল',
      dhakaShipping: 'ঢাকার মধ্যে (২-৩ দিন)',
      outsideShipping: 'ঢাকার বাইরে (৫-৭ দিন)',
      couponCode: 'কুপন কোড',
      applyCoupon: 'প্রয়োগ করুন',
      secureBadge: 'নিরাপদ চেকআউট',
      estimatedDelivery: 'আনুমানিক ডেলিভারি',
      freeShipping: 'বিনামূল্যে শিপিং',
      removeItem: 'আইটেম সরান',
      quantityError: 'অবৈধ পরিমাণ',
    },
  };

  const t = (key: keyof typeof translations.en) => {
    return language === 'en' ? translations.en[key] : translations.bn[key];
  };

  // Handle shipping cost change
  useEffect(() => {
    setShippingCost(shippingMethod === 'dhaka' ? 100 : 200);
  }, [shippingMethod]);

  // Calculate discount
  const handleApplyCoupon = (coupon: string) => {
    // Demo coupon codes
    const coupons: { [key: string]: number } = {
      'WELCOME10': 0.10,
      'SAVE15': 0.15,
      'SUMMER20': 0.20,
      'GIFT50': 50,
    };
    
    if (coupons[coupon]) {
      const discountValue = typeof coupons[coupon] === 'number' && coupons[coupon] < 1
        ? cartTotal * coupons[coupon]
        : coupons[coupon];
      setCouponDiscount(discountValue);
      setAppliedCoupon(coupon);
    }
  };

  // Calculate totals
  const subtotal = cartTotal;
  const discount = couponDiscount;
  const shipping = cartItems.length > 0 ? shippingCost : 0;
  const grandTotal = Math.max(0, subtotal - discount + shipping);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      {/* Header */}
      <div className={`sticky top-0 z-40 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center gap-3">
          <ShoppingCart size={28} className="text-blue-500" />
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t('cart')}
            </h1>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in cart
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {cartItems.length === 0 ? (
          // Empty Cart
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl p-12 text-center ${
              isDark ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t('emptyCart')}
            </h2>
            <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('emptyCartDesc')}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/accessories')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-full hover:shadow-lg transition-shadow"
            >
              {t('continueShop')} <ArrowRight size={18} />
            </motion.button>
          </motion.div>
        ) : (
          // Cart Items
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items Section */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`rounded-2xl overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white shadow-lg'}`}
              >
                {/* Table Header */}
                <div className={`hidden md:grid grid-cols-4 gap-4 p-6 font-semibold ${
                  isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                }`}>
                  <div>{t('product')}</div>
                  <div className="text-center">{t('price')}</div>
                  <div className="text-center">{t('quantity')}</div>
                  <div className="text-right">{t('total')}</div>
                </div>

                {/* Cart Items */}
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  <AnimatePresence>
                    {cartItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-4 md:p-6 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}
                      >
                        <div className="grid md:grid-cols-4 gap-4 items-center">
                          {/* Product Info */}
                          <div className="md:col-span-1">
                            <div className="flex gap-4">
                              <img
                                src={item.image || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100'}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-lg bg-gray-200"
                              />
                              <div>
                                <p className={`font-semibold line-clamp-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                  {item.name}
                                </p>
                                <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                  SKU: {item.id.slice(0, 8).toUpperCase()}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="text-center">
                            <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              ৳{item.price.toLocaleString()}
                            </p>
                            <p className={`text-xs md:hidden ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              {t('price')}
                            </p>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex justify-center">
                            <div className={`flex items-center border rounded-lg ${
                              isDark ? 'border-gray-600' : 'border-gray-300'
                            }`}>
                              <motion.button
                                whileHover={{ backgroundColor: isDark ? '#374151' : '#f3f4f6' }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1.5 transition-colors"
                              >
                                <Minus size={16} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                              </motion.button>
                              <span className={`w-12 text-center font-semibold ${isDark ? 'text-white bg-gray-700' : 'text-gray-900 bg-white'}`}>
                                {item.quantity}
                              </span>
                              <motion.button
                                whileHover={{ backgroundColor: isDark ? '#374151' : '#f3f4f6' }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1.5 transition-colors"
                              >
                                <Plus size={16} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                              </motion.button>
                            </div>
                          </div>

                          {/* Total & Remove */}
                          <div className="flex justify-between md:justify-end items-center gap-4">
                            <div className="text-right">
                              <p className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                ৳{(item.price * item.quantity).toLocaleString()}
                              </p>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeFromCart(item.id)}
                              className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
                              title={t('removeItem')}
                            >
                              <Trash2 size={18} />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Clear Cart Button */}
                {cartItems.length > 0 && (
                  <div className={`p-4 md:p-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={clearCart}
                      className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                        isDark
                          ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                          : 'bg-red-50 text-red-600 hover:bg-red-100'
                      }`}
                    >
                      Clear Cart
                    </motion.button>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Order Summary Section */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl p-6 sticky top-24 ${isDark ? 'bg-gray-800' : 'bg-white shadow-lg'}`}
              >
                <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {t('orderSummary')}
                </h3>

                {/* Shipping Method */}
                <div className="mb-6">
                  <p className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('shipping')}
                  </p>
                  <div className="space-y-2">
                    {[
                      { id: 'dhaka', label: t('dhakaShipping'), cost: 100 },
                      { id: 'outside', label: t('outsideShipping'), cost: 200 },
                    ].map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center p-3 rounded-lg cursor-pointer border transition-colors ${
                          shippingMethod === method.id
                            ? isDark ? 'border-blue-500 bg-blue-500/10' : 'border-blue-500 bg-blue-50'
                            : isDark ? 'border-gray-600 hover:border-gray-500' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="shipping"
                          value={method.id}
                          checked={shippingMethod === method.id}
                          onChange={(e) => setShippingMethod(e.target.value as 'dhaka' | 'outside')}
                          className="mr-3"
                        />
                        <div className="flex-1">
                          <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {method.label}
                          </p>
                          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            ৳{method.cost}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Coupon Code */}
                <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <p className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('couponCode')}
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g., WELCOME10"
                      value={appliedCoupon}
                      onChange={(e) => setAppliedCoupon(e.target.value.toUpperCase())}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border ${
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleApplyCoupon(appliedCoupon)}
                      className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Tag size={16} />
                    </motion.button>
                  </div>
                  <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Try: WELCOME10, SAVE15, SUMMER20
                  </p>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{t('subtotal')}</span>
                    <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      ৳{subtotal.toLocaleString()}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>-{t('discount')}</span>
                      <span className="font-semibold">-৳{discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{t('shipping')}</span>
                    <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      ৳{shipping.toLocaleString()}
                    </span>
                  </div>
                  <div className={`pt-3 border-t flex justify-between ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <span className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {t('grandTotal')}
                    </span>
                    <span className="font-bold text-lg bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                      ৳{grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/checkout')}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg transition-shadow flex items-center justify-center gap-2 mb-3"
                >
                  <ShoppingCart size={18} />
                  {t('checkout')}
                </motion.button>

                {/* Secure Badge */}
                <div className={`flex items-center justify-center gap-2 py-3 rounded-lg ${
                  isDark ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <Lock size={16} className="text-green-500" />
                  <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {t('secureBadge')}
                  </span>
                </div>

                {/* Continue Shopping */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/accessories')}
                  className={`w-full py-2.5 mt-3 rounded-lg font-semibold transition-colors ${
                    isDark
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Continue Shopping
                </motion.button>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
