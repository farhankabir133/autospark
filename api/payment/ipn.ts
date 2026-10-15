import type { VercelRequest, VercelResponse } from '@vercel/node';
import { corsOrigin, setCors, validateWithSSLCommerz } from './_helpers.js';
import { updateOrderStatus } from '../_db.js';

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
    const amountOk = !Number.isFinite(Number(amount)) || !Number.isFinite(Number(check.amount)) || Number(check.amount) === Number(amount);
    const tran = String(tran_id).slice(0, 40);

    if (verified && amountOk) {
      await updateOrderStatus(tran, 'paid', {
        val_id: String(val_id),
        gateway_status: String(check.raw?.status ?? status ?? 'VALID'),
      });
    } else if (!verified) {
      await updateOrderStatus(tran, 'failed', { val_id: String(val_id), gateway_status: String(status ?? 'FAILED') });
    }

    console.log('[payment/ipn]', { tran, verified, amountOk });
    setCors(response, origin);
    return response.status(200).json({ received: true, verified: verified && amountOk, tran_id });
  } catch {
    setCors(response, origin);
    return response.status(500).json({ error: 'Server error' });
  }
}
