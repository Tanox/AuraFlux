// src/components/visualizers/2d/plasma/ParticleManager.ts v2.3.9

import { ParticleState, FusionEffect, ParticleParams } from './types.ts';
import { ObjectPool } from './objectPool';
import { mixColors } from './utils';

const PARTICLE_PARAMS: ParticleParams[] = [
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

const MAX_PARTICLES = {
  low: 30,
  medium: 60,
  high: 80
};

const GRID_SIZE = 100;

export class ParticleManager {
  private particleStates: ParticleState[] = [];
  private fusionEffects: FusionEffect[] = [];
  private particlePool: ObjectPool<ParticleState>;
  private fusionEffectPool: ObjectPool<FusionEffect>;
  private performanceMode: 'low' | 'medium' | 'high' = 'medium';

  constructor(performanceMode: 'low' | 'medium' | 'high' = 'medium') {
    this.performanceMode = performanceMode;
    
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

  setPerformanceMode(mode: 'low' | 'medium' | 'high'): void {
    this.performanceMode = mode;
  }

  private calculateAverage(dataArray: Uint8Array, sensitivity: number): number {
    let sum = 0;
    const length = dataArray.length;
    for (let i = 0; i < length; i++) {
      sum += dataArray[i];
    }
    return (sum / length / 255) * sensitivity;
  }

  adjustParticleCount(average: number, centerX: number, centerY: number): void {
    const maxParticles = MAX_PARTICLES[this.performanceMode];
    
    let targetParticleCount: number;
    if (average < 0.1) {
      targetParticleCount = Math.max(5, Math.floor(maxParticles * 0.25));
    } else if (average < 0.3) {
      targetParticleCount = Math.floor(maxParticles * 0.4);
    } else if (average < 0.5) {
      targetParticleCount = Math.floor(maxParticles * 0.6);
    } else if (average < 0.7) {
      targetParticleCount = Math.floor(maxParticles * 0.8);
    } else {
      targetParticleCount = maxParticles;
    }

    const currentCount = this.particleStates.length;
    
    if (currentCount < targetParticleCount) {
      const particlesToAdd = targetParticleCount - currentCount;
      const states = this.particleStates;
      const pool = this.particlePool;
      
      for (let i = 0; i < particlesToAdd; i++) {
        const newParticle = pool.get();
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
        states.push(newParticle);
      }
    } else if (currentCount > targetParticleCount) {
      const particlesToRemove = currentCount - targetParticleCount;
      const states = this.particleStates;
      const pool = this.particlePool;
      
      for (let i = 0; i < particlesToRemove; i++) {
        const removedParticle = states.shift();
        if (removedParticle) {
          pool.release(removedParticle);
        }
      }
    }
  }

  detectFusion(colors: string[]): void {
    const grid: Map<string, number[]> = new Map();
    const states = this.particleStates;
    const fusionEffects = this.fusionEffects;
    const fusionPool = this.fusionEffectPool;
    const colorCount = colors.length;
    
    for (let i = 0; i < states.length; i++) {
      const p = states[i];
      const key = `${Math.floor(p.x / GRID_SIZE)}-${Math.floor(p.y / GRID_SIZE)}-${Math.floor(p.z / GRID_SIZE)}`;
      const existing = grid.get(key);
      if (existing) {
        existing.push(i);
      } else {
        grid.set(key, [i]);
      }
    }
    
    for (let i = 0; i < states.length; i++) {
      const p1 = states[i];
      const gridX = Math.floor(p1.x / GRID_SIZE);
      const gridY = Math.floor(p1.y / GRID_SIZE);
      const gridZ = Math.floor(p1.z / GRID_SIZE);
      
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          for (let dz = -1; dz <= 1; dz++) {
            const key = `${gridX + dx}-${gridY + dy}-${gridZ + dz}`;
            const particlesInGrid = grid.get(key);
            if (particlesInGrid) {
              for (const j of particlesInGrid) {
                if (j <= i) continue;
                
                const p2 = states[j];
                const dx_ = p1.x - p2.x;
                const dy_ = p1.y - p2.y;
                const dz_ = p1.z - p2.z;
                const distance = Math.sqrt(dx_ * dx_ + dy_ * dy_ + dz_ * dz_);
                
                if (distance < p1.radius + p2.radius) {
                  const fusionX = (p1.x + p2.x) * 0.5;
                  const fusionY = (p1.y + p2.y) * 0.5;
                  const fusionZ = (p1.z + p2.z) * 0.5;
                  const fusionSize = Math.sqrt(p1.radius * p1.radius + p2.radius * p2.radius);
                  
                  const mixedColor = mixColors(colors[i % colorCount], colors[j % colorCount], 0.5);
                  
                  const fusionEffect = fusionPool.get();
                  fusionEffect.x = fusionX;
                  fusionEffect.y = fusionY;
                  fusionEffect.z = fusionZ;
                  fusionEffect.size = fusionSize;
                  fusionEffect.alpha = 1;
                  fusionEffect.color = mixedColor;
                  fusionEffects.push(fusionEffect);
                  
                  const angleX = Math.atan2(p2.y - p1.y, p2.x - p1.x);
                  const dist = Math.sqrt(dx_ * dx_ + dy_ * dy_);
                  const angleY = dist > 0 ? Math.atan2(p2.z - p1.z, dist) : 0;
                  const separationDistance = (p1.radius + p2.radius) * 1.2;
                  
                  const cosAngleX = Math.cos(angleX);
                  const sinAngleX = Math.sin(angleX);
                  const cosAngleY = Math.cos(angleY);
                  const sinAngleY = Math.sin(angleY);
                  
                  p1.targetX = fusionX - cosAngleX * cosAngleY * separationDistance;
                  p1.targetY = fusionY - sinAngleX * cosAngleY * separationDistance;
                  p1.targetZ = fusionZ - sinAngleY * separationDistance;
                  p2.targetX = fusionX + cosAngleX * cosAngleY * separationDistance;
                  p2.targetY = fusionY + sinAngleX * cosAngleY * separationDistance;
                  p2.targetZ = fusionZ + sinAngleY * separationDistance;
                }
              }
            }
          }
        }
      }
    }
  }

  updateParticles(dataArray: Uint8Array, width: number, height: number, sensitivity: number, time: number): void {
    const centerX = width * 0.5;
    const centerY = height * 0.5;
    const average = this.calculateAverage(dataArray, sensitivity);
    
    const states = this.particleStates;
    const params = PARTICLE_PARAMS;
    const paramsLength = params.length;
    const dataLength = dataArray.length;
    const maxParticles = MAX_PARTICLES[this.performanceMode];
    const pool = this.particlePool;
    const minDimension = Math.min(width, height) * 0.3;
    
    for (let i = 0; i < states.length; i++) {
      const dataIndex = Math.floor((i / states.length) * dataLength);
      const val = dataArray[dataIndex] / 255;
      const param = params[i % paramsLength];
      const particle = states[i];
      
      const noiseX = Math.sin(time * param.speed + param.offset) * Math.cos(time * 0.1 + param.offset) + Math.sin(time * 0.05 + param.offset) * 0.5;
      const noiseY = Math.cos(time * param.speed + param.offset) * Math.sin(time * 0.15 + param.offset) + Math.cos(time * 0.08 + param.offset) * 0.5;
      const noiseZ = Math.sin(time * param.speed * 0.8 + param.offset) * Math.cos(time * 0.2 + param.offset) + Math.sin(time * 0.1 + param.offset) * 0.3;
      
      const angle = time * param.speed + i * 0.5;
      const distance = (0.3 + val * 0.7) * minDimension;
      const baseX = centerX + Math.cos(angle) * distance;
      const baseY = centerY + Math.sin(angle) * distance;
      const baseZ = noiseZ * 150;
      
      const audioFactor = (val * 2 - 1) * average;
      const audioOffsetX = audioFactor * 150;
      const audioOffsetY = audioFactor * 150;
      const audioOffsetZ = audioFactor * 100;
      
      const randomFactor = val * 40;
      const randomOffsetX = (Math.random() * 2 - 1) * randomFactor;
      const randomOffsetY = (Math.random() * 2 - 1) * randomFactor;
      const randomOffsetZ = (Math.random() * 2 - 1) * 30 * val;
      
      particle.targetX = baseX + noiseX * 70 + audioOffsetX + randomOffsetX;
      particle.targetY = baseY + noiseY * 70 + audioOffsetY + randomOffsetY;
      particle.targetZ = baseZ + noiseZ * 50 + audioOffsetZ + randomOffsetZ;
      particle.targetRadius = 15 + val * 120 * sensitivity;
      
      const easing = 0.08 + average * 0.05;
      particle.x += (particle.targetX - particle.x) * easing;
      particle.y += (particle.targetY - particle.y) * easing;
      particle.z += (particle.targetZ - particle.z) * easing;
      particle.radius += (particle.targetRadius - particle.radius) * easing;
      
      particle.rotationSpeed = (Math.random() - 0.5) * 0.1 * (1 + average);
      particle.rotation += particle.rotationSpeed;
      
      particle.splitTimer += 0.01 * (1 + average);
      if (particle.splitTimer > 4 && particle.radius > 35 && states.length < maxParticles) {
        particle.isSplitting = true;
        particle.splitTimer = 0;
        
        const newParticle = pool.get();
        newParticle.x = particle.x;
        newParticle.y = particle.y;
        newParticle.z = particle.z;
        newParticle.radius = particle.radius * 0.5;
        newParticle.targetX = particle.x + (Math.random() - 0.5) * 120;
        newParticle.targetY = particle.y + (Math.random() - 0.5) * 120;
        newParticle.targetZ = particle.z + (Math.random() - 0.5) * 100;
        newParticle.targetRadius = 15 + Math.random() * 35;
        newParticle.rotation = 0;
        newParticle.rotationSpeed = (Math.random() - 0.5) * 0.1;
        newParticle.splitTimer = 0;
        newParticle.isSplitting = false;
        
        states.push(newParticle);
        particle.radius *= 0.5;
      }
    }
  }

  updateFusionEffects(): void {
    const activeEffects: FusionEffect[] = [];
    const effects = this.fusionEffects;
    const pool = this.fusionEffectPool;
    
    for (let i = 0; i < effects.length; i++) {
      const effect = effects[i];
      effect.alpha -= 0.02;
      effect.size += 0.5;
      if (effect.alpha > 0) {
        activeEffects.push(effect);
      } else {
        pool.release(effect);
      }
    }
    this.fusionEffects = activeEffects;
  }

  limitParticleCount(): void {
    const maxParticles = MAX_PARTICLES[this.performanceMode];
    const states = this.particleStates;
    const pool = this.particlePool;
    
    if (states.length > maxParticles) {
      const excess = states.length - maxParticles;
      for (let i = 0; i < excess; i++) {
        const removed = states.pop();
        if (removed) {
          pool.release(removed);
        }
      }
    }
  }

  sortByDepth(): void {
    this.particleStates.sort((a, b) => b.z - a.z);
    this.fusionEffects.sort((a, b) => b.z - a.z);
  }

  getParticles(): ParticleState[] {
    return this.particleStates;
  }

  getFusionEffects(): FusionEffect[] {
    return this.fusionEffects;
  }
}
