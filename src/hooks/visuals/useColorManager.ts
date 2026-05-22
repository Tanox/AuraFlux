// src/hooks/visuals/useColorManager.ts v2.3.11
import { useMemo } from 'react';
import { Color } from 'three';

interface ColorManagerOptions {
  colors: string[];
  cycleColors?: boolean;
  colorInterval?: number;
}

interface ColorManagerResult {
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  threejsColors: Color[];
  getGradient: (start: string, end: string, steps: number) => string[];
  getColorAt: (index: number) => string;
  getThreejsColorAt: (index: number) => Color;
}

export const useColorManager = (options: ColorManagerOptions): ColorManagerResult => {
  const { colors, cycleColors = false, colorInterval = 10 } = options;

  const primaryColor = useMemo(() => colors[0] || '#ffffff', [colors]);
  const secondaryColor = useMemo(() => colors[1] || '#000000', [colors]);
  const tertiaryColor = useMemo(() => colors[2] || '#888888', [colors]);

  const threejsColors = useMemo(() => {
    return colors.map(color => new Color(color));
  }, [colors]);

  const getGradient = useMemo(() => {
    return (start: string, end: string, steps: number): string[] => {
      const startColor = new Color(start);
      const endColor = new Color(end);
      const gradient: string[] = [];

      for (let i = 0; i < steps; i++) {
        const t = i / (steps - 1);
        const color = new Color().lerpColors(startColor, endColor, t);
        gradient.push(color.getHexString());
      }

      return gradient;
    };
  }, []);

  const getColorAt = useMemo(() => {
    return (index: number): string => {
      if (colors.length === 0) return '#ffffff';
      return colors[index % colors.length];
    };
  }, [colors]);

  const getThreejsColorAt = useMemo(() => {
    return (index: number): Color => {
      if (threejsColors.length === 0) return new Color('#ffffff');
      return threejsColors[index % threejsColors.length];
    };
  }, [threejsColors]);

  return {
    primaryColor,
    secondaryColor,
    tertiaryColor,
    threejsColors,
    getGradient,
    getColorAt,
    getThreejsColorAt
  };
};