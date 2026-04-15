// File: src/components/visualizers/scenes/laser/types.ts | Version: v2.2.23

import { Vector3, Color } from 'three';
import { VisualizerSettings } from '@/types';

// 激光束状态接口
export interface LaserState {
  angle: number;
  speed: number;
  offset: number;
  phase: number;
  flicker: number;
  flickerSpeed: number;
  collisionCount: number;
  lastCollision: number;
}

// 碰撞效果接口
export interface CollisionEffect {
  position: Vector3;
  size: number;
  alpha: number;
  color: Color;
}

// 反射效果接口
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
