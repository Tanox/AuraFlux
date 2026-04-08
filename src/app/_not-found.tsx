import { AppProvider, useUI } from '@/context/AppContext';
import React from 'react';

const NotFoundContent = () => {
  const ui = useUI();
  const t = ui?.t;
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">{t?.common?.['404']?.title || 'Page not found'}</p>
      <a
        href="/"
        className="px-6 py-3 bg-white text-black rounded-full hover:bg-gray-200 transition-colors"
      >
        {t?.common?.['404']?.back_home || 'Back to Home'}
      </a>
    </div>
  );
};

export default function NotFound() {
  return (
    <AppProvider>
      <NotFoundContent />
    </AppProvider>
  );
}