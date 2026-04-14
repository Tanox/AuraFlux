// File: /src/components/visualizers/modes/BarsMode.ts | Version: v2.2.22

interface BarsModeProps {
  ctx: CanvasRenderingContext2D;
  dataArray: Uint8Array;
  peaks: Float32Array;
  width: number;
  height: number;
  colors: string[];
  sensitivity: number;
}

/**
 * 渲染BARS模式的可视化效果
 */
export const renderBarsMode = ({
  ctx,
  dataArray,
  peaks,
  width,
  height,
  colors,
  sensitivity
}: BarsModeProps) => {
  const bufferLength = dataArray.length;
  const newBufferLength = 24; // Reduce to 24 bars
  const barWidth = (width / newBufferLength) * 3.0; // Increase width to 300%
  let x = 0;
  
  // Default colors if none provided
  const safeColors = colors.length > 0 ? colors : ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
  
  for (let i = 0; i < newBufferLength; i++) {
    const dataIndex = Math.floor((i / newBufferLength) * bufferLength);
    const barHeight = (dataArray[dataIndex] / 255) * height * sensitivity;
    
    // Peak caps
    if (barHeight > peaks[dataIndex]) {
      peaks[dataIndex] = barHeight;
    } else {
      peaks[dataIndex] -= 1.5; // Slow fall speed
    }
    if (peaks[dataIndex] < 0) peaks[dataIndex] = 0;

    // Color based on bar height, synchronized with theme colors
    const normalizedHeight = barHeight / (height * sensitivity);
    const colorIndex = Math.floor(normalizedHeight * (safeColors.length - 1));
    const clampedColorIndex = Math.max(0, Math.min(colorIndex, safeColors.length - 1));
    ctx.fillStyle = safeColors[clampedColorIndex];
    
    // Create gradient effect from base to tip
    const gradient = ctx.createLinearGradient(x, height, x, height - barHeight);
    gradient.addColorStop(0, safeColors[0]); // Base color (first theme color)
    gradient.addColorStop(1, safeColors[clampedColorIndex]); // Tip color based on height
    ctx.fillStyle = gradient;
    
    ctx.fillRect(x, height - barHeight, barWidth, barHeight);
    
    // Draw peak cap
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, height - peaks[dataIndex] - 2, barWidth, 2);

    x += barWidth + 1;
  }
};

