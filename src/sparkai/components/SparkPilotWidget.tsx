import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Send, X, Maximize2, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { respond } from '../services/ai';
import { SPARKPILOT_CONFIG, buildWhatsAppUrl } from '../config';
import { SparkMark } from './Logo';
import { DemoBadge } from './ui';
import { WelcomeCard } from './WelcomeCard';
import { SPARKPILOT_OPEN_EVENT } from './openSparkPilot';
import type { ChatMessage, CustomerPreferences } from '../types';

const uid = () => Math.random().toString(36).slice(2, 10);
const SEED: ChatMessage = {
  id: 'seed', role: 'assistant', createdAt: Date.now(), kind: 'welcome',
  text: "Hi, I'm SparkPilot — I know everything about AutoSpark car sales and car services. What would you like to know?",
};

/**
 * Floating SparkPilot assistant — fixed on the RIGHT side of every page.
 * Compact chat drawer; full experience lives at /sparkai.
 */
export function SparkPilotWidget() {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([SEED]);
  const [prefs, setPrefs] = useState<CustomerPreferences>({});
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [unread, setUnread] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent).detail as { message?: string } | undefined;
      setOpen(true);
      setUnread(false);
      if (detail?.message) void sendRef.current(detail.message);
    };
    window.addEventListener(SPARKPILOT_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(SPARKPILOT_OPEN_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (open && listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages.length, busy, open]);

  const send = useCallback(async (raw: string) => {
    const text = raw.trim();
    if (!text || busy) return;
    setBusy(true);
    setMessages((p) => [...p, { id: uid(), role: 'user', text, createdAt: Date.now(), status: 'sent' }]);
    setInput('');
    try {
      const r = await respond(messages, text, prefs);
      setPrefs((p) => ({ ...p, ...r.prefs }));
      setMessages((p) => [...p, { id: uid(), role: 'assistant', text: r.text, createdAt: Date.now(), status: 'sent', vehicles: r.vehicles }]);
      if (!open) setUnread(true);
    } catch {
      setMessages((p) => [...p, { id: uid(), role: 'assistant', text: 'Sorry — SparkPilot failed to respond. Please retry; nothing was submitted.', createdAt: Date.now(), status: 'failed' }]);
    } finally {
      setBusy(false);
    }
  }, [busy, messages, prefs, open]);

  const sendRef = useRef(send);
  sendRef.current = send;

  return (
    <>
      {/* Floating entry point — RIGHT side, above safe area */}
      {!open && (
        <motion.button
          initial={reduceMotion ? false : { scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => { setOpen(true); setUnread(false); }}
          aria-label="Open SparkPilot assistant"
          className="fixed z-50 right-4 sm:right-6 rounded-full p-[3px] shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          style={{ bottom: 'calc(env(safe-area-inset-bottom,0px) + 16px)', background: 'linear-gradient(135deg,#22D3EE,#2563EB,#7C3AED)' }}
        >
          <span className={`relative flex items-center gap-2 rounded-full pl-1.5 pr-4 py-1.5 ${dark ? 'bg-[#0B1322]' : 'bg-white'}`}>
            <SparkMark size={36} />
            <span className="text-left leading-tight">
              <span className={`block text-[13px] font-extrabold ${dark ? 'text-white' : 'text-slate-900'}`}>Ask SparkPilot</span>
              <span className="block text-[10px] font-medium opacity-60">Sales &amp; service expert</span>
            </span>
            {unread && <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-white" aria-label="New message" />}
          </span>
        </motion.button>
      )}

      {/* Slide-over drawer docked RIGHT */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 sm:bg-black/30"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.section
              role="dialog"
              aria-modal="true"
              aria-label="SparkPilot assistant"
              initial={reduceMotion ? { opacity: 0 } : { x: 420, opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { x: 420, opacity: 0 }}
              transition={{ type: 'tween', duration: 0.25 }}
              className={`fixed z-50 flex flex-col overflow-hidden ${
                dark ? 'bg-[#0B1322] text-slate-100 border-white/10' : 'bg-white text-slate-900 border-slate-200'
              } border inset-x-3 bottom-3 top-16 rounded-2xl sm:inset-x-auto sm:right-5 sm:bottom-5 sm:top-auto sm:w-[400px] sm:h-[600px] sm:max-h-[calc(100dvh-3rem)] sm:rounded-2xl shadow-2xl`}
            >
              <header className={`flex items-center gap-2.5 px-4 py-3 border-b ${dark ? 'border-white/10' : 'border-slate-200'}`}>
                <SparkMark size={30} />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-sm leading-tight">SparkPilot <span className="font-medium opacity-50 text-xs">by AutoSpark</span></p>
                  <p className="text-[11px] opacity-60 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Online · AI expert
                  </p>
                </div>
                <DemoBadge />
                <Link to="/sparkpilot" aria-label="Open full SparkPilot page" className="p-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10" onClick={() => setOpen(false)}>
                  <Maximize2 className="w-4 h-4" />
                </Link>
                <button aria-label="Close SparkPilot" onClick={() => setOpen(false)} className="p-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 min-w-[44px] min-h-[44px]">
                  <X className="w-5 h-5" />
                </button>
              </header>

              <div ref={listRef} className="flex-1 overflow-y-auto px-3.5 py-3 space-y-3" aria-label="Messages" aria-live="off">
                {messages.map((m) => (
                  m.kind === 'welcome' ? (
                    <WelcomeCard key={m.id} compact onAsk={(t) => void send(t)} reduceMotion={reduceMotion} />
                  ) : (
                  <div key={m.id} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {m.role === 'assistant' && <SparkMark size={26} />}
                    <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-[13px] leading-relaxed whitespace-pre-wrap ${
                      m.role === 'user'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-br-md'
                        : dark ? 'bg-white/[0.06] border border-white/10 rounded-bl-md' : 'bg-slate-100 border border-slate-200 rounded-bl-md'
                    }`}>
                      {m.text}
                      {m.vehicles && m.vehicles.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {m.vehicles.slice(0, 3).map((v) => (
                            <button
                              key={v.id}
                              onClick={() => void send(`Tell me more about the ${v.make} ${v.model} ${v.year}.`)}
                              className={`block w-full text-left text-xs font-semibold rounded-lg px-2.5 py-2 border ${dark ? 'border-cyan-500/30 bg-cyan-500/10' : 'border-cyan-600/30 bg-cyan-50'}`}
                            >
                              {v.make} {v.model} {v.year} · ৳{v.budgetLakh.toFixed(1)} lakh <span className="opacity-60 font-normal">· verify with expert</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  )
                ))}
                {busy && (
                  <div className="flex gap-2" aria-label="SparkPilot is typing">
                    <SparkMark size={26} />
                    <div className={`rounded-2xl px-4 py-3 flex gap-1.5 ${dark ? 'bg-white/[0.06]' : 'bg-slate-100'}`}>
                      {[0, 1, 2].map((i) => (
                        <motion.span key={i} className="w-2 h-2 rounded-full bg-cyan-500" animate={reduceMotion ? {} : { opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="px-3 pb-1 flex gap-1.5 overflow-x-auto" role="group" aria-label="Quick replies">
                {['Find my ideal car', 'Car services & pricing', 'Talk to expert'].map((q) => (
                  <button key={q} onClick={() => void send(q)} disabled={busy} className={`shrink-0 text-[11px] font-semibold rounded-full border px-3 py-1.5 disabled:opacity-40 ${dark ? 'border-white/10 hover:bg-white/5' : 'border-slate-300 hover:bg-slate-100'}`}>{q}</button>
                ))}
              </div>

              <form className={`p-3 border-t ${dark ? 'border-white/10' : 'border-slate-200'}`} onSubmit={(e) => { e.preventDefault(); void send(input); }}>
                <div className={`flex items-center gap-2 rounded-xl border px-2 py-1.5 ${dark ? 'bg-white/[0.04] border-white/10 focus-within:border-cyan-500/50' : 'bg-slate-50 border-slate-200 focus-within:border-cyan-500'}`}>
                  <label htmlFor="sparkai-widget-input" className="sr-only">Message SparkPilot</label>
                  <input
                    id="sparkai-widget-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about this product…"
                    disabled={busy}
                    autoComplete="off"
                    className="flex-1 bg-transparent outline-none text-sm px-2 py-2 placeholder:opacity-50 min-w-0"
                  />
                  <button type="submit" aria-label="Send message" disabled={!input.trim() || busy} className="p-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white disabled:opacity-40 min-w-[44px] min-h-[44px] flex items-center justify-center">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-1.5 px-0.5">
                  <Link to="/sparkpilot" onClick={() => setOpen(false)} className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-300 hover:underline">Open full SparkPilot →</Link>
                  <a href={buildWhatsAppUrl('Hello AutoSpark! I need help with a product.')} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] font-semibold opacity-70 hover:opacity-100">
                    <MessageCircle className="w-3 h-3" /> {SPARKPILOT_CONFIG.phoneDisplay}
                  </a>
                </div>
              </form>
            </motion.section>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
