'use client';
// File: src/hooks/audio/useAudio.ts | Version: v2.3.0

import { useCallback, useState, useEffect } from 'react';
import { UseAudioProps, UseAudioReturn } from './types';
import { useMicrophoneManager } from './microphoneManager';
import { useFilePlayer } from './filePlayer';

export function useAudio({ settings, language, setCurrentSong, showToast }: UseAudioProps): UseAudioReturn {
  const [sourceType, setSourceType] = useState<'microphone' | 'file' | 'url'>('microphone');
  const [isPending, setIsPending] = useState(false);

  // 楹﹀厠椋庣鐞?  const {
    isListening,
    mediaStream,
    audioDevices,
    selectedDeviceId,
    toggleMicrophone,
    onDeviceChange,
    audioContext: micAudioContext,
    analyser: micAnalyser,
  } = useMicrophoneManager({ showToast });

  // 鏂囦欢鎾斁绠＄悊
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

  // 閫夋嫨褰撳墠鐨?analyser
  const analyser = sourceType === 'microphone' ? micAnalyser : fileAnalyser;
  const analyserR = sourceType === 'microphone' ? micAnalyser : fileAnalyserR;
  const audioContext = sourceType === 'microphone' ? micAudioContext : fileAudioContext;

  // 鍒囨崲婧愮被鍨嬫椂鐨勫鐞?  const handleSourceTypeChange = useCallback((type: 'microphone' | 'file' | 'url') => {
    setSourceType(type);
  }, []);

  // 娓呯悊鍑芥暟
  useEffect(() => {
    return () => {
      // 娓呯悊楹﹀厠椋?      mediaStream?.getTracks().forEach(t => t.stop());
      
      // 娓呯悊闊抽涓婁笅鏂?      micAudioContext?.close();
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
