/**
 * File: app/services/renderers/GeometryRenderers.ts
 * Version: v1.9.73
 * Author: Sut
 */

import { IVisualizerRenderer, VisualizerSettings, RenderContext } from '../../types/index.ts';
import { getAverage } from '../audioUtils.ts';

interface RingPoint { x: number; y: number; }
interface RingData {
    z: number; scale: number; alpha: number; lineWidth: number; color: string;
    points: RingPoint[];
}

interface Star { x: number; y: number; z: number; size: number; speed: number; }
interface WarpLine { x: number; y: number; length: number; speed: number; }

export class TunnelRenderer implements IVisualizerRenderer {
  private sinCache: Float32Array = new Float32Array(0);
  private cosCache: Float32Array = new Float32Array(0);
  private stars: Star[] = [];
  private warpLines: WarpLine[] = [];
  private beatPulse = 0;
  
  // Temporal Smoothing States
  private lastBass = 0;
  private lastTreble = 0;
  private lastAudioAmp = 0;

  init() { 
    this.sinCache = new Float32Array(0); 
    this.cosCache = new Float32Array(0);
    this.stars = [];
    this.warpLines = [];
    this.beatPulse = 0;
    this.lastBass = 0;
    this.lastTreble = 0;
    this.lastAudioAmp = 0;
  }

  private updateCache(sides: number) {
    if (this.sinCache.length === sides + 1) return;
    this.sinCache = new Float32Array(sides + 1);
    this.cosCache = new Float32Array(sides + 1);
    for (let j = 0; j <= sides; j++) {
      const theta = (j / sides) * Math.PI * 2;
      this.sinCache[j] = Math.sin(theta);
      this.cosCache[j] = Math.cos(theta);
    }
  }

  private initElements(w: number, h: number) {
      this.stars = [];
      for(let i=0; i<150; i++) {
          this.stars.push({
              x: (Math.random() - 0.5) * 3000,
              y: (Math.random() - 0.5) * 3000,
              z: Math.random() * 2000,
              size: 0.5 + Math.random() * 2.5,
              speed: 5 + Math.random() * 20
          });
      }
      this.warpLines = [];
      for(let i=0; i<15; i++) {
          this.warpLines.push({
              x: (Math.random() - 0.5) * w,
              y: (Math.random() - 0.5) * h,
              length: 100 + Math.random() * 400,
              speed: 20 + Math.random() * 40
          });
      }
  }

  draw(ctx: RenderContext, data: Uint8Array, w: number, h: number, colors: string[], settings: VisualizerSettings, rotation: number, beat: boolean) {
    if (colors.length === 0 || w <= 0 || h <= 0) return;
    
    if (this.stars.length === 0) this.initElements(w, h);

    const cx = w / 2, cy = h / 2, minDim = Math.min(w, h);
    const qualityFactor = settings.quality === 'high' ? 1 : (settings.quality === 'med' ? 0.7 : 0.5);
    const rings = Math.floor(28 * qualityFactor);
    const sides = Math.floor(32 * qualityFactor);
    this.updateCache(sides);
    
    // v1.9.2 Smoothing Logic
    const targetBass = getAverage(data, 0, 20) / 255 * settings.sensitivity;
    const targetTreble = getAverage(data, 100, 255) / 255 * settings.sensitivity;
    
    // Smooth factor based on settings.smoothing, default to 0.15 for high responsiveness but no jitter
    const sFactor = 1.0 - (settings.smoothing || 0.8) * 0.8; 
    this.lastBass += (targetBass - this.lastBass) * sFactor;
    this.lastTreble += (targetTreble - this.lastTreble) * sFactor;
    
    const bass = this.lastBass;
    const treble = this.lastTreble;
    
    if (beat) this.beatPulse = 1.0;
    this.beatPulse *= 0.92;

    const fovBase = Math.max(w, h) * 0.8;
    const fov = fovBase * (1.0 - bass * 0.4); 
    const zSpacing = 150, maxDepth = rings * zSpacing, virtualTime = rotation * 1500 * settings.speed; 

    ctx.save();
    
    // 1. Hyper-warp Lines
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineWidth = 1.5;
    this.warpLines.forEach(l => {
        l.length += l.speed * settings.speed * (1 + bass * 2);
        if (l.length > w * 1.5) {
            l.x = (Math.random() - 0.5) * w * 0.5;
            l.y = (Math.random() - 0.5) * h * 0.5;
            l.length = 10;
        }
        const grad = ctx.createLinearGradient(cx + l.x, cy + l.y, cx + l.x + l.length * 0.2, cy + l.y);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(1, `${colors[0]}44`);
        ctx.strokeStyle = grad;
        ctx.beginPath();
        ctx.moveTo(cx + l.x, cy + l.y);
        ctx.lineTo(cx + l.x + l.length, cy + l.y);
        ctx.stroke();
    });

    // 2. Stars
    this.stars.forEach(s => {
        s.z -= (s.speed * (1 + bass * 3) * settings.speed);
        if (s.z <= 10) s.z = 2000;
        const scale = fov / (fov + s.z);
        const x = cx + s.x * scale, y = cy + s.y * scale;
        const alpha = Math.min(1.0, (1.0 - s.z / 2000) * 1.5);
        ctx.fillStyle = colors[Math.floor(s.z % colors.length)];
        ctx.globalAlpha = alpha * 0.5;
        ctx.beginPath();
        ctx.arc(x, y, s.size * scale * (1 + treble * 6), 0, Math.PI * 2);
        ctx.fill();
    });

    // 3. Central Flare
    ctx.translate(cx, cy);
    const flareSize = (minDim * 0.1 + (bass + this.beatPulse) * (minDim * 0.2));
    const flareGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, flareSize);
    flareGrad.addColorStop(0, colors[1] || '#fff');
    flareGrad.addColorStop(0.5, `${colors[0]}22`);
    flareGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = flareGrad;
    ctx.globalAlpha = 0.4 + this.beatPulse * 0.4;
    ctx.beginPath(); ctx.arc(0, 0, flareSize, 0, Math.PI * 2); ctx.fill();

