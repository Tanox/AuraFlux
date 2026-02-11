/**
 * File: public/sw.js
 * Version: 1.8.100
 * Author: Sut
 * Description: Advanced Service Worker for offline support
 */

const CACHE_NAME = 'aura-flux-v1.8.100';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './pwa-icon.svg',
  './assets/images/favicon.svg'
];

// Install Event: Cache core static assets
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Activate worker immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching App Shell');
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[SW] Clearing old cache:', key);
          return caches.delete(key);
        }
      })
    ))
  );
  self.clients.claim(); // Take control of all clients immediately
});

// Helper: Determine if request should be cached
const isCacheable = (request) => {
  const url = new URL(request.url);
  
  // Only cache GET
  if (request.method !== 'GET') return false;

  // Don't cache AI API endpoints
  if (url.hostname.includes('generativelanguage.googleapis.com')) return false;
  if (url.hostname.includes('openai.com')) return false;
  if (url.hostname.includes('anthropic.com')) return false;

  // Don't cache browser-sync or HMR in development
  if (url.pathname.includes('hot-update')) return false;
  if (url.protocol === 'chrome-extension:') return false;

  return true;
};

// Fetch Event: Cache First strategy for assets, Network First for HTML?
// Actually, for a robust PWA using external ESM modules, Stale-While-Revalidate 
// or Cache First is best for libs.
self.addEventListener('fetch', (event) => {
  if (!isCacheable(event.request)) return;

  const url = new URL(event.request.url);
  
  // Strategy 1: Network Only for API (Handled by isCacheable check above)

  // Strategy 2: Stale-While-Revalidate for external resources (ESM, Fonts, CDNs)
  // This ensures fast load from cache, but updates in background if needed.
  if (url.origin !== self.location.origin) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch((e) => {
          // Network failed, nothing to do here if we have cache
          console.debug('[SW] External fetch failed:', e);
        });

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Strategy 3: Cache First for Local Assets (Images, JS, CSS)
  // Fallback to Network. Fallback to offline page for navigation.
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(event.request);
      if (cachedResponse) return cachedResponse;

      try {
        const networkResponse = await fetch(event.request);
        if (networkResponse && networkResponse.status === 200) {
          cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      } catch (error) {
        // Offline fallback for navigation requests (HTML)
        if (event.request.mode === 'navigate') {
          return cache.match('./index.html');
        }
        throw error;
      }
    })
  );
});