// File: src/components/visualizers/canvas/modes/PlasmaMode.ts | Version: v1.0.0
import { VisualizerSettings } from '@/src/types';

export const drawPlasma = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  dataArray: Uint8Array,
  bufferLength: number,
  colors: string[],
  settings: VisualizerSettings
) => {
  const time = Date.now() * 0.001;
  const centerX = width / 2;
  const centerY = height / 2;
  
  let average = 0;
  for (let i = 0; i < bufferLength; i++) {
    average += dataArray[i];
  }
  average = (average / bufferLength / 255) * settings.sensitivity;

  ctx.globalCompositeOperation = 'screen';
  
  for (let i = 0; i < 20; i++) { // Increase number of particles
    const dataIndex = Math.floor((i / 20) * bufferLength);
    const val = dataArray[dataIndex] / 255;
    
    // Siri-like organic random movement
    const noiseX = Math.sin(time * 0.5 + i * 1.2) * Math.cos(time * 0.3 + i * 0.8);
    const noiseY = Math.cos(time * 0.4 + i * 1.5) * Math.sin(time * 0.6 + i * 0.9);
    
    const x = centerX + noiseX * (width * 0.4) * (1 + val * 0.5); // Fill screen
    const y = centerY + noiseY * (height * 0.4) * (1 + val * 0.5); // Fill screen
    const radius = (Math.min(width, height) * 0.6) * (0.8 + val * 0.8 + average * 0.8); // Increase size
    
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, colors[i % colors.length]);
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalCompositeOperation = 'source-over';
};
