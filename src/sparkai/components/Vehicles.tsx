import { Car, Fuel, Cog, Check } from 'lucide-react';
import type { DemoVehicle } from '../types';
import { formatLakh } from '../data/demo';
import { useDark, Card, SButton } from './ui';
import { buildWhatsAppUrl, SPARKPILOT_CONFIG } from '../config';

export function VehicleCard({ v, onAsk, onCompare, onExpert }: { v: DemoVehicle; onAsk: (v: DemoVehicle) => void; onCompare: (v: DemoVehicle) => void; onExpert: (v: DemoVehicle) => void }) {
  const dark = useDark();
  return (
    <Card className="overflow-hidden w-[270px] shrink-0 snap-start">
      <div className={`h-24 flex items-center justify-center relative ${dark ? 'bg-gradient-to-br from-cyan-950 to-blue-950' : 'bg-gradient-to-br from-cyan-50 to-blue-100'}`}>
        <Car className="w-12 h-12 text-cyan-400" strokeWidth={1.4} aria-hidden />
        <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider bg-black/50 text-white px-2 py-0.5 rounded-full">{v.stock === 'demo' ? 'Featured' : v.stock === 'ready' ? 'Ready stock' : v.stock === 'preorder' ? 'Pre-order' : v.stock}</span>
      </div>
      <div className="p-3.5">
        <p className={`font-bold text-sm ${dark ? 'text-white' : 'text-slate-900'}`}>{v.make} {v.model} {v.year}</p>
        <p className="text-xs opacity-70">{v.variant} · {v.bodyType}</p>
        <div className="flex flex-wrap gap-1.5 mt-2 text-[11px]">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/20"><Fuel className="w-3 h-3" />{v.fuel}</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-500/10 border border-slate-500/20 opacity-80"><Cog className="w-3 h-3" />{v.transmission}</span>
        </div>
        <p className="mt-2 font-extrabold text-cyan-600 dark:text-cyan-300">{formatLakh(v.budgetLakh)} <span className="text-[10px] font-medium opacity-60">ask expert</span></p>
        <ul className="mt-1.5 space-y-0.5 text-xs opacity-80">
          {v.features.slice(0, 3).map((f) => <li key={f} className="flex gap-1.5 items-start"><Check className="w-3.5 h-3.5 mt-0.5 text-emerald-500 shrink-0" />{f}</li>)}
        </ul>
        <div className="flex gap-1.5 mt-3">
          <button onClick={() => onAsk(v)} className="flex-1 text-xs font-semibold rounded-full bg-cyan-500 text-white py-2 min-h-[36px] hover:bg-cyan-400">Ask</button>
          <button onClick={() => onCompare(v)} className={`flex-1 text-xs font-semibold rounded-full border py-2 min-h-[36px] ${dark ? 'border-white/15 hover:bg-white/5' : 'border-slate-300 hover:bg-slate-100'}`}>Compare</button>
          <button onClick={() => onExpert(v)} aria-label={`Request expert for ${v.make} ${v.model}`} className={`flex-1 text-xs font-semibold rounded-full border py-2 min-h-[36px] ${dark ? 'border-white/15 hover:bg-white/5' : 'border-slate-300 hover:bg-slate-100'}`}>Expert</button>
        </div>
      </div>
    </Card>
  );
}

export function VehicleComparison({ items, onRemove }: { items: DemoVehicle[]; onRemove: (id: string) => void }) {
  const dark = useDark();
  if (!items.length) return <p className="text-sm opacity-60 p-4">Select up to 3 vehicles with “Compare” to see differences side by side.</p>;
  const rows: [string, (v: DemoVehicle) => string][] = [
    ['Price', (v) => formatLakh(v.budgetLakh)],
    ['Fuel', (v) => v.fuel],
    ['Transmission', (v) => v.transmission],
    ['Body', (v) => v.bodyType],
    ['Year', (v) => String(v.year)],
  ];
  return (
    <div className={`overflow-x-auto rounded-2xl border ${dark ? 'border-white/10' : 'border-slate-200'}`}>
      <table className="w-full text-sm min-w-[420px]">
        <thead>
          <tr>
            <th className="text-left p-3 text-xs uppercase tracking-wider opacity-60">Spec</th>
            {items.map((v) => (
              <th key={v.id} className="p-3 text-left text-xs">{v.make} {v.model}<br /><button onClick={() => onRemove(v.id)} className="text-cyan-500 font-semibold">Remove</button></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, fn]) => (
            <tr key={label} className={`border-t ${dark ? 'border-white/5' : 'border-slate-100'}`}>
              <td className="p-3 font-semibold text-xs opacity-70">{label}</td>
              {items.map((v) => <td key={v.id} className="p-3">{fn(v)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-[11px] opacity-60 px-3 pb-3">Confirm specs and availability with an expert before booking.</p>
    </div>
  );
}

export function ExpertHandoff({ interest }: { interest?: string }) {
  const msg = `Hello AutoSpark! I'm contacting via SparkPilot${interest ? ` about: ${interest}` : ''}. Please have an expert call me back.`;
  return (
    <div className="flex flex-col gap-2">
      <SButton onClick={() => window.open(buildWhatsAppUrl(msg), '_blank', 'noopener')}>
        Open WhatsApp — {SPARKPILOT_CONFIG.phoneDisplay}
      </SButton>
      <p className="text-[11px] opacity-60">Opens WhatsApp with a pre-filled message. Submitting the lead form below is a separate step and notifies our team directly.</p>
    </div>
  );
}
