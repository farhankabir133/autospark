import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, Home } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThankYouPage = () => {
  const [searchParams] = useSearchParams();
  const { theme } = useTheme();

  const transactionId = useMemo(() => searchParams.get('tran_id'), [searchParams]);

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`max-w-xl w-full rounded-2xl shadow-lg p-8 text-center ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
        <div className="flex justify-center mb-5">
          <CheckCircle2 className="w-20 h-20 text-green-600 dark:text-green-400" aria-hidden />
        </div>

        <h1 className={`text-3xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Thank You for Your Order!</h1>
        <p className={`text-gray-600 dark:text-gray-400 mb-5`}>
          Your payment has been confirmed and your order is now being processed.
        </p>

        {transactionId && (
          <div className={`mb-6 p-4 rounded-lg border text-left ${theme === 'dark' ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-100 border-gray-200'}`}>
            <p className={`text-xs font-semibold uppercase mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Transaction ID</p>
            <p className={`font-mono text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'} break-all`}>{transactionId}</p>
          </div>
        )}

        <div className={`rounded-lg border p-4 text-left mb-7 ${theme === 'dark' ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'}`}>
          <h2 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-green-300' : 'text-green-900'}`}>What happens next?</h2>
          <ul className={`text-sm space-y-1 ${theme === 'dark' ? 'text-green-200' : 'text-green-800'}`}>
            <li>• You will receive order updates shortly.</li>
            <li>• Our team will begin fulfillment immediately.</li>
            <li>• Keep your transaction ID for support queries.</li>
          </ul>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            to="/accessories"
            className={`inline-flex items-center justify-center px-4 py-3 rounded-lg border-2 font-semibold transition ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600' : 'bg-white border-[var(--brand-red,#C00000)] text-[var(--brand-red,#C00000)] hover:bg-gray-50'}`}
          >
            <ShoppingBag className="w-4 h-4 mr-2" aria-hidden />
            Continue Shopping
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-4 py-3 rounded-lg text-white font-semibold hover:opacity-90 transition bg-[var(--brand-red,#C00000)]"
          >
            <Home className="w-4 h-4 mr-2" aria-hidden />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
