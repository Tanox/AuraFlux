// src/types/index.ts v2.3.10

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
  WAVEFORM = 'WAVEFORM',
  FISH_SWARM = 'FISH_SWARM'
}

export enum VisualizerCategory {
  MODE_2D = '2D',
  MODE_3D = '3D'
}

export interface BaseVisualizerProps {
  analyser: AnalyserNode;
  analyserR?: AnalyserNode | null;
  colors: string[];
  settings: VisualizerSettings;
}

export interface VisualizerDefinition {
  mode: VisualizerMode;
  category: VisualizerCategory;
  name: string;
  nameKey: string;
  description: string;
  is3D: boolean;
  component?: React.ComponentType<SceneProps>;
  render2D?: (props: Base2DVisualizerProps) => void;
}

export interface Base2DVisualizerProps extends BaseVisualizerProps {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
}

export enum LyricsStyle {
  STANDARD = 'STANDARD',
  KARAOKE = 'KARAOKE',
  MINIMAL = 'MINIMAL'
}

export type Language = 'en' | 'zh' | 'zh-TW' | 'es' | 'ar' | 'fr' | 'pt' | 'pt-BR' | 'de' | 'ja' | 'ko' | 'ru';

export type Region = 'US' | 'CN' | 'EU' | 'OTHER';

export type PerformanceMode = 'low' | 'medium' | 'high';

export type AppTheme = 'light' | 'dark';
export type RecognitionProvider = 'GEMINI' | 'MOCK';
export type QualityLevel = 'low' | 'medium' | 'high';

export interface VisualizerSettings {
  sensitivity: number;
  autoHideUi: boolean;
  showSongInfo: boolean;
  showAlbumArtOverlay: boolean;
  showFps: boolean;
  appTheme: AppTheme;
  wakeLock: boolean;
  doubleClickFullscreen: boolean;
  recognitionProvider: RecognitionProvider;
  performanceMode: PerformanceMode;
  quality: QualityLevel;
  trails: boolean;
  glow: boolean;
  speed: number;
  cycleColors?: boolean;
  colorInterval?: number;
  textOverlay?: string;
  textColor?: string;
  textSize?: number;
  textPosition?: Position;
  lyricsFont?: string;
  lyricsStyle?: LyricsStyle;
  lyricsFontSize?: number;
  [key: string]: unknown;
}

export interface BarsModeProps {
  ctx: CanvasRenderingContext2D;
  dataArray: Uint8Array;
  width: number;
  height: number;
  colors: string[];
  settings: VisualizerSettings;
}

export interface WaveformModeProps {
  ctx: CanvasRenderingContext2D;
  dataArray: Uint8Array;
  dataArrayR?: Uint8Array;
  width: number;
  height: number;
  colors: string[];
  settings: VisualizerSettings;
}

export interface TunnelModeProps {
  ctx: CanvasRenderingContext2D;
  dataArray: Uint8Array;
  width: number;
  height: number;
  colors: string[];
  settings: VisualizerSettings;
}

export interface PlasmaModeProps {
  ctx: CanvasRenderingContext2D;
  dataArray: Uint8Array;
  width: number;
  height: number;
  colors: string[];
  settings: VisualizerSettings;
}

export interface Star {
  x: number;
  y: number;
  z: number;
  speed: number;
  size: number;
}

export interface StarfieldModeProps {
  ctx: CanvasRenderingContext2D;
  dataArray: Uint8Array;
  width: number;
  height: number;
  colors: string[];
  settings: VisualizerSettings;
  stars: Star[];
}

export interface FishSwarmModeProps {
  ctx: CanvasRenderingContext2D;
  dataArray: Uint8Array;
  width: number;
  height: number;
  colors: string[];
  settings: VisualizerSettings;
}

export interface SceneProps {
  analyser: AnalyserNode;
  analyserR?: AnalyserNode | null;
  colors: string[];
  settings: VisualizerSettings;
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
  [key: string]: unknown;
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

export interface VisualConfig {
  mode: VisualizerMode;
  colors: string[];
  sensitivity: number;
}

export interface SongIdentification {
  title: string;
  artist: string;
  album?: string;
}

