// src/components/visualizers/2d/waveform/WaveformMode.ts v2.3.8
import { WaveformModeProps } from '@/types';
import { logger } from '@/utils/logger';

export const renderWaveformMode = (() => {
  // 粒子状态缓存 - 使用闭包避免全局状态污染
  let particles: { x: number; y: number; size: number; speed: number; alpha: number; color: string }[] = [];
  const MAX_PARTICLES = 500; // 限制最大粒子数量
  
  // 渐变对象缓存
  let gradientTopCache: CanvasGradient | null = null;
  let gradientBottomCache: CanvasGradient | null = null;
  let lastWidth = 0;
  let lastHeight = 0;
  let lastColors: string[] = [];
  
  return ({
    ctx,
    dataArray,
    dataArrayR,
    width,
    height,
    colors,
    settings
  }: WaveformModeProps) => {
    try {
      const sensitivity = settings?.sensitivity || 1;
      const bufferLength = dataArray.length;
      const sliceWidth = (width * 1.0) / bufferLength;
      let x = 0;
      const centerY = height / 2;
      const time = Date.now() * 0.001;
      
      // 清空画布（轨迹效果）
      const fadeAmount = settings?.trails === false ? 1 : 0.08;
      ctx.fillStyle = `rgba(0, 0, 0, ${fadeAmount})`;
      ctx.fillRect(0, 0, width, height);
      
      // 绘制左声道波形（上半部分）
      ctx.beginPath();
      ctx.moveTo(0, centerY * 0.75);
      
      for (let i = 0; i < bufferLength; i++) {
        const v = (dataArray[i] / 128.0) * sensitivity;
        const y = centerY * 0.75 - v * (centerY * 0.6);
        
        // 添加波形动画效果
        const animationOffset = Math.sin(time + i * 0.01) * 5;
        const animatedY = y + animationOffset;
        
        if (i === 0) {
          ctx.moveTo(x, animatedY);
        } else {
          ctx.lineTo(x, animatedY);
        }
        
        // 动态波形宽度
        const lineWidth = 1 + (dataArray[i] / 255) * 3;
        
        // 频率响应颜色
        const frequencyRatio = i / bufferLength;
        let frequencyColor;
        if (frequencyRatio < 0.2) {
          // 低频 - 暖色调
          frequencyColor = '#ff6b6b';
        } else if (frequencyRatio < 0.6) {
          // 中频 - 中性色调
          frequencyColor = '#4ecdc4';
        } else {
          // 高频 - 冷色调
          frequencyColor = '#45b7d1';
        }
        
        // 在波形峰值处添加粒子效果，限制粒子数量
        if (dataArray[i] > 200 && particles.length < MAX_PARTICLES) {
          particles.push({
            x: x,
            y: animatedY,
            size: Math.random() * 3 + 1,
            speed: Math.random() * 2 - 1,
            alpha: 1,
            color: frequencyColor
          });
        }
        
        x += sliceWidth;
      }
      
      ctx.lineTo(width, centerY * 0.75);
      
      // 重用渐变对象
      if (!gradientTopCache || width !== lastWidth || height !== lastHeight || JSON.stringify(colors) !== JSON.stringify(lastColors)) {
        gradientTopCache = ctx.createLinearGradient(0, 0, 0, centerY);
        gradientTopCache.addColorStop(0, colors[0]);
        gradientTopCache.addColorStop(0.5, colors[Math.floor(colors.length / 2)]);
        gradientTopCache.addColorStop(1, colors[colors.length - 1]);
        lastWidth = width;
        lastHeight = height;
        lastColors = [...colors];
      }
      
      // 添加发光效果
      if (settings?.glow !== false) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = colors[0];
      } else {
        ctx.shadowBlur = 0;
      }
      
      ctx.strokeStyle = gradientTopCache;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // 绘制填充区域
      ctx.fillStyle = gradientTopCache;
      ctx.globalAlpha = 0.3;
      ctx.fill();
      ctx.globalAlpha = 1.0;
      
      // 绘制右声道波形（下半部分）
      if (dataArrayR) {
        x = 0;
        ctx.beginPath();
        ctx.moveTo(0, centerY * 1.25);
        
        for (let i = 0; i < bufferLength; i++) {
          const v = (dataArrayR[i] / 128.0) * sensitivity;
          const y = centerY * 1.25 + v * (centerY * 0.6);
          
          // 添加波形动画效果
          const animationOffset = Math.sin(time + i * 0.01 + Math.PI) * 5;
          const animatedY = y + animationOffset;
          
          if (i === 0) {
            ctx.moveTo(x, animatedY);
          } else {
            ctx.lineTo(x, animatedY);
          }
          
          // 在波形峰值处添加粒子效果，限制粒子数量
          if (dataArrayR[i] > 200 && particles.length < MAX_PARTICLES) {
            particles.push({
              x: x,
              y: animatedY,
              size: Math.random() * 3 + 1,
              speed: Math.random() * 2 - 1,
              alpha: 1,
              color: colors[i % colors.length]
            });
          }
          
          x += sliceWidth;
        }
        
        ctx.lineTo(width, centerY * 1.25);
        
        // 重用渐变对象
        if (!gradientBottomCache || width !== lastWidth || height !== lastHeight || JSON.stringify(colors) !== JSON.stringify(lastColors)) {
          gradientBottomCache = ctx.createLinearGradient(0, centerY, 0, height);
          gradientBottomCache.addColorStop(0, colors[colors.length - 1]);
          gradientBottomCache.addColorStop(0.5, colors[Math.floor(colors.length / 2)]);
          gradientBottomCache.addColorStop(1, colors[0]);
        }
        
        ctx.strokeStyle = gradientBottomCache;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 绘制填充区域
        ctx.fillStyle = gradientBottomCache;
        ctx.globalAlpha = 0.3;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }
      
      // 重置阴影
      ctx.shadowBlur = 0;
      
      // 更新和绘制粒子效果
      particles = particles.filter(particle => {
        // 更新粒子位置和透明度
        particle.y += particle.speed;
        particle.alpha -= 0.02;
        
        // 绘制粒子（如果需要发光效果）
        if (settings?.glow !== false) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = particle.color;
        }
        
        ctx.globalAlpha = particle.alpha;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        // 重置阴影
        ctx.shadowBlur = 0;
        
        // 保留透明度大于0的粒子
        return particle.alpha > 0;
      });
      
      ctx.globalAlpha = 1.0;
    } catch (error) {
      logger.error('Error rendering Waveform mode:', error);
    }
  };
})();
