'use client';

// src/components/App.tsx v2.3.11


import React, { useState, useEffect, Suspense, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { AppProvider, useUI, useVisuals, useAudioContext, useAI } from '@/context/AppContext';

// Initialize i18n
import '@/i18n';
import { WelcomeScreen } from '@/components/visualizers/ui/WelcomeScreen';
import { OnboardingOverlay } from '@/components/visualizers/ui/onboarding/OnboardingOverlay';
import { HelpModal } from '@/components/visualizers/ui/HelpModal';
import { SongOverlay } from '@/components/visualizers/ui/SongOverlay';
import { LyricsOverlay } from '@/components/visualizers/ui/LyricsOverlay';
import { CustomTextOverlay } from '@/components/visualizers/ui/CustomTextOverlay';
import { FPSCounter } from '@/components/visualizers/ui/FPSCounter';
import { useIdleTimer } from '@/hooks/utils/useIdleTimer';
import { useMobileGestures } from '@/hooks/useMobileGestures';
import { useVersionCheck } from '@/hooks/utils/useVersionCheck';

import { COLOR_THEMES, APP_VERSION } from '@/constants';
import { logger } from '@/utils/logger';

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

  // Version check
  useVersionCheck(APP_VERSION, (newVersion) => {
    if (ui) {
      ui.showToast(`${ui.t('common.updateAvailable')} (${newVersion}). Please refresh.`, 'info', 5000, 'top');
    }
  });

  // Manage wake lock
  useEffect(() => {
    if (visuals?.settings?.wakeLock && ui) {
      ui.manageWakeLock(true);
    }
    return () => {
      if (ui) {
        ui.manageWakeLock(false);
      }
    };
  }, [visuals?.settings?.wakeLock, ui]);

  // Handle theme changes
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

  // Style theme auto cycle functionality
  useEffect(() => {
    if (!visuals?.settings?.cycleColors || !visuals?.setColorTheme || !visuals?.colorTheme) {
      return;
    }

    let currentTheme = visuals.colorTheme;

    const interval = setInterval(() => {
      if (visuals.setColorTheme) {
        // Find current theme index
        const currentIndex = COLOR_THEMES.findIndex(theme => {
          if (theme.colors.length !== currentTheme.length) {
            return false;
          }
          for (let i = 0; i < theme.colors.length; i++) {
            if (theme.colors[i] !== currentTheme[i]) {
              return false;
            }
          }
          return true;
        });
        const nextIndex = (currentIndex + 1) % COLOR_THEMES.length;
        const nextTheme = COLOR_THEMES[nextIndex].colors;
        visuals.setColorTheme(nextTheme);
        currentTheme = nextTheme;
      }
    }, (visuals.settings?.colorInterval || 10) * 1000);

    return () => clearInterval(interval);
  }, [visuals, visuals?.settings?.cycleColors, visuals?.settings?.colorInterval, visuals?.setColorTheme, visuals?.colorTheme]);

  // Service Worker registration
  useEffect(() => {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            logger.info('Service Worker registered:', registration.scope);
          })
          .catch(error => {
            logger.error('Service Worker registration failed:', error);
          });
      });
    }
  }, []);

  const { 
    hasStarted, 
    language, 
    setLanguage, 
    showHelpModal, 
    setShowHelpModal, 
    helpModalInitialTab, 
    isDragging, 
    setIsDragging, 
    t, 
    toggleFullscreen
  } = ui || {};
  
  const { 
    mode, 
    colorTheme, 
    settings, 
    setSettings, 
    isThreeMode 
  } = visuals || {};
  
  const { 
    analyser, 
    analyserR, 
    currentSong, 
    importFiles, 
    mediaStream 
  } = audio || {};
  
  const { 
    showLyrics, 
    lyricsStyle, 
    performIdentification 
  } = ai || {};
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.types.includes('Files') && setIsDragging) {
      setIsDragging(true);
    }
  }, [setIsDragging]);
  
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (setIsDragging) {
      setIsDragging(false);
    }
  }, [setIsDragging]);
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (setIsDragging) {
      setIsDragging(false);
    }
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0 && importFiles) {
      const audioFiles = Array.from(e.dataTransfer.files as FileList)
        .filter((file: File) => file.type.startsWith('audio/'));
      if (audioFiles.length > 0) {
        importFiles(audioFiles);
      }
    }
  }, [importFiles, setIsDragging]);

  const handleRetryIdentification = useCallback(() => {
    if (performIdentification && mediaStream) {
      performIdentification(mediaStream);
    }
  }, [performIdentification, mediaStream]);

  const handleCloseSongInfo = useCallback(() => {
    if (setSettings) {
      setSettings((s: any) => ({ ...s, showSongInfo: false }));
    }
  }, [setSettings]);

  if (!ui || !visuals || !audio || !ai) {
    return null;
  }

  if (!hasStarted) {
    return <WelcomeScreen />;
  }
  
  if (!onboarded) {
    return (
      <OnboardingOverlay 
        language={language} 
        setLanguage={setLanguage} 
        onComplete={() => {
          setOnboarded(true);
          localStorage.setItem('av_v1_onboarded', 'true');
        }} 
      />
    );
  }

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
              <ThreeVisualizer 
                analyser={analyser} 
                analyserR={analyserR} 
                colors={colorTheme} 
                settings={settings} 
                mode={mode} 
              />
            ) : (
              <div className="w-full h-full bg-black" />
            )
          ) : (
            <VisualizerCanvas 
              analyser={analyser} 
              analyserR={analyserR} 
              colors={colorTheme} 
              settings={settings} 
              mode={mode} 
            />
          )}
        </Suspense>
      </div>
      
      {showHelpModal && (
        <HelpModal 
          onClose={() => setShowHelpModal(false)} 
          initialTab={helpModalInitialTab} 
        />
      )}
      
      {settings && <SongOverlay 
        song={currentSong} 
        isVisible={settings.showSongInfo} 
        language={language} 
        onRetry={handleRetryIdentification} 
        onClose={handleCloseSongInfo} 
        analyser={analyser} 
        sensitivity={settings.sensitivity} 
        showAlbumArt={settings.showAlbumArtOverlay} 
      />}
      
      {settings && <LyricsOverlay 
        settings={settings} 
        song={currentSong} 
        showLyrics={showLyrics} 
        lyricsStyle={lyricsStyle} 
        analyser={analyser} 
      />}
      
      {settings && <CustomTextOverlay 
        settings={settings} 
        analyser={analyser} 
        song={currentSong} 
      />}
      
      {settings && settings.showFps && <FPSCounter />}

      <Suspense fallback={null}>
        <Controls 
          isExpanded={isExpanded} 
          setIsExpanded={setIsExpanded} 
          isIdle={isIdle} 
          toggleFullscreen={toggleFullscreen} 
        />
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
