// src/hooks/audio/useAudioAnalyzer.ts v2.3.10
import { useRef, useState, useEffect, useCallback } from 'react';
import { logger } from '@/utils/logger';

interface AudioAnalyzerOptions {
  fftSize?: number;
  smoothingTimeConstant?: number;
  minDecibels?: number;
  maxDecibels?: number;
  skipFrames?: number;
  sensitivity?: number;
}

interface AudioAnalyzerResult {
  frequencyData: Uint8Array;
  timeDomainData: Uint8Array;
  volume: number;
  bass: number;
  mids: number;
  treble: number;
  isBeat: boolean;
  analyser: AnalyserNode | null;
}

const calculateFrequencyBands = (dataArray: Uint8Array): { bass: number; mids: number; treble: number } => {
  const length = dataArray.length;
  const bassEnd = Math.floor(length * 0.1);
  const midsEnd = Math.floor(length * 0.5);
  
  let bass = 0;
  let mids = 0;
  let treble = 0;
  
  for (let i = 0; i < bassEnd; i++) {
    bass += dataArray[i];
  }
  
  for (let i = bassEnd; i < midsEnd; i++) {
    mids += dataArray[i];
  }
  
  for (let i = midsEnd; i < length; i++) {
    treble += dataArray[i];
  }
  
  return {
    bass: bass / (bassEnd * 255),
    mids: mids / ((midsEnd - bassEnd) * 255),
    treble: treble / ((length - midsEnd) * 255)
  };
};

const calculateVolume = (dataArray: Uint8Array): number => {
  let sum = 0;
  const length = dataArray.length;
  for (let i = 0; i < length; i++) {
    sum += dataArray[i];
  }
  return sum / (length * 255);
};

export const useAudioAnalyzer = (audioContext: AudioContext | null, source: MediaElementAudioSourceNode | MediaStreamAudioSourceNode | null, options: AudioAnalyzerOptions = {}) => {
  const {
    fftSize = 2048,
    smoothingTimeConstant = 0.8,
    minDecibels = -90,
    maxDecibels = -10,
    skipFrames = 0,
    sensitivity = 1.0
  } = options;

  const [analyzerResult, setAnalyzerResult] = useState<AudioAnalyzerResult>({
    frequencyData: new Uint8Array(0),
    timeDomainData: new Uint8Array(0),
    volume: 0,
    bass: 0,
    mids: 0,
    treble: 0,
    isBeat: false,
    analyser: null
  });

  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const frameCountRef = useRef(0);
  const lastVolumeRef = useRef(0);
  const beatCooldownRef = useRef(0);
  
  const beatDetectRef = useRef({
    lastVolume: 0,
    beatThreshold: 0.3 * sensitivity,
    beatCooldown: 0,
    beatCooldownTime: 15,
    adaptiveThreshold: 0.3 * sensitivity
  });

  const updateAudioData = useCallback(() => {
    if (!analyserRef.current) return;

    frameCountRef.current++;
    
    if (skipFrames > 0 && frameCountRef.current % (skipFrames + 1) !== 0) {
      animationIdRef.current = requestAnimationFrame(updateAudioData);
      return;
    }

    try {
      const analyser = analyserRef.current;
      const frequencyData = new Uint8Array(analyser.frequencyBinCount);
      const timeDomainData = new Uint8Array(analyser.frequencyBinCount);

      analyser.getByteFrequencyData(frequencyData);
      analyser.getByteTimeDomainData(timeDomainData);

      const volume = calculateVolume(frequencyData);
      const bands = calculateFrequencyBands(frequencyData);

      let isBeat = false;
      const beatDetect = beatDetectRef.current;
      
      beatDetect.adaptiveThreshold = beatDetect.adaptiveThreshold * 0.95 + (0.3 * sensitivity) * 0.05;
      
      if (beatDetect.beatCooldown <= 0) {
        if (volume - beatDetect.lastVolume > beatDetect.adaptiveThreshold) {
          isBeat = true;
          beatDetect.beatCooldown = beatDetect.beatCooldownTime;
        }
      } else {
        beatDetect.beatCooldown--;
      }
      beatDetect.lastVolume = volume;

      setAnalyzerResult({
        frequencyData,
        timeDomainData,
        volume,
        bass: bands.bass * sensitivity,
        mids: bands.mids * sensitivity,
        treble: bands.treble * sensitivity,
        isBeat,
        analyser
      });
    } catch (error) {
      logger.error('Error updating audio data:', error);
    }

    animationIdRef.current = requestAnimationFrame(updateAudioData);
  }, [skipFrames, sensitivity]);

  useEffect(() => {
    if (!audioContext || !source) {
      return;
    }

    try {
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = fftSize;
      analyser.smoothingTimeConstant = smoothingTimeConstant;
      analyser.minDecibels = minDecibels;
      analyser.maxDecibels = maxDecibels;

      source.connect(analyser);
      analyserRef.current = analyser;

      updateAudioData();

      return () => {
        if (animationIdRef.current) {
          cancelAnimationFrame(animationIdRef.current);
        }
        if (analyserRef.current) {
          analyserRef.current.disconnect();
        }
      };
    } catch (error) {
      logger.error('Error creating audio analyser:', error);
    }
  }, [audioContext, source, fftSize, smoothingTimeConstant, minDecibels, maxDecibels, updateAudioData]);

  return analyzerResult;
};