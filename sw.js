// Service Worker — Cache-first for static assets, network-first for API calls
const CACHE_NAME = 'autospark-v1';

// Assets to precache on install
const PRECACHE_URLS = [
  '/autospark/',
  '/autospark/logo/aslogo.svg',
];

// Cache-first patterns (static assets that rarely change)
const CACHE_FIRST_PATTERNS = [
  /\.(?:js|css|woff2?|ttf|eot|svg|png|jpe?g|gif|webp|ico)$/i,
  /fonts\.googleapis\.com/,
  /fonts\.gstatic\.com/,
  /images\.pexels\.com/,
  /threejs\.org\/examples\/models/,
  /gstatic\.com\/draco/,
];

// Network-first patterns (dynamic API data)
const NETWORK_FIRST_PATTERNS = [
  /supabase/,
  /\/api\//,
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip chrome-extension and other non-http(s) schemes
  if (!url.startsWith('http')) return;

  // Network-first for API/dynamic requests
  if (NETWORK_FIRST_PATTERNS.some((p) => p.test(url))) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first for static assets
  if (CACHE_FIRST_PATTERNS.some((p) => p.test(url))) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          // Only cache successful responses
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // Stale-while-revalidate for navigation / HTML requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        const fetchPromise = fetch(event.request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        });
        return cached || fetchPromise;
      })
    );
    return;
  }
});
