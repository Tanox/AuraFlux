'use client';

// src/hooks/state/useVisualsState.ts v2.3.11

import { useReducer, useCallback, useMemo, useEffect } from 'react';
import { VisualizerMode, VisualizerSettings, SmartPreset } from '../../types';
import { COLOR_THEMES } from '../../constants';
import { logger } from '../../utils/logger';

const DEFAULT_AUDIO_SETTINGS = {
  sensitivity: 1.0,
  smoothing: 0.8,
  fftSize: 1024
};

const DEFAULT_TEXT_SETTINGS = {
  showCustomText: false,
  textSource: 'AUTO',
  customText: '',
  customTextPosition: 'center' as const,
  customTextFont: 'Inter, sans-serif',
  customTextSize: 12,
  customTextOpacity: 0.5,
  customTextRotation: 0,
  customTextColor: '#ffffff',
  customTextCycleColor: false,
  customTextCycleInterval: 5,
  customText3D: false,
  textPulse: false
};

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
  showStudioTab: false,
  showPlaybackTab: true,
  glow: true,
  trails: true,
  performanceMode: 'medium',
  quality: 'medium'
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
        logger.warn('Error parsing colorTheme from localStorage:', error);
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
        logger.warn('Error parsing settings from localStorage:', error);
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

type VisualsState = {
  mode: VisualizerMode;
  colorTheme: string[];
  settings: VisualizerSettings;
  activePreset: string;
};

type VisualsAction =
  | { type: 'SET_MODE'; payload: VisualizerMode }
  | { type: 'SET_COLOR_THEME'; payload: string[] }
  | { type: 'SET_SETTINGS'; payload: Partial<VisualizerSettings> }
  | { type: 'SET_ACTIVE_PRESET'; payload: string }
  | { type: 'RESET_VISUAL_SETTINGS' }
  | { type: 'RESET_AUDIO_SETTINGS' }
  | { type: 'RESET_TEXT_SETTINGS' }
  | { type: 'RANDOMIZE_SETTINGS' }
  | { type: 'APPLY_PRESET'; payload: SmartPreset };

const visualsReducer = (state: VisualsState, action: VisualsAction): VisualsState => {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, mode: action.payload };
    case 'SET_COLOR_THEME':
      return { ...state, colorTheme: action.payload };
    case 'SET_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case 'SET_ACTIVE_PRESET':
      return { ...state, activePreset: action.payload };
    case 'RESET_VISUAL_SETTINGS':
      return { ...state, settings: DEFAULT_SETTINGS };
    case 'RESET_AUDIO_SETTINGS':
      return { ...state, settings: { ...state.settings, ...DEFAULT_AUDIO_SETTINGS } };
    case 'RESET_TEXT_SETTINGS':
      return { ...state, settings: { ...state.settings, ...DEFAULT_TEXT_SETTINGS } };
    case 'RANDOMIZE_SETTINGS': {
      const modes = Object.values(VisualizerMode);
      const randomMode = modes[Math.floor(Math.random() * modes.length)];
      const randomTheme = COLOR_THEMES[Math.floor(Math.random() * COLOR_THEMES.length)];
      
      return {
        ...state,
        mode: randomMode,
        colorTheme: randomTheme.colors,
        settings: {
          ...state.settings,
          sensitivity: 0.8 + Math.random() * 1.2,
          speed: 0.5 + Math.random() * 1.5,
          glow: Math.random() > 0.5,
          trails: Math.random() > 0.5
        },
        activePreset: 'Randomized'
      };
    }
    case 'APPLY_PRESET':
      return {
        ...state,
        mode: action.payload.mode,
        settings: { ...state.settings, ...action.payload.settings },
        colorTheme: action.payload.colors,
        activePreset: action.payload.name
      };
    default:
      return state;
  }
};

export const useVisualsState = (hasStarted: boolean, initialSettings: any) => {
  const initialState: VisualsState = {
    mode: getInitialMode(),
    colorTheme: getInitialColorTheme(),
    settings: getInitialSettings(),
    activePreset: getInitialActivePreset()
  };

  const [state, dispatch] = useReducer(visualsReducer, initialState);

  const setMode = useCallback((newMode: VisualizerMode | ((prev: VisualizerMode) => VisualizerMode)) => {
    const modeValue = typeof newMode === 'function' ? newMode(state.mode) : newMode;
    dispatch({ type: 'SET_MODE', payload: modeValue });
  }, [state.mode]);

  const setColorTheme = useCallback((newTheme: string[] | ((prev: string[]) => string[])) => {
    const themeValue = typeof newTheme === 'function' ? newTheme(state.colorTheme) : newTheme;
    dispatch({ type: 'SET_COLOR_THEME', payload: themeValue });
  }, [state.colorTheme]);

  const setSettings = useCallback((newSettings: VisualizerSettings | ((prev: VisualizerSettings) => VisualizerSettings)) => {
    const settingsValue = typeof newSettings === 'function' ? newSettings(state.settings) : newSettings;
    dispatch({ type: 'SET_SETTINGS', payload: settingsValue });
  }, [state.settings]);

  const setActivePreset = useCallback((newPreset: string | ((prev: string) => string)) => {
    const presetValue = typeof newPreset === 'function' ? newPreset(state.activePreset) : newPreset;
    dispatch({ type: 'SET_ACTIVE_PRESET', payload: presetValue });
  }, [state.activePreset]);

  const randomizeSettings = useCallback(() => {
    dispatch({ type: 'RANDOMIZE_SETTINGS' });
  }, []);

  const resetVisualSettings = useCallback(() => {
    dispatch({ type: 'RESET_VISUAL_SETTINGS' });
  }, []);

  const resetAudioSettings = useCallback(() => {
    dispatch({ type: 'RESET_AUDIO_SETTINGS' });
  }, []);

  const resetTextSettings = useCallback(() => {
    dispatch({ type: 'RESET_TEXT_SETTINGS' });
  }, []);

  const applyPreset = useCallback((preset: SmartPreset) => {
    dispatch({ type: 'APPLY_PRESET', payload: preset });
  }, []);

  // Auto rotate visualizer modes
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (state.settings.autoRotate && hasStarted) {
      intervalId = setInterval(() => {
        const included = (state.settings.includedModes as VisualizerMode[] | undefined) || Object.values(VisualizerMode);
        if (included.length > 1) {
          const currentIndex = included.indexOf(state.mode as VisualizerMode);
          const nextIndex = (currentIndex + 1) % included.length;
          setMode(included[nextIndex]);
        }
      }, (state.settings.rotateInterval as number || 30) * 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [state.settings.autoRotate, state.settings.rotateInterval, state.settings.includedModes, state.mode, setMode, hasStarted]);

  // Auto persist state to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('av_v1_mode', state.mode);
      localStorage.setItem('av_v1_colorTheme', JSON.stringify(state.colorTheme));
      localStorage.setItem('av_v1_settings', JSON.stringify(state.settings));
      localStorage.setItem('av_v1_activePreset', state.activePreset);
    }
  }, [state]);

  return {
    ...state,
    setMode,
    setColorTheme,
    setSettings,
    setActivePreset,
    randomizeSettings,
    resetVisualSettings,
    resetTextSettings,
    resetAudioSettings,
    applyPreset
  };
};

