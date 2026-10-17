// ============================================================================
// KB #1 — CAR SALES KNOWLEDGE BASE
// Source of truth: KB/All Car Model, Package, Price & Details.md
// ----------------------------------------------------------------------------
// Every vehicle SparkPilot may recommend lives in CAR_MODELS below:
// 23 models × Ready Stock / Pre-order × Hybrid or trim variants.
//
// ► WHEN STOCK OR PRICES CHANGE: edit the matching entry in CAR_MODELS
//   (or update the source .md and re-import). Never let SparkPilot quote
//   anything that is not listed here.
// ============================================================================

export interface KbOffer {
  availability: 'Ready Stock' | 'Pre-order';
  /** 'Hybrid' | 'Non-Hybrid' | a named trim (e.g. 'Hard Top', 'F-200', 'EX') */
  type: string;
  years: string;
  /** Japanese auction grade as listed (e.g. '3.5/R' ready-stock, '4/4.5' pre-order). */
  grade: string;
  /** Price in lakh as listed — may be a single figure, a range, or per-variant figures. */
  priceLakh: string;
  /** Mileage exactly as listed on the source sheet (auction notation — confirm exact km with an expert). */
  mileage: string;
}

export interface KbCarModel {
  name: string;
  make: string;
  body: string;
  variants: string;
  cc: number;
  /** 'Hybrid' | 'Non-Hybrid' | 'Hybrid & Non-Hybrid' */
  fuel: string;
  /** Fuel/variant types not offered (e.g. ['Non-Hybrid']). */
  unavailable?: string[];
  offers: KbOffer[];
}

const R: KbOffer['availability'] = 'Ready Stock';
const P: KbOffer['availability'] = 'Pre-order';

