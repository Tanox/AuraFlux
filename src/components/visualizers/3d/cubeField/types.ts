// src/components/visualizers/3d/cubeField/types.ts v2.3.11
import { Vector3, Euler } from 'three';

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
  randomTumbleX: number;
  randomTumbleY: number;
  randomTumbleZ: number;
}

export interface CollisionEffect {
  position: Vector3;
  size: number;
  alpha: number;
  color: Vector3;
}
