// File: src/hooks/useAudio.ts | Version: v1.9.99
import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { VisualizerSettings, AudioDevice, Track, PlaybackMode, SongInfo } from '../types';

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
  const [audioDevices, setAudioDevices] = useState<AudioDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playbackMode, setPlaybackMode] = useState<PlaybackMode>(PlaybackMode.SEQUENCE);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioNode | null>(null);

  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devices
          .filter(d => d.kind === 'audioinput')
          .map(d => ({ deviceId: d.deviceId, label: d.label || `Microphone ${d.deviceId.slice(0, 5)}` }));
        setAudioDevices(audioInputs);
      } catch (err) {
        console.warn('Error getting devices:', err);
      }
    };
    getDevices();
  }, []);

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
    } catch (err) {
      console.warn('Microphone access skipped or denied:', err);
      showToast('Microphone access denied. Running in silent mode.', 'error');
    }
  }, [isListening, mediaStream, showToast]);

  const importFiles = useCallback(async (files: FileList | File[]) => {
    const newTracks: Track[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).slice(2),
      file: file as File,
      title: (file as File).name.replace(/\.[^/.]+$/, ""),
      artist: 'Unknown Artist'
    }));
    setPlaylist(prev => [...prev, ...newTracks]);
    setSourceType('file');
    showToast(`Imported ${newTracks.length} tracks`);
  }, [showToast]);

  const togglePlayback = useCallback(() => setIsPlaying(prev => !prev), []);
  const seekFile = useCallback((t: number) => setCurrentTime(t), []);
  const playNext = useCallback(() => setCurrentIndex(prev => (prev + 1) % playlist.length), [playlist.length]);
  const playPrev = useCallback(() => setCurrentIndex(prev => (prev - 1 + playlist.length) % playlist.length), [playlist.length]);
  const playTrackByIndex = useCallback((i: number) => setCurrentIndex(i), []);
  const removeFromPlaylist = useCallback((i: number) => setPlaylist(prev => prev.filter((_, idx) => idx !== i)), []);
  const clearPlaylist = useCallback(() => setPlaylist([]), []);
  
  const getAudioSlice = useCallback(async (s?: number) => {
      // Mock implementation for now
      return null;
  }, []);

  return useMemo(() => ({
    sourceType, isListening, isPending,
    analyser, analyserR,
    mediaStream, audioDevices,
    selectedDeviceId, onDeviceChange: setSelectedDeviceId,
    toggleMicrophone,
    playlist, currentIndex, playbackMode,
    setPlaybackMode,
    importFiles,
    importFromUrl: async () => ({} as any),
    importPlaylistFromUrl: async () => [],
    togglePlayback, seekFile,
    playNext, playPrev,
    playTrackByIndex, removeFromPlaylist,
    clearPlaylist, getAudioSlice,
    isPlaying, duration, currentTime,
    audioContext: audioContextRef.current
  }), [sourceType, isListening, isPending, analyser, analyserR, mediaStream, audioDevices, selectedDeviceId, setSelectedDeviceId, toggleMicrophone, playlist, currentIndex, playbackMode, setPlaybackMode, importFiles, togglePlayback, seekFile, playNext, playPrev, playTrackByIndex, removeFromPlaylist, clearPlaylist, getAudioSlice, isPlaying, duration, currentTime]);
};
