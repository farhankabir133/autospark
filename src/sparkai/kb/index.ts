import type { ChatMessage } from '../types';
import { buildSalesKbText } from './sales';
import { buildServicesKbText } from './services';

export { CAR_MODELS, entryPriceLakh, buildSalesKbText } from './sales';
export type { KbCarModel, KbOffer } from './sales';
export { CAR_SERVICES_KB, buildServicesKbText } from './services';

export type KbTopic = 'sales' | 'services' | 'both';

export interface KbPayload {
  sales?: string;
  services?: string;
}

const SERVICES_RE =
  /service|servicing|maintenance|repair|overhaul|diagnos|oil change|engine oil|brake|battery|a\/c|ac service|air.?cond|coolant|radiator|suspension|gearbox|gear box|polish|polishing|paint|dent|wash|wax|ceramic|ppf|warranty|pickup|drop.?off|mechanic|সার্ভিস|মেরামত|রিপেয়ার|ব্রেক|ব্যাটারি|ঠান্ডা|পলিশ|ওয়াশ/i;
// Strong sales signals: specific models/body types/fuel/finance — the word
// "price" alone is generic (a service question can say price too).
const SALES_STRONG_RE =
  /buy|purchase|budget|suggest|recommend|lakh|lac\b|hybrid|petrol|sedan|suv|mpv|hatchback|wagon|7.?seat|toyota|honda|nissan|mazda|suzuki|lexus|axio|aqua|noah|vezel|grace|prius|fielder|premio|allion|sienta|esquire|harrier|civic|insight|axela|x-?trail|c-hr|corolla|yaris|crown|prado|pre.?order|preorder|auction|import|japan|financ|loan|emi|installment|down.?payment|test.?drive|ready stock|inventory|কিনা|কিনতে|বাজেট|হাইব্রিড|প্রি-?অর্ডার|আমদানি|লোন|কিস্তি|টেস্ট/i;
// Generic commercial words — sales only when no service terms present.
const SALES_RE =
  /price|cost|charge|quote|buy|purchase|car|vehicle|গাড়ি|দাম/i;

/**
 * Route the conversation to the right knowledge base(s).
 * - Service terms → services KB (unless a strong sales signal also appears → both).
 * - Strong sales signal → sales KB.
 * - Generic commercial wording or unclear → sales; greeting/other → both.
 */
export function detectKbTopic(input: string, history: ChatMessage[] = []): KbTopic {
  const recent = [...history.slice(-4).map((m) => m.text), input].join('\n');
  const services = SERVICES_RE.test(recent);
  const salesStrong = SALES_STRONG_RE.test(recent);
  if (services && salesStrong) return 'both';
  if (services) return 'services';
  if (salesStrong) return 'sales';
  if (SALES_RE.test(recent)) return 'sales';
  return 'both';
}

/** Build the KB system-prompt blocks for one chat request. */
export function buildKbPayload(input: string, history: ChatMessage[] = []): KbPayload {
  const recent = [...history.slice(-4).map((m) => m.text), input].join('\n');
  // Pure greetings/smalltalk need no KB — the persona alone answers them.
  // (Also keeps requests small for Groq's free-tier tokens-per-minute limit.)
  if (!SERVICES_RE.test(recent) && !SALES_STRONG_RE.test(recent) && !SALES_RE.test(recent)) return {};
  const topic = detectKbTopic(input, history);
  const payload: KbPayload = {};
  if (topic === 'sales' || topic === 'both') payload.sales = buildSalesKbText();
  if (topic === 'services' || topic === 'both') payload.services = buildServicesKbText();
  return payload;
}
