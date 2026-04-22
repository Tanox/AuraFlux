'use client';
// File: src\components\visualizers\VisualizerCanvas.tsx | Version: v2.3.0
import React, { useRef, useEffect } from 'react';
import { VisualizerMode, VisualizerSettings } from '@/types';
import { renderPlasmaMode } from './2d/plasma/PlasmaMode';
import { renderFishSwarmMode } from './2d/plasma/FishSwarmMode';
import { renderBarsMode } from './2d/bars/BarsMode';
import { renderStarfieldMode } from './2d/starfield/StarfieldMode';
import { renderTunnelMode } from './2d/tunnel/TunnelMode';
import { renderWaveformMode } from './2d/waveform/WaveformMode';
import { APP_VERSION } from '@/constants/version';

interface Props {
  analyser: AnalyserNode | null;
  analyserR: AnalyserNode | null;
  colors: string[];
  settings: VisualizerSettings;
  mode: VisualizerMode;
}

const VisualizerCanvas: React.FC<Props> = ({ analyser, analyserR, colors, settings, mode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<any[]>([]);

  useEffect(() => {
    if (!canvasRef.current || !analyser) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // Initialize star count
    const initStars = (width: number, height: number) => {
      if (mode === VisualizerMode.STARFIELD) {
        starsRef.current = [];
        const starCount = 200;
        for (let i = 0; i < starCount; i++) {
          starsRef.current.push({
            x: Math.random() * width,
            y: Math.random() * height,
            z: Math.random() * 1000,
            size: Math.random() * 3 + 1,
            speed: Math.random() * 2 + 0.5,
            brightness: Math.random() * 0.8 + 0.2
          });
        }
      }
    };

    // Initialize
    const width = canvas.width;
    const height = canvas.height;
    initStars(width, height);

    let dataArrayR: any;
    if (analyserR) {
      dataArrayR = new Uint8Array(analyserR.frequencyBinCount);
    }

    const draw = () => {
      animationId = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      if (analyserR && dataArrayR) {
        analyserR.getByteFrequencyData(dataArrayR);
      }

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Select corresponding rendering function based on mode
      switch (mode) {
        case VisualizerMode.BARS:
          renderBarsMode({
            ctx, dataArray, width, height, colors, settings
          });
          break;
        case VisualizerMode.PLASMA:
          renderPlasmaMode({
            ctx, dataArray, width, height, colors, settings
          });
          break;
        case VisualizerMode.STARFIELD:
          renderStarfieldMode({
            ctx, dataArray, width, height, colors, settings, stars: starsRef.current
          });
          break;
        case VisualizerMode.TUNNEL:
          renderTunnelMode({
            ctx, dataArray, width, height, colors, settings
          });
          break;
        case VisualizerMode.WAVEFORM:
          renderWaveformMode({
            ctx, dataArray, dataArrayR, width, height, colors, settings
          });
          break;
        case VisualizerMode.FISH_SWARM:
          renderFishSwarmMode({
            ctx, dataArray, width, height, colors, settings
          });
          break;
        default:
          renderPlasmaMode({
            ctx, dataArray, width, height, colors, settings
          });
          break;
      }

      // Draw application name and version (single-line display)
      ctx.font = '12px Inter, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      const appName = 'Aura Flux';
      const versionText = APP_VERSION;
      const padding = 16;
      
      // Single-line display app name and version
      const text = `${appName} ${versionText}`;
      ctx.fillText(text, width - padding, height - padding);
    };

    const parent = canvas.parentElement;
    if (!parent) return;

    const resizeObserver = new ResizeObserver(() => {
      canvas.width = parent.clientWidth * window.devicePixelRatio;
      canvas.height = parent.clientHeight * window.devicePixelRatio;
      // Reinitialize star data to adapt to new canvas size
      initStars(canvas.width, canvas.height);
    });

    resizeObserver.observe(parent);
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      // Clear star data
      if (mode === VisualizerMode.STARFIELD) {
        starsRef.current = [];
      }
    };
  }, [analyser, analyserR, colors, settings, mode]);

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

