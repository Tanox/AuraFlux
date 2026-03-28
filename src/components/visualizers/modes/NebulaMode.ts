// File: src/components/visualizers/modes/NebulaMode.ts | Version: v2.0.4

interface NebulaModeProps {
  ctx: CanvasRenderingContext2D;
  dataArray: Uint8Array;
  width: number;
  height: number;
  colors: string[];
  sensitivity: number;
}

/**
 * 渲染NEBULA模式的可视化效果
 */
export const renderNebulaMode = ({
  ctx,
  dataArray,
  width,
  height,
  colors,
  sensitivity
}: NebulaModeProps) => {
  const time = Date.now() * 0.0005;
  const centerX = width / 2;
  const centerY = height / 2;
  
  let average = 0;
  for (let i = 0; i < dataArray.length; i++) {
    average += dataArray[i];
  }
  average = (average / dataArray.length / 255) * sensitivity;

  ctx.globalCompositeOperation = 'lighter';
  
  for (let i = 0; i < 12; i++) {
    const dataIndex = Math.floor((i / 12) * dataArray.length);
    const val = dataArray[dataIndex] / 255;
    
    const angle = time * (i % 2 === 0 ? 1 : -1) + (i * Math.PI * 2) / 12;
    const distance = (Math.min(width, height) * 0.2) * (1 + val + average);
    
    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance;
    const radius = (Math.min(width, height) * 0.3) * (0.5 + val * 0.8);
    
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, colors[i % colors.length]);
    gradient.addColorStop(1, 'transparent');
    
    ctx.globalAlpha = 0.6 + val * 0.4;
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1.0;
  ctx.globalCompositeOperation = 'source-over';
};
