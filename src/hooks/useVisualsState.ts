// File: src/hooks/useVisualsState.ts | Version: v1.10.4
import { useState, useCallback, useMemo } from 'react';
import { VisualizerMode, VisualizerSettings, SmartPreset } from '../types';
import { COLOR_THEMES } from '../constants';

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
  speed: 1.0,
  cycleColors: true
};

export const useVisualsState = (hasStarted: boolean, initialSettings: any) => {
  const [mode, setMode] = useState<VisualizerMode>(VisualizerMode.DIGITAL_GRID);
  const [colorTheme, setColorTheme] = useState<string[]>(['#00f2ff', '#0062ff', '#7000ff']);
  const [settings, setSettings] = useState<VisualizerSettings>(DEFAULT_SETTINGS);
  const [activePreset, setActivePreset] = useState('Default');

  const randomizeSettings = useCallback(() => {
    // Randomize Mode
    const modes = Object.values(VisualizerMode);
    const randomMode = modes[Math.floor(Math.random() * modes.length)];
    setMode(randomMode);

    // Randomize Colors
    const randomTheme = COLOR_THEMES[Math.floor(Math.random() * COLOR_THEMES.length)];
    setColorTheme(randomTheme.colors);

    // Randomize Settings
    setSettings(prev => ({
      ...prev,
      sensitivity: 0.8 + Math.random() * 1.2,
      speed: 0.5 + Math.random() * 1.5,
      glow: Math.random() > 0.5,
      trails: Math.random() > 0.5
    }));

    setActivePreset('Randomized');
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

  return useMemo(() => ({
    mode, setMode,
    colorTheme, setColorTheme,
    settings, setSettings,
    activePreset, setActivePreset,
    randomizeSettings,
    resetVisualSettings,
    resetTextSettings,
    resetAudioSettings,
    applyPreset
  }), [mode, setMode, colorTheme, setColorTheme, settings, setSettings, activePreset, setActivePreset, randomizeSettings, resetVisualSettings, resetTextSettings, resetAudioSettings, applyPreset]);
};
