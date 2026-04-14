// File: src\components\visualizers\modes\TunnelMode.ts | Version: v2.2.18

interface TunnelModeProps {
  ctx: CanvasRenderingContext2D;
  dataArray: Uint8Array;
  width: number;
  height: number;
  colors: string[];
  sensitivity: number;
}

/**
 * 渲染TUNNEL模式的可视化效果
 */
export const renderTunnelMode = ({
  ctx,
  dataArray,
  width,
  height,
  colors,
  sensitivity
}: TunnelModeProps) => {
  const time = Date.now() * 0.002;
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.max(width, height);
  
  for (let i = 0; i < 20; i++) {
    const dataIndex = Math.floor((i / 20) * dataArray.length);
    const val = dataArray[dataIndex] / 255;
    
    const radius = (time * 100 + i * (maxRadius / 20)) % maxRadius;
    const alpha = 1 - (radius / maxRadius);
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.lineWidth = 2 + val * 30 * sensitivity;
    ctx.strokeStyle = colors[i % colors.length];
    ctx.globalAlpha = alpha * (0.5 + val * 0.5 * sensitivity);
    ctx.stroke();
  }
  ctx.globalAlpha = 1.0;
};

