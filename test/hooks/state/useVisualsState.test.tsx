'use client';
// File: test/hooks/state/useVisualsState.test.tsx

import { renderHook, act } from '@testing-library/react';
import { useVisualsState } from '@/hooks/state/useVisualsState';
import { VisualizerMode, SmartPreset } from '@/types';

// Mock localStorage
const mockLocalStorage: Record<string, string> = {};
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn((key) => mockLocalStorage[key] || null),
    setItem: jest.fn((key, value) => {
      mockLocalStorage[key] = value === undefined ? '' : (typeof value === 'string' ? value : value.toString());
    }),
    removeItem: jest.fn((key) => {
      delete mockLocalStorage[key];
    }),
    clear: jest.fn(() => {
      Object.keys(mockLocalStorage).forEach(key => delete mockLocalStorage[key]);
    }),
  },
  writable: true,
});

describe('useVisualsState', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.keys(mockLocalStorage).forEach(key => delete mockLocalStorage[key]);
  });

  test('should initialize with default state', () => {
    const { result } = renderHook(() => useVisualsState(false, {}));

    expect(result.current.mode).toBe(VisualizerMode.DIGITAL_GRID);
    expect(result.current.colorTheme).toEqual(['#00f2ff', '#0062ff', '#7000ff']);
    expect(result.current.activePreset).toBe('Default');
    expect(result.current.settings).toBeDefined();
  });

  test('should initialize with saved state from localStorage', () => {
    // Save mock data to localStorage
    mockLocalStorage['av_v1_mode'] = VisualizerMode.CUBE_FIELD;
    mockLocalStorage['av_v1_colorTheme'] = JSON.stringify(['#ff0000', '#00ff00', '#0000ff']);
    mockLocalStorage['av_v1_settings'] = JSON.stringify({ sensitivity: 1.5, autoHideUi: false });
    mockLocalStorage['av_v1_activePreset'] = 'Custom Preset';

    const { result } = renderHook(() => useVisualsState(false, {}));

    expect(result.current.mode).toBe(VisualizerMode.CUBE_FIELD);
    expect(result.current.colorTheme).toEqual(['#ff0000', '#00ff00', '#0000ff']);
    expect(result.current.activePreset).toBe('Custom Preset');
    expect(result.current.settings.sensitivity).toBe(1.5);
    expect(result.current.settings.autoHideUi).toBe(false);
  });

  test('should handle invalid localStorage data', () => {
    // Save invalid data to localStorage
    mockLocalStorage['av_v1_mode'] = 'invalid-mode';
    mockLocalStorage['av_v1_colorTheme'] = 'invalid-json';
    mockLocalStorage['av_v1_settings'] = 'invalid-json';

    const { result } = renderHook(() => useVisualsState(false, {}));

    // Should fall back to defaults
    expect(result.current.mode).toBe(VisualizerMode.DIGITAL_GRID);
    expect(result.current.colorTheme).toEqual(['#00f2ff', '#0062ff', '#7000ff']);
    expect(result.current.settings).toBeDefined();
  });

  test('should update mode with storage', () => {
    const { result } = renderHook(() => useVisualsState(false, {}));

    act(() => {
      result.current.setMode(VisualizerMode.LASER);
    });

    expect(result.current.mode).toBe(VisualizerMode.LASER);
    expect(window.localStorage.setItem).toHaveBeenCalledWith('av_v1_mode', VisualizerMode.LASER);
  });

  test('should update color theme with storage', () => {
    const { result } = renderHook(() => useVisualsState(false, {}));
    const newTheme = ['#ff0000', '#00ff00', '#0000ff'];

    act(() => {
      result.current.setColorTheme(newTheme);
    });

    expect(result.current.colorTheme).toEqual(newTheme);
    expect(window.localStorage.setItem).toHaveBeenCalledWith('av_v1_colorTheme', JSON.stringify(newTheme));
  });

  test('should update settings with storage', () => {
    const { result } = renderHook(() => useVisualsState(false, {}));
    const newSettings = { sensitivity: 1.5, autoHideUi: false };

    act(() => {
      result.current.setSettings(prev => ({ ...prev, ...newSettings }));
    });

    expect(result.current.settings.sensitivity).toBe(1.5);
    expect(result.current.settings.autoHideUi).toBe(false);
    expect(window.localStorage.setItem).toHaveBeenCalled();
  });

  test('should update active preset with storage', () => {
    const { result } = renderHook(() => useVisualsState(false, {}));
    const newPreset = 'New Preset';

    act(() => {
      result.current.setActivePreset(newPreset);
    });

    expect(result.current.activePreset).toBe(newPreset);
    expect(window.localStorage.setItem).toHaveBeenCalledWith('av_v1_activePreset', newPreset);
  });

  test('should randomize settings', () => {
    const { result } = renderHook(() => useVisualsState(false, {}));
    const originalMode = result.current.mode;

    act(() => {
      result.current.randomizeSettings();
    });

    expect(result.current.activePreset).toBe('Randomized');
    // Mode should be different (most likely)
    expect(result.current.mode).not.toBe(originalMode);
  });

  test('should reset visual settings', () => {
    const { result } = renderHook(() => useVisualsState(false, {}));

    // Change some settings
    act(() => {
      result.current.setSettings(prev => ({ ...prev, sensitivity: 2.0, autoHideUi: false }));
    });

    expect(result.current.settings.sensitivity).toBe(2.0);

    // Reset settings
    act(() => {
      result.current.resetVisualSettings();
    });

    expect(result.current.settings.sensitivity).toBe(1.0);
    expect(result.current.settings.autoHideUi).toBe(true);
  });

  test('should reset audio settings', () => {
    const { result } = renderHook(() => useVisualsState(false, {}));

    // Change audio settings
    act(() => {
      result.current.setSettings(prev => ({ ...prev, sensitivity: 2.0, smoothing: 0.5 }));
    });

    expect(result.current.settings.sensitivity).toBe(2.0);
    expect(result.current.settings.smoothing).toBe(0.5);

    // Reset audio settings
    act(() => {
      result.current.resetAudioSettings();
    });

    expect(result.current.settings.sensitivity).toBe(1.0);
    expect(result.current.settings.smoothing).toBe(0.8);
  });

  test('should reset text settings', () => {
    const { result } = renderHook(() => useVisualsState(false, {}));

    // Change text settings
    act(() => {
      result.current.setSettings(prev => ({ 
        ...prev, 
        showCustomText: true, 
        customText: 'Test Text' 
      }));
    });

    expect(result.current.settings.showCustomText).toBe(true);
    expect(result.current.settings.customText).toBe('Test Text');

    // Reset text settings
    act(() => {
      result.current.resetTextSettings();
    });

    expect(result.current.settings.showCustomText).toBe(false);
    expect(result.current.settings.customText).toBe('');
  });

  test('should apply preset', () => {
    const { result } = renderHook(() => useVisualsState(false, {}));
    const mockPreset: SmartPreset = {
      name: 'Test Preset',
      mode: VisualizerMode.NEURAL_FLOW,
      settings: { sensitivity: 1.2, speed: 1.5 },
      colors: ['#ff0000', '#00ff00', '#0000ff']
    };

    act(() => {
      result.current.applyPreset(mockPreset);
    });

    expect(result.current.activePreset).toBe('Test Preset');
    expect(result.current.mode).toBe(VisualizerMode.NEURAL_FLOW);
    expect(result.current.colorTheme).toEqual(['#ff0000', '#00ff00', '#0000ff']);
    expect(result.current.settings.sensitivity).toBe(1.2);
    expect(result.current.settings.speed).toBe(1.5);
  });
});
