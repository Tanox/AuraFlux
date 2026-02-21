// File: app/services/visualizerStrategies.ts | Version: v1.9.73
import { VisualizerMode, IVisualizerRenderer } from '../types/index.ts';
import { BarsRenderer } from './renderers/BarsRenderer.ts';
import { RingsRenderer } from './renderers/RingsRenderer.ts';
import { FluidCurvesRenderer } from './renderers/FluidCurvesRenderer.ts';
import { ParticlesRenderer } from './renderers/ParticlesRenderer.ts';
import { NebulaRenderer } from './renderers/NebulaRenderer.ts';
import { TunnelRenderer } from './renderers/GeometryRenderers.ts';
import { PlasmaRenderer } from './renderers/PlasmaRenderer.ts';
import { LasersRenderer } from './renderers/LasersRenderer.ts';
import { WaveformRenderer } from './renderers/WaveformRenderer.ts';
import { RippleRenderer } from './renderers/RippleRenderer.ts';
import { SpiralRenderer } from './renderers/SpiralRenderer.ts';

export { 
  BarsRenderer, RingsRenderer, FluidCurvesRenderer, 
  ParticlesRenderer, NebulaRenderer, TunnelRenderer, PlasmaRenderer, 
  LasersRenderer, WaveformRenderer, RippleRenderer, SpiralRenderer
};

export { BeatDetector } from './beatDetector.ts';

export const createVisualizerRenderers = (): Record<string, IVisualizerRenderer> => ({
  [VisualizerMode.BARS]: new BarsRenderer(),
  [VisualizerMode.RINGS]: new RingsRenderer(),
  [VisualizerMode.PARTICLES]: new ParticlesRenderer(),
  [VisualizerMode.TUNNEL]: new TunnelRenderer(),
  [VisualizerMode.PLASMA]: new PlasmaRenderer(),
  [VisualizerMode.NEBULA]: new NebulaRenderer(),
  [VisualizerMode.LASERS]: new LasersRenderer(),
  [VisualizerMode.FLUID_CURVES]: new FluidCurvesRenderer(),
  [VisualizerMode.WAVEFORM]: new WaveformRenderer(),
  [VisualizerMode.RIPPLES]: new RippleRenderer(),
  [VisualizerMode.SPIRAL]: new SpiralRenderer(),
});