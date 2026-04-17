// File: src/components/visualizers/2d/plasma/Renderer.ts | Version: v2.3.3

import { ParticleState, FusionEffect } from './types';
import { project3D } from './utils';

export class Renderer {
  private focalLength = 300;

  /**
   * 绘制粒子
   */
  drawParticles(
    ctx: CanvasRenderingContext2D,
    particles: ParticleState[],
    dataArray: Uint8Array,
    width: number,
    height: number,
    colors: string[],
    average: number
  ): void {
    const centerX = width / 2;
    const centerY = height / 2;
    const time = Date.now() * 0.001;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const dataIndex = Math.floor((i / particles.length) * dataArray.length);
      const val = dataArray[dataIndex] / 255;
      
      const { screenX, screenY, scale } = project3D(p.x, p.y, p.z, centerX, centerY, this.focalLength);
      const screenRadius = p.radius * scale;
      
      const colorIndex = (i + Math.floor(time * 2)) % colors.length;
      const color1 = colors[colorIndex % colors.length];
      const color2 = colors[(colorIndex + 1) % colors.length];
      const color3 = colors[(colorIndex + 2) % colors.length];
      
      const intensity = 0.5 + average * 0.5;
      
      ctx.save();
      
      ctx.translate(screenX, screenY);
      ctx.rotate(p.rotation);
      ctx.translate(-screenX, -screenY);
      
      const gradientSize = Math.max(width, height) * 2 * scale;
      const gradient = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, gradientSize);
      gradient.addColorStop(0, color1);
      gradient.addColorStop(0.15, color1);
      gradient.addColorStop(0.3, color2);
      gradient.addColorStop(0.5, color3);
      gradient.addColorStop(0.7, color2);
      gradient.addColorStop(1, 'transparent');
      
      ctx.globalAlpha = 0.6 * average * intensity;
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(screenX, screenY, gradientSize, 0, Math.PI * 2);
      ctx.fill();
      
      this.drawParticleTail(ctx, p, screenX, screenY, screenRadius, scale, color1, color2, color3, average, intensity);
      this.drawParticleCore(ctx, screenX, screenY, screenRadius, color1, color2, color3, intensity);
      
      ctx.restore();
    }
  }

  /**
   * 绘制粒子拖尾
   */
  private drawParticleTail(
    ctx: CanvasRenderingContext2D,
    p: ParticleState,
    screenX: number,
    screenY: number,
    screenRadius: number,
    scale: number,
    color1: string,
    color2: string,
    color3: string,
    average: number,
    intensity: number
  ): void {
    const tailLength = 8;
    for (let t = 0; t < tailLength; t++) {
      const tailProgress = t / tailLength;
      const tailEasing = 1 - Math.pow(1 - tailProgress, 3);
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
  }

  /**
   * 绘制粒子核心
   */
  private drawParticleCore(
    ctx: CanvasRenderingContext2D,
    screenX: number,
    screenY: number,
    screenRadius: number,
    color1: string,
    color2: string,
    color3: string,
    intensity: number
  ): void {
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
    
    ctx.fillStyle = color1;
    ctx.beginPath();
    ctx.arc(screenX, screenY, screenRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * 绘制融合效果
   */
  drawFusionEffects(
    ctx: CanvasRenderingContext2D,
    fusionEffects: FusionEffect[],
    width: number,
    height: number
  ): void {
    const centerX = width / 2;
    const centerY = height / 2;

    for (const effect of fusionEffects) {
      const { screenX, screenY, scale } = project3D(effect.x, effect.y, effect.z, centerX, centerY, this.focalLength);
      const screenSize = effect.size * scale;
      
      ctx.globalAlpha = effect.alpha;
      ctx.fillStyle = effect.color;
      ctx.beginPath();
      ctx.arc(screenX, screenY, screenSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /**
   * 绘制全屏发光效果
   */
  drawFullScreenGlow(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    average: number
  ): void {
    const centerX = width / 2;
    const centerY = height / 2;

    const fullScreenGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(width, height));
    fullScreenGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    fullScreenGradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.2)');
    fullScreenGradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.1)');
    fullScreenGradient.addColorStop(1, 'transparent');
    
    ctx.globalAlpha = 0.8 * average;
    ctx.fillStyle = fullScreenGradient;
    ctx.fillRect(0, 0, width, height);
  }
}
