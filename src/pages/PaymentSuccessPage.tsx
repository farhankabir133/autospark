import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { appwritePaymentApi, type PaymentStatusResult } from '../lib/appwritePayment';

type UiState =
  | { kind: 'missing' }
  | { kind: 'checking'; attempt: number }
  | { kind: 'validated'; status: PaymentStatusResult }
  | { kind: 'failed'; status: PaymentStatusResult }
  | { kind: 'error'; message: string };

export function PaymentSuccessPage() {
  const [params] = useSearchParams();
  const tranId = params.get('tran_id') || '';

  const [ui, setUi] = useState<UiState>(() => (tranId ? { kind: 'checking', attempt: 0 } : { kind: 'missing' }));

  const maxAttempts = 20;
  const intervalMs = 1500;

  const helpText = useMemo(() => {
    if (!tranId) return null;
    return `Reference: ${tranId}`;
  }, [tranId]);

  useEffect(() => {
    if (!tranId) return;

    let cancelled = false;
    let timeout: number | undefined;

    const tick = async (attempt: number) => {
      try {
        setUi({ kind: 'checking', attempt });
        const status = await appwritePaymentApi.getPaymentStatus({ tran_id: tranId });
        if (cancelled) return;

        const normalized = (status.status || '').toUpperCase();
        if (normalized === 'VALIDATED' || normalized === 'VALID') {
          setUi({ kind: 'validated', status });
          return;
        }

        if (['FAILED', 'CANCELLED'].includes(normalized)) {
          setUi({ kind: 'failed', status });
          return;
        }

        if (attempt >= maxAttempts) {
          setUi({ kind: 'error', message: 'Still verifying payment. Please refresh this page in a moment.' });
          return;
        }

        timeout = window.setTimeout(() => tick(attempt + 1), intervalMs);
      } catch (e) {
        if (cancelled) return;
        const message = e instanceof Error ? e.message : 'Unknown error';
        if (attempt >= maxAttempts) {
          setUi({ kind: 'error', message });
          return;
        }
        timeout = window.setTimeout(() => tick(attempt + 1), intervalMs);
      }
    };

    void tick(0);

    return () => {
      cancelled = true;
      if (timeout) window.clearTimeout(timeout);
    };
  }, [tranId]);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-semibold">Payment verification</h1>
        {helpText && <p className="mt-2 text-sm text-white/70">{helpText}</p>}

        {ui.kind === 'missing' && (
          <div className="mt-6">
            <p className="text-white/80">Missing transaction reference.</p>
            <div className="mt-4 flex gap-3">
              <Link className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15" to="/accessories">Back to Accessories</Link>
            </div>
          </div>
        )}

        {ui.kind === 'checking' && (
          <div className="mt-6">
            <p className="text-white/80">Confirming with payment gateway…</p>
            <p className="mt-2 text-sm text-white/60">Attempt {ui.attempt + 1} of {maxAttempts + 1}</p>
          </div>
        )}

        {ui.kind === 'validated' && (
          <div className="mt-6">
            <p className="text-green-300 font-medium">Payment confirmed.</p>
            {ui.status.transaction_id && (
              <p className="mt-2 text-sm text-white/70">Transaction ID: {ui.status.transaction_id}</p>
            )}
            <div className="mt-4 flex gap-3">
              <Link className="px-4 py-2 rounded-lg bg-[#C00000] hover:brightness-110" to="/accessories">Continue shopping</Link>
              <Link className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15" to="/">Home</Link>
            </div>
          </div>
        )}

        {ui.kind === 'failed' && (
          <div className="mt-6">
            <p className="text-yellow-300 font-medium">Payment not completed.</p>
            <p className="mt-2 text-sm text-white/70">Status: {ui.status.status}</p>
            <div className="mt-4 flex gap-3">
              <Link className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15" to="/accessories">Back to Accessories</Link>
            </div>
          </div>
        )}

        {ui.kind === 'error' && (
          <div className="mt-6">
            <p className="text-red-300 font-medium">Couldn’t verify payment.</p>
            <p className="mt-2 text-sm text-white/70">{ui.message}</p>
            <div className="mt-4 flex gap-3">
              <button className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15" onClick={() => window.location.reload()}>
                Refresh
              </button>
              <Link className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15" to="/accessories">Back to Accessories</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
