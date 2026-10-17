import { motion } from 'framer-motion';
import { Car, Wrench, ArrowRight } from 'lucide-react';
import { useDark } from './ui';
import { SparkMark } from './Logo';

interface WelcomeCardProps {
  /** Compact layout for the floating widget drawer. */
  compact?: boolean;
  /** Sends a starter message when a domain chip / action is tapped. */
  onAsk: (message: string) => void;
  reduceMotion?: boolean;
}

const SALES_MSG = "I'd like to explore AutoSpark car sales options.";
const SERVICES_MSG = 'I have a question about car services.';

/**
 * SparkPilot's rich welcome — introduces the assistant as a modern,
 * elegant sales expert with two knowledge domains (Car Sales · Car Services).
 */
export function WelcomeCard({ compact = false, onAsk, reduceMotion = false }: WelcomeCardProps) {
  const dark = useDark();
  const chip = dark
    ? 'border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-cyan-400/40'
    : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-cyan-400/60 hover:shadow-md';

  const domains = (
    <div className={`grid ${compact ? 'grid-cols-1 gap-1.5' : 'grid-cols-1 sm:grid-cols-2 gap-2'} mt-4`} role="group" aria-label="Knowledge domains">
      <button
        onClick={() => onAsk(SALES_MSG)}
        className={`group text-left rounded-2xl border px-3.5 py-3 transition ${chip}`}
      >
        <span className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shrink-0">
            <Car className="w-4 h-4" />
          </span>
          <span className="min-w-0">
            <span className="flex items-center gap-1 text-[13px] font-extrabold tracking-tight">
              Car Sales
              <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition -translate-x-1 group-hover:translate-x-0 text-cyan-500" />
            </span>
            {!compact && (
              <span className={`block text-[11px] leading-snug ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                Vehicles &amp; prices · Japan pre-order · Financing
              </span>
            )}
          </span>
        </span>
      </button>
      <button
        onClick={() => onAsk(SERVICES_MSG)}
        className={`group text-left rounded-2xl border px-3.5 py-3 transition ${chip}`}
      >
        <span className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 text-white shrink-0">
            <Wrench className="w-4 h-4" />
          </span>
          <span className="min-w-0">
            <span className="flex items-center gap-1 text-[13px] font-extrabold tracking-tight">
              Car Services
              <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition -translate-x-1 group-hover:translate-x-0 text-cyan-500" />
            </span>
            {!compact && (
              <span className={`block text-[11px] leading-snug ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                Maintenance · A/C · Repair · Detailing &amp; prices
              </span>
            )}
          </span>
        </span>
      </button>
    </div>
  );

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`mx-auto ${compact ? 'max-w-none' : 'max-w-xl text-center pt-1 pb-2'}`}
      aria-label="SparkPilot welcome"
    >
      {/* Avatar with soft gradient glow */}
      <div className={`relative inline-block ${compact ? '' : 'mb-3'}`}>
        <span
          className="absolute inset-0 rounded-[18px] blur-lg opacity-60"
          style={{ background: 'linear-gradient(135deg,#22D3EE,#2563EB,#7C3AED)' }}
          aria-hidden
        />
        <span className="relative block">
          <SparkMark size={compact ? 44 : 60} />
        </span>
      </div>

      <div className={compact ? 'mt-2.5' : ''}>
        <p className={`${compact ? 'text-base' : 'text-2xl sm:text-3xl'} font-extrabold tracking-tight leading-tight`}>
          Hi, I&rsquo;m{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
            SparkPilot
          </span>
        </p>
        <p className={`${compact ? 'text-[13px] mt-0.5' : 'text-sm sm:text-base mt-1.5'} font-semibold ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
          Your personal AutoSpark sales &amp; service expert.
        </p>
        <p className={`${compact ? 'text-[12.5px] mt-1' : 'text-sm mt-2'} leading-relaxed ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
          I know everything about AutoSpark{' '}
          <span className="font-semibold text-cyan-500">car sales</span> and{' '}
          <span className="font-semibold text-violet-500">car services</span>. What would you like to know?
        </p>
      </div>

      {domains}
    </motion.div>
  );
}
