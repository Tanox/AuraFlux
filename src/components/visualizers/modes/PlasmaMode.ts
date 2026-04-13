// File: src\components\visualizers\modes\PlasmaMode.ts | Version: v2.2.11

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
  
  // 生成五个发光粒子随机运动
  const particleCount = 5;
  
  // 为每个粒子添加独立的运动参数
  const particleParams = [
    { speed: 0.3, noise: 0.05, offset: 0 },
    { speed: 0.25, noise: 0.07, offset: 1 },
    { speed: 0.35, noise: 0.04, offset: 2 },
    { speed: 0.28, noise: 0.06, offset: 3 },
    { speed: 0.32, noise: 0.05, offset: 4 }
  ];
  
  for (let i = 0; i < particleCount; i++) {
    const dataIndex = Math.floor((i / particleCount) * dataArray.length);
    const val = dataArray[dataIndex] / 255;
    const params = particleParams[i % particleParams.length];
    
    // 计算粒子位置，基于更复杂的随机运动和音频数据
    const noiseX = Math.sin(time * params.speed + params.offset) * Math.cos(time * 0.1 + params.offset);
    const noiseY = Math.cos(time * params.speed + params.offset) * Math.sin(time * 0.15 + params.offset);
    const baseX = (Math.sin(time * params.speed + params.offset) * 0.5 + 0.5) * width;
    const baseY = (Math.cos(time * params.speed * 1.2 + params.offset) * 0.5 + 0.5) * height;
    
    // 添加音频响应的偏移，更强烈的响应
    const audioOffsetX = (val * 2 - 1) * 80 * average;
    const audioOffsetY = (val * 2 - 1) * 80 * average;
    
    // 添加随机噪声偏移
    const randomOffsetX = (Math.random() * 2 - 1) * 20 * val;
    const randomOffsetY = (Math.random() * 2 - 1) * 20 * val;
    
    const x = baseX + noiseX * 30 + audioOffsetX + randomOffsetX;
    const y = baseY + noiseY * 30 + audioOffsetY + randomOffsetY;
    
    // 粒子大小基于音频数据，增加最大值
    const radius = 15 + val * 60 * sensitivity;
    
    // 创建更丰富的径向渐变，增强发光效果
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 2.5);
    gradient.addColorStop(0, colors[i % colors.length]);
    gradient.addColorStop(0.3, colors[(i + 1) % colors.length]);
    gradient.addColorStop(0.7, colors[(i + 2) % colors.length]);
    gradient.addColorStop(1, 'transparent');
    
    // 绘制粒子拖尾效果
    const tailLength = 3;
    for (let t = 0; t < tailLength; t++) {
      const tailProgress = t / tailLength;
      const tailX = x - (audioOffsetX + randomOffsetX) * tailProgress * 0.5;
      const tailY = y - (audioOffsetY + randomOffsetY) * tailProgress * 0.5;
      const tailRadius = radius * (1 - tailProgress * 0.6);
      
      const tailGradient = ctx.createRadialGradient(tailX, tailY, 0, tailX, tailY, tailRadius * 2);
      tailGradient.addColorStop(0, colors[i % colors.length]);
      tailGradient.addColorStop(0.5, colors[(i + 1) % colors.length]);
      tailGradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = tailGradient;
      ctx.globalAlpha = 0.3 * (1 - tailProgress);
      ctx.beginPath();
      ctx.arc(tailX, tailY, tailRadius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // 绘制主粒子
    ctx.globalAlpha = 1;
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalCompositeOperation = 'source-over';
};

