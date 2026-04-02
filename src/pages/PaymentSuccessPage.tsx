'use client';

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Home } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const [transactionId, setTransactionId] = useState<string | null>(null);

  useEffect(() => {
    const tranId = searchParams.get('tran_id');
    setTransactionId(tranId);

    // Clear cart after successful payment
    clearCart();

    // Here you might want to:
    // 1. Validate the transaction with your backend
    // 2. Fetch order details
    // 3. Send order confirmation email
    
    // Redirect to home after 5 seconds if user doesn't click
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);

    return () => clearTimeout(timer);
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
