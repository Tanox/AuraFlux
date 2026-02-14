/**
 * File: core/hooks/useAudioReactive.ts
 * Version: 1.9.13
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

const getSafeColors = (inputColors: string[] | undefined | null) => {
  // Defensive check for non-array or empty input
  const base = (Array.isArray(inputColors) && inputColors.length > 0) ? inputColors : ['#ffffff', '#0000ff', '#ff00ff'];
  const safe = [...base];
  // Ensure minimum 3 colors for consistent destructuring in scenes
  while (safe.length < 3) {
    safe.push(base[0] || '#ffffff');
  }
  return safe;
};

export const useAudioReactive = ({ analyser, analyserR, colors, settings }: UseAudioReactiveProps) => {
  // Safe extraction of input colors
  const safeInputColors = useMemo(() => getSafeColors(colors), [colors]);

  // CRITICAL: Synchronize smoothedColorsRef to prevent "length of undefined" errors in 3D scenes
  // This logic runs during the render phase to ensure the ref is valid before children use it.
  const smoothedColorsRef = useRef<Color[]>([]);
  
  if (smoothedColorsRef.current.length !== safeInputColors.length) {
      const current = smoothedColorsRef.current;
      if (safeInputColors.length > current.length) {
          // Increase size: Add new Color objects
          for (let i = current.length; i < safeInputColors.length; i++) {
              current.push(new Color(safeInputColors[i]));
          }
      } else {
          // Decrease size: Truncate array
          current.length = safeInputColors.length;
      }
  }

  // Audio analysis data arrays - Re-created if fftSize changes
  const binCount = analyser?.frequencyBinCount || 512;
  const dataArray = useMemo(() => new Uint8Array(binCount), [binCount]);
  const dataArrayR = useMemo(() => new Uint8Array(binCount), [binCount]);

  // Utility state refs
  const targetColorRef = useRef(new Color());
  const beatDetectorRef = useRef(new BeatDetector());
  const noiseFilterRef = useRef(new AdaptiveNoiseFilter());
  const peakLimiterRef = useRef(new DynamicPeakLimiter());

  // Result features ref
  const features = useRef({ 
    bass: 0, mids: 0, treble: 0, volume: 0, 
    energyL: 0, energyR: 0,
    isBeat: false 
  }).current;

  useFrame(() => {
    if (!analyser) return;

    const smoothedColors = smoothedColorsRef.current;
    const lerpSpeed = 0.05;
    
    // Smooth transition for all active colors
    smoothedColors.forEach((color, i) => {
      const targetHex = safeInputColors[i] || safeInputColors[0] || '#ffffff';
      if (color instanceof Color) {
        color.lerp(targetColorRef.current.set(targetHex), lerpSpeed);
      }
    });

    // Audio Analysis & Extraction
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
      // Silence intermittent Web Audio API node connection errors
    }
  });

  return { features, smoothedColors: smoothedColorsRef.current };
};