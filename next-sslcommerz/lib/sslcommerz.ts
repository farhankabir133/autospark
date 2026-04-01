// @ts-ignore - sslcommerz-lts doesn't have TypeScript types, but it works fine
import SSLCommerzPayment from 'sslcommerz-lts';

export function createSSLCommerz() {
  const store_id = process.env.STORE_ID;
  const store_passwd = process.env.STORE_PASS;
  const is_live = process.env.IS_LIVE === 'true';

  if (!store_id || !store_passwd) {
    throw new Error('Missing STORE_ID or STORE_PASS environment variables');
  }

  return new SSLCommerzPayment(store_id, store_passwd, is_live);
}
