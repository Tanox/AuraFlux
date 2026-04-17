// File: src\components\visualizers\2d\waveform\WaveformMode.ts | Version: v2.3.3

interface WaveformModeProps {
  ctx: CanvasRenderingContext2D;
  dataArray: Uint8Array;
  dataArrayR?: Uint8Array;
  width: number;
  height: number;
  colors: string[];
  sensitivity: number;
}

/**
 * 渲染WAVEFORM模式的可视化效果
 */
export const renderWaveformMode = (() => {
  // 粒子状态缓�?- 使用闭包避免全局状态污�?
  let particles: { x: number; y: number; size: number; speed: number; alpha: number; color: string }[] = [];
  
  return ({
    ctx,
    dataArray,
    dataArrayR,
    width,
    height,
    colors,
    sensitivity
  }: WaveformModeProps) => {
  const bufferLength = dataArray.length;
  const sliceWidth = (width * 1.0) / bufferLength;
  let x = 0;
  const centerY = height / 2;
  const time = Date.now() * 0.001;
  
  // 绘制左声道波形（上半部分�?
  ctx.beginPath();
  ctx.moveTo(0, centerY * 0.75);
  
  for (let i = 0; i < bufferLength; i++) {
    const v = (dataArray[i] / 128.0) * sensitivity;
    const y = centerY * 0.75 - v * (centerY * 0.6);
    
    // 添加波形动画效果
    const animationOffset = Math.sin(time + i * 0.01) * 5;
    const animatedY = y + animationOffset;
    
    if (i === 0) {
      ctx.moveTo(x, animatedY);
    } else {
      ctx.lineTo(x, animatedY);
    }
    
    // 动态波形宽�?
    const lineWidth = 1 + (dataArray[i] / 255) * 3;
    
    // 频率响应颜色
    const frequencyRatio = i / bufferLength;
    let frequencyColor;
    if (frequencyRatio < 0.2) {
      // 低频 - 暖色�?
      frequencyColor = '#ff6b6b';
    } else if (frequencyRatio < 0.6) {
      // 中频 - 中性色�?
      frequencyColor = '#4ecdc4';
    } else {
      // 高频 - 冷色�?
      frequencyColor = '#45b7d1';
    }
    
    // 在波形峰值处添加粒子效果
    if (dataArray[i] > 200) {
      particles.push({
        x: x,
        y: animatedY,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 2 - 1,
        alpha: 1,
        color: frequencyColor
      });
    }
    
    x += sliceWidth;
  }
  
  ctx.lineTo(width, centerY * 0.75);
  
  // 创建渐变效果
  const gradientTop = ctx.createLinearGradient(0, 0, 0, centerY);
  gradientTop.addColorStop(0, colors[0]);
  gradientTop.addColorStop(0.5, colors[Math.floor(colors.length / 2)]);
  gradientTop.addColorStop(1, colors[colors.length - 1]);
  
  ctx.strokeStyle = gradientTop;
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // 绘制填充区域
  ctx.fillStyle = gradientTop;
  ctx.globalAlpha = 0.3;
  ctx.fill();
  ctx.globalAlpha = 1.0;
  
  // 绘制右声道波形（下半部分�?
  if (dataArrayR) {
    x = 0;
    ctx.beginPath();
    ctx.moveTo(0, centerY * 1.25);
    
    for (let i = 0; i < bufferLength; i++) {
      const v = (dataArrayR[i] / 128.0) * sensitivity;
      const y = centerY * 1.25 + v * (centerY * 0.6);
      
      // 添加波形动画效果
      const animationOffset = Math.sin(time + i * 0.01 + Math.PI) * 5;
      const animatedY = y + animationOffset;
      
      if (i === 0) {
        ctx.moveTo(x, animatedY);
      } else {
        ctx.lineTo(x, animatedY);
      }
      
      // 在波形峰值处添加粒子效果
      if (dataArrayR[i] > 200) {
        particles.push({
          x: x,
          y: animatedY,
          size: Math.random() * 3 + 1,
          speed: Math.random() * 2 - 1,
          alpha: 1,
          color: colors[i % colors.length]
        });
      }
      
      x += sliceWidth;
    }
    
    ctx.lineTo(width, centerY * 1.25);
    
    // 创建渐变效果
    const gradientBottom = ctx.createLinearGradient(0, centerY, 0, height);
    gradientBottom.addColorStop(0, colors[colors.length - 1]);
    gradientBottom.addColorStop(0.5, colors[Math.floor(colors.length / 2)]);
    gradientBottom.addColorStop(1, colors[0]);
    
    ctx.strokeStyle = gradientBottom;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 绘制填充区域
    ctx.fillStyle = gradientBottom;
    ctx.globalAlpha = 0.3;
    ctx.fill();
    ctx.globalAlpha = 1.0;
  }
  
  // 更新和绘制粒子效�?
  particles = particles.filter(particle => {
    // 更新粒子位置和透明�?
    particle.y += particle.speed;
    particle.alpha -= 0.02;
    
    // 绘制粒子
    ctx.globalAlpha = particle.alpha;
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
    
    // 保留透明度大�?的粒�?
    return particle.alpha > 0;
  });
  
  ctx.globalAlpha = 1.0;
  };
})();
