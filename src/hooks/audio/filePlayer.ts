'use client';
// File: src/hooks/audio/filePlayer.ts | Version: v2.3.0

import { useState, useCallback, useRef, useEffect } from 'react';
import { Track, SongInfo, PlaybackMode } from '@/types';

interface FilePlayerProps {
  setCurrentSong: (s: SongInfo | null) => void;
  showToast: (m: string, type?: any) => void;
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      audioRef.current?.pause();
      if (audioRef.current) {
        audioRef.current.srcObject = null;
      }
      sourceRef.current?.disconnect();
      analyser?.disconnect();
      analyserR?.disconnect();
      audioContext?.close();
    };
  }, [analyser, analyserR, audioContext]);

  // Create audio element if not exists
  useEffect(() => {
    if (!audioRef.current) {
      const audio = document.createElement('audio');
      audio.crossOrigin = 'anonymous';
      audioRef.current = audio;
      
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('error', handleError);
    }
  }, []);

  const handleEnded = useCallback(() => {
    if (isLoopingRef.current) {
      audioRef.current?.play();
    } else {
      playNext();
    }
  }, []);

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
      console.error('Audio error:', audioRef.current.error);
      showToast('Error loading audio file', 'error');
      setIsPlaying(false);
    }
  }, [showToast]);

  const initializeAudioContext = useCallback(() => {
    if (!audioContext) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(ctx);
      return ctx;
    }
    return audioContext;
  }, [audioContext]);

  const setupAnalysers = useCallback((ctx: AudioContext, source: MediaElementAudioSourceNode) => {
    const ana = ctx.createAnalyser();
    ana.fftSize = 2048;
    
    const anaR = ctx.createAnalyser();
    anaR.fftSize = 2048;
    
    source.connect(ana);
    source.connect(anaR);
    
    setAnalyser(ana);
    setAnalyserR(anaR);
  }, []);

  const importFiles = useCallback(async (files: FileList | File[]) => {
    const newTracks: Track[] = [];
    for (const file of files) {
      const url = URL.createObjectURL(file);
      newTracks.push({
        id: (Date.now() + Math.random()).toString(),
        file,
        title: file.name,
        artist: 'Unknown Artist',
        url,
        duration: 0,
        isLocal: true,
        coverArt: null
      });
    }
    setPlaylist(prev => [...prev, ...newTracks]);
    showToast(`Added ${newTracks.length} tracks to playlist`);
  }, [showToast]);

  const importFromUrl = useCallback(async (url: string): Promise<Track> => {
    try {
      const track: Track = {
        id: (Date.now() + Math.random()).toString(),
        file: new File([], 'temp.mp3'),
        title: new URL(url).pathname.split('/').pop() || 'Unknown',
        artist: 'Unknown Artist',
        url,
        duration: 0,
        isLocal: false,
        coverArt: null
      };
      setPlaylist(prev => [...prev, track]);
      return track;
    } catch (e) {
      showToast('Invalid URL', 'error');
      throw e;
    }
  }, [showToast]);

  const importPlaylistFromUrl = useCallback(async (_url: string): Promise<Track[]> => {
    try {
      // Placeholder for playlist import logic
      showToast('Playlist import not implemented', 'warning');
      return [];
    } catch (e) {
      showToast('Error importing playlist', 'error');
      return [];
    }
  }, [showToast]);

  const togglePlayback = useCallback(() => {
    if (!audioRef.current || currentIndex < 0 || currentIndex >= playlist.length) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(e => {
        console.warn('Playback error:', e);
        showToast('Playback failed', 'error');
      });
      setIsPlaying(true);
    }
  }, [currentIndex, isPlaying, playlist.length, showToast]);

  const seekFile = useCallback((t: number) => {
    if (!audioRef.current) return;
    isSeekingRef.current = true;
    audioRef.current.currentTime = t;
    setCurrentTime(t);
    isSeekingRef.current = false;
  }, []);

  const playNext = useCallback(() => {
    let nextIndex = currentIndex;
    if (playbackMode === PlaybackMode.SHUFFLE) {
      nextIndex = Math.floor(Math.random() * playlist.length);
      if (nextIndex === currentIndex && playlist.length > 1) {
        nextIndex = (nextIndex + 1) % playlist.length;
      }
    } else {
      nextIndex = (currentIndex + 1) % playlist.length;
    }
    playTrackByIndex(nextIndex);
  }, [currentIndex, playlist.length, playbackMode]);

  const playPrev = useCallback(() => {
    let prevIndex = currentIndex;
    if (playbackMode === PlaybackMode.SHUFFLE) {
      prevIndex = Math.floor(Math.random() * playlist.length);
      if (prevIndex === currentIndex && playlist.length > 1) {
        prevIndex = (prevIndex - 1 + playlist.length) % playlist.length;
      }
    } else {
      prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    }
    playTrackByIndex(prevIndex);
  }, [currentIndex, playlist.length, playbackMode]);

  const playTrackByIndex = useCallback((i: number) => {
    if (i < 0 || i >= playlist.length) return;
    
    const track = playlist[i];
    if (!audioRef.current || !track.url) return;
    
    audioRef.current.src = track.url;
    audioRef.current.play().catch(e => {
      console.warn('Playback error:', e);
      showToast('Playback failed', 'error');
    });
    
    setCurrentIndex(i);
    setIsPlaying(true);
    
    const ctx = initializeAudioContext();
    if (ctx) {
      if (sourceRef.current) sourceRef.current.disconnect();
      sourceRef.current = ctx.createMediaElementSource(audioRef.current);
      setupAnalysers(ctx, sourceRef.current);
    }
    
    setCurrentSong({
      title: track.title,
      artist: 'Unknown',
      album: 'Unknown',
      coverArt: track.coverArt
    });
  }, [playlist, initializeAudioContext, setupAnalysers, setCurrentSong, showToast]);

  const removeFromPlaylist = useCallback((i: number) => {
    setPlaylist(prev => prev.filter((_, index) => index !== i));
    if (i === currentIndex) {
      if (playlist.length > 1) {
        playTrackByIndex((i + 1) % playlist.length);
      } else {
        setCurrentIndex(-1);
        setIsPlaying(false);
        setCurrentSong(null);
      }
    } else if (i < currentIndex) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex, playlist.length, playTrackByIndex, setCurrentSong]);

  const clearPlaylist = useCallback(() => {
    setPlaylist([]);
    setCurrentIndex(-1);
    setIsPlaying(false);
    setCurrentSong(null);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
  }, [setCurrentSong]);

  const getAudioSlice = useCallback(async (_s = 30): Promise<Blob | null> => {
    if (!audioRef.current) return null;
    // Placeholder for audio slicing logic
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
