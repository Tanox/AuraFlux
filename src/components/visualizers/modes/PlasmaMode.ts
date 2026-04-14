// File: /src/components/visualizers/modes/PlasmaMode.ts | Version: v2.2.22

interface ParticleState {
  x: number;
  y: number;
  radius: number;
  targetX: number;
  targetY: number;
  targetRadius: number;
  rotation: number;
  rotationSpeed: number;
  splitTimer: number;
  isSplitting: boolean;
}

interface FusionEffect {
  x: number;
  y: number;
  size: number;
  alpha: number;
  color: string;
}

interface PlasmaModeProps {
  ctx: CanvasRenderingContext2D;
  dataArray: Uint8Array;
  width: number;
  height: number;
  colors: string[];
  sensitivity: number;
}

// 粒子状态缓存
let particleStates: ParticleState[] = [];
// 融合效果缓存
let fusionEffects: FusionEffect[] = [];

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
  
  // 初始化粒子状态
  if (particleStates.length !== particleCount) {
    particleStates = [];
    for (let i = 0; i < particleCount; i++) {
      particleStates.push({
        x: centerX,
        y: centerY,
        radius: 20,
        targetX: centerX,
        targetY: centerY,
        targetRadius: 20,
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
        splitTimer: 0,
        isSplitting: false
      });
    }
  }
  
  // 检测粒子融合
  for (let i = 0; i < particleStates.length; i++) {
    for (let j = i + 1; j < particleStates.length; j++) {
      const p1 = particleStates[i];
      const p2 = particleStates[j];
      const distance = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
      
      if (distance < p1.radius + p2.radius) {
        // 粒子融合
        const fusionX = (p1.x + p2.x) / 2;
        const fusionY = (p1.y + p2.y) / 2;
        const fusionSize = Math.sqrt(p1.radius * p1.radius + p2.radius * p2.radius);
        
        fusionEffects.push({
          x: fusionX,
          y: fusionY,
          size: fusionSize,
          alpha: 1,
          color: colors[(i + j) % colors.length]
        });
        
        // 融合后粒子分离
        const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        const separationDistance = (p1.radius + p2.radius) * 1.2;
        
        p1.targetX = fusionX - Math.cos(angle) * separationDistance;
        p1.targetY = fusionY - Math.sin(angle) * separationDistance;
        p2.targetX = fusionX + Math.cos(angle) * separationDistance;
        p2.targetY = fusionY + Math.sin(angle) * separationDistance;
      }
    }
  }
  
  for (let i = 0; i < particleStates.length; i++) {
    const dataIndex = Math.floor((i / particleStates.length) * dataArray.length);
    const val = dataArray[dataIndex] / 255;
    const params = particleParams[i % particleParams.length];
    
    // 计算粒子目标位置，基于更复杂的随机运动和音频数据
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
    
    // 更新目标位置和大小
    particleStates[i].targetX = baseX + noiseX * 50 + audioOffsetX + randomOffsetX;
    particleStates[i].targetY = baseY + noiseY * 50 + audioOffsetY + randomOffsetY;
    particleStates[i].targetRadius = 20 + val * 100 * sensitivity;
    
    // 缓动过渡到目标位置和大小
    const easing = 0.08; // 缓动系数，越小过渡越平滑
    particleStates[i].x += (particleStates[i].targetX - particleStates[i].x) * easing;
    particleStates[i].y += (particleStates[i].targetY - particleStates[i].y) * easing;
    particleStates[i].radius += (particleStates[i].targetRadius - particleStates[i].radius) * easing;
    
    // 更新旋转
    particleStates[i].rotation += particleStates[i].rotationSpeed;
    
    // 粒子分裂逻辑
    particleStates[i].splitTimer += 0.01;
    if (particleStates[i].splitTimer > 5 && particleStates[i].radius > 30) {
      particleStates[i].isSplitting = true;
      particleStates[i].splitTimer = 0;
      
      // 创建新粒子
      const newParticle: ParticleState = {
        x: particleStates[i].x,
        y: particleStates[i].y,
        radius: particleStates[i].radius / 2,
        targetX: particleStates[i].x + (Math.random() - 0.5) * 100,
        targetY: particleStates[i].y + (Math.random() - 0.5) * 100,
        targetRadius: 20 + Math.random() * 30,
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
        splitTimer: 0,
        isSplitting: false
      };
      
      particleStates.push(newParticle);
      particleStates[i].radius /= 2;
    }
    
    const x = particleStates[i].x;
    const y = particleStates[i].y;
    const radius = particleStates[i].radius;
    const rotation = particleStates[i].rotation;
    const colorIndex = i % colors.length;
    
    // 保存当前画布状态
    ctx.save();
    
    // 应用旋转
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.translate(-x, -y);
    
    // 创建巨大的径向渐变，铺满整个画面的光晕效果，使用更平滑的颜色过渡
    const gradientSize = Math.max(width, height) * 2;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, gradientSize);
    
    // 更平滑的颜色过渡
    const color1 = colors[colorIndex % colors.length];
    const color2 = colors[(colorIndex + 1) % colors.length];
    const color3 = colors[(colorIndex + 2) % colors.length];
    
    gradient.addColorStop(0, color1);
    gradient.addColorStop(0.15, color1);
    gradient.addColorStop(0.3, color2);
    gradient.addColorStop(0.5, color3);
    gradient.addColorStop(0.7, color2);
    gradient.addColorStop(1, 'transparent');
    
    // 绘制超大光晕背景
    ctx.globalAlpha = 0.6 * average;
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, gradientSize, 0, Math.PI * 2);
    ctx.fill();
    
    // 绘制粒子拖尾效果（增强且更顺滑）
    const tailLength = 8; // 增加拖尾长度
    for (let t = 0; t < tailLength; t++) {
      const tailProgress = t / tailLength;
      const tailEasing = 1 - Math.pow(1 - tailProgress, 3); // 缓动拖尾
      const tailX = x - (particleStates[i].targetX - x) * tailEasing * 0.8;
      const tailY = y - (particleStates[i].targetY - y) * tailEasing * 0.8;
      const tailRadius = radius * (1 - tailEasing * 0.6);
      
      const tailGradient = ctx.createRadialGradient(tailX, tailY, 0, tailX, tailY, tailRadius * 6);
      tailGradient.addColorStop(0, color1);
      tailGradient.addColorStop(0.2, color2);
      tailGradient.addColorStop(0.4, color3);
      tailGradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = tailGradient;
      ctx.globalAlpha = 0.3 * (1 - tailEasing) * average;
      ctx.beginPath();
      ctx.arc(tailX, tailY, tailRadius * 6, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // 绘制主粒子，使用更平滑的渐变
    ctx.globalAlpha = 1;
    const particleGradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 4);
    particleGradient.addColorStop(0, color1);
    particleGradient.addColorStop(0.2, color1);
    particleGradient.addColorStop(0.4, color2);
    particleGradient.addColorStop(0.6, color3);
    particleGradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = particleGradient;
    ctx.beginPath();
    ctx.arc(x, y, radius * 4, 0, Math.PI * 2);
    ctx.fill();
    
    // 绘制粒子核心
    ctx.fillStyle = color1;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // 恢复画布状态
    ctx.restore();
  }
  
  // 更新融合效果
  fusionEffects = fusionEffects.filter(effect => {
    effect.alpha -= 0.02;
    effect.size += 0.5;
    return effect.alpha > 0;
  });
  
  // 绘制融合效果
  fusionEffects.forEach(effect => {
    ctx.globalAlpha = effect.alpha;
    ctx.fillStyle = effect.color;
    ctx.beginPath();
    ctx.arc(effect.x, effect.y, effect.size, 0, Math.PI * 2);
    ctx.fill();
  });
  
  // 限制粒子数量
  if (particleStates.length > 10) {
    particleStates = particleStates.slice(0, 10);
  }
  
  // 绘制全屏发光效果，使用更平滑的渐变
  const fullScreenGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(width, height));
  fullScreenGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
  fullScreenGradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.2)');
  fullScreenGradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.1)');
  fullScreenGradient.addColorStop(1, 'transparent');
  
  ctx.globalAlpha = 0.8 * average;
  ctx.fillStyle = fullScreenGradient;
  ctx.fillRect(0, 0, width, height);
  
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;
};

