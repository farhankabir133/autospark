import { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export const useDark = () => useTheme().theme === 'dark';

export function SButton({ children, variant = 'primary', ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'outline'; children: ReactNode }) {
  const dark = useDark();
  const base = 'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition focus-visible:outline-2 min-h-[44px] px-5 text-sm active:scale-[0.98] disabled:opacity-50';
  const styles =
    variant === 'primary'
      ? 'text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-blue-900/30'
      : variant === 'outline'
        ? dark ? 'border border-white/15 text-white hover:bg-white/5' : 'border border-slate-300 text-slate-900 hover:bg-slate-100'
        : dark ? 'text-cyan-300 hover:bg-white/5' : 'text-blue-700 hover:bg-slate-100';
  return <button {...rest} className={`${base} ${styles} ${rest.className ?? ''}`}>{children}</button>;
}

export function SInput(props: InputHTMLAttributes<HTMLInputElement>) {
  const dark = useDark();
  return (
    <input
      {...props}
      className={`w-full rounded-xl px-4 min-h-[44px] text-sm border outline-none focus:ring-2 focus:ring-cyan-400 ${dark ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-500' : 'bg-white border-slate-200 text-slate-900'} ${props.className ?? ''}`}
    />
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  const dark = useDark();
  return (
    <div className={`rounded-2xl border shadow-sm ${dark ? 'bg-[#0E1526]/90 border-white/10' : 'bg-white border-slate-200'} ${className}`}>
      {children}
    </div>
  );
}

export function DemoBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-300 text-[11px] font-bold px-2.5 py-1 uppercase tracking-wider">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> Demo mode
    </span>
  );
}