// Price-notation note: the source sheet records some luxury-car prices in
// crore (e.g. 1.15 = 115 lakh) and Noah non-hybrid ready stock as "30580"
// (= 30.58 lakh). All figures below are normalized to lakh.
export const CAR_MODELS: KbCarModel[] = [
  {
    name: 'Toyota Axio', make: 'Toyota', body: 'Sedan', variants: 'EX', cc: 1500, fuel: 'Hybrid & Non-Hybrid',
    unavailable: ['Non-Hybrid'],
    offers: [
      { availability: R, type: 'Hybrid', years: '2020–2021', grade: '3.5/R', priceLakh: '22.50', mileage: '1.20' },
      { availability: P, type: 'Hybrid', years: '2020–2021', grade: '3.5/R', priceLakh: '21.50', mileage: '1.20' },
    ],
  },
  {
    name: 'Toyota Fielder', make: 'Toyota', body: 'Wagon', variants: 'EX', cc: 1500, fuel: 'Hybrid & Non-Hybrid',
    unavailable: ['Non-Hybrid'],
    offers: [
      { availability: R, type: 'Hybrid', years: '2020–2021', grade: '3.5/R', priceLakh: '22.50', mileage: '1.20' },
      { availability: P, type: 'Hybrid', years: '2020–2021', grade: '3.5/R', priceLakh: '21.50', mileage: '1.20' },
    ],
  },
  {
    name: 'Toyota Premio', make: 'Toyota', body: 'Sedan', variants: 'F, FL, FL Black, FL Base, FEX', cc: 1500, fuel: 'Non-Hybrid',
    unavailable: ['Hybrid'],
    offers: [
      { availability: R, type: 'Non-Hybrid', years: '2020–2021', grade: '4/4.5', priceLakh: '43/44/47/48 (by variant)', mileage: '1.20' },
    ],
  },
  {
    name: 'Toyota Allion', make: 'Toyota', body: 'Sedan', variants: 'A15, A15-G, A15-Plus', cc: 1500, fuel: 'Non-Hybrid',
    unavailable: ['Hybrid'],
    offers: [
      { availability: R, type: 'Non-Hybrid', years: '2020–2021', grade: '4/4.5', priceLakh: '42/43/46/47 (by variant)', mileage: '1.20' },
    ],
  },
  {
    name: 'Toyota Aqua', make: 'Toyota', body: 'Hatchback', variants: 'L, S, G', cc: 1500, fuel: 'Hybrid',
    unavailable: ['Non-Hybrid'],
    offers: [
      { availability: R, type: 'Hybrid', years: '2020–2021', grade: '3.5/R', priceLakh: '18/19.50 (by grade)', mileage: '1.20' },
      { availability: P, type: 'Hybrid', years: '2023–2025', grade: '3.5/R', priceLakh: '18.50', mileage: '1.20' },
    ],
  },
  {
    name: 'Toyota C-HR', make: 'Toyota', body: 'SUV / Crossover', variants: 'G Nardo, GR Sport', cc: 1800, fuel: 'Hybrid',
    unavailable: ['Non-Hybrid'],
    offers: [
      { availability: R, type: 'Hybrid', years: '2020–2021', grade: '3.5/R', priceLakh: '30.50', mileage: '1.30' },
      { availability: P, type: 'Hybrid', years: '2020–2021', grade: '4/4.5', priceLakh: '31.20', mileage: '60/70' },
    ],
  },
  {
    name: 'Nissan X-Trail', make: 'Nissan', body: 'SUV', variants: 'S, SV, SL, TL', cc: 2000, fuel: 'Hybrid & Non-Hybrid',
    unavailable: ['Non-Hybrid'],
    offers: [
      { availability: R, type: 'Hybrid', years: '2020–2021', grade: '3.5/R', priceLakh: '33.50', mileage: '1.30' },
      { availability: P, type: 'Hybrid', years: '2020–2021', grade: '3.5/R', priceLakh: '36.50', mileage: '60/70' },
    ],
  },
  {
    name: 'Mazda Axela', make: 'Mazda', body: 'Hatchback', variants: '—', cc: 1800, fuel: 'Hybrid',
    unavailable: ['Non-Hybrid'],
    offers: [
      { availability: R, type: 'Hybrid', years: '2021', grade: '3.5/R', priceLakh: '32.50', mileage: '1.20' },
      { availability: P, type: 'Hybrid', years: '2021', grade: '3.5/R', priceLakh: '35.50', mileage: '1.20' },
    ],
  },
  {
    name: 'Honda CR-V', make: 'Honda', body: 'SUV', variants: 'EX-L', cc: 2000, fuel: 'Hybrid & Non-Hybrid',
    offers: [
      { availability: R, type: 'Non-Hybrid', years: '2020–2022', grade: '3.5/R', priceLakh: '52.50', mileage: '1.20' },
      { availability: R, type: 'Hybrid', years: '2020–2022', grade: '3.5/R', priceLakh: '51.50', mileage: '1.20' },
      { availability: P, type: 'Non-Hybrid', years: '2020–2022', grade: '3.5/R', priceLakh: '52.50', mileage: '1.20' },
      { availability: P, type: 'Hybrid', years: '2020–2022', grade: '3.5/R', priceLakh: '48.50', mileage: '1.20' },
    ],
  },
  {
    name: 'Toyota Corolla Cross', make: 'Toyota', body: 'SUV / Crossover', variants: 'Z-Leather', cc: 1800, fuel: 'Hybrid',
    unavailable: ['Non-Hybrid'],
    offers: [
      { availability: R, type: 'Hard Top', years: '2021–2022', grade: '3.5/R', priceLakh: '42.50', mileage: '1.20' },
      { availability: R, type: 'Moon Roof', years: '2021–2022', grade: '3.5/R', priceLakh: '45.50', mileage: '1.20' },
      { availability: P, type: 'Hard Top', years: '2021–2022', grade: '4/4.5', priceLakh: '43.50', mileage: '60/70' },
      { availability: P, type: 'Moon Roof', years: '2021–2022', grade: '4/4.5', priceLakh: '46.50', mileage: '60/70' },
    ],
  },
  {
    name: 'Toyota Harrier', make: 'Toyota', body: 'SUV', variants: 'Z', cc: 2000, fuel: 'Hybrid & Non-Hybrid',
    offers: [
      { availability: R, type: 'Non-Hybrid', years: '2020–2021', grade: '3.5/R', priceLakh: '69', mileage: '1.20' },
      { availability: R, type: 'Hybrid', years: '2020–2021', grade: '3.5/R', priceLakh: '72.50', mileage: '1.20' },
      { availability: P, type: 'Non-Hybrid', years: '2020–2021', grade: '4/4.5', priceLakh: '75', mileage: '60/70' },
      { availability: P, type: 'Hybrid', years: '2020–2021', grade: '4/4.5', priceLakh: '60.50', mileage: '60/70' },
    ],
  },
  {
    name: 'Toyota Sienta', make: 'Toyota', body: 'MPV', variants: 'G Cuero', cc: 1500, fuel: 'Hybrid',
    unavailable: ['Non-Hybrid'],
    offers: [
      { availability: R, type: 'Hybrid', years: '2020–2021', grade: '3.5/R', priceLakh: '23.50', mileage: '1.20' },
      { availability: P, type: 'Hybrid', years: '2020–2021', grade: '4/4.5', priceLakh: '23.50', mileage: '60/70' },
    ],
  },
  {
    name: 'Toyota Noah', make: 'Toyota', body: 'MPV', variants: 'X, G, S-i, WxB', cc: 1800, fuel: 'Hybrid & Non-Hybrid',
    offers: [
      { availability: R, type: 'Non-Hybrid', years: '2020–2021', grade: '3.5/R', priceLakh: '30.58', mileage: '1.20' },
      { availability: R, type: 'Hybrid', years: '2020–2021', grade: '3.5/R', priceLakh: '32.50', mileage: '1.20' },
      { availability: P, type: 'Non-Hybrid', years: '2020–2021', grade: '4/4.5', priceLakh: '34.50', mileage: '60/70' },
      { availability: P, type: 'Hybrid', years: '2020–2021', grade: '4/4.5', priceLakh: '29.50', mileage: '60/70' },
    ],
  },
  {
    name: 'Toyota Esquire', make: 'Toyota', body: 'MPV', variants: 'Xi, Gi, Gi Premium', cc: 1800, fuel: 'Hybrid & Non-Hybrid',
    offers: [
      { availability: R, type: 'Non-Hybrid', years: '2020–2021', grade: '4/4.5', priceLakh: '34.50', mileage: '60/70' },
      { availability: R, type: 'Hybrid', years: '2020–2021', grade: '3.5/R', priceLakh: '35.50', mileage: '1.20' },
      { availability: P, type: 'Non-Hybrid', years: '2020–2021', grade: '3.5/R', priceLakh: '37.50', mileage: '1.20' },
      { availability: P, type: 'Hybrid', years: '2020–2021', grade: '4/4.5', priceLakh: '33.50', mileage: '60/70' },
    ],
  },
  {
    name: 'Honda Grace', make: 'Honda', body: 'Sedan', variants: 'EX', cc: 1500, fuel: 'Hybrid & Non-Hybrid',
    unavailable: ['Non-Hybrid'],
    offers: [
      { availability: R, type: 'Hybrid', years: '2020–2021', grade: '3.5/R', priceLakh: '27', mileage: '1.20' },
      { availability: P, type: 'Hybrid', years: '2020–2022', grade: '4/4.5', priceLakh: '25.50', mileage: '60/70' },
    ],
  },
  {
    name: 'Honda Civic', make: 'Honda', body: 'Sedan', variants: 'LX', cc: 1500, fuel: 'Hybrid & Non-Hybrid',
    unavailable: ['Non-Hybrid'],
    offers: [
      { availability: R, type: 'Hybrid', years: '2021–2022', grade: '3.5/R', priceLakh: '35', mileage: '1.20' },
      { availability: P, type: 'Hybrid', years: '2021–2022', grade: '4/4.5', priceLakh: '35.50', mileage: '60/70' },
    ],
  },
  {
    name: 'Toyota Yaris Cross', make: 'Toyota', body: 'SUV / Crossover', variants: 'X, G, Z (P-B)', cc: 1500, fuel: 'Hybrid',
    unavailable: ['Non-Hybrid'],
    offers: [
      { availability: R, type: 'Hybrid', years: '2020–2021', grade: '3.5/R', priceLakh: '30.50', mileage: '1.20' },
      { availability: P, type: 'Hybrid', years: '2020–2021', grade: '4/4.5', priceLakh: '29.50', mileage: '60/70' },
    ],
  },
  {
    name: 'Honda Vezel', make: 'Honda', body: 'SUV / Crossover', variants: 'X, Z, RS', cc: 1500, fuel: 'Hybrid',
    unavailable: ['Non-Hybrid'],
    offers: [
      { availability: R, type: 'Hybrid', years: '2021–2022', grade: '3.5/R', priceLakh: '43', mileage: '1.20' },
      { availability: P, type: 'Hybrid', years: '2021–2022', grade: '4/4.5', priceLakh: '40', mileage: '60/70' },
    ],
  },
  {
    name: 'Toyota Prius', make: 'Toyota', body: 'Hatchback', variants: 'S, S Touring, S Safety Plus, A Touring, A Touring Premium Selection', cc: 1800, fuel: 'Hybrid',
    unavailable: ['Non-Hybrid'],
    offers: [
      { availability: R, type: 'Hybrid', years: '2020–2021', grade: '3.5/R', priceLakh: '29.50', mileage: '1.20' },
      { availability: P, type: 'Hybrid', years: '2020–2021', grade: '4/4.5', priceLakh: '33.50', mileage: '60/70' },
    ],
  },
  {
    name: 'Honda Insight', make: 'Honda', body: 'Sedan', variants: 'EX, LX', cc: 1500, fuel: 'Hybrid',
    unavailable: ['Non-Hybrid'],
    offers: [
      { availability: R, type: 'EX', years: '2020–2021', grade: '3.5/R', priceLakh: '34.50', mileage: '60/70' },
      { availability: R, type: 'LX', years: '2020–2021', grade: '3.5/R', priceLakh: '37', mileage: '1.20' },
      { availability: P, type: 'EX', years: '2020–2021', grade: '4/4.5', priceLakh: '38', mileage: '1.20' },
      { availability: P, type: 'LX', years: '2020–2021', grade: '4/4.5', priceLakh: '35', mileage: '60/70' },
    ],
  },
  {
    name: 'Lexus NX', make: 'Lexus', body: 'SUV', variants: 'F-200, R-300, EX-300', cc: 2500, fuel: 'Hybrid',
    unavailable: ['Non-Hybrid'],
    offers: [
      { availability: R, type: 'F-200', years: '2020–2021', grade: '3.5/R', priceLakh: '75', mileage: '60/70' },
      { availability: R, type: 'R-300', years: '2020–2021', grade: '3.5/R', priceLakh: '115', mileage: '1.20' },
      { availability: R, type: 'EX-300', years: '2020–2021', grade: '3.5/R', priceLakh: '95', mileage: '60/70' },
      { availability: P, type: 'F-200', years: '2020–2021', grade: '4/4.5', priceLakh: '83', mileage: '1.20' },
      { availability: P, type: 'R-300', years: '2020–2021', grade: '4/4.5', priceLakh: '110', mileage: '60/70' },
      { availability: P, type: 'EX-300', years: '2020–2021', grade: '4/4.5', priceLakh: '90', mileage: '60/70' },
    ],
  },
  {
    name: 'Toyota Land Cruiser Prado', make: 'Toyota', body: 'SUV', variants: 'TX, TXL', cc: 2500, fuel: 'Hybrid & Non-Hybrid',
    offers: [
      { availability: R, type: 'TX', years: '2019, 2021', grade: '3.5/R', priceLakh: '138', mileage: '1.30' },
      { availability: R, type: 'TXL', years: '2020–2021', grade: '3.5/R', priceLakh: '150', mileage: '1.20' },
      { availability: P, type: 'TX', years: '2019–2020', grade: '3.5/R', priceLakh: '140', mileage: '1.20' },
      { availability: P, type: 'TXL', years: '2020–2021', grade: '4/4.5', priceLakh: '150', mileage: '60/70' },
    ],
  },
  {
    name: 'Toyota Crown', make: 'Toyota', body: 'Sedan', variants: 'RS Limited, RS Advance', cc: 2500, fuel: 'Hybrid',
    unavailable: ['Non-Hybrid'],
    offers: [
      { availability: R, type: 'RS', years: '2019–2020', grade: '3.5/R', priceLakh: '72', mileage: '1.30' },
      { availability: R, type: 'New G', years: '2019–2020', grade: '3.5/R', priceLakh: '150', mileage: '1.30' },
      { availability: R, type: 'Twin Turbo', years: '2019–2020', grade: '3.5/R', priceLakh: '115', mileage: '1.30' },
      { availability: P, type: 'RS', years: '2019–2020', grade: '4/4.5', priceLakh: '73', mileage: '60/70' },
      { availability: P, type: 'New G', years: '2019–2020', grade: '4/4.5', priceLakh: '100', mileage: '60/70' },
      { availability: P, type: 'Twin Turbo', years: '2019–2020', grade: '4/4.5', priceLakh: '110', mileage: '60/70' },
    ],
  },
];

