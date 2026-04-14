// File: src\hooks\useAudio.ts | Version: v2.2.21
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
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const audioAnalyserRef = useRef<AnalyserNode | null>(null);
  const timeUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devices
          .filter(d => d.kind === 'audioinput')
          .map(d => ({ deviceId: d.deviceId, label: d.label || `Microphone ${d.deviceId.slice(0, 5)}` }));
        setAudioDevices(audioInputs);
      } catch (err: any) {
        console.warn('Error getting devices:', err?.message || err);
      }
    };
    getDevices();
  }, []);

  useEffect(() => {
    if (sourceType === 'file' && playlist.length > 0 && currentIndex >= 0) {
      const track = playlist[currentIndex];
      if (track) {
        if (!audioElementRef.current) {
          audioElementRef.current = new Audio();
          
          audioElementRef.current.addEventListener('loadedmetadata', () => {
            if (audioElementRef.current) {
              setDuration(audioElementRef.current.duration || 0);
            }
          });
          
          audioElementRef.current.addEventListener('timeupdate', () => {
            if (audioElementRef.current) {
              setCurrentTime(audioElementRef.current.currentTime || 0);
            }
          });
          
          audioElementRef.current.addEventListener('ended', () => {
            playNext();
          });
        }
        
        const objectURL = URL.createObjectURL(track.file);
        audioElementRef.current.src = objectURL;
        
        if (isPlaying) {
          audioElementRef.current.play().catch(err => {
            console.warn('Error playing audio:', err);
            setIsPlaying(false);
          });
        }
        
        return () => {
          if (audioElementRef.current) {
            URL.revokeObjectURL(audioElementRef.current.src);
          }
        };
      }
    }
  }, [sourceType, playlist, currentIndex, isPlaying, playNext]);

  useEffect(() => {
    if (audioElementRef.current) {
      if (isPlaying) {
        audioElementRef.current.play().catch(err => {
          console.warn('Error playing audio:', err);
          setIsPlaying(false);
        });
      } else {
        audioElementRef.current.pause();
      }
    }
  }, [isPlaying]);

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
      console.warn('Microphone access skipped or denied:', err?.message || err);
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

  const togglePlayback = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);
  
  const seekFile = useCallback((t: number) => {
    if (audioElementRef.current) {
      audioElementRef.current.currentTime = t;
      setCurrentTime(t);
    }
  }, []);
  
  const playNext = useCallback(() => {
    if (playlist.length > 0) {
      setCurrentIndex(prev => (prev + 1) % playlist.length);
    }
  }, [playlist.length]);
  
  const playPrev = useCallback(() => {
    if (playlist.length > 0) {
      setCurrentIndex(prev => (prev - 1 + playlist.length) % playlist.length);
    }
  }, [playlist.length]);
  
  const playTrackByIndex = useCallback((i: number) => {
    setCurrentIndex(i);
  }, []);
  
  const removeFromPlaylist = useCallback((i: number) => {
    setPlaylist(prev => {
      const newPlaylist = prev.filter((_, idx) => idx !== i);
      if (i === currentIndex && currentIndex >= newPlaylist.length) {
        setCurrentIndex(Math.max(0, newPlaylist.length - 1));
      }
      return newPlaylist;
    });
  }, [currentIndex]);
  
  const clearPlaylist = useCallback(() => {
    setPlaylist([]);
    setCurrentIndex(0);
    setDuration(0);
    setCurrentTime(0);
    setIsPlaying(false);
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.src = '';
    }
  }, []);
  
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

