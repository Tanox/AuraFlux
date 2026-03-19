// File: src/components/visualizers/canvas/modes/ParticlesMode.ts | Version: v1.0.0
import { VisualizerSettings } from '@/src/types';

export const drawParticles = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  dataArray: Uint8Array,
  bufferLength: number,
  colors: string[],
  settings: VisualizerSettings
) => {
  // Optimized Starfield: Particles move forward (Z-axis simulation)
  const time = Date.now() * 0.001;
  const centerX = width / 2;
  const centerY = height / 2;
  
  ctx.globalCompositeOperation = 'screen';
  
  let bass = 0;
  for (let i = 0; i < 10; i++) bass += dataArray[i];
  bass = (bass / 10 / 255) * settings.sensitivity;

  for (let i = 0; i < 150; i++) {
    const dataIndex = Math.floor((i / 150) * bufferLength);
    const val = dataArray[dataIndex] / 255;
    
    // Use i as a seed for consistent "random" properties
    const seed = i * 137.5; 
    const angle = (seed % 360) * (Math.PI / 180);
    
    // Simulate Z movement: speed increases with time and bass
    const speed = 0.05 + bass * 0.1;
    const zProgress = (time * speed + (i / 150)) % 1; // 0 to 1
    
    // Perspective projection: distance from center increases as zProgress increases
    const distance = zProgress * Math.max(width, height) * 0.8;
    
    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance;
    
    // Size also increases as they get "closer"
    const size = zProgress * (2 + val * 8);
    
    // Meteor trail: draw line from current position to a point behind it
    const trailLength = size * 50; // Long trails
    const prevX = centerX + Math.cos(angle) * (distance - trailLength);
    const prevY = centerY + Math.sin(angle) * (distance - trailLength);
    
    // Fade in and out
    const alpha = zProgress < 0.2 ? zProgress * 5 : (zProgress > 0.8 ? (1 - zProgress) * 5 : 1);
    
    ctx.globalAlpha = alpha * 0.5; // Make trail slightly transparent
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = colors[i % colors.length];
    ctx.lineWidth = size * 0.5; // Trail is slightly thinner
    ctx.stroke();
    
    ctx.globalAlpha = alpha;
    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1.0;
  ctx.globalCompositeOperation = 'source-over';
};
