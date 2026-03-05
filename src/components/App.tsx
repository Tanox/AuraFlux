// File: src/components/App.tsx | Version: v1.9.93
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { AppProvider, useUI, useVisuals, useAudioContext, useAI } from '@/src/context/AppContext';
import { WelcomeScreen } from '@/src/components/visualizers/ui/WelcomeScreen';
import { OnboardingOverlay } from '@/src/components/visualizers/ui/onboarding/OnboardingOverlay';
import { UnsupportedScreen } from '@/src/components/visualizers/ui/UnsupportedScreen';
import { HelpModal } from '@/src/components/visualizers/ui/HelpModal';
import SongOverlay from '@/src/components/visualizers/ui/SongOverlay';
import LyricsOverlay from '@/src/components/visualizers/ui/LyricsOverlay';
import CustomTextOverlay from '@/src/components/visualizers/ui/CustomTextOverlay';
import { FPSCounter } from '@/src/components/visualizers/ui/FPSCounter';
import { useIdleTimer } from '@/src/hooks/useIdleTimer';
import { useMobileGestures } from '@/src/hooks/useMobileGestures';
import { useVersionCheck } from '@/src/hooks/useVersionCheck';
import { APP_VERSION } from '@/src/constants/version';
import type { ControlsProps } from '@/src/components/controls/Controls';

const VisualizerCanvas = lazy(() => import('@/src/components/visualizers/VisualizerCanvas'));
const ThreeVisualizer = lazy(() => import('@/src/components/visualizers/ThreeVisualizer'));
const Controls = lazy(() => import('@/src/components/controls/Controls').then(module => ({ default: module.Controls as React.FC<ControlsProps> })));

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

  // Version check logic
  useVersionCheck(APP_VERSION, (newVersion) => {
    if (ui) {
      ui.showToast(`${ui.t?.common?.updateAvailable || 'New version available'} (${newVersion}). Please refresh.`, 'info', 5000, 'top');
    }
  });

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
      toggleFullscreen, showToast
  } = ui;
  
  const { mode, colorTheme, settings, setSettings, isThreeMode } = visuals;
  const { analyser, analyserR, currentSong, importFiles } = audio;
  const { showLyrics, lyricsStyle, performIdentification } = ai;
  
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
      const audioFiles = Array.from(e.dataTransfer.files).filter((file: File) => file.type.startsWith('audio/'));
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
            <p className="text-white font-bold text-2xl drop-shadow-lg">{t.common.dropFiles}</p>
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