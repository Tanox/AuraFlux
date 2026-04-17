// File: src\components\visualizers\2d\bars\BarsMode.ts | Version: v2.3.3

interface BarsModeProps {
  ctx: CanvasRenderingContext2D;
  dataArray: Uint8Array;
  width: number;
  height: number;
  colors: string[];
  sensitivity: number;
}

/**
 * 娓叉煋BARS妯″紡鐨勫彲瑙嗗寲鏁堟灉
 */
export const renderBarsMode = ({
  ctx,
  dataArray,
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

    // Color based on bar height, synchronized with theme colors
    const normalizedHeight = barHeight / (height * sensitivity);
    const colorIndex = Math.floor(normalizedHeight * (safeColors.length - 1));
    const clampedColorIndex = Math.max(0, Math.min(colorIndex, safeColors.length - 1));
    
    // Create gradient effect from base to tip
    const gradient = ctx.createLinearGradient(x, height, x, height - barHeight);
    gradient.addColorStop(0, safeColors[0]); // Base color (first theme color)
    gradient.addColorStop(1, safeColors[clampedColorIndex]); // Tip color based on height
    ctx.fillStyle = gradient;
    
    ctx.fillRect(x, height - barHeight, barWidth, barHeight);

    x += barWidth + 1;
  }
};
