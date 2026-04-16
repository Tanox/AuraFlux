// File: src\types\index.ts | Version: v2.3.0

export enum VisualizerMode {
  DIGITAL_GRID = 'DIGITAL_GRID',
  SILK_WAVE = 'SILK_WAVE',
  OCEAN_WAVE = 'OCEAN_WAVE',
  NEURAL_FLOW = 'NEURAL_FLOW',
  CUBE_FIELD = 'CUBE_FIELD',
  KINETIC_WALL = 'KINETIC_WALL',
  TUNNEL = 'TUNNEL',
  LASERS = 'LASERS',
  PLASMA = 'PLASMA',
  BARS = 'BARS',
  STARFIELD = 'STARFIELD',
  WAVEFORM = 'WAVEFORM'
}

export enum LyricsStyle {
  STANDARD = 'STANDARD',
  KARAOKE = 'KARAOKE',
  MINIMAL = 'MINIMAL'
}

export type Language = 'en' | 'zh' | 'zh-TW' | 'es' | 'ar' | 'fr' | 'pt' | 'pt-BR' | 'de' | 'ja' | 'ko' | 'ru';

export type Region = 'US' | 'CN' | 'EU' | 'OTHER';

export interface VisualizerSettings {
  sensitivity: number;
  autoHideUi: boolean;
  showSongInfo: boolean;
  showAlbumArtOverlay: boolean;
  showFps: boolean;
  appTheme: 'light' | 'dark';
  wakeLock: boolean;
  doubleClickFullscreen: boolean;
  recognitionProvider: 'GEMINI' | 'MOCK';
  [key: string]: any;
}

export interface AudioDevice {
  deviceId: string;
  label: string;
}

export interface SongInfo {
  title: string;
  artist: string;
  album?: string;
  artwork?: string;
  lyrics?: string;
  [key: string]: any;
}

export interface SmartPreset {
  name: string;
  nameKey: string;
  settings: Partial<VisualizerSettings>;
  mode: VisualizerMode;
  colors: string[];
}

export type AudioSourceType = 'microphone' | 'file' | 'url';

export interface Track {
  id: string;
  file: File;
  url?: string;
  title: string;
  artist: string;
  albumArtUrl?: string;
  duration?: number;
  isLocal?: boolean;
  coverArt?: string | null;
}

export enum PlaybackMode {
  SEQUENCE = 'SEQUENCE',
  LOOP = 'LOOP',
  SHUFFLE = 'SHUFFLE'
}

export type Position = 'top' | 'center' | 'bottom';

