// src/components/visualizers/index.ts v2.3.8
import { VisualizerMode, VisualizerCategory, VisualizerDefinition } from '@/types';

export const VISUALIZER_2D_MODES: VisualizerMode[] = [
  VisualizerMode.BARS,
  VisualizerMode.PLASMA,
  VisualizerMode.STARFIELD,
  VisualizerMode.TUNNEL,
  VisualizerMode.WAVEFORM,
  VisualizerMode.FISH_SWARM
];

export const VISUALIZER_3D_MODES: VisualizerMode[] = [
  VisualizerMode.DIGITAL_GRID,
  VisualizerMode.SILK_WAVE,
  VisualizerMode.OCEAN_WAVE,
  VisualizerMode.NEURAL_FLOW,
  VisualizerMode.CUBE_FIELD,
  VisualizerMode.KINETIC_WALL,
  VisualizerMode.LASERS
];

export const VISUALIZER_CATEGORIES: Record<VisualizerMode, VisualizerCategory> = {
  [VisualizerMode.BARS]: VisualizerCategory.MODE_2D,
  [VisualizerMode.PLASMA]: VisualizerCategory.MODE_2D,
  [VisualizerMode.STARFIELD]: VisualizerCategory.MODE_2D,
  [VisualizerMode.TUNNEL]: VisualizerCategory.MODE_2D,
  [VisualizerMode.WAVEFORM]: VisualizerCategory.MODE_2D,
  [VisualizerMode.FISH_SWARM]: VisualizerCategory.MODE_2D,
  [VisualizerMode.DIGITAL_GRID]: VisualizerCategory.MODE_3D,
  [VisualizerMode.SILK_WAVE]: VisualizerCategory.MODE_3D,
  [VisualizerMode.OCEAN_WAVE]: VisualizerCategory.MODE_3D,
  [VisualizerMode.NEURAL_FLOW]: VisualizerCategory.MODE_3D,
  [VisualizerMode.CUBE_FIELD]: VisualizerCategory.MODE_3D,
  [VisualizerMode.KINETIC_WALL]: VisualizerCategory.MODE_3D,
  [VisualizerMode.LASERS]: VisualizerCategory.MODE_3D
};

export const VISUALIZER_DEFINITIONS: VisualizerDefinition[] = [
  {
    mode: VisualizerMode.BARS,
    category: VisualizerCategory.MODE_2D,
    name: 'Audio Bars',
    nameKey: 'modes.BARS',
    description: 'Audio bars visualization',
    is3D: false
  },
  {
    mode: VisualizerMode.PLASMA,
    category: VisualizerCategory.MODE_2D,
    name: 'Plasma',
    nameKey: 'modes.PLASMA',
    description: 'Plasma effect visualization',
    is3D: false
  },
  {
    mode: VisualizerMode.STARFIELD,
    category: VisualizerCategory.MODE_2D,
    name: 'Starfield',
    nameKey: 'modes.STARFIELD',
    description: 'Starfield effect with audio reactivity',
    is3D: false
  },
  {
    mode: VisualizerMode.TUNNEL,
    category: VisualizerCategory.MODE_2D,
    name: 'Tunnel',
    nameKey: 'modes.TUNNEL',
    description: 'Tunnel visualization effect',
    is3D: false
  },
  {
    mode: VisualizerMode.WAVEFORM,
    category: VisualizerCategory.MODE_2D,
    name: 'Waveform',
    nameKey: 'modes.WAVEFORM',
    description: 'Waveform visualization',
    is3D: false
  },
  {
    mode: VisualizerMode.FISH_SWARM,
    category: VisualizerCategory.MODE_2D,
    name: 'Fish Swarm',
    nameKey: 'modes.FISH_SWARM',
    description: 'Fish swarm simulation with audio reactivity',
    is3D: false
  },
  {
    mode: VisualizerMode.DIGITAL_GRID,
    category: VisualizerCategory.MODE_3D,
    name: 'Digital Grid',
    nameKey: 'modes.DIGITAL_GRID',
    description: 'Digital grid visualization with audio reactivity',
    is3D: true
  },
  {
    mode: VisualizerMode.SILK_WAVE,
    category: VisualizerCategory.MODE_3D,
    name: 'Silk Wave',
    nameKey: 'modes.SILK_WAVE',
    description: 'Smooth silk-like wave patterns',
    is3D: true
  },
  {
    mode: VisualizerMode.OCEAN_WAVE,
    category: VisualizerCategory.MODE_3D,
    name: 'Ocean Wave',
    nameKey: 'modes.OCEAN_WAVE',
    description: 'Ocean wave simulation',
    is3D: true
  },
  {
    mode: VisualizerMode.NEURAL_FLOW,
    category: VisualizerCategory.MODE_3D,
    name: 'Neural Flow',
    nameKey: 'modes.NEURAL_FLOW',
    description: 'Neural network inspired flow patterns',
    is3D: true
  },
  {
    mode: VisualizerMode.CUBE_FIELD,
    category: VisualizerCategory.MODE_3D,
    name: 'Cube Field',
    nameKey: 'modes.CUBE_FIELD',
    description: '3D cube field visualization',
    is3D: true
  },
  {
    mode: VisualizerMode.KINETIC_WALL,
    category: VisualizerCategory.MODE_3D,
    name: 'Kinetic Wall',
    nameKey: 'modes.KINETIC_WALL',
    description: 'Kinetic wall effect with audio response',
    is3D: true
  },
  {
    mode: VisualizerMode.LASERS,
    category: VisualizerCategory.MODE_3D,
    name: 'Lasers',
    nameKey: 'modes.LASERS',
    description: 'Laser beam effects',
    is3D: true
  }
];

export const getVisualizerDefinition = (mode: VisualizerMode): VisualizerDefinition | undefined => {
  return VISUALIZER_DEFINITIONS.find(v => v.mode === mode);
};

export const is2DMode = (mode: VisualizerMode): boolean => {
  return VISUALIZER_2D_MODES.includes(mode);
};

export const is3DMode = (mode: VisualizerMode): boolean => {
  return VISUALIZER_3D_MODES.includes(mode);
};

export const getModesByCategory = (category: VisualizerCategory): VisualizerMode[] => {
  if (category === VisualizerCategory.MODE_2D) {
    return VISUALIZER_2D_MODES;
  }
  return VISUALIZER_3D_MODES;
};
