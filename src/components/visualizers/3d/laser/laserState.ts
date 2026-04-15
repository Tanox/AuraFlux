// File: src/components/visualizers/scenes/laser/laserState.ts | Version: v2.2.23

import { LaserState } from './types';

/**
 * 初始化激光状态
 */
export function initializeLaserStates(count: number): LaserState[] {
  return Array.from({ length: count }, (_, i) => ({
    angle: (i / count) * Math.PI * 2,
    speed: 0.2 + Math.random() * 0.5,
    offset: Math.random() * Math.PI * 2,
    phase: Math.random() * Math.PI * 2,
    flicker: Math.random(),
    flickerSpeed: 5 + Math.random() * 10,
    collisionCount: 0,
    lastCollision: 0,
  }));
}

/**
 * 计算激光位置
 */
export function calculateLaserPosition(
  laser: LaserState,
  time: number,
  volume: number,
  bass: number,
  treble: number
): { x: number; y: number; z: number } {
  // 动态旋转
  const r = 15 + Math.sin(time * 0.5 + laser.offset) * 5;
  const x = Math.cos(laser.angle + time * 0.1 * laser.speed) * r;
  const z = Math.sin(laser.angle + time * 0.1 * laser.speed) * r;
  const y = Math.sin(time * 0.2 + laser.phase) * 10;
  
  return { x, y, z };
}

/**
 * 计算激光缩放
 */
export function calculateLaserScale(
  volume: number,
  bass: number,
  treble: number
): { scaleXZ: number; scaleY: number } {
  // 基于音频缩放
  const scaleY = 50 + volume * 100 + bass * 50;
  const scaleXZ = 0.05 + treble * 0.1;
  
  return { scaleXZ, scaleY };
}

/**
 * 计算激光闪烁强度
 */
export function calculateLaserFlicker(
  laser: LaserState,
  time: number,
  volume: number
): number {
  // 激光束闪烁效果
  return 0.7 + Math.sin(time * laser.flickerSpeed + laser.flicker) * 0.3 * (1.0 + volume * 2.0);
}
