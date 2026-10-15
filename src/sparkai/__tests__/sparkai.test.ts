import { describe, it, expect } from 'vitest';
import { normalizeWhatsApp, buildWhatsAppUrl } from '../../sparkai/config';
import { filterDemoVehicles, formatBDT } from '../../sparkai/data/demo';
import { estimateFinance, mockRespond } from '../../sparkai/services/ai';
import { LeadSchema } from '../../sparkai/services/lead';

describe('SparkPilot skeleton', () => {
  it('renders logo variants without crashing', async () => {
    const { SparkPilotLogo, SparkMark } = await import('../../sparkai/components/Logo');
    expect(typeof SparkPilotLogo).toBe('function');
    expect(typeof SparkMark).toBe('function');
  });

  it('filters demo vehicles by budget + hybrid', () => {
    const r = filterDemoVehicles({ maxBudgetLakh: 25, hybrid: true });
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((v) => v.budgetLakh <= 25 && v.hybrid)).toBe(true);
  });

  it('calculates finance with real math + null rate state', () => {
    const e = estimateFinance(25, 30, 12, 48);
    expect(e.downPaymentBDT).toBe(750000);
    expect(e.monthlyBDT).toBeGreaterThan(30000);
    const noRate = estimateFinance(25, 30, null, 48);
    expect(noRate.monthlyBDT).toBeNull();
    expect(formatBDT(100000)).toContain('00,000');
  });

  it('validates + normalizes WhatsApp numbers', () => {
    expect(normalizeWhatsApp('01712345678')).toBe('8801712345678');
    expect(normalizeWhatsApp('+8801712345678')).toBe('8801712345678');
    expect(normalizeWhatsApp('abc')).toBeNull();
    expect(buildWhatsAppUrl('hi there')).toContain('text=hi%20there');
    const bad = LeadSchema.safeParse({ name: 'A', whatsapp: 'xyz', language: 'English', interest: 'Axio', budgetRange: 'x', timeline: 'y', consent: false });
    expect(bad.success).toBe(false);
    const good = LeadSchema.safeParse({ name: 'Rahim', whatsapp: '01712345678', language: 'English', interest: 'Axio Hybrid', budgetRange: '৳18–25 lakh', timeline: 'Within 1 month', consent: true });
    expect(good.success).toBe(true);
  });

  it('demo assistant remembers budget (no re-ask)', async () => {
    const r1 = await mockRespond([], 'Around 25 lakh. Hybrid preferred.', {});
    expect(r1.prefs?.budgetLakh).toBe(25);
    expect(r1.prefs?.hybrid).toBe(true);
    const r2 = await mockRespond([], 'Show me family options', r1.prefs ?? {});
    expect(r2.text).not.toMatch(/budget.*\?.*budget/i);
  }, 10000);
});
