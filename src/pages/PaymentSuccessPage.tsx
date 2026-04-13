'use client';

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Home } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { updatePaymentStatus, getPaymentById } from '../services/appwriteService';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [payment, setPayment] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleSuccess = async () => {
      try {
        const paymentId = searchParams.get('payment_id');
        const tranId = searchParams.get('tran_id');
        
        setTransactionId(tranId);

        if (paymentId) {
          console.log('📝 Processing payment success for ID:', paymentId);
          
          // Update payment status in database to 'success'
          await updatePaymentStatus(paymentId, 'success', tranId || undefined);

          // Get updated payment record
          const paymentData = await getPaymentById(paymentId);
          setPayment(paymentData);
          
          console.log('✅ Payment success processed');
        }

        // Clear cart after successful payment
        clearCart();

        // Redirect to home after 5 seconds if user doesn't click
        const timer = setTimeout(() => {
          navigate('/');
        }, 5000);

        return () => clearTimeout(timer);
      } catch (err) {
        console.error('❌ Error handling success:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    handleSuccess();
  }, [searchParams, navigate, clearCart]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <CheckCircle className="w-20 h-20" style={{ color: '#F28C38' }} />
            <div className="absolute inset-0 animate-pulse">
              <CheckCircle className="w-20 h-20" style={{ color: '#F28C38', opacity: 0.2 }} />
            </div>
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-4">
          Thank you for your purchase. Your order has been confirmed.
        </p>

        {/* Error if any */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Payment Details from Appwrite */}
        {payment && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left space-y-3">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Order ID</p>
              <p className="font-mono text-sm font-bold text-gray-800 break-all">
                {payment.$id.substring(0, 12)}...
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Amount</p>
              <p className="text-lg font-bold text-green-600">৳{payment.total_amount?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Customer</p>
              <p className="text-sm text-gray-700">{payment.customer_name}</p>
            </div>
          </div>
        )}

        {/* Transaction ID */}
        {transactionId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Transaction ID:</p>
            <p className="font-mono text-sm font-semibold text-gray-800 break-all">
              {transactionId}
            </p>
          </div>
        )}

        {/* Information Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✓ Check your email for order confirmation</li>
            <li>✓ Track your order status</li>
            <li>✓ Contact support if you have questions</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 bg-white border-2 text-gray-800 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            style={{ borderColor: '#F28C38' }}
          >
            Continue Shopping
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 text-white font-semibold rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#F28C38' }}
          >
            <Home className="mr-2 w-5 h-5" />
            Back to Home
          </button>
        </div>

        {/* Auto-redirect notice */}
        <p className="text-xs text-gray-500 mt-4">
          Redirecting to home in 5 seconds...
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
