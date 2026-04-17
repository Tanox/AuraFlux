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
 * 娓叉煋WAVEFORM妯″紡鐨勫彲瑙嗗寲鏁堟灉
 */
export const renderWaveformMode = (() => {
  // 绮掑瓙鐘舵€佺紦瀛?- 浣跨敤闂寘閬垮厤鍏ㄥ眬鐘舵€佹薄鏌?
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
  
  // 缁樺埗宸﹀０閬撴尝褰紙涓婂崐閮ㄥ垎锛?
  ctx.beginPath();
  ctx.moveTo(0, centerY * 0.75);
  
  for (let i = 0; i < bufferLength; i++) {
    const v = (dataArray[i] / 128.0) * sensitivity;
    const y = centerY * 0.75 - v * (centerY * 0.6);
    
    // 娣诲姞娉㈠舰鍔ㄧ敾鏁堟灉
    const animationOffset = Math.sin(time + i * 0.01) * 5;
    const animatedY = y + animationOffset;
    
    if (i === 0) {
      ctx.moveTo(x, animatedY);
    } else {
      ctx.lineTo(x, animatedY);
    }
    
    // 鍔ㄦ€佹尝褰㈠搴?
    const lineWidth = 1 + (dataArray[i] / 255) * 3;
    
    // 棰戠巼鍝嶅簲棰滆壊
    const frequencyRatio = i / bufferLength;
    let frequencyColor;
    if (frequencyRatio < 0.2) {
      // 浣庨 - 鏆栬壊璋?
      frequencyColor = '#ff6b6b';
    } else if (frequencyRatio < 0.6) {
      // 涓 - 涓€ц壊璋?
      frequencyColor = '#4ecdc4';
    } else {
      // 楂橀 - 鍐疯壊璋?
      frequencyColor = '#45b7d1';
    }
    
    // 鍦ㄦ尝褰㈠嘲鍊煎娣诲姞绮掑瓙鏁堟灉
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
  
  // 鍒涘缓娓愬彉鏁堟灉
  const gradientTop = ctx.createLinearGradient(0, 0, 0, centerY);
  gradientTop.addColorStop(0, colors[0]);
  gradientTop.addColorStop(0.5, colors[Math.floor(colors.length / 2)]);
  gradientTop.addColorStop(1, colors[colors.length - 1]);
  
  ctx.strokeStyle = gradientTop;
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // 缁樺埗濉厖鍖哄煙
  ctx.fillStyle = gradientTop;
  ctx.globalAlpha = 0.3;
  ctx.fill();
  ctx.globalAlpha = 1.0;
  
  // 缁樺埗鍙冲０閬撴尝褰紙涓嬪崐閮ㄥ垎锛?
  if (dataArrayR) {
    x = 0;
    ctx.beginPath();
    ctx.moveTo(0, centerY * 1.25);
    
    for (let i = 0; i < bufferLength; i++) {
      const v = (dataArrayR[i] / 128.0) * sensitivity;
      const y = centerY * 1.25 + v * (centerY * 0.6);
      
      // 娣诲姞娉㈠舰鍔ㄧ敾鏁堟灉
      const animationOffset = Math.sin(time + i * 0.01 + Math.PI) * 5;
      const animatedY = y + animationOffset;
      
      if (i === 0) {
        ctx.moveTo(x, animatedY);
      } else {
        ctx.lineTo(x, animatedY);
      }
      
      // 鍦ㄦ尝褰㈠嘲鍊煎娣诲姞绮掑瓙鏁堟灉
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
    
    // 鍒涘缓娓愬彉鏁堟灉
    const gradientBottom = ctx.createLinearGradient(0, centerY, 0, height);
    gradientBottom.addColorStop(0, colors[colors.length - 1]);
    gradientBottom.addColorStop(0.5, colors[Math.floor(colors.length / 2)]);
    gradientBottom.addColorStop(1, colors[0]);
    
    ctx.strokeStyle = gradientBottom;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 缁樺埗濉厖鍖哄煙
    ctx.fillStyle = gradientBottom;
    ctx.globalAlpha = 0.3;
    ctx.fill();
    ctx.globalAlpha = 1.0;
  }
  
  // 鏇存柊鍜岀粯鍒剁矑瀛愭晥鏋?
  particles = particles.filter(particle => {
    // 鏇存柊绮掑瓙浣嶇疆鍜岄€忔槑搴?
    particle.y += particle.speed;
    particle.alpha -= 0.02;
    
    // 缁樺埗绮掑瓙
    ctx.globalAlpha = particle.alpha;
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
    
    // 淇濈暀閫忔槑搴﹀ぇ浜?鐨勭矑瀛?
    return particle.alpha > 0;
  });
  
  ctx.globalAlpha = 1.0;
  };
})();
