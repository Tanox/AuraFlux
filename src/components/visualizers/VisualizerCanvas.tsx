// File: src/components/visualizers/VisualizerCanvas.tsx | Version: v1.9.82
import React, { useRef, useEffect } from 'react';
import { VisualizerMode, VisualizerSettings } from '@/src/types';

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

      if (mode === VisualizerMode.BARS) {
        const barWidth = (width / bufferLength) * 2.5;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * height * settings.sensitivity;
          
          // Peak caps
          if (barHeight > peaks[i]) {
            peaks[i] = barHeight;
          } else {
            peaks[i] -= 1.5; // Slow fall speed
          }
          if (peaks[i] < 0) peaks[i] = 0;

          ctx.fillStyle = colors[i % colors.length];
          ctx.fillRect(x, height - barHeight, barWidth, barHeight);
          
          // Draw peak cap
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x, height - peaks[i] - 2, barWidth, 2);

          x += barWidth + 1;
        }
      } else if (mode === VisualizerMode.WAVEFORM) {
        analyser.getByteTimeDomainData(dataArray);
        ctx.beginPath();
        ctx.lineWidth = 6; // Increased from 2
        ctx.strokeStyle = colors[0];
        ctx.shadowBlur = 15;
        ctx.shadowColor = colors[0];
        
        const sliceWidth = width / bufferLength;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * height) / 2;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          x += sliceWidth;
        }
        ctx.lineTo(width, height / 2);
        ctx.stroke();
        ctx.shadowBlur = 0; // Reset for other drawings
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
