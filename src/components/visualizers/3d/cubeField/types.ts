// File: src/components/visualizers/3d/cubeField/types.ts | Version: v1.0.0

import { Vector3, Euler, Color } from 'three';

export interface CubeState {
  x: number;
  y: number;
  z: number;
  scale: number;
  currentScale: number;
  isStructure: boolean;
  speedOffset: number;
  rotationAxis: Vector3;
  initialRotation: Euler;
  rotationSpeed: number;
  speedMult: number;
  torque: number;
  phase: number;
  driftX: number;
  driftY: number;
  spectralAffinity: number;
  tumbleRate: number;
  tumblePhase: number;
  collisionTimer: number;
  isColliding: boolean;
  deformation: number;
}

export interface CollisionEffect {
  position: { x: number; y: number; z: number };
  size: number;
  alpha: number;
  color: { x: number; y: number; z: number };
}
