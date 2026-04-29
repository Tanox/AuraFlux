// src/hooks/audio/useAudioAnalyzer.ts v2.3.8
import { useRef, useState, useEffect } from 'react';
import { logger } from '@/utils/logger';

interface AudioAnalyzerOptions {
  fftSize?: number;
  smoothingTimeConstant?: number;
  minDecibels?: number;
  maxDecibels?: number;
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

export const useAudioAnalyzer = (audioContext: AudioContext | null, source: MediaElementAudioSourceNode | MediaStreamAudioSourceNode | null, options: AudioAnalyzerOptions = {}) => {
  const {
    fftSize = 2048,
    smoothingTimeConstant = 0.8,
    minDecibels = -90,
    maxDecibels = -10
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
  const beatDetectRef = useRef({
    lastVolume: 0,
    beatThreshold: 0.3,
    beatCooldown: 0,
    beatCooldownTime: 15
  });

  useEffect(() => {
    if (!audioContext || !source) {
      return;
    }

    try {
      // 创建分析器节点
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = fftSize;
      analyser.smoothingTimeConstant = smoothingTimeConstant;
      analyser.minDecibels = minDecibels;
      analyser.maxDecibels = maxDecibels;

      // 连接到音频源
      source.connect(analyser);

      const frequencyData = new Uint8Array(analyser.frequencyBinCount);
      const timeDomainData = new Uint8Array(analyser.frequencyBinCount);

      analyserRef.current = analyser;

      const updateAudioData = () => {
        if (!analyserRef.current) return;

        try {
          analyserRef.current.getByteFrequencyData(frequencyData);
          analyserRef.current.getByteTimeDomainData(timeDomainData);

          // 计算音量
          const sum = frequencyData.reduce((acc, val) => acc + val, 0);
          const volume = sum / (frequencyData.length * 255);

          // 计算频率带
          const bass = frequencyData.slice(0, frequencyData.length * 0.1).reduce((acc, val) => acc + val, 0) / (frequencyData.length * 0.1 * 255);
          const mids = frequencyData.slice(frequencyData.length * 0.1, frequencyData.length * 0.5).reduce((acc, val) => acc + val, 0) / (frequencyData.length * 0.4 * 255);
          const treble = frequencyData.slice(frequencyData.length * 0.5).reduce((acc, val) => acc + val, 0) / (frequencyData.length * 0.5 * 255);

          // 节拍检测
          let isBeat = false;
          const beatDetect = beatDetectRef.current;
          if (beatDetect.beatCooldown <= 0) {
            if (volume - beatDetect.lastVolume > beatDetect.beatThreshold) {
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
            bass,
            mids,
            treble,
            isBeat,
            analyser: analyserRef.current
          });
        } catch (error) {
          logger.error('Error updating audio data:', error);
        }

        animationIdRef.current = requestAnimationFrame(updateAudioData);
      };

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
  }, [audioContext, source, fftSize, smoothingTimeConstant, minDecibels, maxDecibels]);

  return analyzerResult;
};