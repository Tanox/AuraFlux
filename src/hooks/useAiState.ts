// File: src\hooks\useAiState.ts | Version: v2.2.23
import { useState, useCallback, useMemo, useRef } from 'react';
import { LyricsStyle, SongInfo } from '../types';

interface UseAiStateProps {
  language: string;
  region: string;
  provider: string;
  isListening: boolean;
  isSimulating: boolean;
  mediaStream: MediaStream | null;
  initialSettings: any;
  setSettings: any;
  onSongIdentified: (s: SongInfo | null) => void;
  currentSong: SongInfo | null;
  getAudioSlice: (s?: number) => Promise<Blob | null>;
  t: any;
  showToast: (m: string, type?: any) => void;
}

export const useAiState = ({ language, region, provider, isListening, isSimulating, mediaStream, initialSettings, setSettings, onSongIdentified, currentSong, getAudioSlice, t, showToast }: UseAiStateProps) => {
  const [lyricsStyle, setLyricsStyle] = useState<LyricsStyle>(LyricsStyle.STANDARD);
  const [showLyrics, setShowLyrics] = useState(false);
  const [enableAnalysis, setEnableAnalysis] = useState(true);
  const [isIdentifying, setIsIdentifying] = useState(false);
  
  // 使用 useRef 存储 t 的最新值
  const tRef = useRef(t);
  tRef.current = t;

  const performIdentification = useCallback(async (stream: MediaStream) => {
    if (isIdentifying) return;
    setIsIdentifying(true);
    showToast(tRef.current?.ai?.identifying || 'Identifying song...');
    
    try {
      // Mock identification for now
      setTimeout(() => {
        setIsIdentifying(false);
        showToast(tRef.current?.ai?.identified || 'Song identified!');
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

  return useMemo(() => ({
    lyricsStyle, showLyrics, setShowLyrics,
    enableAnalysis, setEnableAnalysis,
    isIdentifying,
    performIdentification,
    resetAiSettings
  }), [lyricsStyle, showLyrics, setShowLyrics, enableAnalysis, setEnableAnalysis, isIdentifying, performIdentification, resetAiSettings]);
};

