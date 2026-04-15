// File: src/hooks/audio/types.ts | Version: v2.2.23

import { VisualizerSettings, AudioDevice, Track, PlaybackMode, SongInfo } from '@/types';

export interface UseAudioProps {
  settings: VisualizerSettings;
  language: string;
  setCurrentSong: (s: SongInfo | null) => void;
  showToast: (m: string, type?: any) => void;
}

export interface UseAudioReturn {
  sourceType: 'microphone' | 'file' | 'url';
  isListening: boolean;
  isPending: boolean;
  analyser: AnalyserNode | null;
  analyserR: AnalyserNode | null;
  mediaStream: MediaStream | null;
  audioDevices: AudioDevice[];
  selectedDeviceId: string;
  onDeviceChange: (id: string) => void;
  toggleMicrophone: (deviceId: string) => Promise<void>;
  playlist: Track[];
  currentIndex: number;
  playbackMode: PlaybackMode;
  setPlaybackMode: (mode: PlaybackMode) => void;
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
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  audioContext: AudioContext | null;
}
