// ============================================================================
// KB #2 — CAR SERVICES KNOWLEDGE BASE
// Source of truth: KB/All Car Model, Package, Price & Details.md (official
// price list) — all prices below are VERIFIED against that list.
// ----------------------------------------------------------------------------
// ► TO EXTEND: add only services with a confirmed price (e.g. hybrid battery
//   health check, PPF) to the catalog with their real charge. Never quote a
//   price that is not listed here.
// ============================================================================

export interface ServiceKbEntry {
  name: string;
  priceTk: number | string;
  duration: string;
  includes: string;
}

export interface ServicesKb {
  about: string;
  catalog: ServiceKbEntry[];
  packages: { name: string; priceTk: number; includes: string }[];
  policies: string;
  faqs: { q: string; a: string }[];
}

export const CAR_SERVICES_KB: ServicesKb = {
  about: [
    'AutoSpark Service Center — professional car care in Rajshahi, Bangladesh. All brands serviced (including Japanese hybrids), by certified technicians.',
    'Service hours: Saturday–Thursday, 9:00–18:00. Booking/WhatsApp: +880 1760-401605.',
    'All prices below are from the official AutoSpark price list. If a requested service is not listed, do not invent a price — say an expert will confirm.',
    // ► TODO(owner): add technician count, equipment (OBD scanners, hybrid-battery
    //   tester…), genuine-parts policy, and any brand specializations.
  ].join('\n'),

  catalog: [
    // ===== MAINTENANCE =====
    { name: 'Brake Oil Change', priceTk: 1500, duration: '30–45 min', includes: 'DOT 4 brake fluid, system bleeding, pressure test, safety inspection' },
    { name: 'Master Service', priceTk: 4000, duration: '2–3 hours', includes: 'Engine oil change, all filters replaced, fluid top-up, multi-point inspection' },
    { name: 'Super Master Service', priceTk: 5500, duration: '3–4 hours', includes: 'All Master features + premium synthetic oil, complete diagnostics, interior cleaning' },
    { name: 'Battery Service', priceTk: 4500, duration: '1–2 hours', includes: 'Battery load test, terminal cleaning, charging system check, replacement if needed' },
    { name: 'Brake Service', priceTk: 600, duration: '45 min', includes: 'Brake pad inspection, rotor check, adjustment, performance test' },
    { name: 'Car Wash', priceTk: 500, duration: '30 min', includes: 'Exterior wash, wheel cleaning, window cleaning, quick dry' },
    { name: 'A/C Service', priceTk: 2000, duration: '1–2 hours', includes: 'System diagnostic, gas recharge, leak detection, filter cleaning' },
    // ===== REPAIR =====
    { name: 'Engine Overhauling', priceTk: 8500, duration: '3–5 days', includes: 'Complete teardown, parts replacement, precision assembly, performance testing' },
    { name: 'Gear Box Open/Fitting', priceTk: 5500, duration: '1–2 days', includes: 'Gearbox removal, internal inspection, parts replacement, precision refitting' },
    { name: 'Engine Mounting', priceTk: 2000, duration: '2–3 hours', includes: 'Mount inspection, quality parts, vibration test, alignment check' },
    { name: 'Brake Booster Replace', priceTk: 8000, duration: '2–3 hours', includes: 'Booster replacement, vacuum test, system bleeding, performance test' },
    { name: 'Suspension (Front)', priceTk: 4500, duration: '3–4 hours', includes: 'Shock replacement, strut service, bushing check, alignment included' },
    { name: 'Suspension (Front & Rear)', priceTk: 6000, duration: '5–6 hours', includes: 'Full suspension work, all corners serviced, premium parts, wheel alignment' },
    // ===== DETAILING & PAINT =====
    { name: 'Full Car Polish (Normal)', priceTk: 4000, duration: '4–5 hours', includes: 'Machine polish, scratch removal, wax coating, UV protection' },
    { name: 'Full Car Polish (High Quality)', priceTk: 6000, duration: '6–8 hours', includes: 'Multi-stage polish, paint correction, ceramic sealant, long-lasting shine' },
    { name: '1 Part Color (White & Silver)', priceTk: 5000, duration: '1–2 days', includes: 'Color matching, premium paint, clear coat, buffing finish' },
    { name: '1 Part Color (Any Other Color)', priceTk: 7000, duration: '1–2 days', includes: 'Perfect color match, metallic options, premium finish, quality guarantee' },
    { name: 'Full Body Color (White/Silver)', priceTk: 60000, duration: '5–7 days', includes: 'Without denting work — full body prep, premium paint, multiple clear coats, professional finish' },
    { name: 'Full Body Color (Any Other Color)', priceTk: 80000, duration: '7–10 days', includes: 'Without denting work — color customization, metallic & pearl, show quality finish, full warranty' },
  ],

  packages: [
    { name: 'Essential Care', priceTk: 5500, includes: 'Brake oil change, car wash, brake inspection, basic inspection, fluid check' },
    { name: 'Complete Care (recommended)', priceTk: 12000, includes: 'Master service, A/C service, full car polish, all fluid changes, priority scheduling' },
    { name: 'Premium Care', priceTk: 22000, includes: 'Super Master service, premium polish, A/C service, battery service, front suspension, free pickup/drop, VIP lounge' },
  ],

  policies: [
    'Warranty: minimum 12-month or 20,000 km warranty on repairs; ceramic coatings 5 years; PPF 10 years.',
    'Pickup & drop-off: complimentary within 20 km for services over ৳500 BDT; Premium package customers get unlimited free pickup.',
    'Waiting: comfortable lounge with free WiFi, refreshments and TV; VIP lounge with workstations for Premium customers.',
    'Oil change interval guidance: synthetic every 10,000–15,000 km or 12 months; conventional every 5,000–7,000 km or 6 months.',
    // ► TODO(owner): confirm these policies are current; add payment methods,
    //   booking lead time, and any service guarantees.
  ].join('\n'),

  faqs: [
    { q: 'How long does a full car detailing take?', a: 'A full detailing typically takes 4–6 hours depending on vehicle size and condition; premium detailing with paint correction may take 1–2 days.' },
    { q: 'Do you offer pickup and drop-off?', a: 'Yes — complimentary within a 20 km radius for services over ৳500 BDT; Premium package customers get unlimited free pickup.' },
    { q: 'What warranty do you provide on repairs?', a: 'All repairs carry a minimum 12-month or 20,000 km warranty. Ceramic coatings have 5-year and PPF 10-year warranties.' },
    { q: 'Can I wait while my car is serviced?', a: 'Yes — free WiFi, refreshments and TV in the waiting lounge; VIP lounge with workstations for Premium customers.' },
    { q: 'How often should I change my oil?', a: 'Synthetic oil: every 10,000–15,000 km or 12 months. Conventional oil: every 5,000–7,000 km or 6 months — whichever comes first.' },
    { q: 'Do you service all car brands?', a: 'Yes, all makes and models including Japanese hybrids and luxury brands — technicians are certified for multiple brands.' },
    // ► TODO(owner): add every recurring service question + official answer.
  ],
};

/** Flatten the services KB into a single system-prompt-ready text block. */
export function buildServicesKbText(): string {
  const k = CAR_SERVICES_KB;
  return [
    '### AUTOSPARK CAR SERVICES KNOWLEDGE BASE ###',
    '[ABOUT]', k.about,
    '[SERVICE CATALOG (name | price BDT | duration | includes)]',
    k.catalog.map((s) => `- ${s.name} | ৳${s.priceTk} | ${s.duration} | ${s.includes}`).join('\n'),
    '[SERVICE PACKAGES]',
    k.packages.map((p) => `- ${p.name} | ৳${p.priceTk} | ${p.includes}`).join('\n'),
    '[POLICIES & GUIDANCE]', k.policies,
    '[SERVICE FAQS]',
    k.faqs.map((f, i) => `${i + 1}. Q: ${f.q}\n   A: ${f.a}`).join('\n'),
    'Source: AutoSpark official price list — KB/All Car Model, Package, Price & Details.md.',
  ].join('\n\n');
}
