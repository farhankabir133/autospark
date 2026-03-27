const prefetched = new Set<string>();

export async function prefetchResource(pageUrl: string, apiUrl?: string) {
  try {
    if (!pageUrl) return;

    // Avoid duplicate prefetches
    if (!prefetched.has(pageUrl)) {
      prefetched.add(pageUrl);

      // Add <link rel="prefetch"> for the page to hint the browser
      try {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = pageUrl;
        link.as = 'document';
        document.head.appendChild(link);
      } catch (err) {
        // ignore
      }
    }

    // Optionally fetch a JSON API for data hydration
    if (apiUrl && !prefetched.has(apiUrl)) {
      prefetched.add(apiUrl);
      // Fire-and-forget fetch; we don't need the data here, just warm the cache
      fetch(apiUrl, { credentials: 'same-origin' }).catch(() => {});
    }
  } catch (err) {
    // swallow so prefetch never crashes UI
    // console.warn('prefetch failed', err);
  }
}

export function isPrefetched(url: string) {
  return prefetched.has(url);
}
