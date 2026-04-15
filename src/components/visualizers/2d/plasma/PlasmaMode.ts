// File: src/components/visualizers/modes/plasma/PlasmaMode.ts | Version: v2.2.23

import { ParticleState, FusionEffect, PlasmaModeProps } from './types';
import { ObjectPool } from './objectPool';
import { mixColors } from './utils';

// 粒子状态缓存
let particleStates: ParticleState[] = [];
// 融合效果缓存
let fusionEffects: FusionEffect[] = [];

// 创建对象池
const particlePool = new ObjectPool<ParticleState>(() => ({
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

const fusionEffectPool = new ObjectPool<FusionEffect>(() => ({
  x: 0,
  y: 0,
  z: 0,
  size: 0,
  alpha: 1,
  color: '#ffffff'
}));

/**
 * 渲染PLASMA模式的可视化效果
 */
export const renderPlasmaMode = ({
  ctx,
  dataArray,
  width,
  height,
  colors,
  sensitivity
}: PlasmaModeProps) => {
  const time = Date.now() * 0.001;
  const centerX = width / 2;
  const centerY = height / 2;
  const focalLength = 300; // 焦距，用于3D透视效果
  
  let average = 0;
  for (let i = 0; i < dataArray.length; i++) {
    average += dataArray[i];
  }
  average = (average / dataArray.length / 255) * sensitivity;

  // 减少Canvas状态切换
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  
  // 根据音频能量水平自动调整粒子数量
  let targetParticleCount: number;
  if (average < 0.3) {
    // 低能量时：3-5个粒子
    targetParticleCount = Math.floor(Math.random() * 3) + 3;
  } else if (average < 0.6) {
    // 中能量时：6-8个粒子
    targetParticleCount = Math.floor(Math.random() * 3) + 6;
  } else {
    // 高能量时：9-12个粒子
    targetParticleCount = Math.floor(Math.random() * 4) + 9;
  }
  
  // 为每个粒子添加独立的运动参数
  const particleParams = [
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
  
  // 调整粒子数量
  if (particleStates.length < targetParticleCount) {
    // 添加新粒子
    const particlesToAdd = targetParticleCount - particleStates.length;
    for (let i = 0; i < particlesToAdd; i++) {
      const newParticle = particlePool.get();
      newParticle.x = centerX;
      newParticle.y = centerY;
      newParticle.z = (Math.random() - 0.5) * 200;
      newParticle.targetX = centerX + (Math.random() - 0.5) * 100;
      newParticle.targetY = centerY + (Math.random() - 0.5) * 100;
      newParticle.targetZ = (Math.random() - 0.5) * 200;
      newParticle.radius = 20;
      newParticle.targetRadius = 20;
      newParticle.rotation = 0;
      newParticle.rotationSpeed = (Math.random() - 0.5) * 0.1;
      newParticle.splitTimer = 0;
      newParticle.isSplitting = false;
      particleStates.push(newParticle);
    }
  } else if (particleStates.length > targetParticleCount) {
    // 移除多余粒子
    const particlesToRemove = particleStates.length - targetParticleCount;
    for (let i = 0; i < particlesToRemove; i++) {
      const removedParticle = particleStates.pop();
      if (removedParticle) {
        particlePool.release(removedParticle);
      }
    }
  }
  
  // 检测粒子融合
  for (let i = 0; i < particleStates.length; i++) {
    for (let j = i + 1; j < particleStates.length; j++) {
      const p1 = particleStates[i];
      const p2 = particleStates[j];
      const distance = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) + Math.pow(p1.z - p2.z, 2));
      
      if (distance < p1.radius + p2.radius) {
        // 粒子融合
        const fusionX = (p1.x + p2.x) / 2;
        const fusionY = (p1.y + p2.y) / 2;
        const fusionZ = (p1.z + p2.z) / 2;
        const fusionSize = Math.sqrt(p1.radius * p1.radius + p2.radius * p2.radius);
        
        // 生成混合颜色
        const color1 = colors[i % colors.length];
        const color2 = colors[j % colors.length];
        const mixedColor = mixColors(color1, color2, 0.5);
        
        const fusionEffect = fusionEffectPool.get();
        fusionEffect.x = fusionX;
        fusionEffect.y = fusionY;
        fusionEffect.z = fusionZ;
        fusionEffect.size = fusionSize;
        fusionEffect.alpha = 1;
        fusionEffect.color = mixedColor;
        fusionEffects.push(fusionEffect);
        
        // 融合后粒子分离
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
  
  // 更新粒子状态
  for (let i = 0; i < particleStates.length; i++) {
    const dataIndex = Math.floor((i / particleStates.length) * dataArray.length);
    const val = dataArray[dataIndex] / 255;
    const params = particleParams[i % particleParams.length];
    
    // 计算粒子目标位置，基于更复杂的随机运动和音频数据
    const noiseX = Math.sin(time * params.speed + params.offset) * Math.cos(time * 0.1 + params.offset);
    const noiseY = Math.cos(time * params.speed + params.offset) * Math.sin(time * 0.15 + params.offset);
    const noiseZ = Math.sin(time * params.speed * 0.8 + params.offset) * Math.cos(time * 0.2 + params.offset);
    const baseX = (Math.sin(time * params.speed + params.offset) * 0.5 + 0.5) * width;
    const baseY = (Math.cos(time * params.speed * 1.2 + params.offset) * 0.5 + 0.5) * height;
    const baseZ = noiseZ * 100;
    
    // 添加音频响应的偏移，更强烈的响应
    const audioOffsetX = (val * 2 - 1) * 120 * average;
    const audioOffsetY = (val * 2 - 1) * 120 * average;
    const audioOffsetZ = (val * 2 - 1) * 80 * average;
    
    // 添加随机噪声偏移
    const randomOffsetX = (Math.random() * 2 - 1) * 30 * val;
    const randomOffsetY = (Math.random() * 2 - 1) * 30 * val;
    const randomOffsetZ = (Math.random() * 2 - 1) * 20 * val;
    
    // 更新目标位置和大小
    particleStates[i].targetX = baseX + noiseX * 50 + audioOffsetX + randomOffsetX;
    particleStates[i].targetY = baseY + noiseY * 50 + audioOffsetY + randomOffsetY;
    particleStates[i].targetZ = baseZ + noiseZ * 30 + audioOffsetZ + randomOffsetZ;
    particleStates[i].targetRadius = 20 + val * 100 * sensitivity;
    
    // 缓动过渡到目标位置和大小
    const easing = 0.08; // 缓动系数，越小过渡越平滑
    particleStates[i].x += (particleStates[i].targetX - particleStates[i].x) * easing;
    particleStates[i].y += (particleStates[i].targetY - particleStates[i].y) * easing;
    particleStates[i].z += (particleStates[i].targetZ - particleStates[i].z) * easing;
    particleStates[i].radius += (particleStates[i].targetRadius - particleStates[i].radius) * easing;
    
    // 更新旋转
    particleStates[i].rotation += particleStates[i].rotationSpeed;
    
    // 粒子分裂逻辑
    particleStates[i].splitTimer += 0.01;
    if (particleStates[i].splitTimer > 5 && particleStates[i].radius > 30) {
      particleStates[i].isSplitting = true;
      particleStates[i].splitTimer = 0;
      
      // 创建新粒子
      const newParticle = particlePool.get();
      newParticle.x = particleStates[i].x;
      newParticle.y = particleStates[i].y;
      newParticle.z = particleStates[i].z;
      newParticle.radius = particleStates[i].radius / 2;
      newParticle.targetX = particleStates[i].x + (Math.random() - 0.5) * 100;
      newParticle.targetY = particleStates[i].y + (Math.random() - 0.5) * 100;
      newParticle.targetZ = particleStates[i].z + (Math.random() - 0.5) * 80;
      newParticle.targetRadius = 20 + Math.random() * 30;
      newParticle.rotation = 0;
      newParticle.rotationSpeed = (Math.random() - 0.5) * 0.1;
      newParticle.splitTimer = 0;
      newParticle.isSplitting = false;
      
      particleStates.push(newParticle);
      particleStates[i].radius /= 2;
    }
  }
  
  // 3D深度排序
  particleStates.sort((a, b) => b.z - a.z);
  fusionEffects.sort((a, b) => b.z - a.z);
  
  // 绘制粒子
  for (let i = 0; i < particleStates.length; i++) {
    const p = particleStates[i];
    const dataIndex = Math.floor((i / particleStates.length) * dataArray.length);
    const val = dataArray[dataIndex] / 255;
    
    // 3D透视投影
    const scale = focalLength / (focalLength + p.z);
    const screenX = centerX + (p.x - centerX) * scale;
    const screenY = centerY + (p.y - centerY) * scale;
    const screenRadius = p.radius * scale;
    
    // 动态颜色变化
    const colorIndex = (i + Math.floor(time * 2)) % colors.length;
    const color1 = colors[colorIndex % colors.length];
    const color2 = colors[(colorIndex + 1) % colors.length];
    const color3 = colors[(colorIndex + 2) % colors.length];
    
    // 颜色强度随音频能量变化
    const intensity = 0.5 + average * 0.5;
    
    // 保存当前画布状态
    ctx.save();
    
    // 应用旋转
    ctx.translate(screenX, screenY);
    ctx.rotate(p.rotation);
    ctx.translate(-screenX, -screenY);
    
    // 创建巨大的径向渐变，铺满整个画面的光晕效果，使用更平滑的颜色过渡
    const gradientSize = Math.max(width, height) * 2 * scale;
    const gradient = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, gradientSize);
    
    // 更平滑的颜色过渡
    gradient.addColorStop(0, color1);
    gradient.addColorStop(0.15, color1);
    gradient.addColorStop(0.3, color2);
    gradient.addColorStop(0.5, color3);
    gradient.addColorStop(0.7, color2);
    gradient.addColorStop(1, 'transparent');
    
    // 绘制超大光晕背景
    ctx.globalAlpha = 0.6 * average * intensity;
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(screenX, screenY, gradientSize, 0, Math.PI * 2);
    ctx.fill();
    
    // 绘制粒子拖尾效果（增强且更顺滑）
    const tailLength = 8; // 增加拖尾长度
    for (let t = 0; t < tailLength; t++) {
      const tailProgress = t / tailLength;
      const tailEasing = 1 - Math.pow(1 - tailProgress, 3); // 缓动拖尾
      const tailX = screenX - (p.targetX - p.x) * tailEasing * 0.8 * scale;
      const tailY = screenY - (p.targetY - p.y) * tailEasing * 0.8 * scale;
      const tailRadius = screenRadius * (1 - tailEasing * 0.6);
      
      const tailGradient = ctx.createRadialGradient(tailX, tailY, 0, tailX, tailY, tailRadius * 6);
      tailGradient.addColorStop(0, color1);
      tailGradient.addColorStop(0.2, color2);
      tailGradient.addColorStop(0.4, color3);
      tailGradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = tailGradient;
      ctx.globalAlpha = 0.3 * (1 - tailEasing) * average * intensity;
      ctx.beginPath();
      ctx.arc(tailX, tailY, tailRadius * 6, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // 绘制主粒子，使用更平滑的渐变
    ctx.globalAlpha = 1 * intensity;
    const particleGradient = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, screenRadius * 4);
    particleGradient.addColorStop(0, color1);
    particleGradient.addColorStop(0.2, color1);
    particleGradient.addColorStop(0.4, color2);
    particleGradient.addColorStop(0.6, color3);
    particleGradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = particleGradient;
    ctx.beginPath();
    ctx.arc(screenX, screenY, screenRadius * 4, 0, Math.PI * 2);
    ctx.fill();
    
    // 绘制粒子核心
    ctx.fillStyle = color1;
    ctx.beginPath();
    ctx.arc(screenX, screenY, screenRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // 恢复画布状态
    ctx.restore();
  }
  
  // 更新融合效果
  const activeFusionEffects: FusionEffect[] = [];
  for (const effect of fusionEffects) {
    effect.alpha -= 0.02;
    effect.size += 0.5;
    if (effect.alpha > 0) {
      activeFusionEffects.push(effect);
    } else {
      fusionEffectPool.release(effect);
    }
  }
  fusionEffects = activeFusionEffects;
  
  // 绘制融合效果
  for (const effect of fusionEffects) {
    // 3D透视投影
    const scale = focalLength / (focalLength + effect.z);
    const screenX = centerX + (effect.x - centerX) * scale;
    const screenY = centerY + (effect.y - centerY) * scale;
    const screenSize = effect.size * scale;
    
    ctx.globalAlpha = effect.alpha;
    ctx.fillStyle = effect.color;
    ctx.beginPath();
    ctx.arc(screenX, screenY, screenSize, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // 限制粒子数量，确保不超过最大目标数量
  if (particleStates.length > 12) {
    const excessParticles = particleStates.length - 12;
    for (let i = 0; i < excessParticles; i++) {
      const removedParticle = particleStates.pop();
      if (removedParticle) {
        particlePool.release(removedParticle);
      }
    }
  }
  
  // 绘制全屏发光效果，使用更平滑的渐变
  const fullScreenGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(width, height));
  fullScreenGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
  fullScreenGradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.2)');
  fullScreenGradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.1)');
  fullScreenGradient.addColorStop(1, 'transparent');
  
  ctx.globalAlpha = 0.8 * average;
  ctx.fillStyle = fullScreenGradient;
  ctx.fillRect(0, 0, width, height);
  
  // 恢复Canvas状态
  ctx.restore();
};
