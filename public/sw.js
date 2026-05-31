// Redlix Employee Portal — Service Worker
// Handles caching for offline access on the /employee routes

const CACHE_NAME = 'redlix-employee-v1';
const OFFLINE_URL = '/employee/login';

// Resources to pre-cache on install
const PRE_CACHE = [
  '/employee/login',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// ── Install ────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRE_CACHE))
  );
  self.skipWaiting();
});

// ── Activate ───────────────────────────────────────────────────────────────
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

// ── Fetch — Network-first with offline fallback ────────────────────────────
self.addEventListener('fetch', (event) => {
  // Only handle GET requests within /employee scope
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (!url.pathname.startsWith('/employee') && !url.pathname.startsWith('/api/employee')) return;

  // For Employee GET API calls: Network-first caching with graceful offline fallbacks
  const targetEmployeeAPIs = [
    '/api/employee/declarations',
    '/api/employee/attendance',
    '/api/employee/me'
  ];

  if (targetEmployeeAPIs.includes(url.pathname)) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse.status === 200) {
            const cloned = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
          }
          return networkResponse;
        })
        .catch(async () => {
          const cached = await caches.match(event.request);
          if (cached) return cached;
          
          // If no cache, return appropriate schema matching the expected API structure
          return new Response(
            JSON.stringify({ 
              success: true, 
              message: 'You are offline.', 
              isOfflineFallback: true,
              data: [], 
              history: [], 
              activeSession: null 
            }), 
            { headers: { 'Content-Type': 'application/json' } }
          );
        })
    );
    return;
  }

  // For other API calls: network-only (don't cache API responses)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(event.request).catch(() => new Response(JSON.stringify({ success: false, message: 'You are offline.' }), { headers: { 'Content-Type': 'application/json' } })));
    return;
  }

  // For pages/assets: network-first, fall back to cache, then offline page
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Cache fresh copy
        const cloned = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
        return networkResponse;
      })
      .catch(async () => {
        const cached = await caches.match(event.request);
        return cached || caches.match(OFFLINE_URL);
      })
  );
});
