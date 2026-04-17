'use client';
// File: src/hooks/audio/useAudio.ts | Version: v2.3.0

import { useCallback, useState, useEffect } from 'react';
import { UseAudioProps, UseAudioReturn } from './types';
import { useMicrophoneManager } from './microphoneManager';
import { useFilePlayer } from './filePlayer';

export function useAudio({ settings, language, setCurrentSong, showToast }: UseAudioProps): UseAudioReturn {
  const [sourceType, setSourceType] = useState<'microphone' | 'file' | 'url'>('microphone');
  const [isPending, setIsPending] = useState(false);

  // 麦克风管�?  const {
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

  // 选择当前�?analyser
  const analyser = sourceType === 'microphone' ? micAnalyser : fileAnalyser;
  const analyserR = sourceType === 'microphone' ? micAnalyser : fileAnalyserR;
  const audioContext = sourceType === 'microphone' ? micAudioContext : fileAudioContext;

  // 切换源类型时的处�?  const handleSourceTypeChange = useCallback((type: 'microphone' | 'file' | 'url') => {
    setSourceType(type);
  }, []);

  // 清理函数
  useEffect(() => {
    return () => {
      // 清理麦克�?      mediaStream?.getTracks().forEach(t => t.stop());
      
      // 清理音频上下�?      micAudioContext?.close();
      fileAudioContext?.close();
    };
  }, [mediaStream, micAudioContext, fileAudioContext]);

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
  };
}
