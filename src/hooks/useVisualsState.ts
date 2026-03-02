// File: src/hooks/useVisualsState.ts | Version: v1.9.80
import { useState, useCallback } from 'react';
import { VisualizerMode, VisualizerSettings, SmartPreset } from '../types';

const DEFAULT_SETTINGS: VisualizerSettings = {
  sensitivity: 1.0,
  autoHideUi: true,
  showSongInfo: true,
  showAlbumArtOverlay: true,
  showFps: false,
  appTheme: 'dark',
  wakeLock: true,
  doubleClickFullscreen: true,
  recognitionProvider: 'GEMINI',
  bloom: 0.5,
  particleCount: 1000,
  speed: 1.0
};

export const useVisualsState = (hasStarted: boolean, initialSettings: any) => {
  const [mode, setMode] = useState<VisualizerMode>(VisualizerMode.DIGITAL_GRID);
  const [colorTheme, setColorTheme] = useState<string[]>(['#00f2ff', '#0062ff', '#7000ff']);
  const [settings, setSettings] = useState<VisualizerSettings>(DEFAULT_SETTINGS);
  const [activePreset, setActivePreset] = useState('Default');

  const randomizeSettings = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      sensitivity: 0.5 + Math.random(),
      speed: 0.5 + Math.random() * 1.5
    }));
  }, []);

  const resetVisualSettings = useCallback(() => setSettings(DEFAULT_SETTINGS), []);
  const resetTextSettings = useCallback(() => {}, []);
  const resetAudioSettings = useCallback(() => {}, []);

  const applyPreset = useCallback((preset: SmartPreset) => {
    setMode(preset.mode);
    setSettings(prev => ({ ...prev, ...preset.settings }));
    setColorTheme(preset.colors);
    setActivePreset(preset.name);
  }, []);

  return {
    mode, setMode,
    colorTheme, setColorTheme,
    settings, setSettings,
    activePreset, setActivePreset,
    randomizeSettings,
    resetVisualSettings,
    resetTextSettings,
    resetAudioSettings,
    applyPreset
  };
};
