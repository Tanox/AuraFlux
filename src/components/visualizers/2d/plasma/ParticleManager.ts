// File: src/components/visualizers/2d/plasma/ParticleManager.ts | Version: v2.3.4

import { ParticleState, FusionEffect, ParticleParams } from './types';
import { ObjectPool } from './objectPool';
import { mixColors } from './utils';

export class ParticleManager {
  private particleStates: ParticleState[] = [];
  private fusionEffects: FusionEffect[] = [];
  private particlePool: ObjectPool<ParticleState>;
  private fusionEffectPool: ObjectPool<FusionEffect>;
  private particleParams: ParticleParams[] = [
    { speed: 0.3, noise: 0.05, offset: 0 },
    { speed: 0.25, noise: 0.07, offset: 1 },
    { speed: 0.35, noise: 0.04, offset: 2 },
    { speed: 0.28, noise: 0.06, offset: 3 },
    { speed: 0.32, noise: 0.05, offset: 4 },
    { speed: 0.27, noise: 0.06, offset: 5 },
    { speed: 0.31, noise: 0.04, offset: 6 },
    { speed: 0.29, noise: 0.05, offset: 7 },
    { speed: 0.33, noise: 0.04, offset: 8 },
    { speed: 0.26, noise: 0.07, offset: 9 },
    { speed: 0.34, noise: 0.03, offset: 10 },
    { speed: 0.28, noise: 0.06, offset: 11 }
  ];

  constructor() {
    this.particlePool = new ObjectPool<ParticleState>(() => ({
      x: 0,
      y: 0,
      z: 0,
      radius: 20,
      targetX: 0,
      targetY: 0,
      targetZ: 0,
      targetRadius: 20,
      rotation: 0,
      rotationSpeed: (Math.random() - 0.5) * 0.1,
      splitTimer: 0,
      isSplitting: false
    }));

    this.fusionEffectPool = new ObjectPool<FusionEffect>(() => ({
      x: 0,
      y: 0,
      z: 0,
      size: 0,
      alpha: 1,
      color: '#ffffff'
    }));
  }

  /**
   * 调整粒子数量
   */
  adjustParticleCount(average: number, centerX: number, centerY: number): void {
    let targetParticleCount: number;
    if (average < 0.1) {
      targetParticleCount = 20;
    } else if (average < 0.3) {
      targetParticleCount = 30;
    } else if (average < 0.5) {
      targetParticleCount = 40;
    } else if (average < 0.7) {
      targetParticleCount = 60;
    } else {
      targetParticleCount = 80;
    }

    if (this.particleStates.length < targetParticleCount) {
      const particlesToAdd = targetParticleCount - this.particleStates.length;
      for (let i = 0; i < particlesToAdd; i++) {
        const newParticle = this.particlePool.get();
        newParticle.x = centerX + (Math.random() - 0.5) * 50;
        newParticle.y = centerY + (Math.random() - 0.5) * 50;
        newParticle.z = (Math.random() - 0.5) * 200;
        newParticle.targetX = centerX + (Math.random() - 0.5) * 150;
        newParticle.targetY = centerY + (Math.random() - 0.5) * 150;
        newParticle.targetZ = (Math.random() - 0.5) * 200;
        newParticle.radius = 15 + Math.random() * 10;
        newParticle.targetRadius = 15 + Math.random() * 10;
        newParticle.rotation = 0;
        newParticle.rotationSpeed = (Math.random() - 0.5) * 0.1;
        newParticle.splitTimer = 0;
        newParticle.isSplitting = false;
        this.particleStates.push(newParticle);
      }
    } else if (this.particleStates.length > targetParticleCount) {
      const particlesToRemove = this.particleStates.length - targetParticleCount;
      for (let i = 0; i < particlesToRemove; i++) {
        const removedParticle = this.particleStates.shift();
        if (removedParticle) {
          this.particlePool.release(removedParticle);
        }
      }
    }
  }

