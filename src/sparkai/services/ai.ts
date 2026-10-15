import type { ChatMessage, ConversationIntent, CustomerPreferences, DemoVehicle } from '../types';
import { DEMO_VEHICLES, filterDemoVehicles, formatLakh } from '../data/demo';
import { SPARKAI_GROQ } from '../config';

export interface AIResponse {
  text: string;
  vehicles?: DemoVehicle[];
  followUp?: string;
  prefs?: Partial<CustomerPreferences>;
  intent?: ConversationIntent;
}

const hasBn = (t: string) => /[\u0980-\u09FF]/.test(t);
const num = (t: string): number | undefined => {
  const m = t.replace(/,/g, '').match(/(\d+(?:\.\d+)?)\s*(lakh|lac|laks|million|crore)?/i);
  if (!m) return undefined;
  let v = parseFloat(m[1]);
  const u = (m[2] || '').toLowerCase();
  if (u === 'crore') v *= 100;
  if (u === 'million') v *= 11.85;
  if (v > 200 && v < 10000000) v = v / 100000; // raw BDT → lakh
  if (v >= 10000000) v = v / 100000;
  return v > 5 && v < 300 ? Math.round(v * 10) / 10 : undefined;
};

/**
 * Deterministic demo AI provider. Explicitly NOT a live model/RAG/inventory.
 * Rule: remembers stated prefs, asks one question at a time, never invents stock.
 */
