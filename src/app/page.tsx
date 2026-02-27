'use client';

import dynamic from 'next/dynamic';
import { ErrorBoundary } from '@/src/components/visualizers/ui/ErrorBoundary';

// Dynamically import App to avoid SSR issues with Three.js/Canvas
const App = dynamic(() => import('@/src/components/App').then(mod => mod.App), { ssr: false });

export default function Home() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
