// File: src\components\visualizers\2d\starfield\StarfieldMode.ts | Version: v2.3.3

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
  sensitivity: number;
  stars: Star[];
}

export const renderStarfieldMode = ({ ctx, dataArray, width, height, colors, sensitivity, stars }: StarfieldModeProps) => {
  // 璁＄畻闊抽鑳介噺
  let energy = 0;
  for (let i = 0; i < dataArray.length; i++) {
    energy += dataArray[i];
  }
  energy = energy / dataArray.length / 255 * sensitivity;
  
  // 娓呯┖鐢诲竷
  ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
  ctx.fillRect(0, 0, width, height);
  
  // 缁樺埗鏄熸槦
  stars.forEach((star, index) => {
    // 鏍规嵁闊抽鑳介噺璋冩暣鏄熸槦閫熷害鍜屼寒搴?
    const adjustedSpeed = star.speed * (1 + energy * 3);
    const brightness = star.brightness * (1 + energy * 2);
    
    // 鏇存柊鏄熸槦浣嶇疆
    star.z -= adjustedSpeed;
    
    // 濡傛灉鏄熸槦瓒呭嚭鑼冨洿锛岄噸缃?
    if (star.z <= 0) {
      star.z = 1000;
      star.x = Math.random() * width;
      star.y = Math.random() * height;
      star.size = Math.random() * 3 + 1;
      star.speed = Math.random() * 2 + 0.5;
      star.brightness = Math.random() * 0.8 + 0.2;
    }
    
    // 璁＄畻鏄熸槦鍦ㄥ睆骞曚笂鐨勪綅缃拰澶у皬
    const scale = 1000 / star.z;
    const x = (star.x - width / 2) * scale + width / 2;
    const y = (star.y - height / 2) * scale + height / 2;
    const size = star.size * scale;
    
    // 鏍规嵁褰撳墠涓婚棰滆壊鍔ㄦ€佹洿鏂版槦鏄熼鑹?
    const colorIndex = (index + Math.floor(Date.now() * 0.001)) % colors.length;
    const starColor = colors[colorIndex];
    
    // 缁樺埗鏄熸槦鐨勫厜鏅曟晥鏋滐紙澧炲己锛?
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 8);
    gradient.addColorStop(0, starColor);
    gradient.addColorStop(0.3, starColor);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.globalAlpha = brightness * 0.8;
    ctx.beginPath();
    ctx.arc(x, y, size * 8, 0, Math.PI * 2);
    ctx.fill();
    
    // 缁樺埗鏄熸槦
    ctx.globalAlpha = brightness;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = starColor;
    ctx.fill();
    
    ctx.globalAlpha = 1;
  });
  
  // 缁樺埗闊抽鍝嶅簲鐨勪腑蹇冩晥鏋滐紙澧炲己锛?
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
  
  // 缁樺埗涓績鑴夊啿鏁堟灉
  const pulseSize = centerSize * 1.5;
  const pulseGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, pulseSize);
  pulseGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
  pulseGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
  pulseGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  
  ctx.fillStyle = pulseGradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, pulseSize, 0, Math.PI * 2);
  ctx.fill();
};
