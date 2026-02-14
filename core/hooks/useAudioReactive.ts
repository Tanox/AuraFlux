/**
 * File: core/hooks/useAudioReactive.ts
 * Version: 1.8.47
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
  // Defensive check for undefined or empty color array
  const base = (inputColors && inputColors.length > 0) ? inputColors : ['#ffffff', '#0000ff', '#ff00ff'];
  const safe = [...base];
  while (safe.length < 3) {
    safe.push(base[0]);
  }
  return safe;
};

export const useAudioReactive = ({ analyser, analyserR, colors, settings }: UseAudioReactiveProps) => {
  // Use a fallback size if analyser is not yet available to prevent initialization crash
  const binCount = analyser?.frequencyBinCount || 512;
  const dataArray = useRef(new Uint8Array(binCount)).current;
  const dataArrayR = useRef(new Uint8Array(binCount)).current;
  
  const safeInputColors = useMemo(() => getSafeColors(colors), [colors]);

  const smoothedColorsRef = useRef(safeInputColors.map(c => new Color(c)));
  const targetColorRef = useRef(new Color());
  const beatDetectorRef = useRef(new BeatDetector());
  const noiseFilterRef = useRef(new AdaptiveNoiseFilter());
  const peakLimiterRef = useRef(new DynamicPeakLimiter());

  const features = useRef({ 
    bass: 0, mids: 0, treble: 0, volume: 0, 
    energyL: 0, energyR: 0,
    isBeat: false 
  }).current;

  useFrame(() => {
    if (!analyser) return;

    const smoothedColors = smoothedColorsRef.current;
    const lerpSpeed = 0.05;
    
    // Color Interpolation
    if (smoothedColors.length !== safeInputColors.length) {
      smoothedColors.length = safeInputColors.length;
    }
    smoothedColors.forEach((color, i) => {
      const targetHex = safeInputColors[i] || safeInputColors[0] || '#ffffff';
      color.lerp(targetColorRef.current.set(targetHex), lerpSpeed);
    });

    // Audio Analysis
    analyser.getByteFrequencyData(dataArray);
    if (analyserR) analyserR.getByteFrequencyData(dataArrayR);
    else dataArrayR.set(dataArray);

    noiseFilterRef.current.process(dataArray);
    if (analyserR) noiseFilterRef.current.process(dataArrayR);
    
    const rawVolume = getAverage(dataArray, 0, dataArray.length) / 255;
    const normFactor = peakLimiterRef.current.process(rawVolume);
    
    features.isBeat = beatDetectorRef.current.detect(dataArray);
    
    const len = dataArray.length;
    const rawBass = (getAverage(dataArray, 0, Math.floor(len * 0.06)) / 255) * normFactor;
    const rawMids = (getAverage(dataArray, Math.floor(len * 0.1), Math.floor(len * 0.3)) / 255) * normFactor;
    const rawTreble = (getAverage(dataArray, Math.floor(len * 0.4), Math.floor(len * 0.8)) / 255) * normFactor;

    features.bass = applySoftCompression(rawBass, 0.7) * (settings?.sensitivity || 1.5);
    features.mids = applySoftCompression(rawMids, 0.75) * (settings?.sensitivity || 1.5);
    features.treble = applySoftCompression(rawTreble, 0.8) * (settings?.sensitivity || 1.5);
    features.volume = applySoftCompression(rawVolume * normFactor, 0.9);

    const rawL = getAverage(dataArray, 5, 60) / 255;
    const rawR = getAverage(dataArrayR, 5, 60) / 255;
    features.energyL = applySoftCompression(rawL, 0.8) * (settings?.sensitivity || 1.5) * 0.5;
    features.energyR = applySoftCompression(rawR, 0.8) * (settings?.sensitivity || 1.5) * 0.5;
  });

  return { features, smoothedColors: smoothedColorsRef.current };
};