// File: src/components/visualizers/modes/RingsMode.ts | Version: v2.0.5

interface RingsModeProps {
  ctx: CanvasRenderingContext2D;
  dataArray: Uint8Array;
  width: number;
  height: number;
  colors: string[];
  sensitivity: number;
}

/**
 * 渲染RINGS模式的可视化效果
 */
export const renderRingsMode = ({
  ctx,
  dataArray,
  width,
  height,
  colors,
  sensitivity
}: RingsModeProps) => {
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(centerX, centerY) * 0.9;
  
  const numRings = 8;
  for (let i = 0; i < numRings; i++) {
    const dataIndex = Math.floor((i / numRings) * dataArray.length);
    const val = dataArray[dataIndex] / 255;
    const radius = (maxRadius / numRings) * (i + 1) + (val * 50 * sensitivity);
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 2 + val * 12;
    ctx.strokeStyle = colors[i % colors.length];
    ctx.shadowBlur = 10 + val * 20;
    ctx.shadowColor = colors[i % colors.length];
    ctx.stroke();
  }
  ctx.shadowBlur = 0;
};
