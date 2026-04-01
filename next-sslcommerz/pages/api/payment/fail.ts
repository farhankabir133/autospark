import type { NextApiRequest, NextApiResponse } from 'next';
import { getSupabase } from '../../../lib/supabase';

/**
 * SSLCommerz calls this endpoint when payment fails or is declined.
 * Logs the failure and optionally updates your database.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const body = req.method === 'POST' ? req.body : req.query;
  console.log('SSLCommerz fail POST body:', JSON.stringify(body, null, 2));

  const val_id = (body as any)?.val_id;
  const tran_id = (body as any)?.tran_id;
  const status = (body as any)?.status; // e.g., 'failed', 'declined'
  const error = (body as any)?.error; // error reason from SSLCommerz

  if (tran_id) {
    console.log('Payment failed for tran_id:', tran_id, 'status:', status, 'error:', error);

    // ===== TODO: Update your database here =====
    // Example (Supabase):
    /*
    try {
      const supabase = getSupabase();
      // Mark the order as failed in your database
      const { error: dbError } = await supabase
        .from('orders')
        .update({ status: 'failed', failed_reason: error || status, failed_at: new Date().toISOString() })
        .eq('tran_id', tran_id);
      
      if (dbError) {
        console.error('Failed to update order in Supabase:', dbError);
      } else {
        console.log('Order marked as failed in Supabase for tran_id:', tran_id);
      }
    } catch (dbErr) {
      console.error('Database error:', dbErr);
    }
    */
    // ===== End TODO =====
  }

  // Redirect to failure page
  return res.redirect('/payment-failed');
}
