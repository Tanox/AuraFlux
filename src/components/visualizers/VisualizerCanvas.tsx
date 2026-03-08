// File: src/components/visualizers/VisualizerCanvas.tsx | Version: v2.0.3
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
        
        ctx.lineWidth = 3;
        const sliceWidth = width / bufferLength;
        
        for (let j = 0; j < 3; j++) {
          ctx.beginPath();
          ctx.strokeStyle = colors[j % colors.length];
          ctx.shadowBlur = 10;
          ctx.shadowColor = colors[j % colors.length];
          
          let x = 0;
          for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            // Add some offset based on the ribbon index
            const offset = Math.sin(i * 0.05 + Date.now() * 0.002 + j) * 20;
            const y = (v * height) / 2 + offset;
            
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
            
            x += sliceWidth;
          }
          ctx.lineTo(width, height / 2);
          ctx.stroke();
        }
        ctx.shadowBlur = 0; // Reset for other drawings
      } else if (mode === VisualizerMode.RINGS) {
        const centerX = width / 2;
        const centerY = height / 2;
        const maxRadius = Math.min(centerX, centerY) * 0.9;
        
        const numRings = 8;
        for (let i = 0; i < numRings; i++) {
          const dataIndex = Math.floor((i / numRings) * bufferLength);
          const val = dataArray[dataIndex] / 255;
          const radius = (maxRadius / numRings) * (i + 1) + (val * 50 * settings.sensitivity);
          
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
          ctx.lineWidth = 4 + val * 6;
          ctx.strokeStyle = colors[i % colors.length];
          ctx.shadowBlur = 10 + val * 20;
          ctx.shadowColor = colors[i % colors.length];
          ctx.stroke();
        }
        ctx.shadowBlur = 0;
      } else if (mode === VisualizerMode.PLASMA) {
        const time = Date.now() * 0.001;
        const centerX = width / 2;
        const centerY = height / 2;
        
        let average = 0;
        for (let i = 0; i < bufferLength; i++) {
          average += dataArray[i];
        }
        average = (average / bufferLength / 255) * settings.sensitivity;

        ctx.globalCompositeOperation = 'screen';
        
        for (let i = 0; i < 5; i++) {
          const dataIndex = Math.floor((i / 5) * bufferLength);
          const val = dataArray[dataIndex] / 255;
          
          const x = centerX + Math.sin(time + i) * (width * 0.3) * (1 + val * 0.2);
          const y = centerY + Math.cos(time * 0.8 + i) * (height * 0.3) * (1 + val * 0.2);
          const radius = (Math.min(width, height) * 0.4) * (0.5 + val * 0.5 + average * 0.5);
          
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
          gradient.addColorStop(0, colors[i % colors.length]);
          gradient.addColorStop(1, 'transparent');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalCompositeOperation = 'source-over';
      } else if (mode === VisualizerMode.NEBULA) {
        const time = Date.now() * 0.0005;
        const centerX = width / 2;
        const centerY = height / 2;
        
        let average = 0;
        for (let i = 0; i < bufferLength; i++) {
          average += dataArray[i];
        }
        average = (average / bufferLength / 255) * settings.sensitivity;

        ctx.globalCompositeOperation = 'lighter';
        
        for (let i = 0; i < 12; i++) {
          const dataIndex = Math.floor((i / 12) * bufferLength);
          const val = dataArray[dataIndex] / 255;
          
          const angle = time * (i % 2 === 0 ? 1 : -1) + (i * Math.PI * 2) / 12;
          const distance = (Math.min(width, height) * 0.2) * (1 + val + average);
          
          const x = centerX + Math.cos(angle) * distance;
          const y = centerY + Math.sin(angle) * distance;
          const radius = (Math.min(width, height) * 0.3) * (0.5 + val * 0.8);
          
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
          gradient.addColorStop(0, colors[i % colors.length]);
          gradient.addColorStop(1, 'transparent');
          
          ctx.globalAlpha = 0.6 + val * 0.4;
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1.0;
        ctx.globalCompositeOperation = 'source-over';
      } else if (mode === VisualizerMode.TUNNEL) {
        const time = Date.now() * 0.002;
        const centerX = width / 2;
        const centerY = height / 2;
        const maxRadius = Math.max(width, height);
        
        ctx.lineWidth = 2;
        for (let i = 0; i < 20; i++) {
          const dataIndex = Math.floor((i / 20) * bufferLength);
          const val = dataArray[dataIndex] / 255;
          
          const radius = (time * 100 + i * (maxRadius / 20)) % maxRadius;
          const alpha = 1 - (radius / maxRadius);
          
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          ctx.strokeStyle = colors[i % colors.length];
          ctx.globalAlpha = alpha * (0.5 + val * 0.5 * settings.sensitivity);
          ctx.stroke();
        }
        ctx.globalAlpha = 1.0;
      } else if (mode === VisualizerMode.FLUID_CURVES) {
        const time = Date.now() * 0.001;
        ctx.lineWidth = 3;
        
        for (let i = 0; i < 5; i++) {
          ctx.beginPath();
          ctx.strokeStyle = colors[i % colors.length];
          
          for (let x = 0; x < width; x += 10) {
            const dataIndex = Math.floor((x / width) * bufferLength);
            const val = dataArray[dataIndex] / 255;
            
            const y = height / 2 + Math.sin(x * 0.01 + time + i) * (height * 0.2) * (1 + val * settings.sensitivity);
            
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      } else if (mode === VisualizerMode.PARTICLES) {
        const time = Date.now() * 0.001;
        const centerX = width / 2;
        const centerY = height / 2;
        
        ctx.globalCompositeOperation = 'screen';
        
        for (let i = 0; i < 100; i++) {
          const dataIndex = Math.floor((i / 100) * bufferLength);
          const val = dataArray[dataIndex] / 255;
          
          const angle = (i * Math.PI * 2) / 100 + time * 0.1;
          const distance = (Math.min(width, height) * 0.4) * Math.random() * (1 + val * settings.sensitivity);
          
          const x = centerX + Math.cos(angle) * distance;
          const y = centerY + Math.sin(angle) * distance;
          
          ctx.fillStyle = colors[i % colors.length];
          ctx.beginPath();
          ctx.arc(x, y, 2 + val * 5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalCompositeOperation = 'source-over';
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
