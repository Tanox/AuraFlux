/**
 * File: index.tsx
 * Version: 1.9.8
 * Author: Sut
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import './assets/styles/index.css';

// --- Service Worker Registration with Update Detection ---
const env = (import.meta as any).env;
if ('serviceWorker' in navigator && env?.MODE === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then(
      (registration) => {
        console.log('SW Registered: ', registration.scope);
        
        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000); // Hourly

        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New update available! Notify the app via a custom event
                window.dispatchEvent(new CustomEvent('app-update-available', { detail: registration }));
              }
            };
          }
        };
      },
      (err) => console.error('SW Registration Failed: ', err)
    );
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);