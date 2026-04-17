'use client';
// File: src\components\visualizers\ui\WelcomeScreen.tsx | Version: v2.2.23
import React from 'react';
import { useUI, useAudioContext } from '@/context/AppContext';

export const WelcomeScreen: React.FC = () => {
  const ui = useUI();
  const { toggleMicrophone, selectedDeviceId } = useAudioContext();

  if (!ui) return null;

  const { t, setHasStarted } = ui;

  return (
    <div id="welcome-screen" className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-6 text-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black opacity-80" />
      <div className="relative z-10 max-w-lg w-full space-y-10 animate-fade-in-up">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-blue-100 to-blue-400 tracking-tighter drop-shadow-2xl">
            AURA FLUX
          </h1>
          <p className="text-blue-200/60 text-xs md:text-sm font-bold uppercase tracking-[0.3em]">
            {t('welcomeSubtitle') || "Synesthetic Intelligence Engine"}
          </p>
        </div>

        <button 
          onClick={() => {
            toggleMicrophone(selectedDeviceId);
            setHasStarted(true);
          }}
          className="group relative inline-flex items-center justify-center px-8 py-4 font-black text-white transition-all duration-300 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:scale-105 active:scale-95 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]"
        >
          <span className="mr-3 text-lg">鈻?/span>
          <span className="text-xs tracking-[0.2em] uppercase">{t('startExperience') || "INITIALIZE SYSTEM"}</span>
          <div className="absolute inset-0 rounded-full ring-1 ring-white/20 group-hover:ring-white/40 transition-all duration-500 animate-pulse" />
        </button>

        <div className="flex justify-center gap-8 text-[10px] font-mono text-white/20 uppercase tracking-widest">
          <span>{t('appVersion') || "v2.2.15"}</span>
          <span>鈥?/span>
          <span>{t('common.webAudioApi') || "WebAudio API"}</span>
          <span>鈥?/span>
          <span>{t('common.gemini3') || "Gemini 3.0"}</span>
        </div>
      </div>
    </div>
  );
};
