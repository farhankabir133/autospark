import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LeadSchema, LeadFormValues, submitLead } from '../services/lead';
import { SInput, SButton } from './ui';

const input = (reg: object, label: string, err?: string, extra?: React.ReactNode) => (
  <label className="block text-xs font-semibold space-y-1">
    {label}
    <SInput {...(reg as object)} />
    {extra}
    {err && <span role="alert" className="block text-red-500 font-medium">{err}</span>}
  </label>
);

export function LeadForm({ interestDefault = '', onDone }: { interestDefault?: string; onDone: (ref: string) => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<z.input<typeof LeadSchema>>({
    resolver: zodResolver(LeadSchema),
    defaultValues: { language: 'English', interest: interestDefault, budgetRange: '', timeline: '', notes: '', consent: false } as unknown as LeadFormValues,
  });
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  return (
    <form
      className="space-y-3"
      aria-label="Request expert contact"
      onSubmit={handleSubmit(async (v) => {
        setError(null);
        try {
          const r = await submitLead(v as LeadFormValues);
          setOk(r.reference);
          onDone(r.reference);
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Submission failed. Please retry.');
        }
      })}
    >
      <p className="text-xs opacity-70">Share your WhatsApp so an AutoSpark expert can follow up about <b>{interestDefault || 'your inquiry'}</b>. We only use it to contact you about this request.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {input(register('name'), 'Full name', errors.name?.message)}
        {input({ ...register('whatsapp'), inputMode: 'tel', placeholder: '01XXXXXXXXX' }, 'WhatsApp number', errors.whatsapp?.message)}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <label className="block text-xs font-semibold space-y-1">Preferred language
          <select {...register('language')} className="w-full rounded-xl px-3 min-h-[44px] text-sm border bg-transparent"><option>English</option><option>Bangla</option><option>Mixed</option></select>
        </label>
        {input({ ...register('interest') }, 'Vehicle / service of interest', errors.interest?.message)}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <label className="block text-xs font-semibold space-y-1">Budget range
          <select {...register('budgetRange')} className="w-full rounded-xl px-3 min-h-[44px] text-sm border bg-transparent" defaultValue="">
            <option value="" disabled>Select…</option><option>Under ৳18 lakh</option><option>৳18–25 lakh</option><option>৳25–35 lakh</option><option>Above ৳35 lakh</option><option>Need advice</option>
          </select>
          {errors.budgetRange && <span role="alert" className="block text-red-500 font-medium">{errors.budgetRange.message}</span>}
        </label>
        <label className="block text-xs font-semibold space-y-1">Timeline
          <select {...register('timeline')} className="w-full rounded-xl px-3 min-h-[44px] text-sm border bg-transparent" defaultValue="">
            <option value="" disabled>Select…</option><option>Immediately</option><option>Within 1 month</option><option>1–3 months</option><option>Just exploring</option>
          </select>
          {errors.timeline && <span role="alert" className="block text-red-500 font-medium">{errors.timeline.message}</span>}
        </label>
      </div>
      {input({ ...register('notes'), placeholder: 'Optional: colors, features, questions…' }, 'Additional notes (optional)')}
      <label className="flex gap-2.5 items-start text-xs cursor-pointer">
        <input type="checkbox" {...register('consent')} className="mt-1 w-4 h-4 accent-cyan-500" />
        <span>I agree to be contacted by AutoSpark on WhatsApp about this inquiry. <span className="opacity-60">(Required — numbers are never stored in browser storage.)</span></span>
      </label>
      {errors.consent && <span role="alert" className="block text-red-500 text-xs font-medium">{errors.consent.message}</span>}
      {error && <p role="alert" className="text-xs font-semibold text-red-500 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2">{error}</p>}
      {ok && <p role="status" className="text-xs font-semibold text-emerald-600 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-3 py-2">Submitted! Reference {ok} — an expert will follow up shortly.</p>}
      <SButton type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting…' : 'Request expert callback'}</SButton>
    </form>
  );
}
