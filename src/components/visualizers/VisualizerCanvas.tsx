// File: src/components/visualizers/VisualizerCanvas.tsx | Version: v2.1.0
import React, { useRef, useEffect } from 'react';
import { VisualizerMode, VisualizerSettings } from '@/src/types';
import { drawBars } from './canvas/modes/BarsMode';
import { drawWaveform } from './canvas/modes/WaveformMode';
import { drawPlasma } from './canvas/modes/PlasmaMode';
import { drawTunnel } from './canvas/modes/TunnelMode';
import { drawParticles } from './canvas/modes/ParticlesMode';

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
          drawBars(ctx, width, height, dataArray, bufferLength, colors, settings, peaks);
          break;
        case VisualizerMode.WAVEFORM:
          drawWaveform(ctx, width, height, dataArray, bufferLength, colors, settings);
          break;
        case VisualizerMode.PLASMA:
          drawPlasma(ctx, width, height, dataArray, bufferLength, colors, settings);
          break;
        case VisualizerMode.TUNNEL:
          drawTunnel(ctx, width, height, dataArray, bufferLength, colors, settings);
          break;
        case VisualizerMode.PARTICLES:
          drawParticles(ctx, width, height, dataArray, bufferLength, colors, settings);
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
  }, [analyser, colors, settings, mode]);

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
