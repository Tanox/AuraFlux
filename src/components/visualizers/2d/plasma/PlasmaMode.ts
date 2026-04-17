// File: src/components/visualizers/2d/plasma/PlasmaMode.ts | Version: v2.3.3

import { PlasmaModeProps } from './types';
import { ParticleManager } from './ParticleManager';
import { Renderer } from './Renderer';
import { calculateAverage } from './utils';

// 创建实例
const particleManager = new ParticleManager();
const renderer = new Renderer();

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
  
  const average = calculateAverage(dataArray, sensitivity);

  // 保存Canvas状�?  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  
  // 调整粒子数量
  particleManager.adjustParticleCount(average, centerX, centerY);
  
  // 检测粒子融�?  particleManager.detectFusion(colors);
  
  // 更新粒子状�?  particleManager.updateParticles(dataArray, width, height, sensitivity, time);
  
  // 更新融合效果
  particleManager.updateFusionEffects();
  
  // 深度排序
  particleManager.sortByDepth();
  
  // 绘制粒子
  renderer.drawParticles(ctx, particleManager.getParticles(), dataArray, width, height, colors, average);
  
  // 绘制融合效果
  renderer.drawFusionEffects(ctx, particleManager.getFusionEffects(), width, height);
  
  // 限制粒子数量
  particleManager.limitParticleCount();
  
  // 绘制全屏发光效果
  renderer.drawFullScreenGlow(ctx, width, height, average);
  
  // 恢复Canvas状�?  ctx.restore();
};
