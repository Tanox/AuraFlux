// File: src/hooks/useAudio.ts | Version: v2.2.0
import { useState, useCallback, useRef } from 'react';
import { VisualizerSettings, SongInfo } from '../types';
import { useMediaDevices } from './audio/useMediaDevices';
import { usePlaylist } from './audio/usePlaylist';

interface UseAudioProps {
  settings: VisualizerSettings;
  language: string;
  setCurrentSong: (s: SongInfo | null) => void;
  t: any;
  showToast: (m: string, type?: any) => void;
}

export const useAudio = ({ settings, language, setCurrentSong, t, showToast }: UseAudioProps) => {
  const [sourceType, setSourceType] = useState<'microphone' | 'file' | 'url'>('microphone');
  const [isListening, setIsListening] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [analyserR, setAnalyserR] = useState<AnalyserNode | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioDevices = useMediaDevices();
  const playlistState = usePlaylist(showToast);

  const toggleMicrophone = useCallback(async (deviceId: string) => {
    try {
      if (isListening) {
        mediaStream?.getTracks().forEach(t => t.stop());
        setIsListening(false);
        setMediaStream(null);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: deviceId ? { deviceId: { exact: deviceId } } : true
      });

      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const ctx = audioContextRef.current;
      const source = ctx.createMediaStreamSource(stream);
      const ana = ctx.createAnalyser();
      ana.fftSize = 2048;
      source.connect(ana);

      setAnalyser(ana);
      setMediaStream(stream);
      setIsListening(true);
      setSourceType('microphone');
      setSelectedDeviceId(deviceId);
    } catch (err: any) {
      const isPermissionDenied = err?.name === 'NotAllowedError' || String(err).includes('Permission denied');
      if (!isPermissionDenied) {
        console.error('Microphone error:', err);
      }
      showToast(isPermissionDenied ? 'Microphone permission denied' : 'Failed to access microphone', 'error');
    }
  }, [isListening, mediaStream, showToast]);

  const togglePlayback = useCallback(() => setIsPlaying(prev => !prev), []);
  const seekFile = useCallback((t: number) => setCurrentTime(t), []);
  
  const getAudioSlice = useCallback(async (s?: number) => {
      // Mock implementation for now
      return null;
  }, []);

  return {
    sourceType, isListening, isPending,
    analyser, analyserR,
    mediaStream, audioDevices,
    selectedDeviceId, onDeviceChange: setSelectedDeviceId,
    toggleMicrophone,
    ...playlistState,
    importFiles: async (files: FileList | File[]) => {
        setSourceType('file');
        return playlistState.importFiles(files);
    },
    importFromUrl: async () => ({} as any),
    importPlaylistFromUrl: async () => [],
    togglePlayback, seekFile,
    getAudioSlice,
    isPlaying, duration, currentTime,
    audioContext: audioContextRef.current
  };
};
