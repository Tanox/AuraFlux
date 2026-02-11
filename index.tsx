/**
 * File: index.tsx
 * Version: 1.8.102
 * Author: Sut
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './components/App';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import './assets/styles/index.css';

// --- Service Worker Registration ---
const env = (import.meta as any).env;
if ('serviceWorker' in navigator && env && env.MODE === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then(
      (registration) => console.log('SW Registered: ', registration.scope),
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