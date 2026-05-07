// src/components/visualizers/2d/plasma/types.ts v2.3.8
export interface ParticleState {
  x: number;
  y: number;
  z: number;
  radius: number;
  targetX: number;
  targetY: number;
  targetZ: number;
  targetRadius: number;
  rotation: number;
  rotationSpeed: number;
  splitTimer: number;
  isSplitting: boolean;
}

export interface FusionEffect {
  x: number;
  y: number;
  z: number;
  size: number;
  alpha: number;
  color: string;
}

export interface ParticleParams {
  speed: number;
  noise: number;
  offset: number;
}

export interface RendererSettings {
  trails?: boolean;
  glow?: boolean;
  particleSize?: number;
  intensity?: number;
}
