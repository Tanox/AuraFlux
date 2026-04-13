// File: src\components\visualizers\modes\PlasmaMode.ts | Version: v2.2.14

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
    const audioOffsetX = (val * 2 - 1) * 120 * average;
    const audioOffsetY = (val * 2 - 1) * 120 * average;
    
    // 添加随机噪声偏移
    const randomOffsetX = (Math.random() * 2 - 1) * 30 * val;
    const randomOffsetY = (Math.random() * 2 - 1) * 30 * val;
    
    const x = baseX + noiseX * 50 + audioOffsetX + randomOffsetX;
    const y = baseY + noiseY * 50 + audioOffsetY + randomOffsetY;
    
    // 粒子大小基于音频数据，大幅增加最大值
    const radius = 20 + val * 100 * sensitivity;
    
    // 创建巨大的径向渐变，铺满整个画面的光晕效果
    const gradientSize = Math.max(width, height) * 2;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, gradientSize);
    gradient.addColorStop(0, colors[i % colors.length]);
    gradient.addColorStop(0.1, colors[(i + 1) % colors.length]);
    gradient.addColorStop(0.3, colors[(i + 2) % colors.length]);
    gradient.addColorStop(1, 'transparent');
    
    // 绘制超大光晕背景
    ctx.globalAlpha = 0.6 * average;
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, gradientSize, 0, Math.PI * 2);
    ctx.fill();
    
    // 绘制粒子拖尾效果（增强）
    const tailLength = 5;
    for (let t = 0; t < tailLength; t++) {
      const tailProgress = t / tailLength;
      const tailX = x - (audioOffsetX + randomOffsetX) * tailProgress * 0.3;
      const tailY = y - (audioOffsetY + randomOffsetY) * tailProgress * 0.3;
      const tailRadius = radius * (1 - tailProgress * 0.4);
      
      const tailGradient = ctx.createRadialGradient(tailX, tailY, 0, tailX, tailY, tailRadius * 5);
      tailGradient.addColorStop(0, colors[i % colors.length]);
      tailGradient.addColorStop(0.3, colors[(i + 1) % colors.length]);
      tailGradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = tailGradient;
      ctx.globalAlpha = 0.4 * (1 - tailProgress) * average;
      ctx.beginPath();
      ctx.arc(tailX, tailY, tailRadius * 5, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // 绘制主粒子
    ctx.globalAlpha = 1;
    const particleGradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 3);
    particleGradient.addColorStop(0, colors[i % colors.length]);
    particleGradient.addColorStop(0.5, colors[(i + 1) % colors.length]);
    particleGradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = particleGradient;
    ctx.beginPath();
    ctx.arc(x, y, radius * 3, 0, Math.PI * 2);
    ctx.fill();
    
    // 绘制粒子核心
    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // 绘制全屏发光效果
  const fullScreenGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(width, height));
  fullScreenGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
  fullScreenGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
  fullScreenGradient.addColorStop(1, 'transparent');
  
  ctx.globalAlpha = 0.8 * average;
  ctx.fillStyle = fullScreenGradient;
  ctx.fillRect(0, 0, width, height);
  
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;
};

