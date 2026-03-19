// File: src/components/visualizers/canvas/modes/WaveformMode.ts | Version: v1.0.0
import { VisualizerSettings } from '@/src/types';

export const drawWaveform = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  dataArray: Uint8Array,
  bufferLength: number,
  colors: string[],
  settings: VisualizerSettings
) => {
  ctx.lineWidth = 3;
  const sliceWidth = width / bufferLength;
  
  for (let j = 0; j < 6; j++) { // Increase number of lines
    ctx.beginPath();
    ctx.strokeStyle = colors[j % colors.length];
    ctx.shadowBlur = 15; // Increase shadow
    ctx.shadowColor = colors[j % colors.length];
    
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
      // Frequency response: use different parts of the dataArray
      const freqIndex = Math.floor((i + j * (bufferLength / 6)) % bufferLength);
      const v = (dataArray[freqIndex] - 128) / 128.0; // Center around 0
      // Add some offset based on the ribbon index
      const offset = Math.sin(i * 0.05 + Date.now() * 0.002 + j) * 40;
      const y = height / 2 + (v * height / 4) + offset; // Center on screen
      
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      
      x += sliceWidth;
    }
    ctx.lineTo(width, height / 2);
    ctx.stroke();
  }
  ctx.shadowBlur = 0; // Reset for other drawings
};
