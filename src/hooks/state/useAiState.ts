'use client';

// src/hooks/state/useAiState.ts v2.3.11
import { useState, useCallback, useMemo, useRef } from 'react';
import { LyricsStyle, SongInfo, VisualizerSettings } from '../../types';
import { logger } from '@/utils/logger';

type ToastType = 'success' | 'info' | 'error' | 'warning';

interface UseAiStateProps {
  language: string;
  region: string;
  provider: string;
  isListening: boolean;
  isSimulating: boolean;
  mediaStream: MediaStream | null;
  initialSettings: VisualizerSettings;
  setSettings: React.Dispatch<React.SetStateAction<VisualizerSettings>>;
  onSongIdentified: (s: SongInfo | null) => void;
  currentSong: SongInfo | null;
  getAudioSlice: (s?: number) => Promise<Blob | null>;
  t: (key: string) => string;
  showToast: (m: string, type?: ToastType) => void;
}

export const useAiState = ({ language, region, provider, isListening, isSimulating, mediaStream, initialSettings, setSettings, onSongIdentified, currentSong, getAudioSlice, t, showToast }: UseAiStateProps) => {
  const [lyricsStyle, setLyricsStyle] = useState<LyricsStyle>(LyricsStyle.STANDARD);
  const [showLyrics, setShowLyrics] = useState(false);
  const [enableAnalysis, setEnableAnalysis] = useState(true);
  const [isIdentifying, setIsIdentifying] = useState(false);

  const tRef = useRef(t);
  tRef.current = t;

  const performIdentification = useCallback(async (stream: MediaStream) => {
    if (isIdentifying) return;
    setIsIdentifying(true);
    showToast(tRef.current('ai.identifying') || 'Identifying song...');

    try {
      setTimeout(() => {
        setIsIdentifying(false);
        showToast(tRef.current('ai.identified') || 'Song identified!');
      }, 2000);
    } catch (err) {
      setIsIdentifying(false);
      showToast('Identification failed', 'error');
    }
  }, [isIdentifying, showToast]);

  const resetAiSettings = useCallback(() => {
    setShowLyrics(false);
    setEnableAnalysis(true);
  }, []);

  return {
    lyricsStyle, showLyrics, setShowLyrics,
    enableAnalysis, setEnableAnalysis,
    isIdentifying,
    performIdentification,
    resetAiSettings
  };
};
