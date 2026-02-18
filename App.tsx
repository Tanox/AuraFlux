// File: App.tsx | Version: v1.9.69
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { AppProvider, useUI, useVisuals, useAudioContext, useAI } from './app/AppContext.tsx';
import { WelcomeScreen } from './app/components/visualizers/ui/WelcomeScreen.tsx';
import { OnboardingOverlay } from './app/components/visualizers/ui/onboarding/OnboardingOverlay.tsx';
import { UnsupportedScreen } from './app/components/visualizers/ui/UnsupportedScreen.tsx';
import { HelpModal } from './app/components/visualizers/ui/HelpModal.tsx';
import SongOverlay from './app/components/visualizers/ui/SongOverlay.tsx';
import LyricsOverlay from './app/components/visualizers/ui/LyricsOverlay.tsx';
import CustomTextOverlay from './app/components/visualizers/ui/CustomTextOverlay.tsx';
import { FPSCounter } from './app/components/visualizers/ui/FPSCounter.tsx';
import { useIdleTimer } from './app/hooks/useIdleTimer.ts';
import { useMobileGestures } from './app/hooks/useMobileGestures.ts';
import type { ControlsProps } from './app/components/controls/Controls.tsx';

const VisualizerCanvas = lazy(() => import('./app/components/visualizers/VisualizerCanvas.tsx'));
const ThreeVisualizer = lazy(() => import('./app/components/visualizers/ThreeVisualizer.tsx'));
const Controls = lazy(() => import('./app/components/controls/Controls.tsx').then(module => ({ default: module.Controls as React.FC<ControlsProps> })));

const MainContent: React.FC = () => {
  const ui = useUI();
  const visuals = useVisuals();
  const audio = useAudioContext();
  const ai = useAI();

  if (!ui || !visuals || !audio || !ai) return null;

  const { 
      hasStarted, language, setLanguage, manageWakeLock, 
      showHelpModal, setShowHelpModal, helpModalInitialTab, 
      isDragging, setIsDragging, t, 
      toggleFullscreen
  } = ui;
  
  const { mode, colorTheme, settings, setSettings, isThreeMode } = visuals;
  const { analyser, analyserR, currentSong, importFiles } = audio;
  const { showLyrics, lyricsStyle, performIdentification } = ai;
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [onboarded, setOnboarded] = useState(() => !!localStorage.getItem('av_v1_onboarded'));

  const { isIdle } = useIdleTimer(isExpanded, settings?.autoHideUi);
  const gestures = useMobileGestures();

  useEffect(() => {
    if (settings?.wakeLock) manageWakeLock(true);
    return () => { manageWakeLock(false); };
  }, [settings?.wakeLock, manageWakeLock]);

  useEffect(() => {
    const root = document.documentElement;
    if (settings?.appTheme === 'light') {
        root.classList.remove('dark');
    } else {
        root.classList.add('dark');
    }
  }, [settings?.appTheme]);

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
      className={`relative w-full h-full min-h-screen bg-white dark:bg-black select-none overflow-hidden transition-all duration-700 ${isExpanded ? 'p-2' : 'p-0'} ${isDragging ? 'ring-4 ring-blue-500 ring-inset' : ''}`}
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
        className={`visualizer-container ${isExpanded ? 'rounded-2xl overflow-hidden' : ''}`}
        onDoubleClick={settings?.doubleClickFullscreen ? toggleFullscreen : undefined}
      >
        <Suspense fallback={null}>
          {isThreeMode ? (
            <ThreeVisualizer analyser={analyser} analyserR={analyserR} colors={colorTheme} settings={settings} mode={mode} />
          ) : (
            <VisualizerCanvas analyser={analyser} analyserR={analyserR} colors={colorTheme} settings={settings} mode={mode} />
          )}
        </Suspense>
      </div>
      {showHelpModal && <HelpModal onClose={() => setShowHelpModal(false)} initialTab={helpModalInitialTab} />}
      <SongOverlay song={currentSong} isVisible={settings.showSongInfo} language={language} onRetry={handleRetryIdentification} onClose={() => setSettings(s => ({...s, showSongInfo: false}))} analyser={analyser} sensitivity={settings.sensitivity} showAlbumArt={settings.showAlbumArtOverlay} />
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
        <Suspense fallback={<div className="w-screen h-screen bg-black" />}>
            <MainContent />
        </Suspense>
    </AppProvider>
);