// File: src/components/visualizers/canvas/modes/BarsMode.ts | Version: v1.0.0
import { VisualizerSettings } from '@/src/types';

export const drawBars = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  dataArray: Uint8Array,
  bufferLength: number,
  colors: string[],
  settings: VisualizerSettings,
  peaks: Float32Array
) => {
  const barWidth = (width / (bufferLength / 5)) * 2.5; // Increase width
  let x = 0;
  for (let i = 0; i < bufferLength; i += 5) { // Decrease count
    const barHeight = (dataArray[i] / 255) * height * settings.sensitivity;
    
    // Peak caps
    if (barHeight > peaks[i]) {
      peaks[i] = barHeight;
    } else {
      peaks[i] -= 1.5; // Slow fall speed
    }
    if (peaks[i] < 0) peaks[i] = 0;

    ctx.fillStyle = colors[0]; // Use single color
    ctx.fillRect(x, height - barHeight, barWidth, barHeight);
    
    // Draw peak cap
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, height - peaks[i] - 2, barWidth, 2);

    x += barWidth + 1;
  }
};
