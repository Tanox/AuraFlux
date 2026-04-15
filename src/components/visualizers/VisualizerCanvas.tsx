'use client';
// File: src\components\visualizers\VisualizerCanvas.tsx | Version: v2.2.25
import React, { useRef, useEffect } from 'react';
import { VisualizerMode, VisualizerSettings } from '@/types';
import { renderPlasmaMode } from './2d/plasma/PlasmaMode';
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
    const peaks = new Float32Array(bufferLength);

    // 初始化星星数量
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

    // 初始化
    const width = canvas.width;
    const height = canvas.height;
    initStars(width, height);

    let dataArrayR: Uint8Array<ArrayBuffer> | undefined;
    if (analyserR) {
      dataArrayR = new Uint8Array(analyserR.frequencyBinCount) as Uint8Array<ArrayBuffer>;
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

      // Only PlasmaMode is available
      renderPlasmaMode({
        ctx,
        dataArray,
        width,
        height,
        colors,
        sensitivity: settings.sensitivity
      });

      // 绘制应用名称和版本号（单行显示）
      ctx.font = '12px Inter, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      const appName = 'Aura Flux';
      const versionText = APP_VERSION;
      const padding = 16;
      
      // 单行显示应用名称和版本号
      const text = `${appName} ${versionText}`;
      ctx.fillText(text, width - padding, height - padding);
    };

    const parent = canvas.parentElement;
    if (!parent) return;

    const resizeObserver = new ResizeObserver(() => {
      canvas.width = parent.clientWidth * window.devicePixelRatio;
      canvas.height = parent.clientHeight * window.devicePixelRatio;
      // 重新初始化星星数据以适应新的画布尺寸
      initStars(canvas.width, canvas.height);
    });

    resizeObserver.observe(parent);
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      // 清理星星数据
      if (mode === VisualizerMode.STARFIELD) {
        starsRef.current = [];
      }
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

