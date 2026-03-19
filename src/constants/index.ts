// File: src/constants/index.ts | Version: v2.3.0
import { VisualizerMode } from '../types';
import { APP_VERSION as VERSION_CONST } from './version';

export const APP_NAME = 'Aura Flux';
export const VERSION = VERSION_CONST;
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
  { id: 'fire', name: 'Fire', colors: ['#ff0000', '#ff8000', '#ffff00'] },
  { id: 'ice', name: 'Ice', colors: ['#00ffff', '#0080ff', '#ffffff'] },
  { id: 'amethyst', name: 'Amethyst', colors: ['#800080', '#ff00ff', '#4b0082'] },
  { id: 'gold', name: 'Gold', colors: ['#ffd700', '#daa520', '#b8860b'] },
  { id: 'emerald', name: 'Emerald', colors: ['#00ff00', '#008000', '#006400'] },
  { id: 'ruby', name: 'Ruby', colors: ['#ff0000', '#8b0000', '#b22222'] },
  { id: 'sapphire', name: 'Sapphire', colors: ['#0000ff', '#00008b', '#4169e1'] },
  { id: 'topaz', name: 'Topaz', colors: ['#ffc87c', '#f08080', '#cd5c5c'] },
  { id: 'pearl', name: 'Pearl', colors: ['#f0f8ff', '#e0ffff', '#dcdcdc'] },
  { id: 'obsidian', name: 'Obsidian', colors: ['#000000', '#1a1a1a', '#333333'] },
  { id: 'lavender', name: 'Lavender', colors: ['#e6e6fa', '#d8bfd8', '#dda0dd'] },
  { id: 'mint', name: 'Mint', colors: ['#98ff98', '#bdfcc9', '#7fffd4'] }
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
  {
    name: 'Neon Vortex',
    nameKey: 'galaxy',
    mode: VisualizerMode.VORTEX,
    colors: ['#ff00ff', '#00ffff', '#00ff00'],
    settings: { sensitivity: 1.5 }
  }
];
