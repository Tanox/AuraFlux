// File: public/sw.js | Version: v1.9.36 | Author: Sut
const CACHE_NAME = 'aura-flux-v1.9.36';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './pwa-icon.svg',
  './index.tsx'
];

// Install: Cache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Warm up: Caching shell assets');
      return cache.addAll(STATIC_ASSETS).catch(err => {
          console.warn('[SW] Cache partial failure:', err);
      });
    })
  );
});

// Activate: Clean old caches and take control
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[SW] Purging stale cache:', key);
          return caches.delete(key);
        }
      })
    ))
  );
  self.clients.claim();
});

// Update logic: Listen for SKIP_WAITING from UI
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Utility to determine if a request should be cached
const isCacheable = (request) => {
  if (request.method !== 'GET') return false;
  const url = new URL(request.url);
  // Exclude AI API calls and GTM
  if (url.hostname.includes('generativelanguage.googleapis.com')) return false;
  if (url.hostname.includes('googletagmanager.com')) return false;
  if (url.pathname.includes('hot-update')) return false;
  return true;
};

// Fetch: Stale-while-revalidate strategy
self.addEventListener('fetch', (event) => {
  if (!isCacheable(event.request)) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(event.request);
      
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      }).catch(() => null);

      return cachedResponse || fetchPromise;
    })
  );
});