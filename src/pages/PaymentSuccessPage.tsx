'use client';

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Home } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { appwritePaymentApi } from '../services/appwritePaymentApi';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>('PENDING');
  const [isValidated, setIsValidated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let attempts = 0;
    const maxAttempts = 20; // ~60 seconds at 3s interval

    const tranId = searchParams.get('tran_id');
    setTransactionId(tranId);

    if (!tranId) {
      setError('Missing transaction ID. Please contact support with your payment details.');
      return;
    }

    const pollStatus = async () => {
      while (isMounted && attempts < maxAttempts) {
        attempts += 1;
        try {
          const statusResponse = await appwritePaymentApi.getPaymentStatus(tranId);
          const status = (
            statusResponse.status ||
            statusResponse.payment_status ||
            statusResponse.data?.status ||
            'PENDING'
          ).toString().toUpperCase();

          if (!isMounted) return;

          setPaymentStatus(status);

          if (status === 'VALIDATED') {
            setIsValidated(true);
            clearCart();
            return;
          }

          if (status === 'FAILED' || status === 'CANCELLED') {
            setError(`Payment status is ${status}. Please retry checkout.`);
            return;
          }
        } catch (err) {
          if (!isMounted) return;
          console.error('❌ Error checking payment status:', err);
        }

        await new Promise((resolve) => setTimeout(resolve, 3000));
      }

      if (isMounted && !isValidated) {
        setError('Payment verification is taking longer than expected. Please check again in a moment.');
      }
    };

    pollStatus();

    return () => {
      isMounted = false;
    };
  }, [searchParams, navigate, clearCart]);

  useEffect(() => {
    if (!isValidated) return;
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);
    return () => clearTimeout(timer);
  }, [isValidated, navigate]);

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
          Thank you for your purchase. We are verifying your payment with the gateway.
        </p>

        {/* Error if any */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left space-y-3">
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">Verification Status</p>
            <p className={`text-sm font-bold ${isValidated ? 'text-green-600' : 'text-amber-600'}`}>
              {isValidated ? 'VALIDATED' : paymentStatus}
            </p>
          </div>
          {!isValidated && (
            <p className="text-xs text-gray-600">
              Waiting for secure server confirmation from SSLCommerz via Appwrite Function...
            </p>
          )}
        </div>

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
            <li>✓ Payment verification is handled server-side only</li>
            <li>✓ Your order moves forward after VALIDATED status</li>
            <li>✓ Contact support if status remains pending for long</li>
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
          {isValidated ? 'Redirecting to home in 5 seconds...' : 'Waiting for payment validation...'}
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
