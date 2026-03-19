// File: src/context/AudioContext.tsx | Version: v1.0.0
import React, { createContext, useContext, useState, useMemo } from 'react';
import { AudioSourceType, AudioDevice, SongInfo, Track, PlaybackMode, VisualizerSettings } from '@/src/types';
import { useAudio } from '@/src/hooks/useAudio';
import { TranslationSchema } from '@/src/locales/index';

export interface AudioContextType {
  sourceType: AudioSourceType; isListening: boolean; isPending: boolean;
  analyser: AnalyserNode | null; analyserR: AnalyserNode | null;
  mediaStream: MediaStream | null; audioDevices: AudioDevice[];
  selectedDeviceId: string; onDeviceChange: (id: string) => void;
  toggleMicrophone: (id: string) => void;
  currentSong: SongInfo | null; setCurrentSong: (s: SongInfo | null) => void;
  playlist: Track[]; currentIndex: number; playbackMode: PlaybackMode;
  setPlaybackMode: (m: PlaybackMode) => void;
  importFiles: (files: FileList | File[]) => Promise<any>;
  importFromUrl: (url: string) => Promise<Track>;
  importPlaylistFromUrl: (url: string) => Promise<Track[]>;
  togglePlayback: () => void; seekFile: (t: number) => void;
  playNext: () => void; playPrev: () => void;
  playTrackByIndex: (i: number) => void; removeFromPlaylist: (i: number) => void;
  clearPlaylist: () => void; getAudioSlice: (s?: number) => Promise<Blob | null>;
  isPlaying: boolean; duration: number; currentTime: number;
  fileStatus?: 'ready' | 'loading' | 'none';
  fileName?: string;
  audioContext: AudioContext | null;
}

export const AudioContext = createContext<AudioContextType | null>(null);
export const useAudioContext = () => useContext(AudioContext)!;

export const AudioProvider: React.FC<{ 
  children: React.ReactNode; 
  settings: VisualizerSettings; 
  language: string; 
  t: TranslationSchema; 
  showToast: any;
  currentSong: SongInfo | null;
  setCurrentSong: (s: SongInfo | null) => void;
}> = ({ children, settings, language, t, showToast, currentSong, setCurrentSong }) => {
  const audioState = useAudio({ settings, language, setCurrentSong, t, showToast });

  const fileStatus = audioState.playlist.length > 0 ? 'ready' as const : 'none' as const;
  const fileName = audioState.playlist[audioState.currentIndex]?.file.name;

  const value = useMemo(() => ({ 
    ...audioState, currentSong, setCurrentSong, fileStatus, fileName 
  }), [audioState, currentSong, setCurrentSong, fileStatus, fileName]);

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};
