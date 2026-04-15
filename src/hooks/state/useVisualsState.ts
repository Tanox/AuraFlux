// File: src\hooks\useVisualsState.ts | Version: v2.2.23
import { useState, useCallback, useMemo, useEffect } from 'react';
import { VisualizerMode, VisualizerSettings, SmartPreset } from '../../types';
import { COLOR_THEMES } from '../../constants';

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
  cycleColors: true,
  colorInterval: 5,
  autoRotate: false,
  rotateInterval: 30,
  includedModes: Object.values(VisualizerMode),
  showStudioTab: false
};

const getInitialMode = (): VisualizerMode => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('av_v1_mode');
    if (saved && Object.values(VisualizerMode).includes(saved as VisualizerMode)) {
      return saved as VisualizerMode;
    }
  }
  return VisualizerMode.DIGITAL_GRID;
};

const getInitialColorTheme = (): string[] => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('av_v1_colorTheme');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (error) {
        console.warn('Error parsing colorTheme from localStorage:', error);
      }
    }
  }
  return ['#00f2ff', '#0062ff', '#7000ff'];
};

const getInitialSettings = (): VisualizerSettings => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('av_v1_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_SETTINGS, ...parsed };
      } catch (error) {
        console.warn('Error parsing settings from localStorage:', error);
      }
    }
  }
  return DEFAULT_SETTINGS;
};

const getInitialActivePreset = (): string => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('av_v1_activePreset');
    if (saved) {
      return saved;
    }
  }
  return 'Default';
};

export const useVisualsState = (hasStarted: boolean, initialSettings: any) => {
  const [mode, setMode] = useState<VisualizerMode>(getInitialMode);
  const [colorTheme, setColorTheme] = useState<string[]>(getInitialColorTheme);
  const [settings, setSettings] = useState<VisualizerSettings>(getInitialSettings);
  const [activePreset, setActivePreset] = useState<string>(getInitialActivePreset);

  const setModeWithStorage = useCallback((newMode: VisualizerMode | ((prev: VisualizerMode) => VisualizerMode)) => {
    setMode(prev => {
      const nextMode = typeof newMode === 'function' ? newMode(prev) : newMode;
      if (typeof window !== 'undefined') {
        localStorage.setItem('av_v1_mode', nextMode);
      }
      return nextMode;
    });
  }, []);

  const setColorThemeWithStorage = useCallback((newTheme: string[] | ((prev: string[]) => string[])) => {
    setColorTheme(prev => {
      const nextTheme = typeof newTheme === 'function' ? newTheme(prev) : newTheme;
      if (typeof window !== 'undefined') {
        localStorage.setItem('av_v1_colorTheme', JSON.stringify(nextTheme));
      }
      return nextTheme;
    });
  }, []);

  const setSettingsWithStorage = useCallback((newSettings: VisualizerSettings | ((prev: VisualizerSettings) => VisualizerSettings)) => {
    setSettings(prev => {
      const nextSettings = typeof newSettings === 'function' ? newSettings(prev) : newSettings;
      if (typeof window !== 'undefined') {
        localStorage.setItem('av_v1_settings', JSON.stringify(nextSettings));
      }
      return nextSettings;
    });
  }, []);

  const setActivePresetWithStorage = useCallback((newPreset: string | ((prev: string) => string)) => {
    setActivePreset(prev => {
      const nextPreset = typeof newPreset === 'function' ? newPreset(prev) : newPreset;
      if (typeof window !== 'undefined') {
        localStorage.setItem('av_v1_activePreset', nextPreset);
      }
      return nextPreset;
    });
  }, []);

  const randomizeSettings = useCallback(() => {
    // Randomize Mode
    const modes = Object.values(VisualizerMode);
    const randomMode = modes[Math.floor(Math.random() * modes.length)];
    setModeWithStorage(randomMode);

    // Randomize Colors
    const randomTheme = COLOR_THEMES[Math.floor(Math.random() * COLOR_THEMES.length)];
    setColorThemeWithStorage(randomTheme.colors);

    // Randomize Settings
    setSettingsWithStorage(prev => ({
      ...prev,
      sensitivity: 0.8 + Math.random() * 1.2,
      speed: 0.5 + Math.random() * 1.5,
      glow: Math.random() > 0.5,
      trails: Math.random() > 0.5
    }));

    setActivePresetWithStorage('Randomized');
  }, [setModeWithStorage, setColorThemeWithStorage, setSettingsWithStorage, setActivePresetWithStorage]);

  const resetVisualSettings = useCallback(() => setSettingsWithStorage(DEFAULT_SETTINGS), [setSettingsWithStorage]);
  const resetTextSettings = useCallback(() => {}, []);
  const resetAudioSettings = useCallback(() => {}, []);

  const applyPreset = useCallback((preset: SmartPreset) => {
    setModeWithStorage(preset.mode);
    setSettingsWithStorage(prev => ({ ...prev, ...preset.settings }));
    setColorThemeWithStorage(preset.colors);
    setActivePresetWithStorage(preset.name);
  }, [setModeWithStorage, setSettingsWithStorage, setColorThemeWithStorage, setActivePresetWithStorage]);

  // Auto rotate visualizer modes
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (settings.autoRotate && hasStarted) {
      intervalId = setInterval(() => {
        const included = settings.includedModes || Object.values(VisualizerMode);
        if (included.length > 1) {
          const currentIndex = included.indexOf(mode);
          const nextIndex = (currentIndex + 1) % included.length;
          setModeWithStorage(included[nextIndex]);
        }
      }, (settings.rotateInterval || 30) * 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [settings.autoRotate, settings.rotateInterval, settings.includedModes, mode, setModeWithStorage, hasStarted]);

  return {
    mode, setMode: setModeWithStorage,
    colorTheme, setColorTheme: setColorThemeWithStorage,
    settings, setSettings: setSettingsWithStorage,
    activePreset, setActivePreset: setActivePresetWithStorage,
    randomizeSettings,
    resetVisualSettings,
    resetTextSettings,
    resetAudioSettings,
    applyPreset
  };
};

