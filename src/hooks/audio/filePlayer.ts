'use client';

// src/hooks/audio/filePlayer.ts v2.3.11

import { useState, useCallback, useRef, useEffect } from 'react';
import { Track, SongInfo, PlaybackMode } from '@/types';
import { logger } from '@/utils/logger';

type ToastType = 'success' | 'info' | 'error' | 'warning';

interface FilePlayerProps {
  setCurrentSong: (s: SongInfo | null) => void;
  showToast: (m: string, type?: ToastType) => void;
}

interface FilePlayerReturn {
  playlist: Track[];
  currentIndex: number;
  playbackMode: PlaybackMode;
  setPlaybackMode: (mode: PlaybackMode) => void;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  analyser: AnalyserNode | null;
  analyserR: AnalyserNode | null;
  audioContext: AudioContext | null;
  importFiles: (files: FileList | File[]) => Promise<void>;
  importFromUrl: (url: string) => Promise<Track>;
  importPlaylistFromUrl: (url: string) => Promise<Track[]>;
  togglePlayback: () => void;
  seekFile: (t: number) => void;
  playNext: () => void;
  playPrev: () => void;
  playTrackByIndex: (i: number) => void;
  removeFromPlaylist: (i: number) => void;
  clearPlaylist: () => void;
  getAudioSlice: (s?: number) => Promise<Blob | null>;
}

const FFT_SIZE = 2048;
const AUDIO_MIME_TYPES = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/flac', 'audio/mp3'];

