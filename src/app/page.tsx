// src/app/page.tsx | Version: v2.2.0
'use client';

import dynamic from 'next/dynamic';
import { ErrorBoundary } from '@/src/components/visualizers/ui/ErrorBoundary';
import { useAuth } from '@/src/components/auth/AuthProvider';

// Dynamically import App to avoid SSR issues with Three.js/Canvas
const App = dynamic(() => import('@/src/components/App').then(mod => mod.App), { 
  ssr: false,
  loading: () => (
    <div className="w-screen h-screen bg-black flex flex-col items-center justify-center text-white font-mono">
      <div className="text-2xl font-black tracking-tighter mb-4 animate-pulse">AURA FLUX</div>
      <div className="text-[10px] text-white/40 uppercase tracking-[0.3em]">Initializing Neural Engine...</div>
    </div>
  )
});

export default function Home() {
  const { loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
