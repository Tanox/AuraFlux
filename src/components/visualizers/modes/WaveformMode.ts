// File: src/components/visualizers/modes/WaveformMode.ts | Version: v2.0.4

interface WaveformModeProps {
  ctx: CanvasRenderingContext2D;
  dataArray: Uint8Array<ArrayBuffer>;
  width: number;
  height: number;
  colors: string[];
  analyser: AnalyserNode;
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
  analyser
}: WaveformModeProps) => {
  analyser.getByteTimeDomainData(dataArray);
  
  ctx.lineWidth = 3;
  const sliceWidth = width / dataArray.length;
  
  for (let j = 0; j < 3; j++) {
    ctx.beginPath();
    ctx.strokeStyle = colors[j % colors.length];
    ctx.shadowBlur = 10;
    ctx.shadowColor = colors[j % colors.length];
    
    let x = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const v = dataArray[i] / 128.0;
      // Add some offset based on the ribbon index
      const offset = Math.sin(i * 0.05 + Date.now() * 0.002 + j) * 20;
      const y = (v * height) / 2 + offset;
      
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      
      x += sliceWidth;
    }
    ctx.lineTo(width, height / 2);
    ctx.stroke();
  }
  ctx.shadowBlur = 0; // Reset for other drawings
};
