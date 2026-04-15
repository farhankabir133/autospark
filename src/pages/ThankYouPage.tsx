import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, Home } from 'lucide-react';

const ThankYouPage = () => {
  const [searchParams] = useSearchParams();

  const transactionId = useMemo(() => searchParams.get('tran_id'), [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-lg border border-emerald-100 p-8 text-center">
        <div className="flex justify-center mb-5">
          <CheckCircle2 className="w-20 h-20 text-emerald-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">Thank You for Your Order!</h1>
        <p className="text-gray-600 mb-5">
          Your payment has been confirmed and your order is now being processed.
        </p>

        {transactionId && (
          <div className="mb-6 p-4 rounded-lg bg-gray-50 border border-gray-200 text-left">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Transaction ID</p>
            <p className="font-mono text-sm text-gray-800 break-all">{transactionId}</p>
          </div>
        )}

        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-left mb-7">
          <h2 className="font-semibold text-emerald-900 mb-2">What happens next?</h2>
          <ul className="text-sm text-emerald-800 space-y-1">
            <li>• You will receive order updates shortly.</li>
            <li>• Our team will begin fulfillment immediately.</li>
            <li>• Keep your transaction ID for support queries.</li>
          </ul>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            to="/accessories"
            className="inline-flex items-center justify-center px-4 py-3 rounded-lg bg-white border-2 border-[#F28C38] text-gray-900 font-semibold hover:bg-gray-50 transition"
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-4 py-3 rounded-lg bg-[#F28C38] text-white font-semibold hover:opacity-90 transition"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
