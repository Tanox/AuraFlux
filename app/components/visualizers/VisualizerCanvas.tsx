/**
 * File: app/components/visualizers/VisualizerCanvas.tsx
 * Version: v1.9.36
 * Author: Sut
 */

import React, { useRef, useEffect } from 'react';
import { VisualizerMode, VisualizerSettings, WorkerMessage } from '../../types';

interface VisualizerCanvasProps {
  analyser: AnalyserNode | null;
  analyserR?: AnalyserNode | null;
  mode: VisualizerMode;
  colors: string[];
  settings: VisualizerSettings;
}

const VisualizerCanvas: React.FC<VisualizerCanvasProps> = ({
  analyser, analyserR, mode, colors, settings
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workerRef = useRef<Worker | null>(null);
  const animationFrameId = useRef<number>(0);

  // Use a ref to hold latest props to avoid re-triggering useEffect
  const propsRef = useRef({ mode, colors, settings });
  useEffect(() => {
    propsRef.current = { mode, colors, settings };
  }, [mode, colors, settings]);

  // Initialize and manage worker lifecycle
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Terminate existing worker if it exists
    if (workerRef.current) {
        workerRef.current.terminate();
    }
    
    // Create a new worker instance
    const worker = new Worker(new URL('../../workers/visualizer.worker.ts', import.meta.url), {
      type: 'module'
    });
    workerRef.current = worker;
    
    // Setup offscreen canvas and initialize worker
    const setup = () => {
      try {
        const offscreen = canvas.transferControlToOffscreen();
        const dpr = window.devicePixelRatio || 1;
        const initMessage: WorkerMessage = {
          type: 'INIT',
          canvas: offscreen,
          width: canvas.clientWidth,
          height: canvas.clientHeight,
          devicePixelRatio: dpr
        };
        worker.postMessage(initMessage, [offscreen]);
      } catch (e) {
        console.error("Failed to transfer canvas to worker. Fallback might be needed.", e);
        // In a real-world scenario, you might implement a fallback main-thread renderer here.
      }
    };
    
    setup();

    // Handle resizing
    const resizeObserver = new ResizeObserver(entries => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      const dpr = window.devicePixelRatio || 1;
      worker.postMessage({ type: 'RESIZE', width, height, devicePixelRatio: dpr } as WorkerMessage);
    });
    resizeObserver.observe(canvas);

    return () => {
      resizeObserver.disconnect();
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  // Main animation loop
  useEffect(() => {
    if (!analyser) return;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const dataArrayR = analyserR ? new Uint8Array(analyserR.frequencyBinCount) : undefined;
    
    let lastConfigSent = '';

    const loop = () => {
      const { mode, colors, settings } = propsRef.current;
      const configKey = `${mode}-${colors.join('-')}-${JSON.stringify(settings)}`;

      if (workerRef.current) {
        // Send config changes only when necessary
        if (configKey !== lastConfigSent) {
          workerRef.current.postMessage({ type: 'CONFIG', mode, settings, colors } as WorkerMessage);
          lastConfigSent = configKey;
        }

        // Send frame data
        analyser.getByteFrequencyData(dataArray);
        if (analyserR && dataArrayR) {
          analyserR.getByteFrequencyData(dataArrayR);
        }
        
        workerRef.current.postMessage({ type: 'FRAME', data: dataArray, dataR: dataArrayR } as WorkerMessage);
      }
      
      animationFrameId.current = requestAnimationFrame(loop);
    };

    animationFrameId.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [analyser, analyserR]);

  return <canvas id="visualizer-canvas-2d" ref={canvasRef} className="w-full h-full" />;
};

export default VisualizerCanvas;