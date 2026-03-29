import { test, expect } from '@playwright/test';

const BASE = process.env.BASE_URL || 'http://localhost:5173';

test('Testimonials highlighter is visible (EN or BN)', async ({ page }) => {
  await page.goto(`${BASE}/testimonials`, { waitUntil: 'domcontentloaded' });

  // Wait for the hero to appear
  await page.waitForSelector('h1', { timeout: 10000 });

  // Check for English text or Bengali fallback
  const enLocator = page.getByText("We've Delivered 700+ Cars from our Company!");
  const bnLocator = page.getByText('আমাদের কোম্পানি থেকে ৭০০+ গাড়ি সরবরাহ করেছি!');

  const enVisible = await enLocator.count().then(c => c > 0 ? enLocator.isVisible() : false).catch(() => false);
  const bnVisible = await bnLocator.count().then(c => c > 0 ? bnLocator.isVisible() : false).catch(() => false);

  expect(enVisible || bnVisible).toBeTruthy();
});
