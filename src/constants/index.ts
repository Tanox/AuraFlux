// File: src\constants\index.ts | Version: v2.2.18
import { VisualizerMode } from '../types';

export const APP_NAME = 'Aura Flux';
export const VERSION = '2.2.15';
export const APP_VERSION = VERSION;

export const FONTS = [
  'Inter',
  'JetBrains Mono',
  'Space Grotesk',
  'Outfit',
  'Playfair Display',
  'Cormorant Garamond',
  'Anton',
  'Montserrat'
];

export const THEMES = {
  DARK: 'dark',
  LIGHT: 'light'
};

export const getPositionOptions = (t: any) => [
  { value: 'top', label: t?.positions?.top || 'Top' },
  { value: 'center', label: t?.positions?.center || 'Center' },
  { value: 'bottom', label: t?.positions?.bottom || 'Bottom' }
];

export const COLOR_THEMES = [
  { id: 'neon', name: 'Neon', colors: ['#ff00ff', '#00ffff', '#00ff00'] },
  { id: 'sunset', name: 'Sunset', colors: ['#ff4e50', '#f9d423', '#ff9a9e'] },
  { id: 'ocean', name: 'Ocean', colors: ['#00b4d8', '#48cae4', '#90e0ef'] },
  { id: 'forest', name: 'Forest', colors: ['#06d6a0', '#1b9aaa', '#ef476f'] },
  { id: 'cyber', name: 'Cyber', colors: ['#00ffcc', '#ff0066', '#333399'] },
  { id: 'monochrome', name: 'Monochrome', colors: ['#ffffff', '#888888', '#000000'] },
  { id: 'aurora', name: 'Aurora', colors: ['#ff6b6b', '#4ecdc4', '#45b7d1'] },
  { id: 'fire', name: 'Fire', colors: ['#ff4500', '#ff8c00', '#ffd700'] },
  { id: 'cosmic', name: 'Cosmic', colors: ['#4cc9f0', '#4361ee', '#3a0ca3'] },
  { id: 'desert', name: 'Desert', colors: ['#f4a261', '#e76f51', '#2a9d8f'] },
  { id: 'sakura', name: 'Sakura', colors: ['#ff8fab', '#f9a8d4', '#c4b5fd'] },
  { id: 'neon-glow', name: 'Neon Glow', colors: ['#39ff14', '#00f0ff', '#ff00c8'] },
  { id: 'forest-dusk', name: 'Forest Dusk', colors: ['#70e000', '#00b4d8', '#0077b6'] },
  { id: 'deep-sea', name: 'Deep Sea', colors: ['#0096c7', '#00b4d8', '#48cae4'] },
  { id: 'lava', name: 'Lava', colors: ['#ff5722', '#ff9800', '#ffc107'] },
  { id: 'mint', name: 'Mint', colors: ['#00b4d8', '#90e0ef', '#ade8f4'] },
  { id: 'amethyst', name: 'Amethyst', colors: ['#9f7aea', '#8b5cf6', '#7c3aed'] },
  { id: 'sunset-beach', name: 'Sunset Beach', colors: ['#f97316', '#fdba74', '#fef08a'] }
];

export const SMART_PRESETS = [
  {
    name: 'Cyber Grid',
    nameKey: 'cyberpunk',
    mode: VisualizerMode.DIGITAL_GRID,
    colors: ['#00ffcc', '#ff0066', '#333399'],
    settings: { sensitivity: 1.2 }
  },
  {
    name: 'Deep Ocean',
    nameKey: 'ambient',
    mode: VisualizerMode.OCEAN_WAVE,
    colors: ['#2193b0', '#6dd5ed', '#000046'],
    settings: { sensitivity: 0.3 }
  },

];

