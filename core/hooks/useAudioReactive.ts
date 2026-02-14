/**
 * File: core/hooks/useAudioReactive.ts
 * Version: 1.9.14
 * Author: Sut
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color } from 'three';
import { VisualizerSettings } from '../types';
import { getAverage, AdaptiveNoiseFilter, DynamicPeakLimiter, applySoftCompression } from '../services/audioUtils';
import { BeatDetector } from '../services/beatDetector';

interface UseAudioReactiveProps {
  analyser: AnalyserNode | null;
  analyserR?: AnalyserNode | null;
  colors: string[] | undefined | null;
  settings: VisualizerSettings;
}

const FALLBACK_COLORS = ['#ffffff', '#3b82f6', '#8b5cf6'];

const getSafeColors = (inputColors: string[] | undefined | null) => {
  // Always return an array of at least 3 strings
  const base = (Array.isArray(inputColors) && inputColors.length > 0) ? inputColors : FALLBACK_COLORS;
  const safe = [...base];
  while (safe.length < 3) {
    safe.push(base[0] || '#ffffff');
  }
  return safe;
};

export const useAudioReactive = ({ analyser, analyserR, colors, settings }: UseAudioReactiveProps) => {
  const safeInputColors = useMemo(() => getSafeColors(colors), [colors]);

  // Persistent reference for color objects to avoid GC pressure in useFrame
  const smoothedColorsRef = useRef<Color[]>([]);
  
  // CRITICAL: Force synchronization of the Color array length and initialization 
  // IMMEDIATELY in the render body. This prevents "undefined" access in scene components 
  // that destructure this array before useFrame has finished its first run.
  if (smoothedColorsRef.current.length !== safeInputColors.length) {
      const arr = smoothedColorsRef.current;
      if (safeInputColors.length > arr.length) {
          for (let i = arr.length; i < safeInputColors.length; i++) {
              arr.push(new Color(safeInputColors[i]));
          }
      } else {
          arr.length = safeInputColors.length;
      }
  }

  // Frequency data management
  const binCount = analyser?.frequencyBinCount || 512;
  const dataArray = useMemo(() => new Uint8Array(binCount), [binCount]);
  const dataArrayR = useMemo(() => new Uint8Array(binCount), [binCount]);

  // Utility logic refs
  const targetColorRef = useRef(new Color());
  const beatDetectorRef = useRef(new BeatDetector());
  const noiseFilterRef = useRef(new AdaptiveNoiseFilter());
  const peakLimiterRef = useRef(new DynamicPeakLimiter());

  // Extracted audio features
  const features = useRef({ 
    bass: 0, mids: 0, treble: 0, volume: 0, 
    energyL: 0, energyR: 0,
    isBeat: false 
  }).current;

  useFrame(() => {
    if (!analyser) return;

    const smoothedColors = smoothedColorsRef.current;
    const lerpSpeed = 0.05;
    
    // Interpolate colors towards target theme
    smoothedColors.forEach((color, i) => {
      const targetHex = safeInputColors[i] || safeInputColors[0] || '#ffffff';
      if (color instanceof Color) {
        color.lerp(targetColorRef.current.set(targetHex), lerpSpeed);
      }
    });

    // Real-time audio parsing
    try {
      analyser.getByteFrequencyData(dataArray);
      if (analyserR) analyserR.getByteFrequencyData(dataArrayR);
      else dataArrayR.set(dataArray);

      noiseFilterRef.current.process(dataArray);
      if (analyserR) noiseFilterRef.current.process(dataArrayR);
      
      const rawVolume = getAverage(dataArray, 0, dataArray.length) / 255;
      const normFactor = peakLimiterRef.current.process(rawVolume);
      
      features.isBeat = beatDetectorRef.current.detect(dataArray);
      
      const len = dataArray.length;
      const sensitivity = settings?.sensitivity || 1.5;
      
      const rawBass = (getAverage(dataArray, 0, Math.floor(len * 0.06)) / 255) * normFactor;
      const rawMids = (getAverage(dataArray, Math.floor(len * 0.1), Math.floor(len * 0.3)) / 255) * normFactor;
      const rawTreble = (getAverage(dataArray, Math.floor(len * 0.4), Math.floor(len * 0.8)) / 255) * normFactor;

      features.bass = applySoftCompression(rawBass, 0.7) * sensitivity;
      features.mids = applySoftCompression(rawMids, 0.75) * sensitivity;
      features.treble = applySoftCompression(rawTreble, 0.8) * sensitivity;
      features.volume = applySoftCompression(rawVolume * normFactor, 0.9);

      const rawL = getAverage(dataArray, 5, 60) / 255;
      const rawR = getAverage(dataArrayR, 5, 60) / 255;
      features.energyL = applySoftCompression(rawL, 0.8) * sensitivity * 0.5;
      features.energyR = applySoftCompression(rawR, 0.8) * sensitivity * 0.5;
    } catch (e) {
      // Catch disconnected audio node errors
    }
  });

  return { features, smoothedColors: smoothedColorsRef.current };
};