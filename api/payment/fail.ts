import type { VercelRequest, VercelResponse } from '@vercel/node';
import { corsOrigin, setCors } from './_helpers';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const origin = corsOrigin(request.headers.origin as string | undefined);
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return response
      .status(200)
      .setHeader('Access-Control-Allow-Origin', origin)
      .setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type')
      .end();
  }

  try {
    const { tran_id } = request.method === 'GET' ? request.query : request.body;

    console.log('Payment Failed:', String(tran_id ?? '').slice(0, 40));

    // Acknowledge the callback
    // In production, update order status to "failed" in database (idempotent by tran_id)

    // Return JSON response
    return response
      .status(200)
      .setHeader('Access-Control-Allow-Origin', origin)
      .json({
        success: false,
        message: 'Payment failed',
        tran_id: typeof tran_id === 'string' ? tran_id.slice(0, 80) : tran_id,
        timestamp: new Date().toISOString(),
      });
  } catch (error) {
    console.error('Payment fail handler error');
    return response
      .status(500)
      .setHeader('Access-Control-Allow-Origin', origin)
      .json({
        error: 'Server error',
      });
  }
}
