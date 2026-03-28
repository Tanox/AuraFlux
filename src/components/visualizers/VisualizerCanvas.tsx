'use client';
// File: src/components/visualizers/VisualizerCanvas.tsx | Version: v2.0.4
import React, { useRef, useEffect } from 'react';
import { VisualizerMode, VisualizerSettings } from '@/types';
import { renderBarsMode } from './modes/BarsMode';
import { renderWaveformMode } from './modes/WaveformMode';
import { renderRingsMode } from './modes/RingsMode';
import { renderPlasmaMode } from './modes/PlasmaMode';
import { renderNebulaMode } from './modes/NebulaMode';
import { renderTunnelMode } from './modes/TunnelMode';
import { renderFluidCurvesMode } from './modes/FluidCurvesMode';
import { renderParticlesMode } from './modes/ParticlesMode';

interface Props {
  analyser: AnalyserNode | null;
  analyserR: AnalyserNode | null;
  colors: string[];
  settings: VisualizerSettings;
  mode: VisualizerMode;
}

const VisualizerCanvas: React.FC<Props> = ({ analyser, colors, settings, mode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !analyser) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const peaks = new Float32Array(bufferLength);

    const draw = () => {
      animationId = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      switch (mode) {
        case VisualizerMode.BARS:
          renderBarsMode({
            ctx,
            dataArray,
            peaks,
            width,
            height,
            colors,
            sensitivity: settings.sensitivity
          });
          break;
        case VisualizerMode.WAVEFORM:
          renderWaveformMode({
            ctx,
            dataArray,
            width,
            height,
            colors,
            analyser
          });
          break;
        case VisualizerMode.RINGS:
          renderRingsMode({
            ctx,
            dataArray,
            width,
            height,
            colors,
            sensitivity: settings.sensitivity
          });
          break;
        case VisualizerMode.PLASMA:
          renderPlasmaMode({
            ctx,
            dataArray,
            width,
            height,
            colors,
            sensitivity: settings.sensitivity
          });
          break;
        case VisualizerMode.NEBULA:
          renderNebulaMode({
            ctx,
            dataArray,
            width,
            height,
            colors,
            sensitivity: settings.sensitivity
          });
          break;
        case VisualizerMode.TUNNEL:
          renderTunnelMode({
            ctx,
            dataArray,
            width,
            height,
            colors,
            sensitivity: settings.sensitivity
          });
          break;
        case VisualizerMode.FLUID_CURVES:
          renderFluidCurvesMode({
            ctx,
            dataArray,
            width,
            height,
            colors,
            sensitivity: settings.sensitivity
          });
          break;
        case VisualizerMode.PARTICLES:
          renderParticlesMode({
            ctx,
            dataArray,
            width,
            height,
            colors,
            sensitivity: settings.sensitivity
          });
          break;
      }
    };

    const parent = canvas.parentElement;
    if (!parent) return;

    const resizeObserver = new ResizeObserver(() => {
      canvas.width = parent.clientWidth * window.devicePixelRatio;
      canvas.height = parent.clientHeight * window.devicePixelRatio;
    });

    resizeObserver.observe(parent);
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, [analyser, colors, settings.sensitivity, mode]);

  return (
    <canvas 
      ref={canvasRef} 
      id="visualizer-canvas-2d"
      className="absolute inset-0 w-full h-full block"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default VisualizerCanvas;
