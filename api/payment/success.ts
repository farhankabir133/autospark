import type { VercelRequest, VercelResponse } from '@vercel/node';
import { corsOrigin, setCors, validateWithSSLCommerz } from './_helpers';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  const origin = corsOrigin(request.headers.origin as string | undefined);
  if (request.method === 'OPTIONS') {
    return response.status(200).setHeader('Access-Control-Allow-Origin', origin)
      .setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type').end();
  }
  try {
    const { tran_id, val_id, amount } = request.method === 'GET' ? request.query : request.body;
    if (!tran_id || typeof tran_id !== 'string') {
      setCors(response, origin);
      return response.status(400).json({ error: 'Missing transaction ID' });
    }
    if (!val_id || typeof val_id !== 'string') {
      console.error('[payment/success] missing val_id for', String(tran_id).slice(0, 40));
      setCors(response, origin);
      return response.status(400).json({ error: 'Missing validation ID', tran_id });
    }
    // Server-to-server verification — never trust callback alone
    const check = await validateWithSSLCommerz(val_id);
    if (!check.valid) {
      console.error('[payment/success] validation failed for', String(tran_id).slice(0, 40));
      setCors(response, origin);
      return response.status(402).json({ error: 'Payment verification failed', tran_id });
    }
    // Amount match guard (tolerance 1 BDT)
    if (amount !== undefined && check.amount !== undefined && Math.abs(Number(amount) - check.amount) > 1) {
      console.error('[payment/success] amount mismatch for', String(tran_id).slice(0, 40));
      setCors(response, origin);
      return response.status(402).json({ error: 'Amount mismatch', tran_id });
    }
    console.log('[payment/success] verified', { tran_id: String(tran_id).slice(0, 40) });
    setCors(response, origin);
    return response.status(200).json({ success: true, message: 'Payment verified', tran_id, timestamp: new Date().toISOString() });
  } catch {
    console.error('[payment/success] server error');
    setCors(response, origin);
    return response.status(500).json({ error: 'Server error' });
  }
}
