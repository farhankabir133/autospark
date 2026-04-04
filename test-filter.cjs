const products = [
  { name_en: 'Wireless Car Play', category: 'Accessories', description_en: '' },
  { name_en: 'Dash Cam Pro 4K', category: 'Electronics', description_en: '4K Ultra HD dash camera with night vision and GPS tracking.' },
  { name_en: 'Car Air Purifier', category: 'Interior', description_en: 'Advanced HEPA filtration for clean and fresh cabin air.' },
  { name_en: 'Premium Car Cover', category: 'Exterior', description_en: 'All-weather protection, dust-proof and water-resistant car cover.' },
  { name_en: 'Cosmic Wax', category: 'Accessories', description_en: '' }
];

const term = "cosmic wax".trim().toLowerCase();
const keywords = term.split(/\s+/).filter(k => k.length > 0);

const scoredProducts = products.map(p => {
  let score = 0;
  const nameEn = (p.name_en || p.name || '').toLowerCase();
  const nameBn = (p.name_bn || '').toLowerCase();
  const descEn = (p.description_en || p.description || '').toLowerCase();
  const brand = (p.brand || '').toLowerCase();
  const sku = (p.sku || '').toLowerCase();
  const category = (p.category || '').toLowerCase();

  // 1. Exact phrase match gets highest priority
  if (nameEn === term || sku === term) score += 100;
  if (nameEn.includes(term)) score += 50;
  if (sku.includes(term)) score += 50;
  if (brand.includes(term)) score += 30;
  if (nameBn.includes(term)) score += 20;

  // 2. Keyword matching for partial precision
  let matchedKeywords = 0;
  keywords.forEach(kw => {
    let kwMatched = false;
    if (nameEn.includes(kw)) { score += 10; kwMatched = true; }
    if (sku.includes(kw)) { score += 10; kwMatched = true; }
    if (brand.includes(kw)) { score += 8; kwMatched = true; }
    if (category.includes(kw)) { score += 5; kwMatched = true; }
    if (nameBn.includes(kw)) { score += 4; kwMatched = true; }
    if (descEn.includes(kw)) { score += 2; kwMatched = true; }
    if (kwMatched) matchedKeywords++;
  });

  if (matchedKeywords === keywords.length && keywords.length > 1) {
    score += 20;
  }
  return { name: nameEn, score };
});

const result = scoredProducts.filter(item => item.score > 0);
console.log("SCORES for 'cosmic wax':", result);

