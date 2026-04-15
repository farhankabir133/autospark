'use client';

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle, Home, AlertTriangle } from 'lucide-react';

const PaymentFailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [transactionId, setTransactionId] = useState<string | null>(null);

  useEffect(() => {
    setTransactionId(searchParams.get('tran_id'));

    // Redirect to cart after 5 seconds if user doesn't click
    const timer = setTimeout(() => {
      navigate('/payment');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <XCircle className="w-20 h-20 text-red-500" />
            <div className="absolute inset-0 animate-pulse">
              <XCircle className="w-20 h-20 text-red-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Failed</h1>
        <p className="text-gray-600 mb-4">
          Unfortunately, your payment could not be processed.
        </p>

        {/* Transaction details */}
        {transactionId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left space-y-3">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Transaction ID</p>
              <p className="font-mono text-sm font-bold text-gray-800 break-all">{transactionId}</p>
            </div>
          </div>
        )}

        {/* Information Box */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900 mb-1">What happened?</h3>
              <p className="text-sm text-yellow-800">
                Your payment was declined by the payment gateway. Please verify your payment details and try again.
              </p>
            </div>
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-blue-900 mb-2">Try these steps:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Check your payment card details</li>
            <li>• Ensure sufficient balance</li>
            <li>• Try a different payment method</li>
            <li>• Contact your bank if problem persists</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/payment')}
            className="w-full py-3 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#F28C38' }}
          >
            Try Payment Again
          </button>
          <button
            onClick={() => navigate('/accessories')}
            className="w-full py-3 bg-white border-2 text-gray-800 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            style={{ borderColor: '#F28C38' }}
          >
            Back to Cart
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 text-gray-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            <Home className="mr-2 w-5 h-5" />
            Back to Home
          </button>
        </div>

        {/* Support */}
        <p className="text-xs text-gray-500 mt-4">
          Need help? <a href="/contact" className="text-blue-600 hover:underline">Contact our support team</a>
        </p>

        {/* Auto-redirect notice */}
        <p className="text-xs text-gray-500 mt-2">
          Redirecting to cart in 5 seconds...
        </p>
      </div>
    </div>
  );
};

export default PaymentFailPage;
