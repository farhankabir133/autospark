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

    // ===== Update database with payment cancellation =====
    try {
      const supabase = getSupabase();
      // Mark the order as cancelled in your database
      const { error: dbError } = await supabase
        .from('orders')
        .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
        .eq('tran_id', tran_id);
      
      if (dbError) {
        console.error('Failed to update order in Supabase:', dbError);
      } else {
        console.log('Order marked as cancelled in Supabase for tran_id:', tran_id);
      }
    } catch (dbErr) {
      console.error('Database error:', dbErr);
    }
    // ===== End database update =====
  }

  // Redirect to cancellation page
  return res.redirect('/payment-cancelled');
}