  /**
   * 检测粒子融合
   */
  detectFusion(colors: string[]): void {
    for (let i = 0; i < this.particleStates.length; i++) {
      for (let j = i + 1; j < this.particleStates.length; j++) {
        const p1 = this.particleStates[i];
        const p2 = this.particleStates[j];
        const distance = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) + Math.pow(p1.z - p2.z, 2));
        
        if (distance < p1.radius + p2.radius) {
          const fusionX = (p1.x + p2.x) / 2;
          const fusionY = (p1.y + p2.y) / 2;
          const fusionZ = (p1.z + p2.z) / 2;
          const fusionSize = Math.sqrt(p1.radius * p1.radius + p2.radius * p2.radius);
          
          const color1 = colors[i % colors.length];
          const color2 = colors[j % colors.length];
          const mixedColor = mixColors(color1, color2, 0.5);
          
          const fusionEffect = this.fusionEffectPool.get();
          fusionEffect.x = fusionX;
          fusionEffect.y = fusionY;
          fusionEffect.z = fusionZ;
          fusionEffect.size = fusionSize;
          fusionEffect.alpha = 1;
          fusionEffect.color = mixedColor;
          this.fusionEffects.push(fusionEffect);
          
          const angleX = Math.atan2(p2.y - p1.y, p2.x - p1.x);
          const angleY = Math.atan2(p2.z - p1.z, Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)));
          const separationDistance = (p1.radius + p2.radius) * 1.2;
          
