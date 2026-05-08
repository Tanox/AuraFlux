// src/components/visualizers/3d/laser/types.ts v2.3.10
import { Vector3, Color } from 'three';

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

export interface CollisionEffect {
  position: Vector3;
  size: number;
  alpha: number;
  color: Color;
}

export interface ReflectionEffect {
  start: Vector3;
  end: Vector3;
  alpha: number;
  color: Color;
}
