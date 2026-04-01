import { useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(100);

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const resp = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ total_amount: amount, cus_name: 'Test Buyer', cus_email: 'buyer@example.com', cus_phone: '01711111111' })
      });

      const json = await resp.json();
      if (json?.url) {
        // Redirect the browser to the GatewayPageURL
        window.location.href = json.url;
        return;
      }

      alert('Failed to initiate payment');
    } catch (err) {
      console.error(err);
      alert('Payment error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>SSLCommerz Next.js Example</h1>
      <form onSubmit={handlePay} style={{ marginTop: 16 }}>
        <label>
          Amount (BDT)
          <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} style={{ marginLeft: 8 }} />
        </label>
        <div style={{ marginTop: 12 }}>
          <button type="submit" disabled={loading}>{loading ? 'Starting...' : 'Pay with SSLCommerz'}</button>
        </div>
      </form>
    </main>
  );
}
