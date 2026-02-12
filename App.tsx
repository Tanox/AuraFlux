/**
 * File: App.tsx
 * Version: 1.8.103
 * Author: Sut
 * Updated: 2025-07-28 12:30
 */

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { AppProvider, useUI, useVisuals, useAudioContext, useAI } from './components/AppContext';
import { WelcomeScreen } from './components/ui/WelcomeScreen';
import { OnboardingOverlay } from './components/ui/OnboardingOverlay';
import { UnsupportedScreen } from './components/ui/UnsupportedScreen';
import { HelpModal } from './components/ui/HelpModal';
import SongOverlay from './components/ui/SongOverlay';
import LyricsOverlay from './components/ui/LyricsOverlay';
import CustomTextOverlay from './components/ui/CustomTextOverlay';
import { FPSCounter } from './components/ui/FPSCounter';
import { useIdleTimer } from './core/hooks/useIdleTimer';
import { useMobileGestures } from './core/hooks/useMobileGestures';
import { APP_VERSION } from './core/constants';

const VisualizerCanvas = lazy(() => import('./components/visualizers/VisualizerCanvas'));
const ThreeVisualizer = lazy(() => import('./components/visualizers/ThreeVisualizer'));
const Controls = lazy(() => import('./components/controls/Controls'));

const MainContent: React.FC = () => {
  const { hasStarted, language, setLanguage, manageWakeLock, showHelpModal, setShowHelpModal, helpModalInitialTab, isDragging, setIsDragging, t } = useUI();
  const { mode, colorTheme, settings, isThreeMode } = useVisuals();
  const { analyser, analyserR, currentSong, selectedDeviceId, importFiles } = useAudioContext();
  const { showLyrics, lyricsStyle, performIdentification } = useAI();
  const [isExpanded, setIsExpanded] = useState(false);
  const [onboarded, setOnboarded] = useState(() => !!localStorage.getItem('av_v1_onboarded'));

  const { isIdle } = useIdleTimer(isExpanded, settings.autoHideUi);
  const gestures = useMobileGestures();

  useEffect(() => {
    if (settings.wakeLock) manageWakeLock(true);
    return () => { manageWakeLock(false); };
  }, [settings.wakeLock, manageWakeLock]);

  useEffect(() => {
    const root = document.documentElement;
    if (settings.appTheme === 'light') {
        root.classList.remove('dark');
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#ffffff');
    } else {
        root.classList.add('dark');
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#000000');
    }
  }, [settings.appTheme]);

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

  if (!hasStarted) return <WelcomeScreen />;
  if (!onboarded) return <OnboardingOverlay language={language} setLanguage={setLanguage} onComplete={() => { setOnboarded(true); localStorage.setItem('av_v1_onboarded', 'true'); }} />;

  return (
    <div 
      className={`relative w-full h-full bg-white dark:bg-black select-none overflow-hidden transition-all duration-700 ${isExpanded ? 'p-2' : 'p-0'} ${isDragging ? 'ring-4 ring-blue-500 ring-inset' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      {...gestures}
    >
      {/* Global Drag Overlay - High Priority */}
      {isDragging && (
          <div className="fixed inset-0 z-[300] bg-blue-600/10 backdrop-blur-md flex items-center justify-center pointer-events-none animate-fade-in-up transition-all duration-300">
              <div className="bg-black/80 backdrop-blur-2xl border-4 border-dashed border-blue-500/40 p-16 rounded-[4rem] flex flex-col items-center gap-8 shadow-[0_0_100px_rgba(37,99,235,0.3)] transform scale-110">
                  <div className="w-24 h-24 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 animate-bounce">
                      <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                  </div>
                  <div className="text-center space-y-3">
                    <h3 className="text-3xl font-black text-white uppercase tracking-[0.25em] drop-shadow-xl">{t?.common?.dropFiles || "DROP TO IMPORT"}</h3>
                    <p className="text-blue-400/60 text-xs font-black uppercase tracking-[0.15em]">{t?.player?.supportInfo}</p>
                  </div>
              </div>
          </div>
      )}

      {/* Background Layer */}
      {settings.showAiBg && settings.aiBgUrl && (
          <div className="absolute inset-0 z-0 transition-opacity duration-1000" style={{ opacity: settings.aiBgOpacity }}>
              <img src={settings.aiBgUrl} className="w-full h-full object-cover" style={{ filter: `blur(${settings.aiBgBlur}px)` }} alt="" />
          </div>
      )}

      {/* Main Visualizer Engine */}
      <div className={`w-full h-full relative z-[1] transition-transform duration-1000 ease-out overflow-hidden ${isExpanded ? 'scale-[0.98]' : 'scale-100'}`}>
        <Suspense fallback={null}>
          {isThreeMode ? (
            <ThreeVisualizer analyser={analyser} analyserR={analyserR} colors={colorTheme} settings={settings} mode={mode} />
          ) : (
            <VisualizerCanvas analyser={analyser} analyserR={analyserR} mode={mode} colors={colorTheme} settings={settings} />
          )}
        </Suspense>
      </div>

      {/* 
          AESTHETIC REFINEMENT: Informational overlays are now outside the 
          isIdle opacity container to ensure they remain part of the performance.
      */}
      <SongOverlay 
        song={currentSong} isVisible={settings.showSongInfo} language={language} 
        onRetry={() => { if (performIdentification && (analyser?.context as any)?.stream) performIdentification((analyser?.context as any).stream); }} 
        onClose={() => {}} analyser={analyser} sensitivity={settings.sensitivity}
        showAlbumArt={settings.showAlbumArtOverlay} isIdle={false} /* Force visible in performance */
      />
      <CustomTextOverlay settings={settings} analyser={analyser} song={currentSong} />
      <LyricsOverlay settings={settings} song={currentSong} showLyrics={showLyrics} lyricsStyle={lyricsStyle} analyser={analyser} />

      {/* Interactive Controls Layer - Hides on Idle */}
      <div className={`transition-opacity duration-700 ${isIdle && !isExpanded ? 'opacity-0 cursor-none' : 'opacity-100'}`}>
        <Suspense fallback={null}>
          <Controls isExpanded={isExpanded} setIsExpanded={setIsExpanded} isIdle={isIdle} />
        </Suspense>
        {settings.showFps && <FPSCounter />}
      </div>
      
      {/* Persistent Version Watermark - Explicitly moved outside auto-hide wrapper to stay persistent */}
      <div className="fixed bottom-4 right-4 z-[5] pointer-events-none opacity-40 text-xs font-mono uppercase tracking-widest text-black dark:text-white drop-shadow-md">
        Aura Flux v{APP_VERSION}
      </div>
      
      {showHelpModal && <HelpModal onClose={() => setShowHelpModal(false)} initialTab={helpModalInitialTab} />}
    </div>
  );
};

const App: React.FC = () => {
  const [isSupported, setIsSupported] = useState(true);
  useEffect(() => { if (!window.AudioContext && !(window as any).webkitAudioContext) setIsSupported(false); }, []);
  if (!isSupported) return <UnsupportedScreen />;
  return <AppProvider><MainContent /></AppProvider>;
};

export { App, AppProvider };