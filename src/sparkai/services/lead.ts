import { z } from 'zod';
import { normalizeWhatsApp } from '../config';

export const LeadSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name').max(80),
  whatsapp: z.string().trim().refine((v) => normalizeWhatsApp(v) !== null, 'Enter a valid WhatsApp number (e.g. 01XXXXXXXXX)'),
  language: z.string().min(1),
  interest: z.string().trim().min(2, 'Tell us the vehicle or service').max(120),
  budgetRange: z.string().trim().min(1, 'Select a budget range'),
  timeline: z.string().trim().min(1, 'Select a timeline'),
  notes: z.string().max(500).optional().default(''),
  consent: z.boolean().refine((v) => v === true, 'Consent is required to contact you'),
});

export type LeadFormValues = z.infer<typeof LeadSchema>;

export async function submitLead(values: LeadFormValues): Promise<{ ok: boolean; reference: string }> {
  const r = await fetch('/api/lead/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  });
  if (!r.ok) {
    const data = await r.json().catch(() => ({}));
    throw new Error(data.error || 'Submission failed. Please retry.');
  }
  return r.json();
}
