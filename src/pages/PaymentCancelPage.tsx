'use client';

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';

const PaymentCancelPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to cart after 5 seconds if user doesn't click
    const timer = setTimeout(() => {
      navigate('/cart');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {/* Cancel Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <AlertCircle className="w-20 h-20 text-gray-500" />
            <div className="absolute inset-0 animate-pulse">
              <AlertCircle className="w-20 h-20 text-gray-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Cancel Message */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Cancelled</h1>
        <p className="text-gray-600 mb-4">
          You have cancelled the payment. Your cart items are still saved.
        </p>

        {/* Information Box */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-gray-900 mb-2">What happens next?</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>✓ Your cart items remain available</li>
            <li>✓ No charges have been made</li>
            <li>✓ You can review and try again</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/payment')}
            className="w-full py-3 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#F28C38' }}
          >
            Continue to Payment
          </button>
          <button
            onClick={() => navigate('/cart')}
            className="w-full py-3 bg-white border-2 text-gray-800 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            style={{ borderColor: '#F28C38' }}
          >
            Review Your Cart
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 text-gray-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            <Home className="mr-2 w-5 h-5" />
            Back to Home
          </button>
        </div>

        {/* Auto-redirect notice */}
        <p className="text-xs text-gray-500 mt-4">
          Redirecting to cart in 5 seconds...
        </p>
      </div>
    </div>
  );
};

export default PaymentCancelPage;
