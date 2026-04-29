// src/components/visualizers/2d/tunnel/TunnelMode.ts v2.3.8
import { TunnelModeProps } from '@/types';
import { logger } from '@/utils/logger';

export const renderTunnelMode = (() => {
  // 颜色缓存，避免重复计算
  const colorCache = new Map<number, string>();
  
  return ({
    ctx,
    dataArray,
    width,
    height,
    colors,
    settings
  }: TunnelModeProps) => {
    try {
      const sensitivity = settings?.sensitivity || 1;
      const time = Date.now() * 0.002;
      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = Math.max(width, height);
      
      // 清空画布（轨迹效果）
      const fadeAmount = settings?.trails === false ? 1 : 0.08;
      ctx.fillStyle = `rgba(0, 0, 0, ${fadeAmount})`;
      ctx.fillRect(0, 0, width, height);
      
      for (let i = 0; i < 20; i++) {
        const dataIndex = Math.floor((i / 20) * dataArray.length);
        const val = dataArray[dataIndex] / 255;
        
        const radius = (time * 100 + i * (maxRadius / 20)) % maxRadius;
        const alpha = 1 - (radius / maxRadius);
        
        // 缓存颜色，避免重复计算
        let color = colorCache.get(i);
        if (!color) {
          color = colors[i % colors.length];
          colorCache.set(i, color);
        }
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.lineWidth = 2 + val * 30 * sensitivity;
        ctx.strokeStyle = color;
        ctx.globalAlpha = alpha * (0.5 + val * 0.5 * sensitivity);
        
        // 添加发光效果
        if (settings?.glow !== false) {
          ctx.shadowBlur = 20;
          ctx.shadowColor = color;
        } else {
          ctx.shadowBlur = 0;
        }
        
        ctx.stroke();
      }
      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;
    } catch (error) {
      logger.error('Error rendering Tunnel mode:', error);
    }
  };
})();
