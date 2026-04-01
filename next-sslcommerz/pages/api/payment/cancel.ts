import type { NextApiRequest, NextApiResponse } from 'next';
import { getSupabase } from '../../../lib/supabase';

/**
 * SSLCommerz calls this endpoint when a user cancels the payment (e.g., closes the gateway).
 * Logs the cancellation and optionally updates your database.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const body = req.method === 'POST' ? req.body : req.query;
  console.log('SSLCommerz cancel POST body:', JSON.stringify(body, null, 2));

  const val_id = (body as any)?.val_id;
  const tran_id = (body as any)?.tran_id;
  const status = (body as any)?.status; // e.g., 'cancelled'

  if (tran_id) {
    console.log('Payment cancelled for tran_id:', tran_id, 'status:', status);

    // ===== Save payment cancellation record to database =====
    try {
      const supabase = getSupabase();
      // Insert or update the order as cancelled
      const { error: dbError } = await supabase
        .from('orders')
        .upsert(
          {
            tran_id,
            val_id,
            status: 'cancelled',
            cancelled_at: new Date().toISOString()
          },
          { onConflict: 'tran_id' }
        );
      
      if (dbError) {
        console.error('Failed to save order in Supabase:', dbError);
      } else {
        console.log('Order saved as cancelled in Supabase for tran_id:', tran_id);
      }
    } catch (dbErr) {
      console.error('Database error:', dbErr);
    }
    // ===== End database save =====
  }

  // Redirect to cancellation page
  return res.redirect('/payment-cancelled');
}
