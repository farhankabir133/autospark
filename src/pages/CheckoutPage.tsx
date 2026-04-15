import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { initiatePayment } from '../services/handlePayment';
import {
  ChevronRight,
  Check,
  User,
  MapPin,
  Truck,
  CreditCard,
  AlertCircle,
  ArrowLeft,
  Zap,
  DollarSign,
} from 'lucide-react';

interface OrderData {
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  address: {
    street: string;
    city: string;
    division: string;
    postalCode: string;
  };
  shipping: 'dhaka' | 'outside';
  payment: 'card' | 'bkash' | 'nagad' | 'rocket' | 'cod';
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { cartItems, cartTotal } = useCart();
  
  const isDark = theme === 'dark';
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [orderData, setOrderData] = useState<OrderData>({
    customer: { firstName: '', lastName: '', email: '', phone: '' },
    address: { street: '', city: '', division: '', postalCode: '' },
    shipping: 'dhaka',
    payment: 'cod',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const translations = {
    en: {
      checkout: 'Checkout',
      step: 'Step',
      of: 'of',
      customerInfo: 'Customer Information',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email Address',
      phone: 'Phone Number',
      deliveryAddress: 'Delivery Address',
      street: 'Street Address',
      city: 'City',
      division: 'Division/State',
      postalCode: 'Postal Code',
      shippingMethod: 'Shipping Method',
      paymentMethod: 'Payment Method',
      dhakaShipping: 'Inside Dhaka (2-3 days) - ৳100',
      outsideShipping: 'Outside Dhaka (5-7 days) - ৳200',
      creditCard: 'Credit/Debit Card',
      bkash: 'bKash',
      nagad: 'Nagad',
      rocket: 'Rocket',
      cod: 'Cash on Delivery',
      orderReview: 'Order Review',
      placeOrder: 'Place Order',
      next: 'Next',
      previous: 'Previous',
      backToCart: 'Back to Cart',
      orderPlaced: 'Order Placed Successfully!',
      orderNumber: 'Order Number',
      thankYou: 'Thank you for your purchase!',
      trackOrder: 'Track Order',
      continueShopping: 'Continue Shopping',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      total: 'Total',
      requiredField: 'This field is required',
      invalidEmail: 'Invalid email address',
      invalidPhone: 'Invalid phone number',
      proceedingPayment: 'Processing your order...',
      proceedToPayment: 'Proceed to Payment',
    },
    bn: {
      checkout: 'চেকআউট',
      step: 'ধাপ',
      of: 'এর',
      customerInfo: 'গ্রাহক তথ্য',
      firstName: 'প্রথম নাম',
      lastName: 'শেষ নাম',
      email: 'ইমেইল ঠিকানা',
      phone: 'ফোন নম্বর',
      deliveryAddress: 'ডেলিভারি ঠিকানা',
      street: 'রাস্তার ঠিকানা',
      city: 'শহর',
      division: 'বিভাগ/অঞ্চল',
      postalCode: 'ডাক কোড',
      shippingMethod: 'ডেলিভারি পদ্ধতি',
      paymentMethod: 'পেমেন্ট পদ্ধতি',
      dhakaShipping: 'ঢাকার মধ্যে (২-৩ দিন) - ৳100',
      outsideShipping: 'ঢাকার বাইরে (৫-৭ দিন) - ৳200',
      creditCard: 'ক্রেডিট/ডেবিট কার্ড',
      bkash: 'বিকাশ',
      nagad: 'নগদ',
      rocket: 'রকেট',
      cod: 'ক্যাশ অন ডেলিভারি',
      orderReview: 'অর্ডার পর্যালোচনা',
      placeOrder: 'অর্ডার প্লেস করুন',
      next: 'পরবর্তী',
      previous: 'আগেরটা',
      backToCart: 'কার্টে ফিরুন',
      orderPlaced: 'অর্ডার সফলভাবে প্লেস করা হয়েছে!',
      orderNumber: 'অর্ডার নম্বর',
      thankYou: 'আপনার ক্রয়ের জন্য ধন্যবাদ!',
      trackOrder: 'অর্ডার ট্র্যাক করুন',
      continueShopping: 'কেনাকাটা চালিয়ে যান',
      subtotal: 'উপমোট',
      shipping: 'শিপিং',
      total: 'মোট',
      requiredField: 'এই ক্ষেত্রটি প্রয়োজনীয়',
      invalidEmail: 'অবৈধ ইমেল ঠিকানা',
      invalidPhone: 'অবৈধ ফোন নম্বর',
      proceedingPayment: 'আপনার অর্ডার প্রক্রিয়া করা হচ্ছে...',
      proceedToPayment: 'পেমেন্টে যান',
    },
  };

  const t = (key: keyof typeof translations.en) => {
    return language === 'en' ? translations.en[key] : translations.bn[key];
  };

  // Validate step 1
  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};
    const { firstName, lastName, email, phone } = orderData.customer;

    if (!firstName.trim()) newErrors.firstName = t('requiredField');
    if (!lastName.trim()) newErrors.lastName = t('requiredField');
    if (!email.trim()) newErrors.email = t('requiredField');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = t('invalidEmail');
    if (!phone.trim()) newErrors.phone = t('requiredField');
    else if (!/^\+?[\d\s()-]{10,}$/.test(phone.replace(/\s/g, ''))) newErrors.phone = t('invalidPhone');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate step 2
  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};
    const { street, city, division, postalCode } = orderData.address;

