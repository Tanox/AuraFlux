// File: src/components/visualizers/modes/PlasmaMode.ts | Version: v2.0.4

interface PlasmaModeProps {
  ctx: CanvasRenderingContext2D;
  dataArray: Uint8Array;
  width: number;
  height: number;
  colors: string[];
  sensitivity: number;
}

/**
 * 渲染PLASMA模式的可视化效果
 */
export const renderPlasmaMode = ({
  ctx,
  dataArray,
  width,
  height,
  colors,
  sensitivity
}: PlasmaModeProps) => {
  const time = Date.now() * 0.001;
  const centerX = width / 2;
  const centerY = height / 2;
  
  let average = 0;
  for (let i = 0; i < dataArray.length; i++) {
    average += dataArray[i];
  }
  average = (average / dataArray.length / 255) * sensitivity;

  ctx.globalCompositeOperation = 'screen';
  
  for (let i = 0; i < 5; i++) {
    const dataIndex = Math.floor((i / 5) * dataArray.length);
    const val = dataArray[dataIndex] / 255;
    
    const x = centerX + Math.sin(time + i) * (width * 0.3) * (1 + val * 0.2);
    const y = centerY + Math.cos(time * 0.8 + i) * (height * 0.3) * (1 + val * 0.2);
    const radius = (Math.min(width, height) * 0.4) * (0.5 + val * 0.5 + average * 0.5);
    
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, colors[i % colors.length]);
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalCompositeOperation = 'source-over';
};
