// File: src/components/visualizers/canvas/modes/TunnelMode.ts | Version: v1.0.0
import { VisualizerSettings } from '@/src/types';

export const drawTunnel = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  dataArray: Uint8Array,
  bufferLength: number,
  colors: string[],
  settings: VisualizerSettings
) => {
  const time = Date.now() * 0.002;
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.max(width, height);
  
  ctx.lineWidth = 2;
  for (let i = 0; i < 20; i++) {
    const dataIndex = Math.floor((i / 20) * bufferLength);
    const val = dataArray[dataIndex] / 255;
    
    ctx.lineWidth = 20 + val * 100 * settings.sensitivity; // Adjust thickness based on sound (10x thicker)
    const radius = (time * 100 + i * (maxRadius / 20)) % maxRadius;
    const alpha = 1 - (radius / maxRadius);
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = colors[i % colors.length];
    ctx.globalAlpha = alpha * (0.5 + val * 0.5 * settings.sensitivity);
    ctx.stroke();
  }
  ctx.globalAlpha = 1.0;
};
