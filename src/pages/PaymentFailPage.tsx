import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { XCircle, Home, AlertTriangle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const PaymentFailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { theme } = useTheme();
  const [transactionId] = useState<string | null>(() => searchParams.get('tran_id'));

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`max-w-md w-full rounded-xl shadow-lg p-8 text-center ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
        <div className="flex justify-center mb-6">
          <XCircle className="w-20 h-20 text-red-500" aria-hidden />
        </div>

        <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Payment Failed</h1>
        <p className={`text-gray-600 dark:text-gray-400 mb-4`}>
          Unfortunately, your payment could not be processed.
        </p>

        {transactionId && (
          <div className={`rounded-lg p-4 mb-6 text-left space-y-3 ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
            <div>
              <p className={`text-xs uppercase font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Transaction ID</p>
              <p className={`font-mono text-sm font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'} break-all`}>{transactionId}</p>
            </div>
          </div>
        )}

        <div className={`border rounded-lg p-4 mb-6 text-left ${theme === 'dark' ? 'bg-yellow-900/20 border-yellow-800' : 'bg-yellow-50 border-yellow-200'}`}>
          <div className="flex items-start">
            <AlertTriangle className={`w-5 h-5 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'} mr-3 flex-shrink-0 mt-0.5`} aria-hidden />
            <div>
              <h3 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-900'}`}>What happened?</h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-yellow-200' : 'text-yellow-800'}`}>
                Your payment was declined by the payment gateway. Please verify your payment details and try again.
              </p>
            </div>
          </div>
        </div>

        <div className={`border rounded-lg p-4 mb-6 text-left ${theme === 'dark' ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
          <h3 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-900'}`}>Try these steps:</h3>
          <ul className={`text-sm space-y-1 ${theme === 'dark' ? 'text-blue-200' : 'text-blue-800'}`}>
            <li>• Check your payment card details</li>
            <li>• Ensure sufficient balance</li>
            <li>• Try a different payment method</li>
            <li>• Contact your bank if problem persists</li>
          </ul>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-3 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity bg-[var(--brand-red,#C00000)]"
          >
            Try Payment Again
          </button>
          <button
            onClick={() => navigate('/cart')}
            className={`w-full py-3 border-2 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-[var(--brand-red,#C00000)] text-[var(--brand-red,#C00000)]'}`}
          >
            Back to Cart
          </button>
          <button
            onClick={() => navigate('/')}
            className={`w-full py-3 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center ${theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'text-gray-600'}`}
          >
            <Home className="mr-2 w-5 h-5" aria-hidden />
            Back to Home
          </button>
        </div>

        <p className={`text-xs mt-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
          Need help? <Link to="/contact" className="underline">Contact our support team</Link>
        </p>
      </div>
    </div>
  );
};

export default PaymentFailPage;
