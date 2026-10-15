import type { DemoVehicle, QuickAction } from '../types';

// Curated starter inventory shown by SparkPilot. Prices/availability confirmed by an expert before booking.
export const DEMO_VEHICLES: DemoVehicle[] = [
  { id: 'demo-axio-hybrid', make: 'Toyota', model: 'Axio', year: 2019, variant: 'G Hybrid', fuel: 'Hybrid · Petrol', hybrid: true, transmission: 'CVT', bodyType: 'Sedan', budgetLakh: 24.5, stock: 'demo', features: ['Hybrid synergy drive', 'Push start', 'Reverse camera', 'Toyota Safety Sense'], demo: true },
  { id: 'demo-aqua', make: 'Toyota', model: 'Aqua', year: 2018, variant: 'S', fuel: 'Hybrid · Petrol', hybrid: true, transmission: 'CVT', bodyType: 'Hatchback', budgetLakh: 16.8, stock: 'demo', features: ['Excellent city mileage', 'Compact parking', 'Push start'], demo: true },
  { id: 'demo-noah', make: 'Toyota', model: 'Noah', year: 2019, variant: 'X Hybrid', fuel: 'Hybrid · Petrol', hybrid: true, transmission: 'CVT', bodyType: 'MPV · 7-seater', budgetLakh: 32.0, stock: 'demo', features: ['7 seats, sliding doors', 'Family comfort', 'Dual auto AC'], demo: true },
  { id: 'demo-vezel', make: 'Honda', model: 'Vezel', year: 2019, variant: 'Hybrid Z', fuel: 'Hybrid · Petrol', hybrid: true, transmission: 'DCT', bodyType: 'SUV', budgetLakh: 29.5, stock: 'demo', features: ['SUV stance', 'Honda Sensing', 'Half-leather seats'], demo: true },
  { id: 'demo-grace', make: 'Honda', model: 'Grace', year: 2018, variant: 'Hybrid EX', fuel: 'Hybrid · Petrol', hybrid: true, transmission: 'DCT', bodyType: 'Sedan', budgetLakh: 21.0, stock: 'demo', features: ['Refined sedan', 'Cruise control', 'LED headlights'], demo: true },
  { id: 'demo-x-trail', make: 'Nissan', model: 'X-Trail', year: 2018, variant: '20X Hybrid', fuel: 'Hybrid · Petrol', hybrid: true, transmission: 'CVT · 4WD', bodyType: 'SUV', budgetLakh: 33.5, stock: 'demo', features: ['4WD option', 'Spacious boot', 'Around-view monitor'], demo: true },
  { id: 'demo-prius', make: 'Toyota', model: 'Prius', year: 2017, variant: 'S Touring', fuel: 'Hybrid · Petrol', hybrid: true, transmission: 'CVT', bodyType: 'Hatchback', budgetLakh: 23.0, stock: 'demo', features: ['Legendary efficiency', 'Heads-up display', 'Lane assist'], demo: true },
  { id: 'demo-fielder', make: 'Toyota', model: 'Fielder', year: 2018, variant: 'G Non-hybrid', fuel: 'Petrol', hybrid: false, transmission: 'CVT', bodyType: 'Wagon', budgetLakh: 22.5, stock: 'demo', features: ['Huge luggage space', 'Simple maintenance', 'Roof rails'], demo: true },
];

export const STARTER_ACTIONS: QuickAction[] = [
  { id: 'find', label: 'Find my ideal car', labelBn: 'আমার গাড়ি খুঁজুন', intent: 'find-car' },
  { id: 'explore', label: 'Explore Japanese cars', labelBn: 'জাপানি গাড়ি দেখুন', intent: 'explore' },
  { id: 'compare', label: 'Compare two vehicles', labelBn: 'তুলনা করুন', intent: 'compare' },
  { id: 'budget', label: 'Estimate my budget', labelBn: 'বাজেট হিসাব', intent: 'budget' },
  { id: 'preorder', label: 'Pre-order from Japan', labelBn: 'জাপান থেকে প্রি-অর্ডার', intent: 'preorder' },
  { id: 'service', label: 'Book a service', labelBn: 'সার্ভিস বুক করুন', intent: 'service' },
  { id: 'expert', label: 'Talk to an expert', labelBn: 'এক্সপার্টের সাথে কথা', intent: 'expert' },
];

export function filterDemoVehicles(f: { maxBudgetLakh?: number; hybrid?: boolean; bodyType?: string; make?: string }): DemoVehicle[] {
  return DEMO_VEHICLES.filter((v) => {
    if (f.maxBudgetLakh != null && v.budgetLakh > f.maxBudgetLakh) return false;
    if (f.hybrid === true && !v.hybrid) return false;
    if (f.hybrid === false && v.hybrid) return false;
    if (f.bodyType && !v.bodyType.toLowerCase().includes(f.bodyType.toLowerCase())) return false;
    if (f.make && v.make.toLowerCase() !== f.make.toLowerCase()) return false;
    return true;
  });
}

export function formatBDT(amount: number): string {
  return '৳' + Math.round(amount).toLocaleString('en-IN');
}

export function formatLakh(lakh: number): string {
  return `৳${lakh.toFixed(1)} lakh`;
}
