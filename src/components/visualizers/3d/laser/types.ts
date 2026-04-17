// File: src/components/visualizers/3d/laser/types.ts | Version: v2.3.3

import { Vector3, Color } from 'three';
import { VisualizerSettings } from '@/types';

// 婵€鍏夋潫鐘舵€佹帴鍙?export interface LaserState {
  angle: number;
  speed: number;
  offset: number;
  phase: number;
  flicker: number;
  flickerSpeed: number;
  collisionCount: number;
  lastCollision: number;
}

// 纰版挒鏁堟灉鎺ュ彛
export interface CollisionEffect {
  position: Vector3;
  size: number;
  alpha: number;
  color: Color;
}

// 鍙嶅皠鏁堟灉鎺ュ彛
export interface ReflectionEffect {
  start: Vector3;
  end: Vector3;
  alpha: number;
  color: Color;
}

export interface SceneProps {
  analyser: AnalyserNode;
  analyserR?: AnalyserNode | null;
  colors: string[];
  settings: VisualizerSettings;
}
