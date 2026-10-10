import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const PaymentCancelPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { theme } = useTheme();
  const [transactionId] = useState<string | null>(() => searchParams.get('tran_id'));

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`max-w-md w-full rounded-xl shadow-lg p-8 text-center ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
        <div className="flex justify-center mb-6">
          <AlertCircle className="w-20 h-20 text-gray-500" aria-hidden />
        </div>

        <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Payment Cancelled</h1>
        <p className={`text-gray-600 dark:text-gray-400 mb-4`}>
          You have cancelled the payment. Your cart items are still saved.
        </p>

        {transactionId && (
          <div className={`rounded-lg p-4 mb-6 text-left space-y-3 ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
            <div>
              <p className={`text-xs uppercase font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Transaction ID</p>
              <p className={`font-mono text-sm font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'} break-all`}>{transactionId}</p>
            </div>
          </div>
        )}

        <div className={`border rounded-lg p-4 mb-6 text-left ${theme === 'dark' ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
          <h3 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>What happens next?</h3>
          <ul className={`text-sm space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            <li>✓ Your cart items remain available</li>
            <li>✓ No charges have been made</li>
            <li>✓ You can review and try again</li>
          </ul>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-3 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity bg-[var(--brand-red,#C00000)]"
          >
            Continue to Payment
          </button>
          <button
            onClick={() => navigate('/cart')}
            className={`w-full py-3 border-2 font-semibold rounded-lg flex items-center justify-center transition-colors ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600' : 'bg-white border-[var(--brand-red,#C00000)] text-[var(--brand-red,#C00000)] hover:bg-gray-50'}`}
          >
            Review Your Cart
          </button>
          <button
            onClick={() => navigate('/')}
            className={`w-full py-3 font-semibold rounded-lg transition-colors flex items-center justify-center ${theme === 'dark' ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Home className="mr-2 w-5 h-5" aria-hidden />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelPage;
