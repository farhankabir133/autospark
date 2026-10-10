/** Shared payment helpers: CORS allowlist, validation, sanitized logging. */
export const ALLOWED_ORIGINS = new Set([
  'https://autosparkbd.com',
  'https://www.autosparkbd.com',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
]);

export function corsOrigin(reqOrigin: string | undefined): string {
  if (reqOrigin && ALLOWED_ORIGINS.has(reqOrigin)) return reqOrigin;
  return 'https://autosparkbd.com';
}

export function setCors(res: any, origin: string) {
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
}

const BD_PHONE = /^01[3-9]\d{8}$/;

export interface InitPayload {
  cart?: Array<{ price?: number; qty?: number; quantity?: number; name?: string }>;
  total_amount?: number | string;
  customer_name?: string;
  mobile?: string;
  email?: string;
  address?: string;
  thana?: string;
  district?: string;
}

export function validateInitPayload(body: InitPayload): { ok: boolean; error?: string; amount?: number } {
  const { cart, total_amount, customer_name, mobile, address, thana, district } = body ?? {};
  if (!customer_name || String(customer_name).trim().length < 3) return { ok: false, error: 'Invalid customer name' };
  if (!mobile || !BD_PHONE.test(String(mobile).trim())) return { ok: false, error: 'Invalid BD mobile (01XXXXXXXXX)' };
  if (!address || String(address).trim().length < 5) return { ok: false, error: 'Invalid address' };
  if (!thana || !district) return { ok: false, error: 'Thana/district required' };
  const amount = Number(total_amount);
  if (!Number.isFinite(amount) || amount < 10 || amount > 5000000) return { ok: false, error: 'Invalid amount (10–5000000 BDT)' };
  if (cart !== undefined) {
    if (!Array.isArray(cart) || cart.length === 0 || cart.length > 100) return { ok: false, error: 'Invalid cart' };
    for (const it of cart) {
      const price = Number(it?.price);
      const qty = Number(it?.qty ?? it?.quantity ?? 1);
      if (!Number.isFinite(price) || price < 0 || price > 5000000) return { ok: false, error: 'Invalid cart price' };
      if (!Number.isInteger(qty) || qty < 1 || qty > 99) return { ok: false, error: 'Invalid cart quantity' };
    }
    // Server-side amount recalculation guard: claimed total must be >= sum - tolerance
    const sum = cart.reduce((s, it) => s + Number(it.price) * Number(it.qty ?? (it as any).quantity ?? 1), 0);
    if (sum > 0 && Math.abs(sum - amount) > Math.max(1, sum * 0.02)) {
      return { ok: false, error: 'Amount mismatch with cart total' };
    }
  }
  if (String(customer_name).length > 100 || String(address).length > 500) return { ok: false, error: 'Field too long' };
  return { ok: true, amount };
}

export function newTranId(): string {
  const rand = Math.random().toString(36).slice(2, 10);
  return `autospark-${Date.now()}-${rand}`;
}

/** Verify transaction with SSLCommerz validation API (server-to-server). */
export async function validateWithSSLCommerz(valId: string): Promise<{ valid: boolean; amount?: number; tranId?: string; raw?: any }> {
  const STORE_ID = process.env.SSLCOMMERZ_STORE_ID || process.env.STORE_ID;
  const STORE_PASS = process.env.SSLCOMMERZ_STORE_PASSWORD || process.env.STORE_PASS;
  const IS_LIVE = (process.env.SSLCZ_IS_LIVE || 'true') !== 'false';
  if (!STORE_ID || !STORE_PASS || !valId) return { valid: false };
  const base = IS_LIVE ? 'https://securepay.sslcommerz.com' : 'https://sandbox.sslcommerz.com';
  try {
    const url = `${base}/validator/api/validationserverAPI.php?val_id=${encodeURIComponent(valId)}&store_id=${encodeURIComponent(STORE_ID)}&store_passwd=${encodeURIComponent(STORE_PASS)}&v=1&format=json`;
    const r = await fetch(url);
    if (!r.ok) return { valid: false };
    const data = await r.json();
    const status = String(data?.status ?? '').toUpperCase();
    if (status === 'VALID' || status === 'VALIDATED') {
      return { valid: true, amount: Number(data.amount), tranId: String(data.tran_id ?? ''), raw: { status: data.status, tran_id: data.tran_id, amount: data.amount, currency: data.currency } };
    }
    return { valid: false, raw: { status: data.status } };
  } catch {
    return { valid: false };
  }
}
