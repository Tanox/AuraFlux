// File: src\constants\index.ts | Version: v2.2.8
import { VisualizerMode } from '../types';

export const APP_NAME = 'Aura Flux';
export const VERSION = '2.2.8';
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

export const getFontOptions = () => FONTS.map(font => ({ value: font, label: font }));

export const COLOR_THEMES = [
  { id: 'neon', name: 'Neon', colors: ['#ff00ff', '#00ffff', '#00ff00'] },
  { id: 'sunset', name: 'Sunset', colors: ['#ff4e50', '#f9d423', '#ff9a9e'] },
  { id: 'ocean', name: 'Ocean', colors: ['#2193b0', '#6dd5ed', '#000046'] },
  { id: 'forest', name: 'Forest', colors: ['#11998e', '#38ef7d', '#000000'] },
  { id: 'cyber', name: 'Cyber', colors: ['#00ffcc', '#ff0066', '#333399'] },
  { id: 'monochrome', name: 'Monochrome', colors: ['#ffffff', '#888888', '#000000'] },
  { id: 'aurora', name: 'Aurora', colors: ['#0b486b', '#3b8686', '#79bd9a'] },
  { id: 'fire', name: 'Fire', colors: ['#ff4500', '#ff8c00', '#ffd700'] },
  { id: 'cosmic', name: 'Cosmic', colors: ['#1a1a2e', '#16213e', '#0f3460'] },
  { id: 'desert', name: 'Desert', colors: ['#d4a373', '#e9edc9', '#faedcd'] },
  { id: 'sakura', name: 'Sakura', colors: ['#ffb3ba', '#ffc0cb', '#f7e7eb'] },
  { id: 'neon-glow', name: 'Neon Glow', colors: ['#39ff14', '#00f0ff', '#ff00c8'] },
  { id: 'forest-dusk', name: 'Forest Dusk', colors: ['#2d5016', '#639a67', '#a7c5bd'] },
  { id: 'deep-sea', name: 'Deep Sea', colors: ['#05445e', '#189ab4', '#75e6da'] },
  { id: 'lava', name: 'Lava', colors: ['#c2410c', '#f97316', '#fb923c'] },
  { id: 'mint', name: 'Mint', colors: ['#d1fae5', '#a7f3d0', '#6ee7b7'] },
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

