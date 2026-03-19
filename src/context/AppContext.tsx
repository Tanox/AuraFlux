// File: src/context/AppContext.tsx | Version: v2.1.0
import React, { useState, useCallback } from 'react';
import { SongInfo } from '@/src/types/index';
import { Toast } from '@/src/components/visualizers/ui/Toast';
import { UIProvider, useUI } from './UIContext';
import { VisualsProvider, useVisuals } from './VisualsContext';
import { AudioProvider, useAudioContext } from './AudioContext';
import { AIProvider, useAI } from './AIContext';

export { useUI, useVisuals, useAudioContext, useAI };

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState({ message: null as string | null, type: 'info' as any, duration: 3000, position: 'bottom' as 'top' | 'bottom' });
  const [currentSong, setCurrentSong] = useState<SongInfo | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'info', duration = 3000, position: 'top' | 'bottom' = 'bottom') => 
    setToast({ message, type, duration, position }), []);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, message: null }));
  }, []);

  return (
    <UIProvider showToast={showToast}>
      <UIContextConsumer>
        {(ui) => (
          <VisualsProvider hasStarted={ui.hasStarted}>
            <VisualsContextConsumer>
              {(visuals) => (
                <AudioProvider 
                  settings={visuals.settings} 
                  language={ui.language} 
                  t={ui.t} 
                  showToast={showToast}
                  currentSong={currentSong}
                  setCurrentSong={setCurrentSong}
                >
                  <AudioContextConsumer>
                    {(audio) => (
                      <AIProvider
                        language={ui.language}
                        region={ui.region}
                        settings={visuals.settings}
                        isListening={audio.isListening}
                        mediaStream={audio.mediaStream}
                        setSettings={visuals.setSettings}
                        onSongIdentified={setCurrentSong}
                        currentSong={currentSong}
                        getAudioSlice={audio.getAudioSlice}
                        t={ui.t}
                        showToast={showToast}
                      >
                        {children}
                        <Toast 
                          message={toast.message} 
                          type={toast.type} 
                          duration={toast.duration}
                          position={toast.position}
                          onClose={hideToast} 
                        />
                      </AIProvider>
                    )}
                  </AudioContextConsumer>
                </AudioProvider>
              )}
            </VisualsContextConsumer>
          </VisualsProvider>
        )}
      </UIContextConsumer>
    </UIProvider>
  );
};

// Helper components to consume contexts during provider nesting
const UIContextConsumer: React.FC<{ children: (ui: any) => React.ReactNode }> = ({ children }) => {
    const ui = useUI();
    return <>{children(ui)}</>;
};

const VisualsContextConsumer: React.FC<{ children: (visuals: any) => React.ReactNode }> = ({ children }) => {
    const visuals = useVisuals();
    return <>{children(visuals)}</>;
};

const AudioContextConsumer: React.FC<{ children: (audio: any) => React.ReactNode }> = ({ children }) => {
    const audio = useAudioContext();
    return <>{children(audio)}</>;
};