export async function mockRespond(_history: ChatMessage[], input: string, prefs: CustomerPreferences): Promise<AIResponse> {
  await new Promise((r) => setTimeout(r, 500 + Math.random() * 500));
  const t = input.toLowerCase();
  const bn = hasBn(input);
  const next: CustomerPreferences = { ...prefs };
  const b = num(t);
  if (b) next.budgetLakh = b;
  if (/hybrid/.test(t) && !/non.?hybrid/.test(t)) next.hybrid = true;
  if (/non.?hybrid|non hybrid|octane only|petrol only/.test(t)) next.hybrid = false;
  for (const k of ['sedan', 'suv', 'hatchback', 'mpv', 'wagon', '7-seater', '7 seater']) {
    if (t.includes(k)) next.bodyType = k.includes('7') ? 'MPV' : k[0].toUpperCase() + k.slice(1);
  }
  for (const m of ['toyota', 'honda', 'nissan', 'mazda', 'suzuki']) {
    if (t.includes(m)) next.manufacturer = m[0].toUpperCase() + m.slice(1);
  }
  if (bn) next.language = 'bn';

  const pick = (n = 3) => filterDemoVehicles({ maxBudgetLakh: next.budgetLakh, hybrid: next.hybrid, bodyType: next.bodyType, make: next.manufacturer }).slice(0, n);
  const demoNote = bn
    ? '\n\n_নোট: নিচের গাড়িগুলো ডেমো উদাহরণ — লাইভ স্টক বা চূড়ান্ত দাম নয়। যাচাই করতে এক্সপার্টের সাথে কথা বলুন।_'
    : '\n\n_Note: vehicles below are demo examples — not live stock or final prices. Please confirm with an expert._';

  if (/^(hi|hello|salam|assalam|hey|adab|nomoskar|হাই|হ্যালো|আসসালামু|সালাম)/.test(t.trim())) {
    return { text: bn || /salam|assalam/.test(t) ? 'ওয়ালাইকুম আসসালাম! আমি SparkAI — AutoSpark-এর গাড়ি সহায়ক। পরিবারের জন্য গাড়ি, বাজেট, নাকি জাপান প্রি-অর্ডার — কী নিয়ে সাহায্য করব?' : "Hello! I'm SparkAI, AutoSpark's car assistant. Are you looking for a family car, estimating a budget, or pre-ordering from Japan?", prefs: next, intent: 'general' };
  }
  if (/pre.?order|japan|auction|import/.test(t)) {
    return { text: bn ? 'জাপান প্রি-অর্ডার নিয়ে সাহায্য করছি। কোন গাড়ি (মডেল + বছর), বাজেট, আর কবে নাগাদ চান — জানাবেন?' : 'I can help with a Japan pre-order. Which model + year, your budget, and your timeline?', prefs: next, intent: 'preorder', followUp: 'preorder' };
  }
  if (/service|battery|diagnos|maintenance|repair|সার্ভিস|ব্যাটারি/.test(t)) {
    return { text: bn ? 'সার্ভিসের জন্য: গাড়ির মডেল/বছর আর সমস্যাটা (যেমন হাইব্রিড ব্যাটারি চেক, ডায়াগনসিস, জেনারেল সার্ভিস) জানান — এক্সপার্ট ফলো-আপের ব্যবস্থা করছি।' : 'For service: please share your model/year and the concern (e.g. hybrid battery check, diagnostics, general service) — I will arrange expert follow-up.', prefs: next, intent: 'service', followUp: 'service' };
  }
  if (/financ|loan|installment|down ?payment|emi|কিস্তি|লোন/.test(t) || /budget|বাজেট/.test(t)) {
    if (next.budgetLakh) {
      const v = pick();
      return { text: `${bn ? `আপনার ${next.budgetLakh} লাখ বাজেট নোট করেছি` : `Noted your budget of ${formatLakh(next.budgetLakh)}`}.${v.length ? (bn ? ` এই বাজেটে ${v.length}টি ডেমো অপশন:` : ` Here are ${v.length} demo options in range:`) : (bn ? ' এই বাজেটে ডেমো তালিকায় মিল পাইনি — বাজেট একটু বাড়িয়ে দেখবেন?' : ' No demo matches in that range — shall we stretch the budget slightly?')}${demoNote}`, vehicles: v, prefs: next, intent: 'budget' };
    }
    return { text: bn ? 'আপনার আনুমানিক বাজেট কত (লাখে)? আর Hybrid পছন্দ করেন?' : 'What is your approximate budget (in lakh), and do you prefer hybrid?', prefs: next, intent: 'budget' };
  }
  if (/compare|vs |difference|পার্থক্য|তুলনা/.test(t)) {
    const v = DEMO_VEHICLES.slice(0, 2);
    return { text: (bn ? 'দুটি জনপ্রিয় ডেমো অপশনের তুলনা দিলাম — Compare ট্যাবে বিস্তারিত দেখুন।' : 'Here is a comparison of two popular demo options — see the Compare tab for detail.') + demoNote, vehicles: v, prefs: next, intent: 'compare', followUp: 'compare' };
  }
  if (/expert|human|call|phone|whatsapp|যোগাযোগ|কথা বলতে/.test(t)) {
    return { text: bn ? 'অবশ্যই! নিচের ফর্মে আপনার নাম ও WhatsApp নম্বর দিন — AutoSpark এক্সপার্ট শীঘ্রই যোগাযোগ করবেন।' : 'Of course! Please share your name and WhatsApp number below — an AutoSpark expert will follow up shortly.', prefs: next, intent: 'expert', followUp: 'lead' };
  }
  if (/family|7.?seat|noah|mpv|বাচ্চা|পরিবার/.test(t)) {
    const v = filterDemoVehicles({ maxBudgetLakh: next.budgetLakh, hybrid: next.hybrid, bodyType: 'MPV' });
    const list = v.length ? v : DEMO_VEHICLES.filter((x) => x.bodyType.includes('MPV'));
    return { text: (bn ? 'পরিবারের জন্য ৭-সিটের আরামদায়ক অপশন:' : 'Comfortable 7-seater family options:') + demoNote, vehicles: list.slice(0, 3), prefs: { ...next, bodyType: 'MPV' }, intent: 'find-car' };
  }
  if (b || /hybrid/.test(t) || next.manufacturer || next.bodyType || /car|gari|গাড়ি|suv|sedan|toyota|honda/.test(t)) {
    const v = pick();
    if (!next.budgetLakh) {
      return { text: bn ? `ধন্যবাদ! ${next.manufacturer ?? ''} ${next.bodyType ?? 'গাড়ি'} পছন্দ নোট করেছি। আপনার বাজেট আনুমানিক কত (লাখে)?` : `Thanks — noted your interest in ${next.manufacturer ?? ''} ${next.bodyType ?? 'cars'}. What is your approximate budget (in lakh)?`, vehicles: v.length ? v : undefined, prefs: next, intent: 'find-car' };
    }
    return { text: `${bn ? `আপনার পছন্দ মনে রাখছি — বাজেট ${next.budgetLakh} লাখ${next.hybrid ? ', Hybrid' : ''}. এই ডেমো অপশনগুলো দেখুন:` : `Keeping your preferences — budget ${formatLakh(next.budgetLakh)}${next.hybrid ? ', hybrid' : ''}. Consider these demo options:`}${demoNote}`, vehicles: v, prefs: next, intent: 'find-car' };
  }
  const v = pick();
  return { text: bn ? 'বুঝতে পেরেছি। সেরা সাজেশন দিতে — বাজেট (লাখে) আর Hybrid চান কিনা জানাবেন?' : "Got it. To suggest the best options — could you share your budget (in lakh) and whether you'd like hybrid?", vehicles: v.length ? v.slice(0, 2) : undefined, prefs: next, intent: 'general' };
}

