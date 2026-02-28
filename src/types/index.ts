// File: src/types/index.ts | Version: v1.9.76

export enum VisualizerMode {
  DIGITAL_GRID = 'DIGITAL_GRID',
  SILK_WAVE = 'SILK_WAVE',
  OCEAN_WAVE = 'OCEAN_WAVE',
  NEURAL_FLOW = 'NEURAL_FLOW',
  CUBE_FIELD = 'CUBE_FIELD',
  KINETIC_WALL = 'KINETIC_WALL',
  RESONANCE_ORB = 'RESONANCE_ORB',
  VORTEX = 'VORTEX',
  LIQUID_SPHERE = 'LIQUID_SPHERE',
  WAVEFORM = 'WAVEFORM',
  FLUID_CURVES = 'FLUID_CURVES',
  NEBULA = 'NEBULA',
  TUNNEL = 'TUNNEL',
  LASERS = 'LASERS',
  RINGS = 'RINGS',
  PARTICLES = 'PARTICLES',
  PLASMA = 'PLASMA',
  BARS = 'BARS',
  RIPPLES = 'RIPPLES',
  SPIRAL = 'SPIRAL'
}

export enum LyricsStyle {
  CLASSIC = 'CLASSIC',
  MODERN = 'MODERN',
  KARAOKE = 'KARAOKE'
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
}

export enum PlaybackMode {
  SEQUENCE = 'SEQUENCE',
  LOOP = 'LOOP',
  SHUFFLE = 'SHUFFLE'
}

export type Position = 'top' | 'center' | 'bottom';
