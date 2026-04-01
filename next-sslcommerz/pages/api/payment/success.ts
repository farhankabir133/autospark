import type { NextApiRequest, NextApiResponse } from 'next';
import { createSSLCommerz } from '../../../lib/sslcommerz';
import { getSupabase } from '../../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // SSLCommerz posts form-encoded data to your success_url. Next parses into req.body.
  const body = req.method === 'POST' ? req.body : req.query;
  // Debug log to capture the raw POST body from SSLCommerz during sandbox testing
  console.log('SSLCommerz success POST body:', JSON.stringify(body, null, 2));
  const val_id = (body as any)?.val_id;
  const tran_id = (body as any)?.tran_id;

  if (!val_id) {
    // No val_id: cannot validate
    console.log('No val_id received, redirecting to payment-failed');
    return res.redirect('/payment-failed');
  }

  try {
    const sslcz = createSSLCommerz();
    const validation = await sslcz.validate({ val_id } as any);

    // sslcommerz-lts may return different shapes; check for success markers
    console.log('SSLCommerz validation response:', JSON.stringify(validation, null, 2));
    const status = (validation as any)?.status || (validation as any)?.validated;
    if (status === 'VALIDATED' || status === 'VALID' || status === true) {
      console.log('Payment validated for val_id:', val_id, 'tran_id:', tran_id);
      
      // ===== TODO: Update your database here =====
      // Example (Supabase):
      /*
      try {
        const supabase = getSupabase();
        // Update your orders table when payment is validated
        const { error } = await supabase
          .from('orders')
          .update({ status: 'paid', val_id, validated_at: new Date().toISOString() })
          .eq('tran_id', tran_id);
        
        if (error) {
          console.error('Failed to update order in Supabase:', error);
          return res.redirect('/payment-failed');
        }
        console.log('Order updated in Supabase for tran_id:', tran_id);
      } catch (dbErr) {
        console.error('Database error:', dbErr);
        return res.redirect('/payment-failed');
      }
      */
      // ===== End TODO =====
      
      // Redirect to success page (you may customize this URL)
      return res.redirect('/dashboard/payment-success');
    }

    console.log('Validation failed, redirecting to payment-failed');
    return res.redirect('/payment-failed');
  } catch (err) {
    console.error('validation error', err);
    return res.redirect('/payment-failed');
  }
}
