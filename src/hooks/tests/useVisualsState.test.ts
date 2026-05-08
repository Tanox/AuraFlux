'use client';

// src/hooks/tests/useVisualsState.test.ts v2.3.10
import { renderHook, act } from '@testing-library/react';
import { useVisualsState } from '../state/useVisualsState';
import { VisualizerMode } from '../../types';

jest.mock('../../utils/logger', () => ({
  logger: {
    warn: jest.fn(),
  },
}));

jest.mock('../../constants', () => ({
  COLOR_THEMES: [
    { name: 'Theme1', colors: ['#ff0000', '#00ff00'] },
    { name: 'Theme2', colors: ['#0000ff', '#ffff00'] },
  ],
}));

describe('useVisualsState', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should use default mode when nothing is saved', () => {
      const { result } = renderHook(() => useVisualsState(false, {}));
      expect(result.current.mode).toBe(VisualizerMode.DIGITAL_GRID);
    });

    it('should use default theme when nothing is saved', () => {
      const { result } = renderHook(() => useVisualsState(false, {}));
      expect(result.current.colorTheme).toEqual(['#00f2ff', '#0062ff', '#7000ff']);
    });
  });

  describe('setMode', () => {
    it('should update mode when setMode is called', () => {
      const { result } = renderHook(() => useVisualsState(false, {}));
      
      act(() => {
        result.current.setMode(VisualizerMode.PLASMA);
      });

      expect(result.current.mode).toBe(VisualizerMode.PLASMA);
    });

    it('should accept function to update mode', () => {
      const { result } = renderHook(() => useVisualsState(false, {}));
      
      act(() => {
        result.current.setMode((prev) => VisualizerMode.SILK_WAVE);
      });

      expect(result.current.mode).toBe(VisualizerMode.SILK_WAVE);
    });
  });

  describe('setColorTheme', () => {
    it('should update color theme', () => {
      const { result } = renderHook(() => useVisualsState(false, {}));
      const newTheme = ['#ff0000', '#00ff00', '#0000ff'];

      act(() => {
        result.current.setColorTheme(newTheme);
      });

      expect(result.current.colorTheme).toEqual(newTheme);
    });
  });

  describe('setSettings', () => {
    it('should update settings with partial update', () => {
      const { result } = renderHook(() => useVisualsState(false, {}));

      act(() => {
        result.current.setSettings({ sensitivity: 0.5 } as any);
      });

      expect(result.current.settings.sensitivity).toBe(0.5);
    });
  });

  describe('reset functions', () => {
    it('should reset visual settings', () => {
      const { result } = renderHook(() => useVisualsState(false, {}));
      
      act(() => {
        result.current.setSettings({ sensitivity: 0.5 } as any);
      });

      act(() => {
        result.current.resetVisualSettings();
      });

      expect(result.current.settings.sensitivity).toBe(1.0);
    });
  });

  describe('randomizeSettings', () => {
    it('should randomize all settings', () => {
      const { result } = renderHook(() => useVisualsState(false, {}));

      act(() => {
        result.current.randomizeSettings();
      });

      expect(result.current.mode).toBeDefined();
      expect(result.current.colorTheme).toBeDefined();
      expect(result.current.activePreset).toBe('Randomized');
    });
  });
});
