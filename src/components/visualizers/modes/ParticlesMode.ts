// File: src/components/visualizers/modes/ParticlesMode.ts | Version: v2.0.5

interface ParticlesModeProps {
  ctx: CanvasRenderingContext2D;
  dataArray: Uint8Array;
  width: number;
  height: number;
  colors: string[];
  sensitivity: number;
}

/**
 * 渲染PARTICLES模式的可视化效果
 */
export const renderParticlesMode = ({
  ctx,
  dataArray,
  width,
  height,
  colors,
  sensitivity
}: ParticlesModeProps) => {
  const time = Date.now() * 0.001;
  const centerX = width / 2;
  const centerY = height / 2;
  
  ctx.globalCompositeOperation = 'screen';
  
  for (let i = 0; i < 100; i++) {
    const dataIndex = Math.floor((i / 100) * dataArray.length);
    const val = dataArray[dataIndex] / 255;
    
    const angle = (i * Math.PI * 2) / 100 + time * 0.1;
    const distance = (Math.min(width, height) * 0.4) * Math.random() * (1 + val * sensitivity);
    
    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance;
    
    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath();
    ctx.arc(x, y, 2 + val * 5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalCompositeOperation = 'source-over';
};
