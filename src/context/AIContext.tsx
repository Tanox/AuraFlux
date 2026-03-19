// File: src/context/AIContext.tsx | Version: v1.0.0
import React, { createContext, useContext, useMemo } from 'react';
import { LyricsStyle, SongInfo, VisualizerSettings } from '@/src/types';
import { useAiState } from '@/src/hooks/useAiState';
import { TranslationSchema } from '@/src/locales/index';

export interface AIContextType {
  lyricsStyle: LyricsStyle; showLyrics: boolean; setShowLyrics: (b: boolean | ((prev: boolean) => boolean)) => void;
  enableAnalysis: boolean; setEnableAnalysis: (b: boolean) => void;
  isIdentifying: boolean;
  performIdentification: (s: MediaStream) => Promise<void>;
  resetAiSettings: () => void; 
}

export const AIContext = createContext<AIContextType | null>(null);
export const useAI = () => useContext(AIContext)!;

export const AIProvider: React.FC<{
  children: React.ReactNode;
  language: string;
  region: string;
  settings: VisualizerSettings;
  isListening: boolean;
  mediaStream: MediaStream | null;
  setSettings: any;
  onSongIdentified: (s: SongInfo | null) => void;
  currentSong: SongInfo | null;
  getAudioSlice: (s?: number) => Promise<Blob | null>;
  t: TranslationSchema;
  showToast: any;
}> = ({ 
  children, language, region, settings, isListening, mediaStream, 
  setSettings, onSongIdentified, currentSong, getAudioSlice, t, showToast 
}) => {
  const aiState = useAiState({
    language,
    region,
    provider: settings.recognitionProvider || 'GEMINI',
    isListening,
    isSimulating: settings.recognitionProvider === 'MOCK',
    mediaStream,
    initialSettings: settings,
    setSettings,
    onSongIdentified,
    currentSong,
    getAudioSlice,
    t,
    showToast,
  });

  const value = useMemo(() => aiState, [aiState]);

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
};
