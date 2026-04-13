import type { VercelRequest, VercelResponse } from '@vercel/node';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return response
      .status(200)
      .setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type')
      .end();
  }

  try {
    const { tran_id, status } = request.method === 'GET' ? request.query : request.body;

    // Log payment cancellation
    console.log('Payment Cancelled:', {
      tran_id,
      status,
    });

    // User cancelled the payment on SSLCommerz gateway
    console.log('⏸️ Payment cancelled by user for transaction:', tran_id);

    // In production:
    // Update order status to "cancelled" in database
    // Clear session data
    // Allow user to retry

    // Return JSON response
    return response
      .status(200)
      .setHeader('Access-Control-Allow-Origin', '*')
      .json({
        success: false,
        message: 'Payment cancelled by user',
        tran_id,
        status,
        timestamp: new Date().toISOString(),
      });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('Payment cancel handler error:', errorMessage);
    return response
      .status(500)
      .setHeader('Access-Control-Allow-Origin', '*')
      .json({
        error: `Server error: ${errorMessage}`,
      });
  }
}
