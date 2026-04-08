// src/components/visualizers/modes/StarfieldMode.ts

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  speed: number;
  color: string;
}

interface StarfieldModeProps {
  ctx: CanvasRenderingContext2D;
  dataArray: Uint8Array;
  width: number;
  height: number;
  colors: string[];
  sensitivity: number;
}

export const renderStarfieldMode = ({ ctx, dataArray, width, height, colors, sensitivity }: StarfieldModeProps) => {
  // 计算音频能量
  let energy = 0;
  for (let i = 0; i < dataArray.length; i++) {
    energy += dataArray[i];
  }
  energy = energy / dataArray.length / 255 * sensitivity;
  
  // 初始化星星数组（如果还没有）
  if (!window.stars) {
    window.stars = [];
    const starCount = 200;
    for (let i = 0; i < starCount; i++) {
      window.stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 1000,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 2 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }
  
  const stars = window.stars as Star[];
  
  // 清空画布
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.fillRect(0, 0, width, height);
  
  // 绘制星星
  stars.forEach((star, index) => {
    // 根据音频能量调整星星速度
    const adjustedSpeed = star.speed * (1 + energy * 2);
    
    // 更新星星位置
    star.z -= adjustedSpeed;
    
    // 如果星星超出范围，重置
    if (star.z <= 0) {
      star.z = 1000;
      star.x = Math.random() * width;
      star.y = Math.random() * height;
      star.size = Math.random() * 3 + 1;
      star.speed = Math.random() * 2 + 0.5;
      star.color = colors[Math.floor(Math.random() * colors.length)];
    }
    
    // 计算星星在屏幕上的位置和大小
    const scale = 1000 / star.z;
    const x = (star.x - width / 2) * scale + width / 2;
    const y = (star.y - height / 2) * scale + height / 2;
    const size = star.size * scale;
    
    // 绘制星星
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = star.color;
    ctx.fill();
    
    // 绘制星星的光晕效果
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 3);
    gradient.addColorStop(0, star.color);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, size * 3, 0, Math.PI * 2);
    ctx.fill();
  });
  
  // 绘制音频响应的中心效果
  const centerX = width / 2;
  const centerY = height / 2;
  const centerSize = energy * 50;
  
  const centerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, centerSize);
  centerGradient.addColorStop(0, colors[0]);
  centerGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  
  ctx.fillStyle = centerGradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, centerSize, 0, Math.PI * 2);
  ctx.fill();
};

// 扩展 Window 接口以存储星星数据
declare global {
  interface Window {
    stars?: Star[];
  }
}
