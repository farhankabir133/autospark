// Service Worker — Cache-first for static assets, network-first for API calls
const CACHE_NAME = 'autospark-v3';

// Assets to precache on install (only lightweight critical assets)
// Ferrari GLB + DRACO removed — cached on-demand when 3D scene loads
const PRECACHE_URLS = [
  '/',
  '/logo/logoAS3.svg',
  '/preview/preview-image.webp',
];

// Cache-first patterns (static assets that rarely change)
const CACHE_FIRST_PATTERNS = [
  /\.(?:js|css|woff2?|ttf|eot|svg|png|jpe?g|gif|webp|ico|glb|wasm)$/i,
  /fonts\.googleapis\.com/,
  /fonts\.gstatic\.com/,
  /images\.pexels\.com/,
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
          if (response && response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request).then((m) => m || caches.match('/')).then((r) => r || new Response('Service Unavailable', { status: 503 })))
    );
    return;
  }

  // Cache-first for static assets
  if (CACHE_FIRST_PATTERNS.some((p) => p.test(url))) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request)
          .then((response) => {
            // Only cache successful responses
            if (response && response.ok) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
            }
            return response;
          })
          .catch(() => caches.match('/').then((r) => r || new Response('', { status: 404 })));
      })
    );
    return;
  }

  // Network-first for navigation / HTML requests — ensures users receive latest SPA shell
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache the successful HTML response for offline fallback
          if (response && response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match('/').then((r) => r || new Response('<h1>Offline</h1>', { status: 503, headers: { 'Content-Type': 'text/html' } })))
    );
    return;
  }
});
