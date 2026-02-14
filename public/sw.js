/**
 * File: public/sw.js
 * Version: 1.9.11
 * Author: Sut
 * Description: Robust Service Worker with fault-tolerant caching
 */

const CACHE_NAME = 'aura-flux-v1.9.11';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './pwa-icon.svg'
];

// Install Event: Cache core static assets with error tolerance
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching App Shell Resources');
      
      // Separate critical from non-critical to avoid complete failure on 404
      const cachePromises = STATIC_ASSETS.map(async (url) => {
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Offline cache failed for ${url}: ${response.status}`);
          }
          return await cache.put(url, response);
        } catch (err) {
          console.warn(`[SW] Non-critical resource skipped: ${url}`, err);
          return Promise.resolve(); 
        }
      });
      
      return Promise.all(cachePromises);
    })
  );
});

// Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[SW] Clearing legacy cache:', key);
          return caches.delete(key);
        }
      })
    ))
  );
  self.clients.claim();
});

// Message listener to trigger immediate skipping of wait
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

const isCacheable = (request) => {
  const url = new URL(request.url);
  if (request.method !== 'GET') return false;
  if (url.hostname.includes('generativelanguage.googleapis.com')) return false;
  if (url.hostname.includes('googletagmanager.com')) return false;
  if (url.pathname.includes('hot-update')) return false;
  return true;
};

// Fetch Event: Stale-While-Revalidate
self.addEventListener('fetch', (event) => {
  if (!isCacheable(event.request)) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(event.request);
      
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
          cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      }).catch((e) => {
        console.debug('[SW] Network unavailable, serving from cache if possible');
        return null;
      });

      return cachedResponse || fetchPromise.then(response => {
         if (response) return response;
         if (event.request.mode === 'navigate') {
            return cache.match('./index.html');
         }
         return new Response("Aura Flux: Offline (Resource not in cache)", { 
           status: 503, 
           headers: { "Content-Type": "text/plain" } 
         });
      });
    })
  );
});