    if (!street.trim()) newErrors.street = t('requiredField');
    if (!city.trim()) newErrors.city = t('requiredField');
    if (!division.trim()) newErrors.division = t('requiredField');
    if (!postalCode.trim()) newErrors.postalCode = t('requiredField');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
      setErrors({});
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
      setErrors({});
    } else if (currentStep === 3) {
      setCurrentStep(4);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
      setErrors({});
    }
  };

  const handlePlaceOrder = async () => {
    // Validate all required fields
    const newErrors: Record<string, string> = {};
    
    if (!orderData.customer.firstName) newErrors.firstName = t('requiredField');
    if (!orderData.customer.lastName) newErrors.lastName = t('requiredField');
    if (!orderData.customer.email) newErrors.email = t('requiredField');
    if (!orderData.customer.phone) newErrors.phone = t('requiredField');
    if (!orderData.address.street) newErrors.street = t('requiredField');
    if (!orderData.address.city) newErrors.city = t('requiredField');
    if (!orderData.address.division) newErrors.division = t('requiredField');
    if (!orderData.address.postalCode) newErrors.postalCode = t('requiredField');
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const normalizedCart = cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      const shippingCost = orderData.shipping === 'dhaka' ? 100 : 200;
      const finalTotal = cartTotal + shippingCost;

      await initiatePayment({
        name: `${orderData.customer.firstName} ${orderData.customer.lastName}`.trim(),
        phone: orderData.customer.phone,
        address: orderData.address.street,
        thana: orderData.address.city,
        district: orderData.address.division,
        total: finalTotal,
        items: normalizedCart,
      });
    } catch (error) {
      console.error('Error proceeding to payment:', error);
      setErrors({ general: 'Failed to proceed to payment. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-12 text-center ${isDark ? 'bg-gray-800' : 'bg-white'}`}
        >
          <AlertCircle size={64} className="mx-auto text-orange-500 mb-4" />
          <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            No Items in Cart
          </h2>
          <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Please add items to your cart before proceeding to checkout
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/accessories')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-full hover:shadow-lg transition-shadow"
          >
            <ArrowLeft size={18} /> Back to Shopping
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const shippingCost = orderData.shipping === 'dhaka' ? 100 : 200;
  const total = cartTotal + shippingCost;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      {/* Header */}
      <div className={`sticky top-0 z-40 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t('checkout')}
          </h1>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('step')} {currentStep} {t('of')} 4
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Progress Bar */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((step) => (
              <React.Fragment key={step}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => step < currentStep && setCurrentStep(step as 1 | 2 | 3 | 4)}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full text-sm sm:text-base font-bold transition-all ${
                    step < currentStep
                      ? 'bg-green-500 text-white'
                      : step === currentStep
                      ? 'bg-blue-500 text-white'
                      : isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step < currentStep ? <Check size={20} /> : step}
                </motion.button>
                {step < 4 && (
                  <div
                    className={`flex-1 h-1 mx-1 sm:mx-2 ${
                      step < currentStep
                        ? 'bg-green-500'
                        : isDark ? 'bg-gray-700' : 'bg-gray-200'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
          <p className={`md:hidden text-center text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('step')} {currentStep} {t('of')} 4
          </p>
          <div className="hidden md:flex justify-between text-sm gap-3">
            <span className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t('customerInfo')}</span>
            <span className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t('deliveryAddress')}</span>
            <span className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t('shippingMethod')}</span>
            <span className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t('orderReview')}</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Customer Info */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`rounded-2xl p-5 sm:p-8 ${isDark ? 'bg-gray-800' : 'bg-white shadow-lg'}`}
                >
                  <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    <User size={24} /> {t('customerInfo')}
                  </h3>
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {t('firstName')}
                        </label>
                        <input
                          type="text"
                          value={orderData.customer.firstName}
                          onChange={(e) => setOrderData({
                            ...orderData,
                            customer: { ...orderData.customer, firstName: e.target.value }
                          })}
                          className={`w-full px-4 py-2 rounded-lg border font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            isDark
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                          } ${errors.firstName ? 'border-red-500' : ''}`}
                          placeholder="John"
                        />
                        {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {t('lastName')}
                        </label>
                        <input
                          type="text"
                          value={orderData.customer.lastName}
                          onChange={(e) => setOrderData({
                            ...orderData,
                            customer: { ...orderData.customer, lastName: e.target.value }
                          })}
                          className={`w-full px-4 py-2 rounded-lg border font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            isDark
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                          } ${errors.lastName ? 'border-red-500' : ''}`}
                          placeholder="Doe"
                        />
                        {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {t('email')}
                      </label>
                      <input
                        type="email"
                        value={orderData.customer.email}
                        onChange={(e) => setOrderData({
                          ...orderData,
                          customer: { ...orderData.customer, email: e.target.value }
                        })}
                        className={`w-full px-4 py-2 rounded-lg border font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isDark
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                        } ${errors.email ? 'border-red-500' : ''}`}
                        placeholder="john@example.com"
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {t('phone')}
                      </label>
                      <input
                        type="tel"
                        value={orderData.customer.phone}
                        onChange={(e) => setOrderData({
                          ...orderData,
                          customer: { ...orderData.customer, phone: e.target.value }
                        })}
                        className={`w-full px-4 py-2 rounded-lg border font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isDark
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                        } ${errors.phone ? 'border-red-500' : ''}`}
                        placeholder="+880 1234567890"
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Delivery Address */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`rounded-2xl p-5 sm:p-8 ${isDark ? 'bg-gray-800' : 'bg-white shadow-lg'}`}
                >
                  <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    <MapPin size={24} /> {t('deliveryAddress')}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {t('street')}
                      </label>
                      <input
                        type="text"
                        value={orderData.address.street}
                        onChange={(e) => setOrderData({
                          ...orderData,
                          address: { ...orderData.address, street: e.target.value }
                        })}
                        className={`w-full px-4 py-2 rounded-lg border font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isDark
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                        } ${errors.street ? 'border-red-500' : ''}`}
                        placeholder="123 Main Street"
                      />
                      {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {t('city')}
                        </label>
                        <input
                          type="text"
                          value={orderData.address.city}
                          onChange={(e) => setOrderData({
                            ...orderData,
                            address: { ...orderData.address, city: e.target.value }
                          })}
                          className={`w-full px-4 py-2 rounded-lg border font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            isDark
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                          } ${errors.city ? 'border-red-500' : ''}`}
                          placeholder="Dhaka"
                        />
                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {t('division')}
                        </label>
                        <select
                          value={orderData.address.division}
                          onChange={(e) => setOrderData({
                            ...orderData,
                            address: { ...orderData.address, division: e.target.value }
                          })}
                          className={`w-full px-4 py-2 rounded-lg border font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            isDark
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          } ${errors.division ? 'border-red-500' : ''}`}
                        >
                          <option value="">Select Division</option>
                          <option value="dhaka">Dhaka</option>
                          <option value="chittagong">Chittagong</option>
                          <option value="sylhet">Sylhet</option>
                          <option value="rajshahi">Rajshahi</option>
                          <option value="khulna">Khulna</option>
                          <option value="barisal">Barisal</option>
                          <option value="rangpur">Rangpur</option>
                        </select>
                        {errors.division && <p className="text-red-500 text-xs mt-1">{errors.division}</p>}
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {t('postalCode')}
                      </label>
                      <input
                        type="text"
                        value={orderData.address.postalCode}
                        onChange={(e) => setOrderData({
                          ...orderData,
                          address: { ...orderData.address, postalCode: e.target.value }
                        })}
                        className={`w-full px-4 py-2 rounded-lg border font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isDark
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                        } ${errors.postalCode ? 'border-red-500' : ''}`}
                        placeholder="1212"
                      />
                      {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Shipping & Payment */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`rounded-2xl p-5 sm:p-8 ${isDark ? 'bg-gray-800' : 'bg-white shadow-lg'}`}
                >
                  <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    <Truck size={24} /> {t('shippingMethod')}
                  </h3>
                  <div className="space-y-3 mb-8">
                    {[
                      { id: 'dhaka', label: t('dhakaShipping') },
                      { id: 'outside', label: t('outsideShipping') },
                    ].map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center p-4 rounded-lg cursor-pointer border transition-colors ${
                          orderData.shipping === method.id
                            ? isDark ? 'border-blue-500 bg-blue-500/10' : 'border-blue-500 bg-blue-50'
                            : isDark ? 'border-gray-600 hover:border-gray-500' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="shipping"
                          value={method.id}
                          checked={orderData.shipping === method.id}
                          onChange={(e) => setOrderData({
                            ...orderData,
                            shipping: e.target.value as 'dhaka' | 'outside'
                          })}
                          className="mr-3"
                        />
                        <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {method.label}
                        </span>
                      </label>
                    ))}
                  </div>

                  <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    <CreditCard size={24} /> {t('paymentMethod')}
                  </h3>
                  <div className="space-y-3">
                    {[
                      { id: 'card', label: t('creditCard'), icon: <CreditCard size={18} /> },
                      { id: 'bkash', label: t('bkash'), icon: <Zap size={18} /> },
                      { id: 'nagad', label: t('nagad'), icon: <DollarSign size={18} /> },
                      { id: 'rocket', label: t('rocket'), icon: <Zap size={18} /> },
                      { id: 'cod', label: t('cod'), icon: <Truck size={18} /> },
                    ].map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center p-4 rounded-lg cursor-pointer border transition-colors ${
                          orderData.payment === method.id
                            ? isDark ? 'border-blue-500 bg-blue-500/10' : 'border-blue-500 bg-blue-50'
                            : isDark ? 'border-gray-600 hover:border-gray-500' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={orderData.payment === method.id}
                          onChange={(e) => setOrderData({
                            ...orderData,
                            payment: e.target.value as any
                          })}
                          className="mr-3"
                        />
                        <span className="text-blue-500 mr-2">{method.icon}</span>
                        <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {method.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 4: Review Order */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`rounded-2xl p-5 sm:p-8 space-y-6 ${isDark ? 'bg-gray-800' : 'bg-white shadow-lg'}`}
                >
                  <div>
                    <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {t('customerInfo')}
                    </h3>
                    <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                        {orderData.customer.firstName} {orderData.customer.lastName}
                      </p>
                      <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>{orderData.customer.email}</p>
                      <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>{orderData.customer.phone}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {t('deliveryAddress')}
                    </h3>
                    <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>{orderData.address.street}</p>
                      <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                        {orderData.address.city}, {orderData.address.division} {orderData.address.postalCode}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {t('shippingMethod')}
                    </h3>
                    <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                        {orderData.shipping === 'dhaka' ? t('dhakaShipping') : t('outsideShipping')}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {t('paymentMethod')}
                    </h3>
                    <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                        {orderData.payment === 'card'
                          ? t('creditCard')
                          : orderData.payment === 'bkash'
                          ? t('bkash')
                          : orderData.payment === 'nagad'
                          ? t('nagad')
                          : orderData.payment === 'rocket'
                          ? t('rocket')
                          : t('cod')}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8">
              {currentStep > 1 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePrevious}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                    isDark
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  }`}
                >
                  <ArrowLeft size={18} /> {t('previous')}
                </motion.button>
              )}
              {currentStep < 4 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
                >
                  {t('next')} <ChevronRight size={18} />
                </motion.button>
              )}
              {currentStep === 4 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {t('proceedingPayment')}
                    </>
                  ) : (
                    <>
                      <Check size={18} /> {t('proceedToPayment')}
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="order-first lg:order-none">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl p-5 sm:p-6 lg:sticky lg:top-24 ${isDark ? 'bg-gray-800' : 'bg-white shadow-lg'}`}
            >
              <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {t('orderReview')}
              </h3>

              {/* Items */}
              <div className={`mb-6 pb-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                        {item.name} x {item.quantity}
                      </span>
                      <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{t('subtotal')}</span>
                  <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    ৳{cartTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{t('shipping')}</span>
                  <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    ৳{shippingCost.toLocaleString()}
                  </span>
                </div>
                <div className={`pt-3 border-t flex justify-between ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('total')}</span>
                  <span className="font-bold text-lg bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                    ৳{total.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
