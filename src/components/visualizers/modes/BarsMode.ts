// File: src/components/visualizers/modes/BarsMode.ts | Version: v2.0.5

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
  const newBufferLength = Math.max(1, Math.floor(bufferLength * 0.25)); // Reduce to 25%
  const barWidth = (width / newBufferLength) * 2.5;
  let x = 0;
  
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

    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(x, height - barHeight, barWidth, barHeight);
    
    // Draw peak cap
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, height - peaks[dataIndex] - 2, barWidth, 2);

    x += barWidth + 1;
  }
};
