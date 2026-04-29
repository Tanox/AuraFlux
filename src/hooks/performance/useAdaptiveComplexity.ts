// src/hooks/performance/useAdaptiveComplexity.ts v2.3.8
import { useMemo } from 'react';
import { usePerformanceMonitor } from './usePerformanceMonitor';
import { VisualizerSettings } from '@/types';

interface AdaptiveComplexityOptions {
  baseSettings: VisualizerSettings;
  performanceThresholds?: {
    low?: number;
    medium?: number;
    high?: number;
  };
  complexityLevels?: {
    low?: Partial<VisualizerSettings>;
    medium?: Partial<VisualizerSettings>;
    high?: Partial<VisualizerSettings>;
  };
}

export const useAdaptiveComplexity = (options: AdaptiveComplexityOptions) => {
  const {
    baseSettings,
    performanceThresholds = {
      low: 20,
      medium: 40,
      high: 60
    },
    complexityLevels = {
      low: {
        quality: 'low',
        sensitivity: baseSettings.sensitivity * 0.8,
        trails: false,
        glow: false
      },
      medium: {
        quality: 'medium',
        sensitivity: baseSettings.sensitivity * 0.9,
        trails: baseSettings.trails,
        glow: baseSettings.glow
      },
      high: {
        quality: 'high',
        sensitivity: baseSettings.sensitivity,
        trails: baseSettings.trails,
        glow: baseSettings.glow
      }
    }
  } = options;

  const performanceData = usePerformanceMonitor({
    lowPerformanceThreshold: performanceThresholds.medium!,
    highPerformanceThreshold: performanceThresholds.high!
  });

  const adaptiveSettings = useMemo(() => {
    let complexityLevel: 'low' | 'medium' | 'high';

    if (performanceData.fps < performanceThresholds.low!) {
      complexityLevel = 'low';
    } else if (performanceData.fps < performanceThresholds.medium!) {
      complexityLevel = 'medium';
    } else {
      complexityLevel = 'high';
    }

    return {
      ...baseSettings,
      ...complexityLevels[complexityLevel],
      performanceMode: complexityLevel
    };
  }, [baseSettings, complexityLevels, performanceData.fps, performanceThresholds]);

  return {
    adaptiveSettings,
    performanceData
  };
};