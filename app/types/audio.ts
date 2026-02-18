// File: app/types/audio.ts | Version: v1.9.67
import { AIProvider } from './common.ts';

export enum LyricsStyle {
  STANDARD = 'STANDARD',
  KARAOKE = 'KARAOKE',
  MINIMAL = 'MINIMAL'
}

export type AudioSourceType = 'MICROPHONE' | 'FILE';
export type PlaybackMode = 'repeat-all' | 'repeat-one' | 'shuffle';

export interface SongInfo {
  title: string;
  artist: string;
  lyricsSnippet?: string;
  lyrics?: string;
  mood?: string;
  mood_en_keywords?: string;
  identified: boolean;
  searchUrl?: string;
  albumArtUrl?: string;
  matchSource?: 'AI' | 'LOCAL' | 'PREVIEW' | 'FILE' | AIProvider;
  isError?: boolean;
}

export interface Track extends SongInfo {
    id: string;
    file: File;
    duration: number;
}

export interface AudioDevice {
  deviceId: string;
  label: string;
}

export interface AudioFeatures {
  rms: number;
  energy: number;
  timestamp: number;
}