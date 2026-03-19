// File: src/hooks/audio/useMediaDevices.ts | Version: v1.0.0
import { useState, useEffect } from 'react';
import { AudioDevice } from '../../types';

export const useMediaDevices = () => {
  const [audioDevices, setAudioDevices] = useState<AudioDevice[]>([]);

  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devices
          .filter(d => d.kind === 'audioinput')
          .map(d => ({ deviceId: d.deviceId, label: d.label || `Microphone ${d.deviceId.slice(0, 5)}` }));
        setAudioDevices(audioInputs);
      } catch (err) {
        console.error('Error getting devices:', err);
      }
    };
    getDevices();
  }, []);

  return audioDevices;
};