          p1.targetX = fusionX - Math.cos(angleX) * Math.cos(angleY) * separationDistance;
          p1.targetY = fusionY - Math.sin(angleX) * Math.cos(angleY) * separationDistance;
          p1.targetZ = fusionZ - Math.sin(angleY) * separationDistance;
          p2.targetX = fusionX + Math.cos(angleX) * Math.cos(angleY) * separationDistance;
          p2.targetY = fusionY + Math.sin(angleX) * Math.cos(angleY) * separationDistance;
          p2.targetZ = fusionZ + Math.sin(angleY) * separationDistance;
        }
      }
    }
  }

  /**
   * 更新粒子状态
   */
  updateParticles(dataArray: Uint8Array, width: number, height: number, sensitivity: number, time: number): void {
    const centerX = width / 2;
    const centerY = height / 2;
    const average = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length / 255 * sensitivity;
    
    for (let i = 0; i < this.particleStates.length; i++) {
      const dataIndex = Math.floor((i / this.particleStates.length) * dataArray.length);
      const val = dataArray[dataIndex] / 255;
      const params = this.particleParams[i % this.particleParams.length];
      
      // 更复杂的噪声运动
      const noiseX = Math.sin(time * params.speed + params.offset) * Math.cos(time * 0.1 + params.offset) + Math.sin(time * 0.05 + params.offset) * 0.5;
      const noiseY = Math.cos(time * params.speed + params.offset) * Math.sin(time * 0.15 + params.offset) + Math.cos(time * 0.08 + params.offset) * 0.5;
      const noiseZ = Math.sin(time * params.speed * 0.8 + params.offset) * Math.cos(time * 0.2 + params.offset) + Math.sin(time * 0.1 + params.offset) * 0.3;
      
      // 基于中心的运动
      const angle = time * params.speed + i * 0.5;
      const distance = (0.3 + val * 0.7) * Math.min(width, height) * 0.3;
      const baseX = centerX + Math.cos(angle) * distance;
      const baseY = centerY + Math.sin(angle) * distance;
      const baseZ = noiseZ * 150;
      
      // 音频响应偏移
      const audioOffsetX = (val * 2 - 1) * 150 * average;
      const audioOffsetY = (val * 2 - 1) * 150 * average;
      const audioOffsetZ = (val * 2 - 1) * 100 * average;
      
      // 随机偏移
      const randomOffsetX = (Math.random() * 2 - 1) * 40 * val;
      const randomOffsetY = (Math.random() * 2 - 1) * 40 * val;
      const randomOffsetZ = (Math.random() * 2 - 1) * 30 * val;
      
      // 目标位置
      this.particleStates[i].targetX = baseX + noiseX * 70 + audioOffsetX + randomOffsetX;
      this.particleStates[i].targetY = baseY + noiseY * 70 + audioOffsetY + randomOffsetY;
      this.particleStates[i].targetZ = baseZ + noiseZ * 50 + audioOffsetZ + randomOffsetZ;
      
      // 基于音频能量的半径
      this.particleStates[i].targetRadius = 15 + val * 120 * sensitivity;
      
      // 动态缓动
      const easing = 0.08 + average * 0.05;
      this.particleStates[i].x += (this.particleStates[i].targetX - this.particleStates[i].x) * easing;
      this.particleStates[i].y += (this.particleStates[i].targetY - this.particleStates[i].y) * easing;
      this.particleStates[i].z += (this.particleStates[i].targetZ - this.particleStates[i].z) * easing;
      this.particleStates[i].radius += (this.particleStates[i].targetRadius - this.particleStates[i].radius) * easing;
      
      // 旋转速度随音频变化
      this.particleStates[i].rotationSpeed = (Math.random() - 0.5) * 0.1 * (1 + average);
      this.particleStates[i].rotation += this.particleStates[i].rotationSpeed;
      
      // 粒子分裂逻辑
      this.particleStates[i].splitTimer += 0.01 * (1 + average);
      if (this.particleStates[i].splitTimer > 4 && this.particleStates[i].radius > 35 && this.particleStates.length < 80) {
        this.particleStates[i].isSplitting = true;
        this.particleStates[i].splitTimer = 0;
        
        const newParticle = this.particlePool.get();
        newParticle.x = this.particleStates[i].x;
        newParticle.y = this.particleStates[i].y;
        newParticle.z = this.particleStates[i].z;
        newParticle.radius = this.particleStates[i].radius / 2;
        newParticle.targetX = this.particleStates[i].x + (Math.random() - 0.5) * 120;
        newParticle.targetY = this.particleStates[i].y + (Math.random() - 0.5) * 120;
        newParticle.targetZ = this.particleStates[i].z + (Math.random() - 0.5) * 100;
        newParticle.targetRadius = 15 + Math.random() * 35;
        newParticle.rotation = 0;
        newParticle.rotationSpeed = (Math.random() - 0.5) * 0.1;
        newParticle.splitTimer = 0;
        newParticle.isSplitting = false;
        
        this.particleStates.push(newParticle);
        this.particleStates[i].radius /= 2;
      }
    }
  }

  /**
   * 更新融合效果
   */
  updateFusionEffects(): void {
    const activeFusionEffects: FusionEffect[] = [];
    for (const effect of this.fusionEffects) {
      effect.alpha -= 0.02;
      effect.size += 0.5;
      if (effect.alpha > 0) {
        activeFusionEffects.push(effect);
      } else {
        this.fusionEffectPool.release(effect);
      }
    }
    this.fusionEffects = activeFusionEffects;
  }

  /**
   * 限制粒子数量
   */
  limitParticleCount(): void {
    if (this.particleStates.length > 80) {
      const excessParticles = this.particleStates.length - 80;
      for (let i = 0; i < excessParticles; i++) {
        const removedParticle = this.particleStates.pop();
        if (removedParticle) {
          this.particlePool.release(removedParticle);
        }
      }
    }
  }

  /**
   * 深度排序
   */
  sortByDepth(): void {
    this.particleStates.sort((a, b) => b.z - a.z);
    this.fusionEffects.sort((a, b) => b.z - a.z);
  }

  /**
   * 获取粒子状态
   */
  getParticles(): ParticleState[] {
    return this.particleStates;
  }

  /**
   * 获取融合效果
   */
  getFusionEffects(): FusionEffect[] {
    return this.fusionEffects;
  }
}