/** Parse prefs deterministically (shared by mock + live path so memory never regresses). */
export function parsePrefs(input: string, prefs: CustomerPreferences): CustomerPreferences {
  const t = input.toLowerCase();
  const next: CustomerPreferences = { ...prefs };
  const b = num(t);
  if (b) next.budgetLakh = b;
  if (/hybrid/.test(t) && !/non.?hybrid/.test(t)) next.hybrid = true;
  if (/non.?hybrid|non hybrid|octane only|petrol only/.test(t)) next.hybrid = false;
  for (const k of ['sedan', 'suv', 'hatchback', 'mpv', 'wagon', '7-seater', '7 seater']) {
    if (t.includes(k)) next.bodyType = k.includes('7') ? 'MPV' : k[0].toUpperCase() + k.slice(1);
  }
  for (const m of ['toyota', 'honda', 'nissan', 'mazda', 'suzuki']) {
    if (t.includes(m)) next.manufacturer = m[0].toUpperCase() + m.slice(1);
  }
  if (hasBn(input)) next.language = 'bn';
  return next;
}

function detectIntent(t: string): ConversationIntent {
  if (/pre.?order|japan|auction|import/.test(t)) return 'preorder';
  if (/service|battery|diagnos|maintenance|repair|সার্ভিস|ব্যাটারি/.test(t)) return 'service';
  if (/financ|loan|installment|down ?payment|emi|কিস্তি|লোন|budget|বাজেট/.test(t)) return 'budget';
  if (/compare|vs |difference|পার্থক্য|তুলনা/.test(t)) return 'compare';
  if (/expert|human|call|phone|whatsapp|যোগাযোগ|কথা বলতে/.test(t)) return 'expert';
  if (/family|7.?seat|noah|mpv|বাচ্চা|পরিবার|car|gari|গাড়ি|suv|sedan|toyota|honda/.test(t)) return 'find-car';
  return 'general';
}

/** Live Groq call via server proxy. Returns null on any failure (caller falls back). */
async function liveRespond(history: ChatMessage[], input: string, prefs: CustomerPreferences): Promise<AIResponse | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 25000);
  try {
    const msgs = [...history.slice(-10).map((m) => ({ role: m.role, content: m.text })), { role: 'user', content: input }];
    const candidates = filterDemoVehicles({ maxBudgetLakh: prefs.budgetLakh, hybrid: prefs.hybrid, bodyType: prefs.bodyType, make: prefs.manufacturer }).slice(0, 6);
    const context = (candidates.length ? candidates : DEMO_VEHICLES.slice(0, 6))
      .map((v) => `- ${v.make} ${v.model} ${v.year} ${v.variant} | ${v.bodyType} | ${v.fuel} | ৳${v.budgetLakh.toFixed(1)} lakh | ${v.features.slice(0, 3).join(', ')}`)
      .join('\n');
    const r = await fetch(SPARKAI_GROQ.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: msgs, prefs, context }),
      signal: ctrl.signal,
    });
    if (!r.ok) return null;
    const data = await r.json();
    const text = String(data?.text || '').trim();
    if (!text) return null;
    const t = input.toLowerCase();
    return { text, vehicles: candidates.slice(0, 3), prefs, intent: detectIntent(t) };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Unified entry — tries real Groq (Polished Sales AI Expert) first,
 * falls back to deterministic demo brain when offline / unconfigured.
 * All callers should use this instead of mockRespond directly.
 */
export async function respond(history: ChatMessage[], input: string, prefs: CustomerPreferences): Promise<AIResponse> {
  const next = parsePrefs(input, prefs);
  const live = await liveRespond(history, input, next);
  if (live) return { ...live, prefs: next };
  return mockRespond(history, input, prefs);
}

export function estimateFinance(priceLakh: number, downPct: number, annualRatePct: number | null, months: number) {
  const price = priceLakh * 100000;
  const down = Math.round((price * downPct) / 100);
  const loan = price - down;
  if (annualRatePct == null || annualRatePct <= 0 || months <= 0) {
    return { priceLakh, downPct, annualRatePct, months, downPaymentBDT: down, loanBDT: loan, monthlyBDT: null };
  }
  const r = annualRatePct / 100 / 12;
  const monthly = Math.round((loan * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1));
  return { priceLakh, downPct, annualRatePct, months, downPaymentBDT: down, loanBDT: loan, monthlyBDT: monthly };
}
