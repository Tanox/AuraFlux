// src/hooks/audio/useAudioReactive.ts v2.3.11

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color } from 'three';
import { VisualizerSettings } from '@/types';

interface Props {
  analyser: AnalyserNode | null;
  analyserR?: AnalyserNode | null;
  colors: string[];
  settings: VisualizerSettings;
}

export const useAudioReactive = ({ analyser, analyserR, colors, settings }: Props) => {
  const dataRef = useRef(new Uint8Array(1024));
  const dataRefR = useRef(new Uint8Array(1024));
  const timeCounterRef = useRef(0);
  const featuresRef = useRef({
    bass: 0,
    mids: 0,
    treble: 0,
    volume: 0,
    isBeat: false,
    energyL: 0,
    energyR: 0
  });

  const smoothedColors = useMemo(() => {
    return colors.map(c => new Color(c));
  }, [colors]);

  useFrame(() => {
    if (!settings) return;
    
    const len = dataRef.current.length;
    
    if (analyser) {
      analyser.getByteFrequencyData(dataRef.current);
      const data = dataRef.current;

      let bass = 0, mids = 0, treble = 0, vol = 0;
      for (let i = 0; i < len; i++) {
        const val = data[i] / 255;
        vol += val;
        if (i < len * 0.1) bass += val;
        else if (i < len * 0.5) mids += val;
        else treble += val;
      }

      let volR = 0;
      if (analyserR) {
          analyserR.getByteFrequencyData(dataRefR.current);
          const dataR = dataRefR.current;
          for (let i = 0; i < len; i++) {
              volR += dataR[i] / 255;
          }
      } else {
          volR = vol;
      }

      const volume = vol / len;
      const volumeR = volR / len;
      const sensitivity = settings.sensitivity ?? 1;
      
      const f = featuresRef.current;
      f.bass = (bass / (len * 0.1)) * sensitivity;
      f.mids = (mids / (len * 0.4)) * sensitivity;
      f.treble = (treble / (len * 0.5)) * sensitivity;
      f.volume = volume * sensitivity;
      f.isBeat = volume * sensitivity > 0.5;
      f.energyL = volume * sensitivity;
      f.energyR = volumeR * sensitivity;
    } else {
      // 没有 analyser 时，生成模拟的音频特征
      timeCounterRef.current += 0.05;
      const t = timeCounterRef.current;
      
      // 使用正弦波生成模拟的特征
      const sensitivity = settings.sensitivity ?? 1;
      const f = featuresRef.current;
      
      f.bass = (Math.sin(t * 1.2) * 0.5 + 0.5) * sensitivity;
      f.mids = (Math.sin(t * 0.8 + 1) * 0.5 + 0.5) * sensitivity;
      f.treble = (Math.sin(t * 1.5 + 2) * 0.5 + 0.5) * sensitivity;
      f.volume = (f.bass + f.mids + f.treble) / 3;
      f.isBeat = Math.sin(t * 2) > 0.8;
      f.energyL = f.volume;
      f.energyR = f.volume;
    }
  });

  return {
    features: featuresRef.current,
    smoothedColors
  };
};

