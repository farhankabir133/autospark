import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Home, ShoppingBag, Loader2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { appwritePaymentApi } from '../services/appwritePaymentApi';
import { useTheme } from '../contexts/ThemeContext';

const SUCCESS_STATES = new Set(['VALIDATED', 'COMPLETE', 'COMPLETED', 'PAID', 'SUCCESS']);

export const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const { theme } = useTheme();
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>('PENDING');
  const [isValidated, setIsValidated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let attempts = 0;
    const maxAttempts = 20;

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

          if (SUCCESS_STATES.has(status)) {
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
          console.error('Error checking payment status:', err);
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
      const tranIdQuery = transactionId ? `?tran_id=${encodeURIComponent(transactionId)}` : '';
      navigate(`/thank-you${tranIdQuery}`, { replace: true });
    }, 5000);
    return () => clearTimeout(timer);
  }, [isValidated, transactionId, navigate]);

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`max-w-md w-full rounded-xl shadow-lg p-8 text-center ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
        <div className="flex justify-center mb-6">
          <div className="relative">
            {isValidated ? (
              <CheckCircle className="w-20 h-20 text-[var(--brand-red,#C00000)]" aria-hidden />
            ) : (
              <Loader2 className="w-20 h-20 text-[var(--brand-red,#C00000)] animate-spin" aria-hidden />
            )}
          </div>
        </div>

        <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {isValidated ? 'Payment Successful!' : 'Verifying Payment…'}
        </h1>
        <p className={`text-gray-600 dark:text-gray-400 mb-4 ${isValidated ? '' : 'animate-pulse'}`}>
          {isValidated
            ? 'Thank you for your purchase. Your payment has been verified.'
            : 'We are verifying your payment with the gateway. This may take a moment.'}
        </p>

        {error && (
          <div role="alert" className={`bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6 ${theme === 'dark' ? 'bg-red-900/20' : 'bg-red-50'}`}>
            <p className={`text-sm ${theme === 'dark' ? 'text-red-300' : 'text-red-700'}`}>{error}</p>
          </div>
        )}

        <div className={`rounded-lg p-4 mb-6 text-left space-y-3 ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
          <div>
            <p className={`text-xs uppercase font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Verification Status</p>
            <p className={`text-sm font-bold ${isValidated ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
              {isValidated ? 'Verified' : paymentStatus}
            </p>
          </div>
          {!isValidated && (
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Waiting for secure server confirmation from SSLCommerz via Appwrite Function...
            </p>
          )}
        </div>

        {transactionId && (
          <div className={`rounded-lg p-4 mb-6 ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Transaction ID:</p>
            <p className={`font-mono text-sm font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'} break-all`}>
              {transactionId}
            </p>
          </div>
        )}

        <div className={`border rounded-lg p-4 mb-6 text-left ${theme === 'dark' ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
          <h3 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-900'}`}>What's Next?</h3>
          <ul className={`text-sm space-y-1 ${theme === 'dark' ? 'text-blue-200' : 'text-blue-800'}`}>
            <li>✓ Payment verification is handled server-side only</li>
            <li>✓ Your order moves forward after Verified status</li>
            <li>✓ Contact support if status remains pending for long</li>
          </ul>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/accessories')}
            className={`w-full py-3 border-2 font-semibold rounded-lg flex items-center justify-center transition-colors ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600' : 'bg-white border-[var(--brand-red,#C00000)] text-[var(--brand-red,#C00000)] hover:bg-gray-50'}`}
          >
            <ShoppingBag className="mr-2 w-5 h-5" aria-hidden />
            Continue Shopping
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 text-white font-semibold rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity bg-[var(--brand-red,#C00000)]"
          >
            <Home className="mr-2 w-5 h-5" aria-hidden />
            Back to Home
          </button>
        </div>

        <p className={`text-xs mt-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
          {isValidated ? 'Redirecting to Thank You page in 5 seconds…' : 'Waiting for payment validation…'}
        </p>
      </div>
    </div>
  );
};
