import { useMemo, useState } from 'react';
import { estimateFinance } from '../services/ai';
import { formatBDT } from '../data/demo';
import { SInput, SButton } from './ui';

export function BudgetPlanner({ onExpert }: { onExpert: (summary: string) => void }) {
  const [price, setPrice] = useState(24.5);
  const [down, setDown] = useState(30);
  const [rate, setRate] = useState('');
  const [months, setMonths] = useState(48);
  const est = useMemo(() => estimateFinance(price, down, rate === '' ? null : Number(rate), months), [price, down, rate, months]);

  return (
    <div className="space-y-3 p-1" aria-label="Budget planner">
      <div className="grid grid-cols-2 gap-2.5">
        <label className="text-xs font-semibold">Price (lakh ৳)<SInput type="number" min={5} max={300} step={0.5} value={price} onChange={(e) => setPrice(Number(e.target.value))} /></label>
        <label className="text-xs font-semibold">Down payment %<SInput type="number" min={0} max={90} value={down} onChange={(e) => setDown(Number(e.target.value))} /></label>
        <label className="text-xs font-semibold">Rate %/yr (optional)<SInput type="number" min={0} max={30} step={0.1} placeholder="Not configured" value={rate} onChange={(e) => setRate(e.target.value)} /></label>
        <label className="text-xs font-semibold">Months<SInput type="number" min={6} max={84} value={months} onChange={(e) => setMonths(Number(e.target.value))} /></label>
      </div>
      <dl className="text-sm grid grid-cols-2 gap-2 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3">
        <div><dt className="text-[11px] opacity-60 uppercase">Down payment</dt><dd className="font-bold">{formatBDT(est.downPaymentBDT)}</dd></div>
        <div><dt className="text-[11px] opacity-60 uppercase">Loan needed</dt><dd className="font-bold">{formatBDT(est.loanBDT)}</dd></div>
        <div className="col-span-2"><dt className="text-[11px] opacity-60 uppercase">Monthly installment (est.)</dt><dd className="font-bold text-base">{est.monthlyBDT != null ? formatBDT(est.monthlyBDT) : '— unavailable (no verified rate configured)'}</dd></div>
      </dl>
      <p className="text-[11px] opacity-60">Estimate only — not an offer, loan approval, or bank rate. Verified financing terms are not configured; confirm with an expert.</p>
      <SButton variant="outline" onClick={() => onExpert(`Budget plan: ${price} lakh, ${down}% down, ${months} months`)}>Ask expert to review my plan</SButton>
    </div>
  );
}
