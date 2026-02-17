/**
 * File: app/hooks/useAiState.ts
 * Version: v1.9.36
 * Author: Sut
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useIdentification } from './useIdentification';
import { LyricsStyle, Language, Region, VisualizerSettings, AIProvider, SongInfo } from '../types';
import { TranslationSchema } from '../locales';

const DEFAULT_LYRICS_STYLE = LyricsStyle.KARAOKE;
const DEFAULT_SHOW_LYRICS = false;
const DEFAULT_ENABLE_ANALYSIS = false;

const encodeKey = (key: string) => `enc:${btoa(key)}`;
const decodeKey = (str: string) => {
    if (typeof str === 'string' && str.startsWith('enc:')) {
        try {
            return atob(str.substring(4));
        } catch (e) {
            console.error("Failed to decode API key:", e);
            return '';
        }
    }
    return str;
};

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
    
    // Store API keys in local storage, encoded for minimal security
    const [apiKeys, setApiKeysInternal] = useState<Record<string, string>>(() => {
        const storedKeys = getStorage<Record<string, string>>('apiKeys', {});
        // Decode keys when loading
        const decodedKeys: Record<string, string> = {};
        for (const [p, k] of Object.entries(storedKeys)) {
            decodedKeys[p] = decodeKey(k as string);
        }
        return decodedKeys;
    });

    // Encodes API keys before saving
    const setApiKeys = useCallback((newKeys: React.SetStateAction<Record<string, string>>) => {
        setApiKeysInternal(prevKeys => {
            const resolvedKeys = typeof newKeys === 'function' ? newKeys(prevKeys) : newKeys;
            const encodedKeys: Record<string, string> = {};
            for (const [p, k] of Object.entries(resolvedKeys)) {
                encodedKeys[p] = encodeKey(k as string);
            }
            setStorage('apiKeys', encodedKeys);
            return resolvedKeys;
        });
    }, [setStorage]);

    const { isIdentifying, currentSong: identifiedSong, setCurrentSong: setIdentifiedSong, performIdentification: doIdentification } = useIdentification({
        language,
        region,
        provider,
        isEnabled: enableAnalysis && (isListening || isSimulating),
        apiKey: apiKeys[provider],
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
        // Do not clear API keys here, they are user-specific and persistent across resets
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

        const currentApiKey = apiKeys[provider] || process.env.API_KEY;

        if (!currentApiKey && provider !== 'MOCK') {
            showToast(t?.errors?.configMissing || "Gemini API Key Required", 'error');
            return;
        }
        
        await doIdentification(stream);
    }, [enableAnalysis, isIdentifying, apiKeys, provider, t, showToast, doIdentification]);


    return {
        lyricsStyle,
        showLyrics,
        setShowLyrics,
        enableAnalysis,
        setEnableAnalysis,
        isIdentifying,
        performIdentification,
        resetAiSettings,
        apiKeys,
        setApiKeys,
    };
};