// File: src\components\visualizers\modes\PlasmaMode.ts | Version: v2.0.6

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
  
  // 生成更多发光粒子
  const particleCount = 100;
  for (let i = 0; i < particleCount; i++) {
    const dataIndex = Math.floor((i / particleCount) * dataArray.length);
    const val = dataArray[dataIndex] / 255;
    
    // 计算粒子位置，基于音频数据和时间
    const angle = (i / particleCount) * Math.PI * 2 + time * 0.5;
    const distance = (Math.min(width, height) * 0.4) * (0.3 + val * 0.7 + average * 0.5);
    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance;
    
    // 粒子大小基于音频数据
    const radius = 2 + val * 10 * sensitivity;
    
    // 创建径向渐变，增强发光效果
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 2);
    gradient.addColorStop(0, colors[i % colors.length]);
    gradient.addColorStop(0.5, colors[(i + 1) % colors.length]);
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalCompositeOperation = 'source-over';
};

