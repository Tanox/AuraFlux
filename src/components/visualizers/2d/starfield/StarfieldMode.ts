// src/components/visualizers/2d/starfield/StarfieldMode.ts v2.3.11
interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  speed: number;
  brightness: number;
}

interface StarfieldModeProps {
  ctx: CanvasRenderingContext2D;
  dataArray: Uint8Array;
  width: number;
  height: number;
  colors: string[];
  settings: any;
  stars: Star[];
}

export const renderStarfieldMode = ({ ctx, dataArray, width, height, colors, settings, stars }: StarfieldModeProps) => {
  const sensitivity = settings?.sensitivity || 1;
  // 计算音频能量
  let energy = 0;
  for (let i = 0; i < dataArray.length; i++) {
    energy += dataArray[i];
  }
  energy = energy / dataArray.length / 255 * sensitivity;
  
  // 清空画布（轨迹效果）
  const fadeAmount = settings?.trails === false ? 1 : 0.08;
  ctx.fillStyle = `rgba(0, 0, 0, ${fadeAmount})`;
  ctx.fillRect(0, 0, width, height);
  
  // 绘制星星
  stars.forEach((star, index) => {
    // 根据音频能量调整星星速度和亮度
    const adjustedSpeed = star.speed * (1 + energy * 3);
    const brightness = star.brightness * (1 + energy * 2);
    
    // 更新星星位置
    star.z -= adjustedSpeed;
    
    // 如果星星超出范围，重置
    if (star.z <= 0) {
      star.z = 1000;
      star.x = Math.random() * width;
      star.y = Math.random() * height;
      star.size = Math.random() * 3 + 1;
      star.speed = Math.random() * 2 + 0.5;
      star.brightness = Math.random() * 0.8 + 0.2;
    }
    
    // 计算星星在屏幕上的位置和大小
    const scale = 1000 / star.z;
    const x = (star.x - width / 2) * scale + width / 2;
    const y = (star.y - height / 2) * scale + height / 2;
    const size = star.size * scale;
    
    // 根据当前主题颜色动态更新星星颜色
    const colorIndex = (index + Math.floor(Date.now() * 0.001)) % colors.length;
    const starColor = colors[colorIndex];
    
    // 绘制星星的光晕效果（增强）
    if (settings?.glow !== false) {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 8);
      gradient.addColorStop(0, starColor);
      gradient.addColorStop(0.3, starColor);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.globalAlpha = brightness * 0.8;
      ctx.beginPath();
      ctx.arc(x, y, size * 8, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // 绘制星星
    ctx.globalAlpha = brightness;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = starColor;
    ctx.fill();
    
    ctx.globalAlpha = 1;
  });
  
  // 绘制音频响应的中心效果（增强）
  if (settings?.glow !== false) {
    const centerX = width / 2;
    const centerY = height / 2;
    const centerSize = energy * 80;
    
    const centerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, centerSize);
    centerGradient.addColorStop(0, colors[0]);
    centerGradient.addColorStop(0.2, colors[1] || colors[0]);
    centerGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = centerGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, centerSize, 0, Math.PI * 2);
    ctx.fill();
    
    // 绘制中心脉冲效果
    const pulseSize = centerSize * 1.5;
    const pulseGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, pulseSize);
    pulseGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    pulseGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
    pulseGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = pulseGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, pulseSize, 0, Math.PI * 2);
    ctx.fill();
  }
};
