// File: src/components/visualizers/3d/cubeField/types.ts | Version: v2.2.23

import { Vector3, Euler } from 'three';
import { VisualizerSettings } from '@/types';

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
  position: Vector3;
  size: number;
  alpha: number;
  color: Vector3;
}

export interface SceneProps {
  analyser: AnalyserNode;
  analyserR?: AnalyserNode | null;
  colors: string[];
  settings: VisualizerSettings;
}
