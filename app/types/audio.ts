/**
 * File: app/types/audio.ts
 * Version: v1.9.36
 * Author: Sut
 */

import { AIProvider } from './common';

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
  lyricsSnippet?: string; // AI generated short snippet
  lyrics?: string; // Full lyrics from file (ID3)
  mood?: string;
  mood_en_keywords?: string; // Canonical English keywords for styling
  identified: boolean;
  searchUrl?: string;
  albumArtUrl?: string;
  matchSource?: 'AI' | 'LOCAL' | 'PREVIEW' | 'FILE' | AIProvider;
  isError?: boolean; // Flag to indicate system messages/errors
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
  rms: number;      // Smoothed volume level (0.0 - 1.0)
  energy: number;   // Raw instantaneous energy (0.0 - 1.0)
  timestamp: number;
}