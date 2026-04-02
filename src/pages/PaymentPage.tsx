'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { bdDistricts, bdThanas } from '../data/bd-locations';
import { useCart } from '../contexts/CartContext';
import { PAYMENT_GATEWAY_URLS, getSupabaseAuthHeader } from '../config/payment';

const phoneRegex = new RegExp(/^01[3-9]\d{8}$/);

const billingSchema = z.object({
  customer_name: z.string().min(2, { message: 'Full name is required' }),
  mobile: z.string().regex(phoneRegex, { message: 'Must be a valid 11-digit BD number' }),
  district: z.string().min(1, { message: 'District is required' }),
  thana: z.string().min(1, { message: 'Thana is required' }),
  address: z.string().min(5, { message: 'Full address is required' }),
});

type BillingFormInputs = z.infer<typeof billingSchema>;

const OnePageCheckout = () => {
  const { cartItems, cartTotal } = useCart();
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [thanas, setThanas] = useState<{ id: string; name: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    resetField,
    formState: { errors },
  } = useForm<BillingFormInputs>({
    resolver: zodResolver(billingSchema),
    defaultValues: {
      customer_name: '',
      mobile: '',
      district: '',
      thana: '',
      address: '',
    },
  });

  const districtValue = watch('district');

  useEffect(() => {
    if (districtValue) {
      setSelectedDistrict(districtValue);
      setThanas(bdThanas[districtValue] || []);
      resetField('thana');
    } else {
      setSelectedDistrict('');
      setThanas([]);
    }
  }, [districtValue, resetField]);

  const onSubmit = async (data: BillingFormInputs) => {
    setIsSubmitting(true);
    setError(null);
    
    const paymentData = {
      cart: cartItems,
      total_amount: cartTotal,
      customer_name: data.customer_name,
      mobile: data.mobile,
      address: data.address,
      thana: data.thana,
      district: data.district,
    };

    try {
      // Try Supabase first
      let response = await fetch(PAYMENT_GATEWAY_URLS.INIT_PAYMENT, {
        method: 'POST',
        headers: getSupabaseAuthHeader(),
        body: JSON.stringify(paymentData),
      });

      // If Supabase fails for ANY reason, try Vercel API as fallback
      if (!response.ok) {
        console.warn('Supabase endpoint failed with status', response.status, '- trying Vercel API as fallback');
        try {
          const supabaseError = await response.json().catch(() => null);
          if (supabaseError) {
            console.warn('Supabase error response:', supabaseError);
          }
        } catch {
          // ignore JSON parse errors
        }

        response = await fetch(PAYMENT_GATEWAY_URLS.INIT_PAYMENT_FALLBACK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(paymentData),
        });
      }

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || responseData.message || 'Payment initialization failed');
      }

      // SSLCommerz returns a JSON response with payment URLs
      // Extract the GatewayPageURL from the response
      if (responseData.GatewayPageURL) {
        // Redirect to the SSLCommerz payment gateway
        window.location.href = responseData.GatewayPageURL;
      } else if (responseData.redirectGatewayURL) {
        // Fallback to redirectGatewayURL if available
        window.location.href = responseData.redirectGatewayURL;
      } else {
        throw new Error('No payment gateway URL found in response');
      }
    } catch (error) {
      setIsSubmitting(false);
      const errorMessage = error instanceof Error ? error.message : 'Payment initialization failed';
      setError(errorMessage);
      console.error('Payment error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold" style={{ color: '#F28C38' }}>
            One-Page Checkout
          </h1>
          <p className="text-gray-500 mt-2">Complete your purchase in a single step.</p>
        </header>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-medium">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Billing Details */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-6 border-b pb-4" style={{ color: '#F28C38' }}>
              Billing Details
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  id="customer_name"
                  type="text"
                  {...register('customer_name')}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.customer_name ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm`}
                />
                {errors.customer_name && <p className="mt-1 text-xs text-red-500">{errors.customer_name.message}</p>}
              </div>

              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                  Mobile Number
                </label>
                <input
                  id="mobile"
                  type="tel"
                  {...register('mobile')}
                  placeholder="01XXXXXXXXX"
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.mobile ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm`}
                />
                {errors.mobile && <p className="mt-1 text-xs text-red-500">{errors.mobile.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                    District
                  </label>
                  <Controller
                    name="district"
                    control={control}
                    render={({ field }) => (
                      <select
                        id="district"
                        {...field}
                        className={`mt-1 block w-full px-3 py-2 border ${
                          errors.district ? 'border-red-500' : 'border-gray-300'
                        } rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm`}
                      >
                        <option value="">Select District</option>
                        {bdDistricts.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  {errors.district && <p className="mt-1 text-xs text-red-500">{errors.district.message}</p>}
                </div>

                <div>
                  <label htmlFor="thana" className="block text-sm font-medium text-gray-700">
                    Thana
                  </label>
                  <Controller
                    name="thana"
                    control={control}
                    render={({ field }) => (
                      <select
                        id="thana"
                        {...field}
                        disabled={!selectedDistrict}
                        className={`mt-1 block w-full px-3 py-2 border ${
                          errors.thana ? 'border-red-500' : 'border-gray-300'
                        } rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm disabled:bg-gray-100`}
                      >
                        <option value="">Select Thana</option>
                        {thanas.map((t) => (
                          <option key={t.id} value={t.name}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  {errors.thana && <p className="mt-1 text-xs text-red-500">{errors.thana.message}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Full Address
                </label>
                <textarea
                  id="address"
                  rows={3}
                  {...register('address')}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm`}
                />
                {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>}
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-2xl font-semibold mb-6 border-b pb-4" style={{ color: '#F28C38' }}>
                Order Summary
              </h2>
              <div className="space-y-4">
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <img
                        src={item.image || "https://i.ibb.co/GkL0xS4/tree-bookshelf.webp"}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-grow">
                        <h3 className="font-semibold text-md">{item.name}</h3>
                        <p className="text-gray-500 text-sm">
                          {item.quantity} x {item.price.toLocaleString()} BDT
                        </p>
                      </div>
                      <p className="font-semibold">
                        {(item.quantity * item.price).toLocaleString()} BDT
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">Your cart is empty.</p>
                )}

                <div className="border-t pt-4 flex justify-between items-center">
                  <p className="text-lg font-semibold">Total</p>
                  <p className="text-xl font-bold" style={{ color: '#F28C38' }}>
                    {cartTotal.toLocaleString()} BDT
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || cartItems.length === 0}
                className="w-full mt-6 py-3 text-white font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                style={{ backgroundColor: '#F28C38' }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Confirm Order - ${cartTotal.toLocaleString()} BDT`
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OnePageCheckout;
