// File: index.tsx | Version: v1.9.36 | Author: Sut
import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { ErrorBoundary } from './app/components/visualizers/ui/ErrorBoundary';
import './app/styles/index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Could not find root element");

// --- PWA Service Worker Registration & Update Logic ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then((registration) => {
        console.log('[PWA] ServiceWorker registered with scope:', registration.scope);

        // Check for updates periodically (every 60 minutes)
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000);

        // Notify if a waiting worker is already present on load
        if (registration.waiting) {
          window.dispatchEvent(new CustomEvent('app-update-available', { detail: registration }));
        }

        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available; dispatch event for UI update
                window.dispatchEvent(new CustomEvent('app-update-available', { detail: registration }));
              }
            };
          }
        };
      })
      .catch((error) => {
        console.error('[PWA] ServiceWorker registration failed:', error);
      });
  });

  // Handle actual page reload when the new service worker takes control
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      refreshing = true;
      window.location.reload();
    }
  });
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);