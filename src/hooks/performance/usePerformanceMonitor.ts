// src/hooks/performance/usePerformanceMonitor.ts v2.3.9
import { useRef, useEffect, useState, useCallback } from 'react';

interface PerformanceMonitorOptions {
  updateInterval?: number;
  lowPerformanceThreshold?: number;
  highPerformanceThreshold?: number;
  warningThreshold?: number;
  maxHistoryLength?: number;
  onPerformanceWarning?: (data: PerformanceData) => void;
  warningCooldown?: number;
}

interface PerformanceData {
  fps: number;
  isLowPerformance: boolean;
  isHighPerformance: boolean;
  isWarning: boolean;
  frameCount: number;
  averageFps: number;
  minFps: number;
  maxFps: number;
  frameTime: number;
  averageFrameTime: number;
  cpuUsage?: number;
  memoryUsage?: number;
}

export const usePerformanceMonitor = (options: PerformanceMonitorOptions = {}) => {
  const {
    updateInterval = 1000,
    lowPerformanceThreshold = 30,
    highPerformanceThreshold = 50,
    warningThreshold = 35,
    maxHistoryLength = 30,
    onPerformanceWarning,
    warningCooldown = 5000
  } = options;

  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    fps: 60,
    isLowPerformance: false,
    isHighPerformance: true,
    isWarning: false,
    frameCount: 0,
    averageFps: 60,
    minFps: 60,
    maxFps: 60,
    frameTime: 16.67,
    averageFrameTime: 16.67
  });

  const performanceRef = useRef({
    lastFrameTime: performance.now(),
    frameCount: 0,
    lastUpdateTime: performance.now(),
    fpsHistory: [] as number[],
    frameTimeHistory: [] as number[],
    maxHistoryLength,
    lastWarningTime: 0,
    minFps: 60,
    maxFps: 60,
    totalFrameTime: 0
  });

  const calculateAverage = (arr: number[]): number => {
    if (arr.length === 0) return 0;
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
      sum += arr[i];
    }
    return sum / arr.length;
  };

  const updatePerformance = useCallback(() => {
    const currentTime = performance.now();
    const deltaTime = currentTime - performanceRef.current.lastFrameTime;
    performanceRef.current.lastFrameTime = currentTime;
    performanceRef.current.frameCount++;
    performanceRef.current.totalFrameTime += deltaTime;

    performanceRef.current.frameTimeHistory.push(deltaTime);
    if (performanceRef.current.frameTimeHistory.length > performanceRef.current.maxHistoryLength) {
      performanceRef.current.frameTimeHistory.shift();
    }

    if (currentTime - performanceRef.current.lastUpdateTime >= updateInterval) {
      const elapsed = currentTime - performanceRef.current.lastUpdateTime;
      const fps = Math.round((performanceRef.current.frameCount * 1000) / elapsed);

      performanceRef.current.fpsHistory.push(fps);
      if (performanceRef.current.fpsHistory.length > performanceRef.current.maxHistoryLength) {
        performanceRef.current.fpsHistory.shift();
      }

      performanceRef.current.minFps = Math.min(performanceRef.current.minFps, fps);
      performanceRef.current.maxFps = Math.max(performanceRef.current.maxFps, fps);

      const averageFps = Math.round(calculateAverage(performanceRef.current.fpsHistory));
      const averageFrameTime = calculateAverage(performanceRef.current.frameTimeHistory);

      const isLowPerformance = fps < lowPerformanceThreshold;
      const isHighPerformance = fps > highPerformanceThreshold;
      const isWarning = fps < warningThreshold;

      const shouldTriggerWarning = isWarning && 
        onPerformanceWarning && 
        currentTime - performanceRef.current.lastWarningTime > warningCooldown;

      if (shouldTriggerWarning) {
        performanceRef.current.lastWarningTime = currentTime;
      }

      const newData: PerformanceData = {
        fps,
        isLowPerformance,
        isHighPerformance,
        isWarning,
        frameCount: performanceRef.current.frameCount,
        averageFps,
        minFps: performanceRef.current.minFps,
        maxFps: performanceRef.current.maxFps,
        frameTime: deltaTime,
        averageFrameTime
      };

      setPerformanceData(newData);

      if (shouldTriggerWarning) {
        onPerformanceWarning(newData);
      }

      performanceRef.current.frameCount = 0;
      performanceRef.current.lastUpdateTime = currentTime;
      performanceRef.current.totalFrameTime = 0;
    }
  }, [updateInterval, lowPerformanceThreshold, highPerformanceThreshold, warningThreshold, onPerformanceWarning, warningCooldown]);

  useEffect(() => {
    const animationId = requestAnimationFrame(function animate() {
      updatePerformance();
      requestAnimationFrame(animate);
    });

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [updatePerformance]);

  return performanceData;
};