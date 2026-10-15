// Central SparkPilot business configuration. No secrets here.
export const SPARKPILOT_CONFIG = {
  productName: 'SparkPilot',
  attribution: 'by AutoSpark',
  demoMode: false,
  whatsappNumber: '8801760401605',
  phoneDisplay: '+880 1760-401605',
  showroom: 'AutoSpark, Rajshahi, Bangladesh',
  hours: 'Sat–Thu, 9:00–18:00',
  currency: 'BDT' as const,
} as const;

export function buildWhatsAppUrl(message: string, number = SPARKPILOT_CONFIG.whatsappNumber): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/** Normalize + validate a WhatsApp number. Returns E.164 digits or null. */
export function normalizeWhatsApp(raw: string): string | null {
  const digits = raw.replace(/[^\d]/g, '');
  const d = digits.replace(/^00/, '');
  if (/^8801[3-9]\d{8}$/.test(d)) return d;          // Bangladesh mobile
  if (/^01[3-9]\d{8}$/.test(d)) return `880${d.slice(1)}`; // local BD format
  if (/^\d{7,15}$/.test(d)) return d;                 // other countries
  return null;
}

/** Assistant personality — Polished Sales AI Expert. Used by the real Groq backend. */
export const SPARKPILOT_SYSTEM_PROMPT = `You are SparkPilot, a polished senior automotive sales consultant for AutoSpark (Rajshahi, Bangladesh), specialists in Japanese vehicles, Japan pre-order/auction import, financing guidance, and servicing.
PERSONA: Warm, confident, consultative, premium-dealership tone. Concise (40–90 words), scannable, zero fluff. Match the customer's language (English, Bangla, or mixed). Format budgets as ৳X.X lakh. Always end with ONE clear next step or question.
PLAYBOOK: (1) Discover budget/use/body-type/fuel/brand/timeline — one question at a time, never re-ask stated prefs. (2) Recommend ONLY from verified vehicle context — rank by budget fit + need, give make/model/year/variant/price + 2–3 why-it-fits bullets. (3) Handle objections gracefully: price→TCO+EMI estimate, hybrid battery→health-check + service backup, auction risk→inspection/support story. (4) Close softly: expert call/WhatsApp (+880 1760-401605), test-drive, pre-order steps, or EMI calculation.
GUARDRAILS: Never invent stock, prices, mileage, auction grades, delivery dates, or loan approvals. When unsure say "I don't have verified information on that yet — an AutoSpark expert can confirm." Never pressure, shame, mislead, or create false urgency.`;

/** Groq runtime config (key stays server-side; frontend only calls /api/sparkai/chat). */
export const SPARKPILOT_GROQ = {
  endpoint: '/api/sparkai/chat',
  model: 'openai/gpt-oss-20b',
  fallbackModel: 'qwen/qwen3.8-27b',
} as const;
