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
    const { tran_id, error, faliure_message } = request.method === 'GET' ? request.query : request.body;

    // Log payment failure
    console.log('Payment Failed:', {
      tran_id,
      error,
      faliure_message,
    });

    // Acknowledge the callback
    console.log('❌ Payment failed for transaction:', tran_id);
    console.log('Error:', error || faliure_message);

    // In production, update order status to "failed" in database
    // Send notification email to customer
    // Offer retry option

    // Return JSON response
    return response
      .status(200)
      .setHeader('Access-Control-Allow-Origin', '*')
      .json({
        success: false,
        message: 'Payment failed',
        tran_id,
        error: error || faliure_message,
        timestamp: new Date().toISOString(),
      });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('Payment fail handler error:', errorMessage);
    return response
      .status(500)
      .setHeader('Access-Control-Allow-Origin', '*')
      .json({
        error: `Server error: ${errorMessage}`,
      });
  }
}
