// File: app/hooks/useAiState.ts | Version: v1.9.73
import React, { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage.ts';
import { useIdentification } from './useIdentification.ts';
import { LyricsStyle, Language, Region, VisualizerSettings, AIProvider, SongInfo } from '../types/index.ts';
import { TranslationSchema } from '../locales/index.ts';

const DEFAULT_LYRICS_STYLE = LyricsStyle.KARAOKE;
const DEFAULT_SHOW_LYRICS = false;
const DEFAULT_ENABLE_ANALYSIS = false;

interface UseAiStateProps {
    language: Language;
    region: Region;
    provider: AIProvider;
    isListening: boolean;
    isSimulating: boolean;
    mediaStream: MediaStream | null;
    initialSettings: VisualizerSettings;
    setSettings: React.Dispatch<React.SetStateAction<VisualizerSettings>>;
    onSongIdentified: (song: SongInfo | null) => void;
    currentSong: SongInfo | null;
    getAudioSlice: (s?: number) => Promise<Blob | null>;
    t: TranslationSchema;
    showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const useAiState = ({
    language,
    region,
    provider,
    isListening,
    isSimulating,
    mediaStream,
    initialSettings,
    setSettings,
    onSongIdentified,
    currentSong,
    getAudioSlice,
    t,
    showToast,
}: UseAiStateProps) => {
    const { getStorage, setStorage } = useLocalStorage();

    const [lyricsStyle, setLyricsStyle] = useState<LyricsStyle>(() => getStorage('lyricsStyle', DEFAULT_LYRICS_STYLE));
    const [showLyrics, setShowLyrics] = useState<boolean>(() => getStorage('showLyrics', DEFAULT_SHOW_LYRICS));
    const [enableAnalysis, setEnableAnalysis] = useState<boolean>(() => getStorage('enableAnalysis', DEFAULT_ENABLE_ANALYSIS));
    
    // @fix: Removed apiKeys state and persistence as keys must be exclusively obtained from environment variables.
    
    const { isIdentifying, currentSong: identifiedSong, setCurrentSong: setIdentifiedSong, performIdentification: doIdentification } = useIdentification({
        language,
        region,
        provider,
        isEnabled: enableAnalysis && (isListening || isSimulating),
        onSongUpdate: onSongIdentified,
    });

    useEffect(() => {
        setStorage('lyricsStyle', lyricsStyle);
    }, [lyricsStyle, setStorage]);

    useEffect(() => {
        setStorage('showLyrics', showLyrics);
    }, [showLyrics, setStorage]);

    useEffect(() => {
        setStorage('enableAnalysis', enableAnalysis);
    }, [enableAnalysis, setStorage]);

    const resetAiSettings = useCallback(() => {
        setLyricsStyle(DEFAULT_LYRICS_STYLE);
        setShowLyrics(DEFAULT_SHOW_LYRICS);
        setEnableAnalysis(DEFAULT_ENABLE_ANALYSIS);
        setSettings(prev => ({
            ...prev,
            recognitionProvider: initialSettings.recognitionProvider,
            lyricsStyle: initialSettings.lyricsStyle,
            region: initialSettings.region,
        }));
    }, [setLyricsStyle, setShowLyrics, setEnableAnalysis, setSettings, initialSettings]);


    // Ensure settings are synced if they change outside this hook (e.g., from presets)
    useEffect(() => {
      if (initialSettings.lyricsStyle !== lyricsStyle) {
        setLyricsStyle(initialSettings.lyricsStyle || DEFAULT_LYRICS_STYLE);
      }
    }, [initialSettings.lyricsStyle, lyricsStyle, setLyricsStyle]);

    // Pass the mediaStream from useAudio hook to the useIdentification hook
    const performIdentification = useCallback(async (stream: MediaStream) => {
        if (!enableAnalysis || isIdentifying) return;
        
        // Robustness: Check online status
        if (!navigator.onLine && provider !== 'MOCK') {
             showToast("Network Offline", 'error');
             return;
        }

        // @fix: Rely solely on process.env.API_KEY as per the GenAI coding guidelines.
        if (!process.env.API_KEY && provider !== 'MOCK') {
            showToast(t?.errors?.configMissing || "Gemini API Key Required", 'error');
            return;
        }
        
        await doIdentification(stream);
    }, [enableAnalysis, isIdentifying, provider, t, showToast, doIdentification]);


    return {
        lyricsStyle,
        showLyrics,
        setShowLyrics,
        enableAnalysis,
        setEnableAnalysis,
        isIdentifying,
        performIdentification,
        resetAiSettings,
    };
};