/**
 * File: app/services/renderers/SpiralRenderer.ts
 * Version: v1.9.72
 * Author: Sut
 */

import { IVisualizerRenderer, VisualizerSettings, RenderContext } from '../../types/index.ts';
import { getAverage } from '../audioUtils.ts';

export class SpiralRenderer implements IVisualizerRenderer {
  init() {}

  draw(ctx: RenderContext, data: Uint8Array, w: number, h: number, colors: string[], settings: VisualizerSettings, rotation: number, beat: boolean) {
    if (colors.length === 0 || data.length === 0) return;

    const cx = w / 2;
    const cy = h / 2;
    const minDim = Math.min(w, h);
    
    // Audio metrics
    const bass = getAverage(data, 0, 10) / 255 * settings.sensitivity;
    
    const rot = rotation * settings.speed * 0.5;
    const points = settings.quality === 'high' ? 240 : 160;
    const spacing = (minDim * 0.48) / points;
    const baseRad = 5;

    ctx.save();
    // Fade trail for motion blur effect
    if (!settings.trails) ctx.clearRect(0, 0, w, h);
    
    ctx.lineCap = 'round';
    
    // Draw two interleaving spirals
    for (let j = 0; j < 2; j++) {
        const dir = j === 0 ? 1 : -1;
        const phaseOffset = j * Math.PI;
        
        ctx.beginPath();
        for (let i = 0; i < points; i++) {
            // Map spiral index to frequency spectrum
            const index = Math.floor((i / points) * data.length * 0.7); 
            const val = (data[index] || 0) / 255 * settings.sensitivity;
            
            const angle = (i * 0.15) + rot * dir + phaseOffset + (bass * 0.1 * dir);
            const r = baseRad + (i * spacing) * (1 + bass * 0.2);
            
            // Spiral coordinates
            const x = cx + Math.cos(angle) * r;
            const y = cy + Math.sin(angle) * r;
            
            const size = Math.max(1, (val * 25 * (i/points * 2)) + 1.5);
            const color = colors[(i + (beat ? 5 : 0)) % colors.length];
            
            ctx.fillStyle = color;
            ctx.globalAlpha = Math.min(1, 0.4 + val + (beat ? 0.3 : 0));
            
            ctx.moveTo(x + size, y);
            ctx.arc(x, y, size, 0, Math.PI * 2);
        }
        ctx.fill();
    }
    
    // Central beat pulse
    if (settings.glow) {
        ctx.shadowBlur = 30 * bass;
        ctx.shadowColor = colors[0];
        ctx.beginPath();
        ctx.arc(cx, cy, baseRad * 2 * (1 + bass), 0, Math.PI * 2);
        ctx.fillStyle = colors[0];
        // Fix: Added missing 'ctx.' reference to call the fill method on the render context
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    ctx.restore();
  }
}