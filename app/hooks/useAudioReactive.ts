// File: app/hooks/useAudioReactive.ts | Version: v1.9.73
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color } from 'three';
import { VisualizerSettings } from '../types/index.ts';
import { getAverage, AdaptiveNoiseFilter, DynamicPeakLimiter, applySoftCompression } from '../services/audioUtils.ts';
import { BeatDetector } from '../services/beatDetector.ts';

interface UseAudioReactiveProps {
  analyser: AnalyserNode | null;
  analyserR?: AnalyserNode | null;
  colors: string[] | undefined | null;
  settings: VisualizerSettings;
}

const FALLBACK_COLORS = ['#ffffff', '#3b82f6', '#8b5cf6'];

const getSafeColors = (inputColors: string[] | undefined | null) => {
  const base = (Array.isArray(inputColors) && inputColors.length > 0) ? inputColors : FALLBACK_COLORS;
  const safe = [...base];
  // 确保数组至少有 3 个颜色，防止解构失败
  while (safe.length < 3) {
    safe.push(base[0] || '#ffffff');
  }
  return safe;
};

export const useAudioReactive = ({ analyser, analyserR, colors, settings }: UseAudioReactiveProps) => {
  const safeInputColors = useMemo(() => getSafeColors(colors), [colors]);
  const smoothedColorsRef = useRef<Color[]>([]);
  
  /**
   * CRITICAL FIX: 强制同步初始化
   * 在并发模式下，useFrame 运行前组件可能已经尝试渲染并解构 smoothedColors。
   * 此逻辑在 Render Phase 执行，保证返回值永远可用。
   */
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

  // 分析数组管理
  const binCount = analyser?.frequencyBinCount || 512;
  const dataArray = useMemo(() => new Uint8Array(binCount), [binCount]);
  const dataArrayR = useMemo(() => new Uint8Array(binCount), [binCount]);

  // 状态组件引用
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
    
    // 颜色平滑过渡
    smoothedColors.forEach((color, i) => {
      const targetHex = safeInputColors[i] || safeInputColors[0] || '#ffffff';
      if (color instanceof Color) {
        color.lerp(targetColorRef.current.set(targetHex), lerpSpeed);
      }
    });

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
      // 捕获偶发的 Web Audio 节点连接断开错误
    }
  });

  return { features, smoothedColors: smoothedColorsRef.current };
};