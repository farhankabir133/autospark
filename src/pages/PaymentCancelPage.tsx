import { Link, useSearchParams } from 'react-router-dom';

export function PaymentCancelPage() {
  const [params] = useSearchParams();
  const tranId = params.get('tran_id');

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-semibold">Payment cancelled</h1>
        {tranId && <p className="mt-2 text-sm text-white/70">Reference: {tranId}</p>}
        <p className="mt-6 text-white/80">You cancelled the payment. Your cart is still available in Accessories.</p>

        <div className="mt-6 flex gap-3">
          <Link className="px-4 py-2 rounded-lg bg-[#C00000] hover:brightness-110" to="/accessories">Back to cart</Link>
          <Link className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15" to="/">Home</Link>
        </div>
      </div>
    </div>
  );
}
