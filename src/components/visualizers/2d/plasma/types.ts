// File: src/components/visualizers/modes/plasma/types.ts | Version: v2.2.23

export interface ParticleState {
  x: number;
  y: number;
  z: number; // 用于3D效果的深度值
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

export interface PlasmaModeProps {
  ctx: CanvasRenderingContext2D;
  dataArray: Uint8Array;
  width: number;
  height: number;
  colors: string[];
  sensitivity: number;
}