    // 4. Rings Data Generation
    const ringList: RingData[] = [];
    const baseR = minDim * 0.5;
    const targetAudioAmp = minDim * 0.4 * settings.sensitivity;
    this.lastAudioAmp += (targetAudioAmp - this.lastAudioAmp) * 0.1; // Extra smoothing for the structural radius
    
    for (let i = 0; i < rings; i++) {
        let z = (i * zSpacing - virtualTime) % maxDepth;
        if (z < 0) z += maxDepth;
        if (z < 10) continue; 

        const scale = fov / (fov + z);
        const finalAlpha = Math.pow(1.0 - (z / maxDepth), 1.5) * (0.5 + bass * 0.5);
        if (finalAlpha < 0.05) continue;

        const twist = z * 0.0015 - rotation * 0.2, cT = Math.cos(twist), sT = Math.sin(twist);
        const lineWidth = Math.max(1.0, 18.0 * Math.pow(scale, 1.8) * (1 + bass));
        const points: RingPoint[] = [];
        
        for (let j = 0; j < sides; j++) {
            // Sampling multiple bins to average out single-bin noise
            const binBase = Math.floor((j/sides)*120);
            const freqVal = (getAverage(data, binBase, binBase + 4)) / 255;
            const r = (baseR + freqVal * this.lastAudioAmp) * scale;
            points.push({ 
                x: (this.cosCache[j]*cT - this.sinCache[j]*sT) * r, 
                y: (this.cosCache[j]*sT + this.sinCache[j]*cT) * r 
            });
        }
        ringList.push({ z, scale, alpha: finalAlpha, lineWidth, color: colors[i % colors.length], points });
    }

    ringList.sort((a, b) => b.z - a.z);

    // 5. Draw Rings and Connections
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.globalAlpha = 0.2;
    for (let i = 0; i < ringList.length - 1; i++) {
        const curr = ringList[i], next = ringList[i+1];
        if (Math.abs(curr.z - next.z) > zSpacing * 1.5) continue;
        ctx.strokeStyle = curr.color;
        ctx.lineWidth = (curr.lineWidth + next.lineWidth) * 0.3;
        for (let j = 0; j < sides; j += 4) { // Only connect every 4th vertex for cleaner looks
            ctx.beginPath();
            ctx.moveTo(curr.points[j].x, curr.points[j].y);
            ctx.lineTo(next.points[j].x, next.points[j].y);
            ctx.stroke();
        }
    }

    ringList.forEach(ring => {
        ctx.beginPath();
        ctx.globalAlpha = ring.alpha;
        ctx.strokeStyle = ring.color;
        ctx.lineWidth = ring.lineWidth;
        
        if (settings.glow) {
            ctx.shadowBlur = ring.lineWidth * 3;
            ctx.shadowColor = ring.color;
        }

        const pts = ring.points;
        ctx.moveTo((pts[0].x + pts[pts.length-1].x) / 2, (pts[0].y + pts[pts.length-1].y) / 2);
        for (let i = 0; i < pts.length; i++) {
            const next = pts[(i + 1) % pts.length];
            const midX = (pts[i].x + next.x) / 2;
            const midY = (pts[i].y + next.y) / 2;
            ctx.quadraticCurveTo(pts[i].x, pts[i].y, midX, midY);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
    });

    ctx.restore();
  }
}