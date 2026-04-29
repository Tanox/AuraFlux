// src/components/visualizers/2d/bars/BarsMode.ts v2.3.8
import { BarsModeProps } from '@/types';
import { logger } from '@/utils/logger';

export const renderBarsMode = (() => {
  // 渐变对象缓存
  const gradientCache = new Map<string, CanvasGradient>();
  
  return ({
    ctx,
    dataArray,
    width,
    height,
    colors,
    settings
  }: BarsModeProps) => {
    try {
      const sensitivity = settings?.sensitivity || 1;
      const bufferLength = dataArray.length;
      const newBufferLength = 24; // Reduce to 24 bars
      const barWidth = (width / newBufferLength) * 3.0; // Increase width to 300%
      let x = 0;
      
      // Default colors if none provided
      const safeColors = colors.length > 0 ? colors : ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
      
      for (let i = 0; i < newBufferLength; i++) {
        const dataIndex = Math.floor((i / newBufferLength) * bufferLength);
        const barHeight = (dataArray[dataIndex] / 255) * height * sensitivity;

        // Color based on bar height, synchronized with theme colors
        const normalizedHeight = barHeight / (height * sensitivity);
        const colorIndex = Math.floor(normalizedHeight * (safeColors.length - 1));
        const clampedColorIndex = Math.max(0, Math.min(colorIndex, safeColors.length - 1));
        
        // Generate gradient cache key
        const cacheKey = `${x}-${height}-${height - barHeight}-${safeColors[0]}-${safeColors[clampedColorIndex]}`;
        
        // Reuse gradient object
        let gradient = gradientCache.get(cacheKey);
        if (!gradient) {
          gradient = ctx.createLinearGradient(x, height, x, height - barHeight);
          gradient.addColorStop(0, safeColors[0]); // Base color (first theme color)
          gradient.addColorStop(1, safeColors[clampedColorIndex]); // Tip color based on height
          gradientCache.set(cacheKey, gradient);
        }
        
        ctx.fillStyle = gradient;
        
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    } catch (error) {
      logger.error('Error rendering Bars mode:', error);
    }
  };
})();
