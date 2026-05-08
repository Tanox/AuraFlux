'use client';

// src/hooks/audio/microphoneManager.ts v2.3.10

import { useState, useCallback, useEffect } from 'react';
import { AudioDevice } from '@/types';
import { logger } from '@/utils/logger';
import { DeviceService } from '@/services/deviceService';

type ToastType = 'success' | 'info' | 'error' | 'warning';
const FFT_SIZE = 2048;

interface MicrophoneManagerProps {
  showToast: (m: string, type?: ToastType) => void;
}

interface MicrophoneManagerReturn {
  isListening: boolean;
  mediaStream: MediaStream | null;
  audioDevices: AudioDevice[];
  selectedDeviceId: string;
  analyser: AnalyserNode | null;
  audioContext: AudioContext | null;
  toggleMicrophone: (deviceId: string) => Promise<void>;
  onDeviceChange: (id: string) => void;
}

export function useMicrophoneManager({ showToast }: MicrophoneManagerProps): MicrophoneManagerReturn {
  const [isListening, setIsListening] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [audioDevices, setAudioDevices] = useState<AudioDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    const loadDevices = async () => {
      try {
        const devices = await DeviceService.enumerateDevices();
        setAudioDevices(devices);
      } catch (err) {
        const error = err as Error;
        logger.warn('Error getting devices:', error?.message || err);
      }
    };
    loadDevices();

    const unsubscribe = DeviceService.addListener((devices) => {
      setAudioDevices(devices);
    });

    return unsubscribe;
  }, []);

  const createAudioContext = (): AudioContext => {
    const AudioContextCtor = window.AudioContext || (window as { webkitAudioContext?: new () => AudioContext }).webkitAudioContext;
    if (!AudioContextCtor) {
      throw new Error('Web Audio API not supported');
    }
    return new AudioContextCtor();
  };

  const toggleMicrophone = useCallback(async (deviceId: string) => {
    try {
      if (isListening) {
        if (mediaStream) {
          mediaStream.getTracks().forEach(t => {
            try {
              t.stop();
            } catch (e) {
              logger.warn('Error stopping track:', e);
            }
          });
        }
        
        if (audioContext) {
          try {
            if (analyser) analyser.disconnect();
            await audioContext.close();
          } catch (e) {
            logger.warn('Error closing audio context:', e);
          }
        }
        
        setIsListening(false);
        setMediaStream(null);
        setAnalyser(null);
        setAudioContext(null);
        return;
      }

      const stream = await DeviceService.requestMicrophoneAccess(deviceId || undefined);
      if (!stream) {
        showToast('Microphone access denied. Running in silent mode.', 'error');
        return;
      }

      const ctx = createAudioContext();
      const source = ctx.createMediaStreamSource(stream);
      const ana = ctx.createAnalyser();
      ana.fftSize = FFT_SIZE;
      source.connect(ana);

      setAnalyser(ana);
      setMediaStream(stream);
      setIsListening(true);
      setSelectedDeviceId(deviceId);
      setAudioContext(ctx);
    } catch (err) {
      const error = err as Error;
      logger.warn('Microphone access skipped or denied:', error?.message || err);
      showToast('Microphone access denied. Running in silent mode.', 'error');
    }
  }, [isListening, mediaStream, showToast, audioContext, analyser]);

  const onDeviceChange = useCallback((id: string) => {
    DeviceService.selectDevice(id);
    setSelectedDeviceId(id);
  }, []);

  return {
    isListening,
    mediaStream,
    audioDevices,
    selectedDeviceId,
    analyser,
    audioContext,
    toggleMicrophone,
    onDeviceChange
  };
}
