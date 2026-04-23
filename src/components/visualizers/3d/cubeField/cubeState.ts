// File: src/components/visualizers/3d/cubeField/cubeState.ts | Version: v2.3.4

import { Vector3, Euler } from 'three';
import { CubeState } from './types';

/**
 * 初始化立方体状态
 */
export function initializeCubeStates(count: number): CubeState[] {
  const temp: CubeState[] = [];
  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * 300;
    const y = (Math.random() - 0.5) * 200;
    const z = (Math.random() - 0.5) * 450;
    const isStructure = Math.random() > 0.95;
    const scaleBase = isStructure ? (1.5 + Math.random() * 3.0) : (0.1 + Math.random() * 0.4);
    const rotAxis = new Vector3(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    ).normalize();
    const initialRotation = new Euler(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    );
    temp.push({
      x,
      y,
      z,
      scale: scaleBase,
      currentScale: scaleBase,
      isStructure,
      speedOffset: isStructure ? 0.3 + Math.random() * 0.9 : 1.5 + Math.random() * 2.5,
      rotationAxis: rotAxis,
      initialRotation,
      rotationSpeed: (Math.random() - 0.5) * (isStructure ? 0.0005 : 0.01),
      speedMult: isStructure ? 0.2 + Math.random() * 1.8 : 0.66 + Math.random() * 0.67,
      torque: 0,
      phase: Math.random() * Math.PI * 2,
      driftX: (Math.random() - 0.5) * (isStructure ? 0.05 : 0.2),
      driftY: (Math.random() - 0.5) * (isStructure ? 0.05 : 0.2),
      spectralAffinity: Math.pow(Math.random(), 1.5),
      tumbleRate: 0.5 + Math.random() * 3.0,
      tumblePhase: Math.random() * Math.PI * 2,
      collisionTimer: 0,
      isColliding: false,
      deformation: 0,
      randomTumbleX: 0,
      randomTumbleY: 0,
      randomTumbleZ: 0
    });
  }
  return temp;
}

/**
 * 更新立方体状态
 */
export function updateCubeState(
  cube: CubeState,
  time: number,
  delta: number,
  globalSpeed: number,
  centerX: number,
  centerY: number,
  rotationBoost: number,
  reaction: number,
  isBeat: boolean,
  settings: any
): void {
  // Update collision state
  if (cube.collisionTimer > 0) {
    cube.collisionTimer -= delta;
  } else {
    cube.isColliding = false;
  }
  
  // Update deformation effect
  if (cube.deformation > 0) {
    cube.deformation -= delta * 2;
  }
  
  cube.z += globalSpeed * cube.speedOffset * 0.016;
  if (cube.z > 60) {
    cube.z -= 450;
    cube.x = (Math.random() - 0.5) * 300;
    cube.y = (Math.random() - 0.5) * 200;
    cube.rotationAxis.set(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    ).normalize();
  }
  
  cube.x += cube.driftX * settings.speed * 0.15;
  cube.y += cube.driftY * settings.speed * 0.15;
  
  if (cube.x > 180) cube.x -= 360; else if (cube.x < -180) cube.x += 360;
  if (cube.y > 120) cube.y -= 240; else if (cube.y < -120) cube.y += 240;
  
  if (isBeat) cube.torque += (Math.random() * 0.015 + 0.005) * settings.sensitivity;
  cube.torque *= 0.94;
  
  cube.rotationAxis.x += Math.sin(time * 0.3 + cube.tumblePhase) * 0.01;
  cube.rotationAxis.y += Math.cos(time * 0.2 + cube.tumblePhase) * 0.01;
  cube.rotationAxis.normalize();

  cube.randomTumbleX = Math.sin(time * cube.tumbleRate * 0.7 + cube.tumblePhase) * (0.02 + Math.random() * 0.08);
  cube.randomTumbleY = Math.cos(time * cube.tumbleRate * 0.5 + cube.tumblePhase * 1.3) * (0.02 + Math.random() * 0.08);
  cube.randomTumbleZ = Math.sin(time * cube.tumbleRate * 0.9 + cube.tumblePhase * 0.7) * (0.02 + Math.random() * 0.08);

  const targetS = cube.scale * (1.0 + reaction * 1.8);
  cube.currentScale += (targetS - cube.currentScale) * (targetS > cube.currentScale ? 0.3 : 0.1);
}
