
/**
 * File: core/hooks/useAudio.ts
 * Version: 2.1.0
 * Author: Sut
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AudioDevice, VisualizerSettings, Language, AudioSourceType, SongInfo, Track } from '../types';
import { audioBufferToWav } from '../services/audioUtils';
import { usePlaylist } from './usePlaylist';

interface UseAudioProps {
  settings: VisualizerSettings;
  language: Language;
  setCurrentSong: React.Dispatch<React.SetStateAction<SongInfo | null>>;
  t?: any;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const useAudio = ({ settings, setCurrentSong, t, showToast }: UseAudioProps) => {
  const safeFftSize = settings?.fftSize || 512;
  const safeSmoothing = settings?.smoothing ?? 0.8;

  const [sourceType, setSourceType] = useState<AudioSourceType>('MICROPHONE');
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [analyserR, setAnalyserR] = useState<AnalyserNode | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [audioDevices, setAudioDevices] = useState<AudioDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const analyserRRef = useRef<AnalyserNode | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const fileSourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const micSourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const splitterNodeRef = useRef<ChannelSplitterNode | null>(null);
  const startTimeRef = useRef(0);
  const pausedAtRef = useRef(0);
  const rafRef = useRef(0);
  const pendingTrackIdRef = useRef<string | null>(null);

  const pl = usePlaylist(setCurrentSong);

  useEffect(() => {
    if (analyserRef.current) {
        analyserRef.current.fftSize = safeFftSize;
        analyserRef.current.smoothingTimeConstant = safeSmoothing;
    }
    if (analyserRRef.current) {
        analyserRRef.current.fftSize = safeFftSize;
        analyserRRef.current.smoothingTimeConstant = safeSmoothing;
    }
  }, [safeFftSize, safeSmoothing]);

  useEffect(() => {
    const getDevices = async () => {
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return;
            const devices = await navigator.mediaDevices.enumerateDevices();
            const audioIn = devices
                .filter(d => d.kind === 'audioinput')
                .map(d => ({ deviceId: d.deviceId, label: d.label || `Microphone ${d.deviceId.slice(0, 5)}` }));
            setAudioDevices(audioIn);
        } catch (e) {
            console.error("[Audio] Device enumeration failed:", e);
        }
    };
    getDevices();
    if (navigator.mediaDevices) {
        navigator.mediaDevices.addEventListener('devicechange', getDevices);
        return () => navigator.mediaDevices.removeEventListener('devicechange', getDevices);
    }
  }, []);

  const ensureContext = useCallback(async (): Promise<AudioContext> => {
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
        try { await audioContextRef.current.resume(); } catch(e) { console.warn("Context resume failed", e); }
    }
    if (!analyserRef.current || !analyserRRef.current) {
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = analyserRRef.current.fftSize = safeFftSize;
      analyserRef.current.smoothingTimeConstant = analyserRRef.current.smoothingTimeConstant = safeSmoothing;
      setAnalyser(analyserRef.current);
      setAnalyserR(analyserRRef.current);
    }
    return audioContextRef.current;
  }, [safeFftSize, safeSmoothing]);

  const killExistingFileSource = useCallback(() => {
    if (fileSourceNodeRef.current) {
        try {
            fileSourceNodeRef.current.onended = null;
            fileSourceNodeRef.current.stop();
            fileSourceNodeRef.current.disconnect();
        } catch (e) {}
        fileSourceNodeRef.current = null;
    }
  }, []);

  const stopAll = useCallback(async () => {
    cancelAnimationFrame(rafRef.current);
    if (mediaStream) mediaStream.getTracks().forEach(track => track.stop());
    killExistingFileSource();
    const disconnectNode = (nodeRef: React.MutableRefObject<any>) => {
        if (nodeRef.current) { try { nodeRef.current.disconnect(); } catch (e) {} nodeRef.current = null; }
    };
    disconnectNode(micSourceNodeRef); 
    disconnectNode(splitterNodeRef);
    setIsListening(false); 
    setIsPlaying(false); 
    setMediaStream(null);
  }, [mediaStream, killExistingFileSource]);

  const toggleMicrophone = useCallback(async (deviceId?: string) => {
    if (!navigator.mediaDevices) {
        showToast(t?.errors?.accessDenied || "Microphone access is required.", 'error');
        return;
    }
    if (isListening && sourceType === 'MICROPHONE' && (!deviceId || deviceId === selectedDeviceId)) {
      await stopAll();
      pendingTrackIdRef.current = null;
    } else {
      setIsPending(true);
      try {
        await stopAll();
        pendingTrackIdRef.current = null;
        setSourceType('MICROPHONE');
        const ctx = await ensureContext();
        let stream: MediaStream;
        try {
            const constraints = (deviceId || selectedDeviceId) 
                ? { audio: { deviceId: { exact: deviceId || selectedDeviceId } } } 
                : { audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } };
            stream = await navigator.mediaDevices.getUserMedia(constraints);
        } catch (err) {
            stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        }
        setMediaStream(stream);
        const source = ctx.createMediaStreamSource(stream);
        micSourceNodeRef.current = source;
        if (analyserRef.current) source.connect(analyserRef.current);
        if (analyserRRef.current) source.connect(analyserRRef.current);
        if (deviceId) setSelectedDeviceId(deviceId);
        setIsListening(true);
      } catch (e: any) {
          showToast(t?.errors?.accessDenied || "Microphone access denied.", 'error');
      } finally { setIsPending(false); }
    }
  }, [isListening, sourceType, stopAll, ensureContext, selectedDeviceId, t, showToast]);

  const playFileBuffer = useCallback(async () => {
    if (!audioBufferRef.current) return;
    killExistingFileSource();
    const ctx = await ensureContext();
    const source = ctx.createBufferSource(); 
    source.buffer = audioBufferRef.current;
    const splitter = ctx.createChannelSplitter(2); 
    splitterNodeRef.current = splitter;
    source.connect(splitter);
    splitter.connect(analyserRef.current!, 0);
    splitter.connect(analyserRRef.current!, audioBufferRef.current.numberOfChannels > 1 ? 1 : 0);
    source.connect(ctx.destination);
    source.onended = () => { 
        if (fileSourceNodeRef.current === source) {
            setIsPlaying(false);
            const nextIdx = pl.getNextIndex(); 
            if (nextIdx !== -1) playTrackByIndex(nextIdx); 
        } 
    };
    const startOffset = Math.max(0, Math.min(pausedAtRef.current, audioBufferRef.current.duration - 0.01));
    source.start(0, startOffset);
    startTimeRef.current = ctx.currentTime - startOffset;
    fileSourceNodeRef.current = source; 
    setIsPlaying(true);
    cancelAnimationFrame(rafRef.current);
    const update = () => { 
        if (audioContextRef.current) {
            setCurrentTime(audioContextRef.current.currentTime - startTimeRef.current);
        }
        rafRef.current = requestAnimationFrame(update); 
    };
    rafRef.current = requestAnimationFrame(update);
  }, [pl, ensureContext, killExistingFileSource]);

  const playTrack = useCallback(async (track: Track, index: number) => {
    if (!track) return;
    const currentId = track.id;
    setIsPending(true); 
    await stopAll(); 
    pendingTrackIdRef.current = currentId;
    setSourceType('FILE'); 
    setCurrentSong(track); 
    pl.setCurrentIndex(index); 
    pausedAtRef.current = 0;
    try {
      const ctx = await ensureContext(); 
      const ab = await ctx.decodeAudioData(await track.file.arrayBuffer());
      if (pendingTrackIdRef.current !== currentId) return;
      audioBufferRef.current = ab; 
      setDuration(ab.duration); 
      playFileBuffer();
    } catch (e) {
        if (pendingTrackIdRef.current === currentId) {
            console.error("[Audio] Decode Error:", e);
            showToast(t?.errors?.trackLoad || "Failed to load track.", 'error');
        }
    } finally { 
        if (pendingTrackIdRef.current === currentId) {
            setIsPending(false); 
        }
    }
  }, [stopAll, setCurrentSong, playFileBuffer, ensureContext, pl.setCurrentIndex, t, showToast]);

  const playTrackByIndex = useCallback(async (index: number) => {
    const track = pl.playlist[index]; 
    if (track) playTrack(track, index);
  }, [pl.playlist, playTrack]);

  // 特殊包装：确保在曲目被删除时停止当前音频
  const safeRemoveFromPlaylist = useCallback((index: number) => {
      const result = pl.removeFromPlaylist(index);
      if (result?.wasCurrent && sourceType === 'FILE') {
          stopAll();
          audioBufferRef.current = null;
          pendingTrackIdRef.current = null;
      }
  }, [pl.removeFromPlaylist, sourceType, stopAll]);

  const togglePlayback = useCallback(async () => {
    if (isPending) return;
    if (audioContextRef.current) {
        if (audioContextRef.current.state === 'suspended') {
            try { await audioContextRef.current.resume(); } catch (e) { console.error(e); }
        }
    } else { await ensureContext(); }

    if (isPlaying) {
        if (audioContextRef.current && fileSourceNodeRef.current) {
            const suspendTime = audioContextRef.current.currentTime - startTimeRef.current;
            if (audioBufferRef.current && audioBufferRef.current.duration > 0) {
                pausedAtRef.current = suspendTime > 0 ? suspendTime % audioBufferRef.current.duration : 0;
            }
        }
        killExistingFileSource();
        cancelAnimationFrame(rafRef.current);
        setIsPlaying(false);
    } else {
        if (isListening || sourceType === 'MICROPHONE') {
            await stopAll();
            pendingTrackIdRef.current = null;
        }
        if (audioBufferRef.current) {
            setSourceType('FILE');
            playFileBuffer();
        } else if (pl.playlist.length > 0) {
            setSourceType('FILE');
            const idx = (pl.currentIndex >= 0 && pl.currentIndex < pl.playlist.length) ? pl.currentIndex : 0;
            playTrackByIndex(idx);
        } else { if (!isListening) toggleMicrophone(); }
    }
  }, [isPlaying, isListening, isPending, playFileBuffer, killExistingFileSource, pl.playlist, pl.currentIndex, playTrackByIndex, sourceType, toggleMicrophone, stopAll, ensureContext]);

  return {
    sourceType, analyser, analyserR, isListening, isPending, mediaStream, audioDevices,
    selectedDeviceId, onDeviceChange: setSelectedDeviceId,
    isPlaying, duration, currentTime, ...pl, 
    removeFromPlaylist: safeRemoveFromPlaylist, 
    toggleMicrophone, playTrackByIndex,
    playNext: () => { if (pl.playlist.length > 0) playTrackByIndex(pl.getNextIndex()); },
    playPrev: () => { if (pl.playlist.length > 0) playTrackByIndex(pl.getPrevIndex()); },
    togglePlayback, importFiles: async (files: FileList | File[]) => {
        const wasEmpty = pl.playlist.length === 0;
        const newTracks = await pl.importFiles(files);
        if (wasEmpty && newTracks.length > 0) playTrack(newTracks[0], 0);
        return newTracks;
    },
    seekFile: (t: number) => { 
        killExistingFileSource();
        pausedAtRef.current = t; 
        if (isPlaying) playFileBuffer(); 
        else setCurrentTime(t); 
    },
    getAudioSlice: async (s = 15) => audioBufferRef.current ? audioBufferToWav(audioBufferRef.current) : null,
    audioContext: audioContextRef.current
  };
};
