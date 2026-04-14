// File: /src/hooks/useAudioReactive.ts | Version: v2.2.22
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color } from 'three';
import { VisualizerSettings } from '../types';

interface Props {
  analyser: AnalyserNode;
  analyserR?: AnalyserNode | null;
  colors: string[];
  settings: VisualizerSettings;
}

export const useAudioReactive = ({ analyser, analyserR, colors, settings }: Props) => {
  const dataRef = useRef(new Uint8Array(analyser.frequencyBinCount));
  const dataRefR = useRef(new Uint8Array(analyser.frequencyBinCount));
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
    analyser.getByteFrequencyData(dataRef.current);
    const data = dataRef.current;
    const len = data.length;

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
    
    const f = featuresRef.current;
    f.bass = (bass / (len * 0.1)) * settings.sensitivity;
    f.mids = (mids / (len * 0.4)) * settings.sensitivity;
    f.treble = (treble / (len * 0.5)) * settings.sensitivity;
    f.volume = volume * settings.sensitivity;
    f.isBeat = volume * settings.sensitivity > 0.5;
    f.energyL = volume * settings.sensitivity;
    f.energyR = volumeR * settings.sensitivity;
  });

  return {
    features: featuresRef.current,
    smoothedColors
  };
};

