// File: src/components/visualizers/2d/plasma/PlasmaMode.ts | Version: v2.3.4

import { PlasmaModeProps } from './types';
import { ParticleManager } from './ParticleManager';
import { Renderer } from './Renderer';
import { calculateAverage } from './utils';

// 鍒涘缓瀹炰緥
const particleManager = new ParticleManager();
const renderer = new Renderer();

/**
 * 娓叉煋PLASMA妯″紡鐨勫彲瑙嗗寲鏁堟灉
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

  // 淇濆瓨Canvas鐘舵€?  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  
  // 璋冩暣绮掑瓙鏁伴噺
  particleManager.adjustParticleCount(average, centerX, centerY);
  
  // 妫€娴嬬矑瀛愯瀺鍚?  particleManager.detectFusion(colors);
  
  // 鏇存柊绮掑瓙鐘舵€?  particleManager.updateParticles(dataArray, width, height, sensitivity, time);
  
  // 鏇存柊铻嶅悎鏁堟灉
  particleManager.updateFusionEffects();
  
  // 娣卞害鎺掑簭
  particleManager.sortByDepth();
  
  // 缁樺埗绮掑瓙
  renderer.drawParticles(ctx, particleManager.getParticles(), dataArray, width, height, colors, average);
  
  // 缁樺埗铻嶅悎鏁堟灉
  renderer.drawFusionEffects(ctx, particleManager.getFusionEffects(), width, height);
  
  // 闄愬埗绮掑瓙鏁伴噺
  particleManager.limitParticleCount();
  
  // 缁樺埗鍏ㄥ睆鍙戝厜鏁堟灉
  renderer.drawFullScreenGlow(ctx, width, height, average);
  
  // 鎭㈠Canvas鐘舵€?  ctx.restore();
};