export function useFilePlayer({ setCurrentSong, showToast }: FilePlayerProps): FilePlayerReturn {
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [playbackMode, setPlaybackMode] = useState<PlaybackMode>(PlaybackMode.SHUFFLE);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [analyserR, setAnalyserR] = useState<AnalyserNode | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isLoopingRef = useRef(false);
  const isSeekingRef = useRef(false);
  const handlersRef = useRef<Record<string, () => void>>({});

  const cleanupAudioContext = useCallback(() => {
    if (sourceRef.current) {
      try {
        sourceRef.current.disconnect();
      } catch (e) {
        logger.warn('Error disconnecting audio source', e);
      }
    }
    if (analyser) {
      try {
        analyser.disconnect();
      } catch (e) {
        logger.warn('Error disconnecting analyser', e);
      }
    }
    if (analyserR) {
      try {
        analyserR.disconnect();
      } catch (e) {
        logger.warn('Error disconnecting analyserR', e);
      }
    }
    if (audioContext) {
      try {
        audioContext.close();
      } catch (e) {
        logger.warn('Error closing audio context', e);
      }
    }
    setAudioContext(null);
    setAnalyser(null);
    setAnalyserR(null);
  }, [analyser, analyserR, audioContext]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      const audio = audioRef.current;
      const handlers = handlersRef.current;
      
      if (audio) {
        try {
          audio.pause();
          audio.removeEventListener('ended', handlers.ended);
          audio.removeEventListener('timeupdate', handlers.timeUpdate);
          audio.removeEventListener('loadedmetadata', handlers.loadedMetadata);
          audio.removeEventListener('error', handlers.error);
          
          if (audio.src && audio.src.startsWith('blob:')) {
            URL.revokeObjectURL(audio.src);
          }
          audio.src = '';
          audio.srcObject = null;
        } catch (e) {
          logger.warn('Error cleaning up audio element', e);
        }
      }
      
      cleanupAudioContext();
    };
  }, [cleanupAudioContext]);

  const createAudioContext = useCallback((): AudioContext => {
    const AudioContextCtor = window.AudioContext || (window as { webkitAudioContext?: new () => AudioContext }).webkitAudioContext;
    if (!AudioContextCtor) {
      throw new Error('Web Audio API not supported');
    }
    return new AudioContextCtor();
  }, []);

  const setupAnalysers = useCallback((ctx: AudioContext, source: MediaElementAudioSourceNode): void => {
    const ana = ctx.createAnalyser();
    ana.fftSize = FFT_SIZE;
    
    const anaR = ctx.createAnalyser();
    anaR.fftSize = FFT_SIZE;
    
    source.connect(ana);
    source.connect(anaR);
    
    setAnalyser(ana);
    setAnalyserR(anaR);
  }, []);

  const playTrackByIndex = useCallback((i: number): void => {
    if (i < 0 || i >= playlist.length) {
      logger.warn('Invalid track index', i);
      return;
    }
    
    const track = playlist[i];
    if (!audioRef.current || !track.url) {
      logger.warn('Audio element or track URL not available');
      return;
    }
    
    audioRef.current.src = track.url;
    
    audioRef.current.play().catch(e => {
      logger.error('Playback error:', e);
      showToast('Playback failed', 'error');
      setIsPlaying(false);
    });
    
    setCurrentIndex(i);
    setIsPlaying(true);
    
    let ctx = audioContext;
    if (!ctx) {
      try {
        ctx = createAudioContext();
        setAudioContext(ctx);
      } catch (e) {
        logger.error('Failed to create audio context:', e);
        showToast('Audio initialization failed', 'error');
        return;
      }
    }
    
    if (ctx.state === 'suspended') {
      ctx.resume().catch(e => logger.warn('Failed to resume audio context', e));
    }
    
    if (sourceRef.current) {
      try {
        sourceRef.current.disconnect();
      } catch {
        // Ignore disconnect errors
      }
    }
    
    sourceRef.current = ctx.createMediaElementSource(audioRef.current);
    setupAnalysers(ctx, sourceRef.current);
    
    setCurrentSong({
      title: track.title,
      artist: 'Unknown',
      album: 'Unknown',
      coverArt: track.coverArt
    });
  }, [playlist, audioContext, createAudioContext, setupAnalysers, setCurrentSong, showToast]);

  const playNext = useCallback(() => {
    if (playlist.length === 0) return;
    
    let nextIndex: number;
    if (playbackMode === PlaybackMode.SHUFFLE) {
      nextIndex = Math.floor(Math.random() * playlist.length);
      if (nextIndex === currentIndex && playlist.length > 1) {
        nextIndex = (nextIndex + 1) % playlist.length;
      }
    } else {
      nextIndex = (currentIndex + 1) % playlist.length;
    }
    playTrackByIndex(nextIndex);
  }, [currentIndex, playlist.length, playbackMode, playTrackByIndex]);

  const playPrev = useCallback(() => {
    if (playlist.length === 0) return;
    
    let prevIndex: number;
    if (playbackMode === PlaybackMode.SHUFFLE) {
      prevIndex = Math.floor(Math.random() * playlist.length);
      if (prevIndex === currentIndex && playlist.length > 1) {
        prevIndex = (prevIndex - 1 + playlist.length) % playlist.length;
      }
    } else {
      prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    }
    playTrackByIndex(prevIndex);
  }, [currentIndex, playlist.length, playbackMode, playTrackByIndex]);

  const handleEnded = useCallback(() => {
    if (isLoopingRef.current && audioRef.current) {
      audioRef.current.play().catch(e => {
        logger.warn('Loop playback failed', e);
      });
    } else {
      playNext();
    }
  }, [playNext]);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current && !isSeekingRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  }, []);

  const handleError = useCallback(() => {
    if (audioRef.current?.error) {
      logger.error('Audio error:', audioRef.current.error);
      showToast('Error loading audio file', 'error');
      setIsPlaying(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (!audioRef.current) {
      const audio = document.createElement('audio');
      audio.crossOrigin = 'anonymous';
      audio.preload = 'metadata';
      audioRef.current = audio;
    }
    
    const audio = audioRef.current;
    handlersRef.current = {
      ended: handleEnded,
      timeUpdate: handleTimeUpdate,
      loadedMetadata: handleLoadedMetadata,
      error: handleError
    };
    
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('error', handleError);
    
    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('error', handleError);
    };
  }, [handleEnded, handleError, handleLoadedMetadata, handleTimeUpdate]);

  const isValidAudioFile = (file: File): boolean => {
    return AUDIO_MIME_TYPES.includes(file.type) || file.name.match(/\.(mp3|wav|ogg|flac|m4a|aac)$/i) !== null;
  };

  const importFiles = useCallback(async (files: FileList | File[]): Promise<void> => {
    const fileArray = Array.from(files);
    const newTracks: Track[] = [];
    let skippedCount = 0;
    
    for (const file of fileArray) {
      if (!isValidAudioFile(file)) {
        skippedCount++;
        logger.warn('Skipping invalid audio file:', file.name);
        continue;
      }
      
      try {
        const url = URL.createObjectURL(file);
        newTracks.push({
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file,
          title: file.name.replace(/\.[^/.]+$/, ''),
          artist: 'Unknown Artist',
          url,
          duration: 0,
          isLocal: true,
          coverArt: null
        });
      } catch (e) {
        logger.error('Error processing file:', file.name, e);
        skippedCount++;
      }
    }
    
    if (newTracks.length > 0) {
      setPlaylist(prev => [...prev, ...newTracks]);
      showToast(`Added ${newTracks.length} tracks to playlist`);
    }
    
    if (skippedCount > 0) {
      showToast(`Skipped ${skippedCount} invalid files`, 'warning');
    }
  }, [showToast]);

  const importFromUrl = useCallback(async (url: string): Promise<Track> => {
    try {
      const parsedUrl = new URL(url);
      const fileName = parsedUrl.pathname.split('/').pop() || 'Unknown';
      const title = fileName.replace(/\.[^/.]+$/, '');
      
      const track: Track = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file: new File([], fileName),
        title,
        artist: 'Unknown Artist',
        url,
        duration: 0,
        isLocal: false,
        coverArt: null
      };
      
      setPlaylist(prev => [...prev, track]);
      showToast(`Added "${title}" to playlist`, 'success');
      return track;
    } catch (e) {
      logger.error('Error importing URL:', e);
      showToast('Invalid URL', 'error');
      throw e;
    }
  }, [showToast]);

  const importPlaylistFromUrl = useCallback(async (_url: string): Promise<Track[]> => {
    showToast('Playlist import not implemented', 'warning');
    return [];
  }, [showToast]);

  const togglePlayback = useCallback(() => {
    if (!audioRef.current || currentIndex < 0 || currentIndex >= playlist.length) {
      logger.warn('Toggle playback failed: invalid state');
      return;
    }
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(e => {
        logger.error('Playback error:', e);
        showToast('Playback failed', 'error');
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  }, [currentIndex, isPlaying, playlist.length, showToast]);

  const seekFile = useCallback((t: number): void => {
    if (!audioRef.current || !isFinite(t)) return;
    
    isSeekingRef.current = true;
    try {
      audioRef.current.currentTime = Math.max(0, Math.min(t, duration));
      setCurrentTime(audioRef.current.currentTime);
    } catch (e) {
      logger.error('Seek error:', e);
    } finally {
      isSeekingRef.current = false;
    }
  }, [duration]);

  const removeFromPlaylist = useCallback((i: number): void => {
    if (i < 0 || i >= playlist.length) return;
    
    const removedTrack = playlist[i];
    if (removedTrack.url && removedTrack.url.startsWith('blob:')) {
      try {
        URL.revokeObjectURL(removedTrack.url);
      } catch (e) {
        logger.warn('Error revoking object URL', e);
      }
    }
    
    setPlaylist(prev => prev.filter((_, index) => index !== i));
    
    if (i === currentIndex) {
      if (playlist.length > 1) {
        const nextIndex = i < playlist.length - 1 ? i : 0;
        playTrackByIndex(nextIndex);
      } else {
        setCurrentIndex(-1);
        setIsPlaying(false);
        setCurrentSong(null);
      }
    } else if (i < currentIndex) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex, playlist.length, playlist, playTrackByIndex, setCurrentSong]);

  const clearPlaylist = useCallback(() => {
    playlist.forEach(track => {
      if (track.url && track.url.startsWith('blob:')) {
        try {
          URL.revokeObjectURL(track.url);
        } catch (e) {
          logger.warn('Error revoking object URL', e);
        }
      }
    });
    
    setPlaylist([]);
    setCurrentIndex(-1);
    setIsPlaying(false);
    setCurrentSong(null);
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
  }, [playlist, setCurrentSong]);

  const getAudioSlice = useCallback(async (_s = 30): Promise<Blob | null> => {
    logger.warn('getAudioSlice not implemented');
    return null;
  }, []);

  return {
    playlist,
    currentIndex,
    playbackMode,
    setPlaybackMode,
    isPlaying,
    duration,
    currentTime,
    analyser,
    analyserR,
    audioContext,
    importFiles,
    importFromUrl,
    importPlaylistFromUrl,
    togglePlayback,
    seekFile,
    playNext,
    playPrev,
    playTrackByIndex,
    removeFromPlaylist,
    clearPlaylist,
    getAudioSlice
  };
}
