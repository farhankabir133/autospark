import type { VercelRequest, VercelResponse } from '@vercel/node';
import { insertLead } from '../_db';

const cors = (res: VercelResponse) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, whatsapp, language, interest, budgetRange, timeline, notes, consent } = req.body ?? {};
  const errors: string[] = [];

  if (!name || String(name).trim().length < 2) errors.push('Name is required');
  if (!whatsapp || String(whatsapp).trim().length < 10) errors.push('Valid WhatsApp number is required');
  if (!interest || String(interest).trim().length < 2) errors.push('Interest/vehicle is required');
  if (!budgetRange) errors.push('Budget range is required');
  if (!timeline) errors.push('Timeline is required');
  if (!consent) errors.push('Consent is required');

  if (errors.length) return res.status(400).json({ error: errors.join('. ') });

  const reference = `SPARK-${Date.now().toString(36).toUpperCase()}`;

  await insertLead({
    name: String(name).trim(),
    whatsapp: String(whatsapp).trim(),
    language: language || 'en',
    interest: String(interest).trim(),
    budget_range: budgetRange,
    timeline,
    notes: notes || '',
    reference,
    source: 'sparkai',
  });

  return res.status(200).json({ ok: true, reference });
}
