'use client';
// File: src/hooks/audio/microphoneManager.ts | Version: v2.3.8

import { useState, useCallback, useEffect } from 'react';
import { AudioDevice } from '@/types';
import { logger } from '@/utils/logger';
import { DeviceService } from '@/services/deviceService';

interface MicrophoneManagerProps {
  showToast: (m: string, type?: any) => void;
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
      } catch (err: any) {
        logger.warn('Error getting devices:', err?.message || err);
      }
    };
    loadDevices();

    const unsubscribe = DeviceService.addListener((devices) => {
      setAudioDevices(devices);
    });

    return unsubscribe;
  }, []);

  const toggleMicrophone = useCallback(async (deviceId: string) => {
    try {
      if (isListening) {
        mediaStream?.getTracks().forEach(t => t.stop());
        setIsListening(false);
        setMediaStream(null);
        return;
      }

      const stream = await DeviceService.requestMicrophoneAccess(deviceId || undefined);
      if (!stream) {
        showToast('Microphone access denied. Running in silent mode.', 'error');
        return;
      }

      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = ctx.createMediaStreamSource(stream);
      const ana = ctx.createAnalyser();
      ana.fftSize = 2048;
      source.connect(ana);

      setAnalyser(ana);
      setMediaStream(stream);
      setIsListening(true);
      setSelectedDeviceId(deviceId);
      setAudioContext(ctx);
    } catch (err: any) {
      logger.warn('Microphone access skipped or denied:', err?.message || err);
      showToast('Microphone access denied. Running in silent mode.', 'error');
    }
  }, [isListening, mediaStream, showToast]);

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
