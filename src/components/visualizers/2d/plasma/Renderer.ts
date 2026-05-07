// src/components/visualizers/2d/plasma/Renderer.ts v2.3.8
import { ParticleState, FusionEffect } from './types.ts';
import { project3D } from './utils';

export class Renderer {
  private focalLength = 300;
  private gradientCache: Map<string, CanvasGradient> = new Map();

    private getCachedGradient(_ctx: CanvasRenderingContext2D, key: string, creator: () => CanvasGradient): CanvasGradient {
    if (!this.gradientCache.has(key)) {
      this.gradientCache.set(key, creator());
    }
    return this.gradientCache.get(key)!;
  }

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
    average: number,
    settings?: RendererSettings
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

      // 动态颜色变化
      const colorIndex = (i + Math.floor(time * 3)) % colors.length;
      const color1 = colors[colorIndex % colors.length];
      const color2 = colors[(colorIndex + 1) % colors.length];
      const color3 = colors[(colorIndex + 2) % colors.length];

      // 颜色强度随音频能量变化
      const intensity = 0.3 + average * 0.7;

      ctx.save();

      ctx.translate(screenX, screenY);
      ctx.rotate(p.rotation);
      ctx.translate(-screenX, -screenY);

      // 更大的渐变范围，增强视觉效果
      const gradientSize = Math.max(width, height) * 2.5 * scale;
      const gradientKey = `${color1}-${color2}-${color3}`;
      const gradient = this.getCachedGradient(ctx, gradientKey, () => {
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, gradientSize);
        // 更丰富的颜色过渡
        grad.addColorStop(0, color1);
        grad.addColorStop(0.1, color1);
        grad.addColorStop(0.3, color2);
        grad.addColorStop(0.5, color3);
        grad.addColorStop(0.7, color2);
        grad.addColorStop(0.9, color1);
        grad.addColorStop(1, 'transparent');
        return grad;
      });

      // 透明度随音频和粒子大小变化
      ctx.globalAlpha = 0.5 * average * intensity * (1 + scale);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(screenX, screenY, gradientSize, 0, Math.PI * 2);
      ctx.fill();

      // 绘制粒子尾迹（仅当trails启用时）
      if (settings?.trails !== false) {
        this.drawParticleTail(ctx, p, screenX, screenY, screenRadius, scale, color1, color2, color3, average, intensity);
      }

      // 绘制粒子核心
      this.drawParticleCore(ctx, screenX, screenY, screenRadius, color1, color2, color3, intensity, val);

      // 绘制粒子光环效果（仅当glow启用时）
      if (settings?.glow !== false) {
        this.drawParticleAura(ctx, screenX, screenY, screenRadius, scale, color1, color2, average, intensity);
      }

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
    const tailLength = 5; // 减少尾迹长度以提高性能
    const tailGradientKey = `${color1}-${color2}-${color3}-tail`;
    const tailGradient = this.getCachedGradient(ctx, tailGradientKey, () => {
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, 100); // 固定大小用于缓存
      grad.addColorStop(0, color1);
      grad.addColorStop(0.2, color2);
      grad.addColorStop(0.4, color3);
      grad.addColorStop(1, 'transparent');
      return grad;
    });
    
    for (let t = 0; t < tailLength; t++) {
      const tailProgress = t / tailLength;
      const tailEasing = 1 - Math.pow(1 - tailProgress, 3);
      const tailX = screenX - (p.targetX - p.x) * tailEasing * 0.8 * scale;     
      const tailY = screenY - (p.targetY - p.y) * tailEasing * 0.8 * scale;     
      const tailRadius = screenRadius * (1 - tailEasing * 0.6);

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
    intensity: number,
    val: number
  ): void {
    // 核心渐变
    ctx.globalAlpha = 1 * intensity;
    const coreGradientKey = `${color1}-${color2}-${color3}-core`;
    const particleGradient = this.getCachedGradient(ctx, coreGradientKey, () => {
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, 100); // 固定大小用于缓存
      grad.addColorStop(0, color1);
      grad.addColorStop(0.2, color1);
      grad.addColorStop(0.4, color2);
      grad.addColorStop(0.6, color3);
      grad.addColorStop(1, 'transparent');
      return grad;
    });

    ctx.fillStyle = particleGradient;
    ctx.beginPath();
    ctx.arc(screenX, screenY, screenRadius * 4, 0, Math.PI * 2);
    ctx.fill();
    
    // 核心圆点
    ctx.fillStyle = color1;
    ctx.beginPath();
    ctx.arc(screenX, screenY, screenRadius, 0, Math.PI * 2);
    ctx.fill();

    // 中心亮点
    if (val > 0.5) {
      ctx.fillStyle = 'rgba(255, 255, 255, ' + (val * 0.8) + ')';
      ctx.beginPath();
      ctx.arc(screenX, screenY, screenRadius * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /**
   * 绘制粒子光环效果
   */
  private drawParticleAura(
    ctx: CanvasRenderingContext2D,
    screenX: number,
    screenY: number,
    screenRadius: number,
    scale: number,
    color1: string,
    color2: string,
    average: number,
    intensity: number
  ): void {
    const auraSize = screenRadius * 8 * scale;
    const auraGradientKey = `${color1}-${color2}-aura`;
    const auraGradient = this.getCachedGradient(ctx, auraGradientKey, () => {
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, 200); // 固定大小用于缓存
      grad.addColorStop(0, color1);
      grad.addColorStop(0.2, color2);
      grad.addColorStop(0.4, 'rgba(255, 255, 255, 0.3)');
      grad.addColorStop(0.6, 'rgba(255, 255, 255, 0.1)');
      grad.addColorStop(1, 'transparent');
      return grad;
    });

    ctx.globalAlpha = 0.3 * average * intensity;
    ctx.fillStyle = auraGradient;
    ctx.beginPath();
    ctx.arc(screenX, screenY, auraSize, 0, Math.PI * 2);
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

      // 融合效果渐变
      const fusionGradient = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, screenSize * 2);
      fusionGradient.addColorStop(0, effect.color);
      fusionGradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
      fusionGradient.addColorStop(0.6, effect.color);
      fusionGradient.addColorStop(1, 'transparent');

      ctx.globalAlpha = effect.alpha * 0.8;
      ctx.fillStyle = fusionGradient;
      ctx.beginPath();
      ctx.arc(screenX, screenY, screenSize * 2, 0, Math.PI * 2);
      ctx.fill();

      // 中心亮点
      ctx.fillStyle = 'rgba(255, 255, 255, ' + effect.alpha + ')';
      ctx.beginPath();
      ctx.arc(screenX, screenY, screenSize * 0.5, 0, Math.PI * 2);
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
    const time = Date.now() * 0.0005;

    // 动态全屏渐变
    const fullScreenGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(width, height));
    fullScreenGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
    fullScreenGradient.addColorStop(0.2, 'rgba(255, 200, 255, 0.3)');
    fullScreenGradient.addColorStop(0.4, 'rgba(200, 200, 255, 0.2)');
    fullScreenGradient.addColorStop(0.6, 'rgba(200, 255, 255, 0.1)');
    fullScreenGradient.addColorStop(1, 'transparent');

    ctx.globalAlpha = 0.9 * average;
    ctx.fillStyle = fullScreenGradient;
    ctx.fillRect(0, 0, width, height);

    // 动态光斑效果
    if (average > 0.5) {
      for (let i = 0; i < 5; i++) {
        const angle = time + i * Math.PI * 0.4;
        const distance = Math.max(width, height) * 0.3 * (0.5 + Math.sin(time + i) * 0.5);
        const glowX = centerX + Math.cos(angle) * distance;
        const glowY = centerY + Math.sin(angle) * distance;
        const glowSize = 100 + average * 200;

        const spotGradient = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, glowSize);
        spotGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
        spotGradient.addColorStop(1, 'transparent');

        ctx.fillStyle = spotGradient;
        ctx.fillRect(glowX - glowSize, glowY - glowSize, glowSize * 2, glowSize * 2);
      }
    }
  }
}