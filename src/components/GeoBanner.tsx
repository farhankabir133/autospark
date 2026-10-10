import { useEffect, useState } from 'react';

const CACHE_KEY = 'autospark-geo-allowed';
const CACHE_TTL = 24 * 3600 * 1000;

/** Non-blocking geo notice: never blocks render; bots/crawlers always pass. */
export function GeoBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    if (/bot|crawl|spider|slurp|mediapartners|google/i.test(ua)) return;
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { allowed, ts } = JSON.parse(cached);
        if (Date.now() - ts < CACHE_TTL && allowed === false) setShow(true);
        return;
      }
    } catch { /* ignore */ }
    if (import.meta.env.DEV) return;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    fetch('https://ipapi.co/json/', { signal: controller.signal })
      .then(r => r.json())
      .then(data => {
        const allowed = data?.country_code === 'BD';
        try { localStorage.setItem(CACHE_KEY, JSON.stringify({ allowed, ts: Date.now() })); } catch { /* ignore */ }
        if (!allowed) setShow(true);
      })
      .catch(() => { /* fail-open: legitimate users never blocked */ })
      .finally(() => clearTimeout(timeout));
    return () => { clearTimeout(timeout); controller.abort(); };
  }, []);

  if (!show) return null;
  return (
    <div role="note" aria-label="Regional notice" className="bg-amber-100 text-amber-900 text-sm px-4 py-2 text-center">
      AutoSpark BD primarily serves customers within Bangladesh. Some features (payment, delivery) may be limited outside BD.
      <button onClick={() => setShow(false)} aria-label="Dismiss regional notice" className="ml-3 underline">Dismiss</button>
    </div>
  );
}