/** Lowest listed price (lakh) for a model — used for the budget index. */
export function entryPriceLakh(m: KbCarModel): number {
  let min = Infinity;
  for (const o of m.offers) {
    const v = parseFloat(o.priceLakh.replace(/,/g, ''));
    if (!Number.isNaN(v) && v < min) min = v;
  }
  return Number.isFinite(min) ? min : 999;
}

export const SALES_KB_SOURCE_NOTE =
  'Source: AutoSpark official price sheet — KB/All Car Model, Package, Price & Details.md.';

function lineupText(): string {
  const lines: string[] = [];
  for (const m of CAR_MODELS) {
    lines.push(`## ${m.name} | ${m.variants !== '—' ? `variants ${m.variants}, ` : ''}${m.cc} cc | ${m.fuel} | ${m.body}`);
    for (const o of m.offers) {
      lines.push(
        `- ${o.availability} · ${o.type} · Years ${o.years} · Grade ${o.grade} · ৳${o.priceLakh} lakh · Mileage ${o.mileage}`,
      );
    }
    if (m.unavailable?.length) lines.push(`- Not available: ${m.unavailable.join(', ')} (do not offer these)`);
  }
  return lines.join('\n');
}

function priceIndexText(): string {
  return [...CAR_MODELS]
    .sort((a, b) => entryPriceLakh(a) - entryPriceLakh(b))
    .map((m) => `৳${entryPriceLakh(m)} lakh → ${m.name} (${m.body}${m.fuel.includes('Hybrid') && m.fuel.includes('Non') ? '' : m.fuel === 'Hybrid' ? ', Hybrid' : ', Non-Hybrid'})`)
    .join('\n');
}

