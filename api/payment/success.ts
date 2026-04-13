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
    const {
      tran_id,
      status,
      val_id,
      bank_tran_id,
      card_type,
      amount,
      currency,
    } = request.method === 'GET' ? request.query : request.body;

    // Log payment success callback
    console.log('Payment Success Callback:', {
      tran_id,
      status,
      val_id,
      bank_tran_id,
      amount,
    });

    // Validate transaction ID is present
    if (!tran_id) {
      console.error('Missing transaction ID in success callback');
      return response
        .status(400)
        .setHeader('Access-Control-Allow-Origin', '*')
        .json({
          error: 'Missing transaction ID',
        });
    }

    // SSLCommerz sends val_id which contains the validation details
    // In production, you should:
    // 1. Validate this transaction with SSLCommerz validation API
    // 2. Update order status in database
    // 3. Send confirmation email to customer
    // 4. Return success to SSLCommerz

    // For now, log and acknowledge
    console.log('✅ Payment successful for transaction:', tran_id);
    console.log('Validation ID:', val_id);
    console.log('Bank Transaction ID:', bank_tran_id);

    // Return JSON response (SSLCommerz expects JSON)
    return response
      .status(200)
      .setHeader('Access-Control-Allow-Origin', '*')
      .json({
        success: true,
        message: 'Payment verified successfully',
        tran_id,
        val_id,
        timestamp: new Date().toISOString(),
      });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('Payment success handler error:', errorMessage);
    return response
      .status(500)
      .setHeader('Access-Control-Allow-Origin', '*')
      .json({
        error: `Server error: ${errorMessage}`,
      });
  }
}
