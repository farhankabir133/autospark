import type { NextApiRequest, NextApiResponse } from 'next';
import { createSSLCommerz } from '../../../lib/sslcommerz';
import { getSupabase } from '../../../lib/supabase';

type InitBody = {
  total_amount: number;
  currency?: string;
  cus_name?: string;
  cus_email?: string;
  cus_phone?: string;
  product_name?: string;
  cus_add1?: string;
  cus_city?: string;
  cus_postcode?: string | number;
  cus_state?: string;
  cus_country?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body as InitBody;
  const amount = body?.total_amount ?? 1;
  const tran_id = `txn_${Date.now()}`;

  const baseUrl = process.env.APP_URL || 'http://localhost:3000';
  const success_url = `${baseUrl}/api/payment/success`;
  const fail_url = `${baseUrl}/api/payment/fail`;
  const cancel_url = `${baseUrl}/api/payment/cancel`;
  const ipn_url = `${baseUrl}/api/payment/ipn`;

  const data = {
    total_amount: amount,
    currency: body.currency || 'BDT',
    tran_id,
    success_url,
    fail_url,
    cancel_url,
    ipn_url,
    shipping_method: 'Courier',
    product_name: body.product_name || 'Auto Spark Service',
    product_category: 'Automotive',
    product_profile: 'general',
    cus_name: body.cus_name || 'Customer',
    cus_email: body.cus_email || '',
    cus_add1: '',
    cus_city: '',
    cus_postcode: '',
    cus_country: 'Bangladesh',
    cus_phone: body.cus_phone || '',
    ship_name: body.cus_name || 'Customer',
    ship_add1: body.cus_add1 || 'N/A',
    ship_city: body.cus_city || 'N/A',
    ship_state: body.cus_state || 'N/A',
    ship_postcode: body.cus_postcode || '0000',
    ship_country: body.cus_country || 'Bangladesh',
  };

  try {
    const sslcz = createSSLCommerz();
    const result = await sslcz.init(data as any);

    if (result && result.GatewayPageURL) {
      // Save order to Supabase when payment is initiated
      try {
        const supabase = getSupabase();
        const { error: dbError } = await supabase
          .from('orders')
          .insert({
            tran_id,
            status: 'pending',
            total_amount: amount,
            cus_name: body.cus_name,
            cus_email: body.cus_email,
            cus_phone: body.cus_phone,
            product_name: body.product_name,
            created_at: new Date().toISOString()
          });
        
        if (dbError) {
          console.error('Failed to save order to Supabase:', dbError);
          // Log but don't fail - still return the payment URL
          console.log('Proceeding with payment despite DB save error');
        } else {
          console.log('Order saved to Supabase:', tran_id);
        }
      } catch (dbErr) {
        console.error('Database error:', dbErr);
        // Log but don't fail
      }
      
      return res.status(200).json({ url: result.GatewayPageURL, tran_id });
    }

    return res.status(500).json({ error: 'Payment initiation failed', detail: result });
  } catch (err: any) {
    console.error('initiate error', err?.message || err);
    return res.status(500).json({ error: err?.message || 'internal' });
  }
}
