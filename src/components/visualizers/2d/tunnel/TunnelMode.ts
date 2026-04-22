// File: src/components/visualizers/2d/tunnel/TunnelMode.ts | Version: v2.3.3

interface TunnelModeProps {
  ctx: CanvasRenderingContext2D;
  dataArray: Uint8Array;
  width: number;
  height: number;
  colors: string[];
  settings: any;
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
  settings
}: TunnelModeProps) => {
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
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.lineWidth = 2 + val * 30 * sensitivity;
    ctx.strokeStyle = colors[i % colors.length];
    ctx.globalAlpha = alpha * (0.5 + val * 0.5 * sensitivity);
    
    // 添加发光效果
    if (settings?.glow !== false) {
      ctx.shadowBlur = 20;
      ctx.shadowColor = colors[i % colors.length];
    } else {
      ctx.shadowBlur = 0;
    }
    
    ctx.stroke();
  }
  ctx.globalAlpha = 1.0;
  ctx.shadowBlur = 0;
};
