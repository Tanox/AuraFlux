'use client';
// File: src\components\App.tsx | Version: v2.2.23
import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { AppProvider, useUI, useVisuals, useAudioContext, useAI } from '@/context/AppContext';
import { WelcomeScreen } from '@/components/visualizers/ui/WelcomeScreen';
import { OnboardingOverlay } from '@/components/visualizers/ui/onboarding/OnboardingOverlay';
import { HelpModal } from '@/components/visualizers/ui/HelpModal';
import SongOverlay from '@/components/visualizers/ui/SongOverlay';
import LyricsOverlay from '@/components/visualizers/ui/LyricsOverlay';
import CustomTextOverlay from '@/components/visualizers/ui/CustomTextOverlay';
import { FPSCounter } from '@/components/visualizers/ui/FPSCounter';
import { useIdleTimer } from '@/hooks/utils/useIdleTimer';
import { useMobileGestures } from '@/hooks/useMobileGestures';

import { COLOR_THEMES } from '@/constants';
import type { ControlsProps } from '@/components/controls/Controls';

const VisualizerCanvas = dynamic(() => import('@/components/visualizers/VisualizerCanvas'), { ssr: false });
const ThreeVisualizer = dynamic(() => import('@/components/visualizers/ThreeVisualizer'), { ssr: false });
const Controls = dynamic(() => import('@/components/controls/Controls'), { ssr: false });

const MainContent: React.FC = () => {
  const ui = useUI();
  const visuals = useVisuals();
  const audio = useAudioContext();
  const ai = useAI();

  const [isExpanded, setIsExpanded] = useState(false);
  const [onboarded, setOnboarded] = useState(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('av_v1_onboarded');
    }
    return false;
  });

  const { isIdle } = useIdleTimer(isExpanded, visuals?.settings?.autoHideUi);
  const gestures = useMobileGestures();



  useEffect(() => {
    if (visuals?.settings?.wakeLock && ui) ui.manageWakeLock(true);
    return () => { if (ui) ui.manageWakeLock(false); };
  }, [visuals?.settings?.wakeLock, ui]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (visuals?.settings?.appTheme === 'light') {
          root.classList.remove('dark');
      } else {
          root.classList.add('dark');
      }
    }
  }, [visuals?.settings?.appTheme]);

  if (!ui || !visuals || !audio || !ai) return null;

  const { 
      hasStarted, language, setLanguage, manageWakeLock, 
      showHelpModal, setShowHelpModal, helpModalInitialTab, 
      isDragging, setIsDragging, t, 
      toggleFullscreen
  } = ui;
  
  const { mode, colorTheme, settings, setSettings, isThreeMode, setColorTheme } = visuals;
  const { analyser, analyserR, currentSong, importFiles } = audio;
  const { showLyrics, lyricsStyle, performIdentification } = ai;

  // Style theme auto cycle functionality
  useEffect(() => {
    if (!settings?.cycleColors || !setColorTheme) return;

    let currentTheme = colorTheme;

    const interval = setInterval(() => {
      if (setColorTheme) {
        // Find current theme index
        const currentIndex = COLOR_THEMES.findIndex(theme => {
          if (theme.colors.length !== currentTheme.length) return false;
          for (let i = 0; i < theme.colors.length; i++) {
            if (theme.colors[i] !== currentTheme[i]) return false;
          }
          return true;
        });
        const nextIndex = (currentIndex + 1) % COLOR_THEMES.length;
        const nextTheme = COLOR_THEMES[nextIndex].colors;
        setColorTheme(nextTheme);
        currentTheme = nextTheme;
      }
    }, (settings.colorInterval || 10) * 1000);

    return () => clearInterval(interval);
  }, [settings?.cycleColors, settings?.colorInterval, setColorTheme]);
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.types.includes('Files')) setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const audioFiles = Array.from(e.dataTransfer.files as FileList).filter((file: File) => file.type.startsWith('audio/'));
      if (audioFiles.length > 0) importFiles(audioFiles);
    }
  };

  const handleRetryIdentification = () => {
      const stream = audio.mediaStream;
      if (performIdentification && stream) {
          performIdentification(stream);
      }
  };

  if (!hasStarted) return <WelcomeScreen />;
  if (!onboarded) return <OnboardingOverlay language={language} setLanguage={setLanguage} onComplete={() => { setOnboarded(true); localStorage.setItem('av_v1_onboarded', 'true'); }} />;

  return (
    <div 
      id="app-root"
      className={`absolute inset-0 bg-white dark:bg-black select-none overflow-hidden transition-all duration-700 ${isDragging ? 'ring-4 ring-blue-500 ring-inset' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      {...gestures}
    >
      {isDragging && (
          <div id="drag-overlay" className="absolute inset-0 bg-blue-500/20 backdrop-blur-sm flex items-center justify-center pointer-events-none z-50">
            <p className="text-white font-bold text-2xl drop-shadow-lg">{t('common.dropFiles')}</p>
          </div>
      )}
      <div
        id="visualizer-container"
        className="visualizer-container w-full h-full relative"
        onDoubleClick={settings?.doubleClickFullscreen ? toggleFullscreen : undefined}
      >
        <Suspense fallback={null}>
          {isThreeMode ? (
            analyser && settings ? (
              <ThreeVisualizer analyser={analyser} analyserR={analyserR} colors={colorTheme} settings={settings} mode={mode} />
            ) : (
              <div className="w-full h-full bg-black" />
            )
          ) : (
            <VisualizerCanvas analyser={analyser} analyserR={analyserR} colors={colorTheme} settings={settings} mode={mode} />
          )}
        </Suspense>
      </div>
      {showHelpModal && <HelpModal onClose={() => setShowHelpModal(false)} initialTab={helpModalInitialTab} />}
      <SongOverlay song={currentSong} isVisible={settings.showSongInfo} language={language} onRetry={handleRetryIdentification} onClose={() => setSettings((s: any) => ({...s, showSongInfo: false}))} analyser={analyser} sensitivity={settings.sensitivity} showAlbumArt={settings.showAlbumArtOverlay} />
      <LyricsOverlay settings={settings} song={currentSong} showLyrics={showLyrics} lyricsStyle={lyricsStyle} analyser={analyser} />
      <CustomTextOverlay settings={settings} analyser={analyser} song={currentSong} />
      {settings.showFps && <FPSCounter />}

      <Suspense fallback={null}>
        <Controls isExpanded={isExpanded} setIsExpanded={setIsExpanded} isIdle={isIdle} toggleFullscreen={toggleFullscreen} />
      </Suspense>
    </div>
  );
};

export const App: React.FC = () => (
    <AppProvider>
        <Suspense fallback={<div id="app-fallback-loader" className="w-screen h-screen bg-black" />}>
            <MainContent />
        </Suspense>
    </AppProvider>
);
