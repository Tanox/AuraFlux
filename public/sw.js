/**
 * File: public/sw.js
 * Version: 1.9.2
 * Author: Sut
 * Description: Advanced Service Worker for offline support
 */

const CACHE_NAME = 'aura-flux-v1.9.2';
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

// Fetch Event: Stale-While-Revalidate for most resources
self.addEventListener('fetch', (event) => {
  if (!isCacheable(event.request)) return;

  const url = new URL(event.request.url);
  
  // Strategy: Stale-While-Revalidate
  // Serve from cache immediately, then update cache from network
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(event.request);
      
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Check for valid response
        if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
          cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      }).catch((e) => {
        // Network failed
        console.debug('[SW] Network unavailable:', e);
        // Return null here, cachedResponse will be returned if available
        // If no cache and network fails, standard browser error or offline page logic below
        return null;
      });

      return cachedResponse || fetchPromise.then(response => {
         if (response) return response;
         // Fallback for navigation if both cache and network fail
         if (event.request.mode === 'navigate') {
            return cache.match('./index.html');
         }
         return new Response("Network error", { status: 408, headers: { "Content-Type": "text/plain" } });
      });
    })
  );
});