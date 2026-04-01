'use client';

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { ShoppingCart } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  product: string;
  amount: string;
}

export default function PaymentPage() {
  const { cartItems, cartTotal } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    product: '',
    amount: '',
  });

  // Initialize form with cart data if available
  useEffect(() => {
    let nameToUse = formData.name;
    let emailToUse = formData.email;
    let phoneToUse = formData.phone;

    // Check if we have checkout data from CheckoutPage
    const checkoutDataStr = sessionStorage.getItem('checkoutData');
    if (checkoutDataStr) {
      try {
        const checkoutData = JSON.parse(checkoutDataStr);
        nameToUse = `${checkoutData.customer.firstName} ${checkoutData.customer.lastName}`;
        emailToUse = checkoutData.customer.email;
        phoneToUse = checkoutData.customer.phone;
        // Clear the checkout data after using it
        sessionStorage.removeItem('checkoutData');
      } catch (e) {
        console.error('Error parsing checkout data:', e);
      }
    }

    if (cartItems.length > 0) {
      const productNames = cartItems.map(item => `${item.name} (${item.quantity}x)`).join(', ');
      setFormData(prev => ({
        ...prev,
        name: nameToUse,
        email: emailToUse,
        phone: phoneToUse,
        product: productNames,
        amount: cartTotal.toFixed(2),
      }));
    }
  }, [cartItems, cartTotal]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate form data
      if (!formData.name || !formData.email || !formData.phone || !formData.product || !formData.amount) {
        throw new Error('All fields are required');
      }

      if (parseFloat(formData.amount) < 1) {
        throw new Error('Amount must be at least 1 BDT');
      }

      // Call local proxy which forwards to DigitalOcean Payment API
      const response = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          total_amount: parseFloat(formData.amount),
          cus_name: formData.name,
          cus_email: formData.email,
          cus_phone: formData.phone,
          product_name: formData.product,
        }),
      });

      const result = await response.json();
      console.log('Payment response:', result);

      if (!response.ok) {
        throw new Error(result.error || `API error: ${response.status}`);
      }

      if (result.url) {
        // Redirect to SSLCommerz gateway
        console.log('Redirecting to SSLCommerz:', result.url);
        window.location.href = result.url;
      } else if (result.error) {
        throw new Error(result.error);
      } else {
        throw new Error('Payment initiation failed: no URL returned');
      }
    } catch (err) {
      console.error('Payment error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error processing payment';
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cart Summary (Left side for md and above) */}
          {cartItems.length > 0 && (
            <div className="md:col-span-1 md:order-1 order-2">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
                  <ShoppingCart size={20} /> Order Summary
                </h2>
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm pb-2 border-b">
                      <div>
                        <p className="font-medium text-gray-700">{item.name}</p>
                        <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-800">৳{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">Total:</span>
                    <span className="text-2xl font-bold text-blue-600">৳{cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Form (Right side) */}
          <div className={`${cartItems.length > 0 ? 'md:col-span-2 order-1' : 'col-span-1'} md:order-2`}>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">💳 Make Payment</h1>
              <p className="text-center text-gray-600 mb-6">Secure payment powered by SSLCommerz</p>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded animate-pulse">
            <p className="font-semibold">❌ Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            <p className="font-semibold">✅ Success</p>
            <p className="text-sm">Redirecting to payment gateway...</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block font-semibold mb-2 text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-semibold mb-2 text-gray-700">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="john@example.com"
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="phone" className="block font-semibold mb-2 text-gray-700">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="01700000000"
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="product" className="block font-semibold mb-2 text-gray-700">
              Product/Service <span className="text-red-500">*</span>
            </label>
            <input
              id="product"
              type="text"
              name="product"
              value={formData.product}
              onChange={handleChange}
              required
              placeholder="Car Maintenance Package"
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="amount" className="block font-semibold mb-2 text-gray-700">
              Amount (BDT) <span className="text-red-500">*</span>
            </label>
            <input
              id="amount"
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              min="1"
              required
              placeholder="1000"
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full font-bold py-3 rounded transition duration-200 ${
              loading
                ? 'bg-gray-400 cursor-not-allowed text-gray-700'
                : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span> Processing...
              </span>
            ) : (
              '💳 Pay Now'
            )}
          </button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-4">
          🔒 Secure payment gateway. Your data is encrypted.
        </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
