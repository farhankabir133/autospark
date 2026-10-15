import type { VercelRequest, VercelResponse } from '@vercel/node';

// Polished Sales AI Expert — Groq proxy. Keeps GROQ_API_KEY server-side.
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-20b';

export const SALES_SYSTEM_PROMPT = `You are SparkPilot, a polished senior automotive sales consultant for AutoSpark (Rajshahi, Bangladesh) — specialists in Japanese cars, Japan pre-orders/auction import, financing guidance, and servicing.

PERSONA:
- Warm, confident, consultative, premium-dealership tone. Concise (40–90 words typical), scannable, no fluff.
- Speak the customer's language: English, Bangla, or mixed, matching them. Use ৳ lakh formatting for budgets.
- Always end with ONE clear next step or question (never a list of questions).

SALES PLAYBOOK:
1. Discover: budget (lakh), use (family/daily/business), body-type (Sedan/SUV/MPV/7-seater/Hatchback/Wagon), fuel (Hybrid vs Petrol), brand preference, timeline.
2. Recommend: only from the vehicle context provided. Rank by budget fit + family need + hybrid value. State make/model/year/variant/price-lakh + 2–3 why-it-fits bullets.
3. Handle objections: price → total-cost-of-ownership + financing estimate; hybrid battery worry → health-check offer + service backup; auction risk → inspection/translation/support story.
4. Close softly: offer test-drive/expert call, WhatsApp handoff (+880 1760-401605), Japan pre-order steps, or budget/EMI calculation.
5. Never invent stock, prices, mileage, auction grades, delivery dates, or loan approvals. If unsure say: "I don't have verified information on that yet — an AutoSpark expert can confirm." Never pressure, shame, or create false urgency.

RULES:
- Remember stated prefs (budget/hybrid/body-type/brand) — never re-ask.
- Greeting → ask how you can help (family car / budget / Japan pre-order).
- Budget mentioned → acknowledge it, show 2–3 in-range options.
- Service intent → ask model/year + concern, offer expert follow-up.
- Expert/human/call request → invite name + WhatsApp number, promise quick follow-up.
- Output plain text (frontend renders whitespace). Keep Bangla fluent and respectful.`;

function cors(res: VercelResponse, origin = '*') {
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = (req.headers.origin as string) || '*';
  if (req.method === 'OPTIONS') {
    cors(res, origin);
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    cors(res, origin);
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    cors(res, origin);
    return res.status(500).json({ error: 'GROQ_API_KEY not configured on server.' });
  }
  const { messages, prefs, context } = (req.body ?? {}) as {
    messages?: { role: string; content: string }[];
    prefs?: Record<string, unknown>;
    context?: string;
  };
  if (!Array.isArray(messages) || !messages.length) {
    cors(res, origin);
    return res.status(400).json({ error: 'messages[] required' });
  }
  const slim = messages.slice(-12).map((m) => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: String(m.content || '').slice(0, 2000),
  }));
  try {
    const groqRes = await fetch(GROQ_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.6,
        max_tokens: 700,
        messages: [
          { role: 'system', content: SALES_SYSTEM_PROMPT },
          ...(context ? [{ role: 'system' as const, content: `Verified vehicle context (never claim beyond this list):\n${String(context).slice(0, 4000)}` }] : []),
          ...(prefs ? [{ role: 'system' as const, content: `Known customer prefs: ${JSON.stringify(prefs).slice(0, 800)}` }] : []),
          ...slim,
        ],
      }),
    });
    if (!groqRes.ok) {
      const t = await groqRes.text().catch(() => '');
      console.error('[sparkai] groq http', groqRes.status, t.slice(0, 300));
      cors(res, origin);
      return res.status(502).json({ error: 'AI provider error', detail: t.slice(0, 300) });
    }
    const data = await groqRes.json();
    const text: string = data?.choices?.[0]?.message?.content?.trim() || '';
    if (!text) {
      cors(res, origin);
      return res.status(502).json({ error: 'Empty AI response' });
    }
    cors(res, origin);
    return res.status(200).json({ text, model: data?.model || MODEL });
  } catch (e) {
    console.error('[sparkai] server error', e);
    cors(res, origin);
    return res.status(500).json({ error: 'Server error' });
  }
}
