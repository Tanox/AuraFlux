'use client';

// src/hooks/audio/useAudio.ts v2.3.11
import { useCallback, useState, useEffect, useRef } from 'react';
import { UseAudioProps, UseAudioReturn } from './types';
import { useMicrophoneManager } from './microphoneManager';
import { useFilePlayer } from './filePlayer';

export function useAudio({ settings, language, setCurrentSong, showToast }: UseAudioProps): UseAudioReturn {
  const [sourceType, setSourceType] = useState<'microphone' | 'file' | 'url'>('microphone');
  const [isPending, setIsPending] = useState(false);
  
  // 用于跟踪需要在卸载时清理的资源
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const micAudioContextRef = useRef<AudioContext | null>(null);
  const fileAudioContextRef = useRef<AudioContext | null>(null);

  // 麦克风管理
  const {
    isListening,
    mediaStream,
    audioDevices,
    selectedDeviceId,
    toggleMicrophone,
    onDeviceChange,
    audioContext: micAudioContext,
    analyser: micAnalyser,
  } = useMicrophoneManager({ showToast });

  // 文件播放管理
  const {
    playlist,
    currentIndex,
    playbackMode,
    setPlaybackMode,
    isPlaying,
    duration,
    currentTime,
    analyser: fileAnalyser,
    analyserR: fileAnalyserR,
    audioContext: fileAudioContext,
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
    getAudioSlice,
  } = useFilePlayer({ setCurrentSong, showToast });

  // 更新 refs 跟踪当前资源
  useEffect(() => {
    mediaStreamRef.current = mediaStream;
    micAudioContextRef.current = micAudioContext;
    fileAudioContextRef.current = fileAudioContext;
  }, [mediaStream, micAudioContext, fileAudioContext]);

  // 选择当前的 analyser
  const analyser = sourceType === 'microphone' ? micAnalyser : fileAnalyser;
  const analyserR = sourceType === 'microphone' ? null : fileAnalyserR;
  const audioContext = sourceType === 'microphone' ? micAudioContext : fileAudioContext;

  // 切换源类型时的处理
  const handleSourceTypeChange = useCallback((type: 'microphone' | 'file' | 'url') => {
    setSourceType(type);
  }, []);

  // 清理函数 - 只在组件卸载时执行
  useEffect(() => {
    return () => {
      // 清理麦克风
      mediaStreamRef.current?.getTracks().forEach(t => t.stop());
      
      // 清理音频上下文
      micAudioContextRef.current?.close();
      fileAudioContextRef.current?.close();
    };
  }, []);

  return {
    sourceType,
    isListening,
    isPending,
    analyser,
    analyserR,
    mediaStream,
    audioDevices,
    selectedDeviceId,
    onDeviceChange,
    toggleMicrophone,
    playlist,
    currentIndex,
    playbackMode,
    setPlaybackMode,
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
    getAudioSlice,
    isPlaying,
    duration,
    currentTime,
    audioContext,
    handleSourceTypeChange,
  };
}
