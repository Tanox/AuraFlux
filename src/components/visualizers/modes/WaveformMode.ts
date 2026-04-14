// File: src\components\visualizers\modes\WaveformMode.ts | Version: v2.2.18

interface WaveformModeProps {
  ctx: CanvasRenderingContext2D;
  dataArray: Uint8Array;
  width: number;
  height: number;
  colors: string[];
  sensitivity: number;
}

/**
 * 渲染WAVEFORM模式的可视化效果
 */
export const renderWaveformMode = ({
  ctx,
  dataArray,
  width,
  height,
  colors,
  sensitivity
}: WaveformModeProps) => {
  const bufferLength = dataArray.length;
  const sliceWidth = (width * 1.0) / bufferLength;
  let x = 0;
  
  // 绘制波形路径
  ctx.beginPath();
  ctx.moveTo(0, height / 2);
  
  for (let i = 0; i < bufferLength; i++) {
    const v = (dataArray[i] / 128.0) * sensitivity;
    const y = v * (height / 2);
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
    
    x += sliceWidth;
  }
  
  ctx.lineTo(width, height / 2);
  
  // 创建渐变效果
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, colors[0]);
  gradient.addColorStop(0.5, colors[Math.floor(colors.length / 2)]);
  gradient.addColorStop(1, colors[colors.length - 1]);
  
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // 绘制填充区域
  ctx.fillStyle = gradient;
  ctx.globalAlpha = 0.3;
  ctx.fill();
  ctx.globalAlpha = 1.0;
};
