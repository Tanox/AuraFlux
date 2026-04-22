import { useRef, useEffect, useState } from 'react';
import { logger } from '@/utils/logger';

interface AnimationLoopOptions {
  fpsTarget?: number;
  onFrame: (deltaTime: number, elapsedTime: number) => void;
  onPerformanceUpdate?: (fps: number) => void;
  enabled?: boolean;
}

interface AnimationLoopResult {
  isRunning: boolean;
  fps: number;
  start: () => void;
  stop: () => void;
}

export const useAnimationLoop = (options: AnimationLoopOptions): AnimationLoopResult => {
  const { fpsTarget = 60, onFrame, onPerformanceUpdate, enabled = true } = options;

  const [isRunning, setIsRunning] = useState(false);
  const [fps, setFps] = useState(60);

  const animationIdRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const elapsedTimeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const lastFpsUpdateRef = useRef<number>(0);

  const start = () => {
    if (isRunning) return;
    setIsRunning(true);
    lastFrameTimeRef.current = performance.now();
    elapsedTimeRef.current = 0;
    frameCountRef.current = 0;
    lastFpsUpdateRef.current = 0;

    const loop = (currentTime: number) => {
      if (!isRunning) return;

      try {
        const deltaTime = (currentTime - lastFrameTimeRef.current) / 1000;
        elapsedTimeRef.current += deltaTime;
        lastFrameTimeRef.current = currentTime;

        // 调用帧回调
        onFrame(deltaTime, elapsedTimeRef.current);

        // 计算FPS
        frameCountRef.current++;
        if (currentTime - lastFpsUpdateRef.current >= 1000) {
          const currentFps = frameCountRef.current;
          setFps(currentFps);
          if (onPerformanceUpdate) {
            onPerformanceUpdate(currentFps);
          }
          frameCountRef.current = 0;
          lastFpsUpdateRef.current = currentTime;
        }

        // 控制FPS
        const frameTime = 1000 / fpsTarget;
        const nextFrameTime = lastFrameTimeRef.current + frameTime;
        if (nextFrameTime > currentTime) {
          animationIdRef.current = requestAnimationFrame(loop);
        } else {
          // 如果当前帧超时，立即执行下一帧
          animationIdRef.current = requestAnimationFrame(loop);
        }
      } catch (error) {
        logger.error('Error in animation loop:', error);
        animationIdRef.current = requestAnimationFrame(loop);
      }
    };

    animationIdRef.current = requestAnimationFrame(loop);
  };

  const stop = () => {
    setIsRunning(false);
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    }
  };

  useEffect(() => {
    if (enabled && !isRunning) {
      start();
    } else if (!enabled && isRunning) {
      stop();
    }

    return () => {
      stop();
    };
  }, [enabled]);

  return {
    isRunning,
    fps,
    start,
    stop
  };
};