/** Flatten the sales KB into a single system-prompt-ready text block. */
export function buildSalesKbText(): string {
  return [
    '### AUTOSPARK CAR SALES KNOWLEDGE BASE (verified — the ONLY vehicles SparkPilot may recommend) ###',
    'NOTATION:',
    '- Prices are in Bangladeshi lakh (৳ lakh). Some entries show per-grade or per-variant figures (e.g. "43/44/47/48") or a range — present the range and confirm the exact variant price with an expert.',
    '- Grade is the Japanese auction grade as listed: "3.5/R" = typical ready-stock grade (body/interior), "4/4.5" = typical pre-order grade.',
    '- Mileage is exactly as listed on the source auction sheet (e.g. "1.20", "60/70") — never convert or invent exact km; tell customers an expert can confirm the exact reading.',
    '- "Ready Stock" = car is in Bangladesh now. "Pre-order" = sourced via Japan auction/import; price and grade are typical, final vehicle is confirmed per order.',
    '- Never claim a model, variant, year, grade, fuel type, or price that is not listed below. If a customer wants something unlisted, offer Japan pre-order sourcing via an expert.',
    '',
    '[FULL MODEL MATRIX]',
    lineupText(),
    '',
    '[BUDGET QUICK INDEX — lowest listed price per model]',
    priceIndexText(),
    '',
    '[ABOUT AUTOSPARK SALES]',
    [
      'AutoSpark is a Japanese-car specialist dealership in Rajshahi, Bangladesh: ready-stock sales, Japan pre-order / auction import, hybrid consulting, and financing guidance.',
      'Showroom hours: Saturday–Thursday, 9:00–18:00. Expert/WhatsApp: +880 1760-401605.',
    ].join('\n'),
    '',
    '[JAPAN PRE-ORDER / AUCTION IMPORT — how it works]',
    [
      '1) Customer shares desired model + variant + year + budget.',
      '2) AutoSpark sources Japanese auction/dealer options and shares verified listings with photos, auction-sheet translation, and landed-cost estimate.',
      '3) Customer confirms the vehicle and pays the agreed booking amount.',
      '4) AutoSpark handles purchase, export documents, shipping, customs, registration support, and delivery in Bangladesh.',
      'Never quote a fixed delivery date — promise an expert-confirmed timeline instead.',
    ].join('\n'),
    '',
    '[FINANCING]',
    [
      'AutoSpark helps estimate budgets and EMI plans; final loan approval comes from the bank/financial institution.',
      'SparkPilot can compute an indicative monthly installment when the customer gives down-payment %, tenure, and annual rate.',
      'For official bank rates or approval guarantees → connect to an expert (+880 1760-401605). Never approve or promise a loan.',
    ].join('\n'),
    '',
    '[BUYING PROCESS]',
    [
      '1) Consultation (SparkPilot does this interactively) → 2) Shortlist 2–3 matching models from the matrix → 3) Expert confirms exact price, condition, availability → 4) Test drive / showroom visit in Rajshahi → 5) Booking & paperwork → delivery.',
    ].join('\n'),
    '',
    '[SALES FAQS]',
    [
      '1. Q: Are the listed prices final? A: They are the official listed prices; the expert confirms the exact variant price and availability before booking.',
      '2. Q: Do you offer test drives? A: Yes — share your name and WhatsApp number and an expert will arrange a test drive in Rajshahi.',
      '3. Q: What is ready stock vs pre-order? A: Ready stock is already in Bangladesh and can be viewed/booked now; pre-order is sourced fresh from Japan (typical grade/price shown, final vehicle confirmed per order).',
      '4. Q: Do you take trade-ins? A: An expert can evaluate your current car for exchange — share details via WhatsApp (+880 1760-401605).',
      '5. Q: Why are pre-order mileage figures different? A: Pre-order cars are sourced per order; the listed figure is typical — the exact vehicle is confirmed with photos and auction sheet.',
    ].join('\n'),
    '',
    SALES_KB_SOURCE_NOTE,
  ].join('\n\n');
}
