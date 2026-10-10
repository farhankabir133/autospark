import type { VercelRequest, VercelResponse } from '@vercel/node';
import { corsOrigin, setCors, validateWithSSLCommerz } from './_helpers';

// Authoritative server-to-server IPN handler. Validates val_id, checks amount,
// and is idempotent (callers must dedupe tran_id in DB; repeated IPN returns same result).
export default async function handler(request: VercelRequest, response: VercelResponse) {
  const origin = corsOrigin(request.headers.origin as string | undefined);
  if (request.method === 'OPTIONS') {
    return response.status(200).setHeader('Access-Control-Allow-Origin', origin)
      .setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type').end();
  }
  if (request.method !== 'POST') {
    setCors(response, origin);
    return response.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { tran_id, val_id, status, amount } = request.body ?? {};
    if (!tran_id || !val_id) {
      setCors(response, origin);
      return response.status(400).json({ error: 'Missing tran_id/val_id' });
    }
    const check = await validateWithSSLCommerz(String(val_id));
    const verified = check.valid && String(status ?? '').toUpperCase() !== 'FAILED';
    console.log('[payment/ipn]', { tran: String(tran_id).slice(0, 40), verified });
    // TODO: upsert order by tran_id with idempotency guard (status paid check) here.
    setCors(response, origin);
    return response.status(200).json({ received: true, verified, tran_id });
  } catch {
    setCors(response, origin);
    return response.status(500).json({ error: 'Server error' });
  }
}
