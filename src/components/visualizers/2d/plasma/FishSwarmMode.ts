// src/components/visualizers/2d/plasma/FishSwarmMode.ts v2.3.11
import { FishSwarmModeProps } from '@/types';
import { FishSwarmManager, FrequencyData } from './FishSwarmManager';

// Use a Map to store multiple instances, avoiding global pollution
const fishSwarmManagers = new Map<string, { manager: FishSwarmManager; settings: string }>();

// Generate a unique key
const getManagerKey = (ctx: CanvasRenderingContext2D) => {
  // Use canvas reference as part of the key
  return String(ctx.canvas);
};

const extractFrequencyData = (dataArray: Uint8Array, sensitivity: number): FrequencyData => {
  const bassEnd = Math.floor(dataArray.length * 0.25);
  const midEnd = Math.floor(dataArray.length * 0.75);
  let bass = 0, mid = 0, treble = 0;

  for (let i = 0; i < dataArray.length; i++) {
    if (i < bassEnd) {
      bass += dataArray[i];
    } else if (i < midEnd) {
      mid += dataArray[i];
    } else {
      treble += dataArray[i];
    }
  }

  return {
    bass: (bass / (bassEnd * 255)) * sensitivity,
    mid: (mid / ((midEnd - bassEnd) * 255)) * sensitivity,
    treble: (treble / ((dataArray.length - midEnd) * 255)) * sensitivity,
  };
};

const renderFishParticle = (
  ctx: CanvasRenderingContext2D,
  particle: { x: number; y: number; z: number; size: number; color: string; rotation: number; trail: { x: number; y: number; z: number }[] },
  averageEnergy: number,
  trails: boolean,
  glow: boolean
) => {
  const scale = 1 + (particle.z / 200);
  const alpha = 0.8 + (particle.z / 400);
  const finalSize = particle.size * scale;

  // Render trail
  if (trails && particle.trail.length > 1) {
    ctx.save();
    ctx.globalAlpha = alpha * 0.5;
    ctx.strokeStyle = particle.color;
    ctx.lineWidth = finalSize * 0.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(particle.trail[0].x, particle.trail[0].y);

    for (let i = 1; i < particle.trail.length; i++) {
      const progress = i / (particle.trail.length - 1);
      const trailAlpha = 0.1 + (1 - progress) * 0.4;
      ctx.globalAlpha = alpha * trailAlpha;
      ctx.lineTo(particle.trail[i].x, particle.trail[i].y);
    }

    ctx.stroke();
    ctx.restore();
  }

  // Render fish shape
  ctx.save();
  ctx.translate(particle.x, particle.y);
  ctx.rotate(particle.rotation);
  ctx.globalAlpha = alpha;

  ctx.fillStyle = particle.color;
  ctx.beginPath();
  ctx.moveTo(finalSize * 0.5, 0);
  ctx.quadraticCurveTo(finalSize * 0.8, -finalSize * 0.2, finalSize * 1.2, -finalSize * 0.1);
  ctx.quadraticCurveTo(finalSize * 1.4, 0, finalSize * 1.2, finalSize * 0.1);
  ctx.quadraticCurveTo(finalSize * 0.8, finalSize * 0.2, finalSize * 0.5, 0);
  ctx.moveTo(finalSize * 0.3, -finalSize * 0.15);
  ctx.quadraticCurveTo(finalSize * 0.4, -finalSize * 0.3, finalSize * 0.5, -finalSize * 0.2);
  ctx.moveTo(finalSize * 0.3, finalSize * 0.15);
  ctx.quadraticCurveTo(finalSize * 0.4, finalSize * 0.3, finalSize * 0.5, finalSize * 0.2);
  ctx.moveTo(-finalSize * 0.1, 0);
  ctx.quadraticCurveTo(-finalSize * 0.2, -finalSize * 0.2, -finalSize * 0.4, 0);
  ctx.quadraticCurveTo(-finalSize * 0.2, finalSize * 0.2, -finalSize * 0.1, 0);
  ctx.fill();

  // Render glow
  if (glow) {
    ctx.globalAlpha = 0.6 * alpha * averageEnergy;
    const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, finalSize * 2);
    glowGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    glowGradient.addColorStop(0.3, particle.color);
    glowGradient.addColorStop(1, 'transparent');

    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(0, 0, finalSize * 2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
};

export const renderFishSwarmMode = ({
  ctx,
  dataArray,
  width,
  height,
  colors: _colors,
  settings
}: FishSwarmModeProps) => {
  const sensitivity = settings?.sensitivity || 1;
  const glow = settings?.glow ?? true;
  const trails = settings?.trails ?? true;
  const time = Date.now();
  const managerKey = getManagerKey(ctx);
  const settingsString = JSON.stringify(settings);

  let managerData = fishSwarmManagers.get(managerKey);
  if (!managerData || managerData.settings !== settingsString) {
    const manager = new FishSwarmManager(width, height, settings as Record<string, unknown>);
    managerData = { manager, settings: settingsString };
    fishSwarmManagers.set(managerKey, managerData);
  }

  const averageEnergy = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length / 255 * sensitivity;
  const frequencyData = extractFrequencyData(dataArray, sensitivity);

  managerData.manager.update(time, width, height, averageEnergy, frequencyData);
  const particles = managerData.manager.getParticles();

  ctx.save();
  ctx.globalCompositeOperation = 'screen';

  particles.forEach(particle => {
    renderFishParticle(ctx, particle, averageEnergy, trails, glow);
  });

  ctx.restore();
};
