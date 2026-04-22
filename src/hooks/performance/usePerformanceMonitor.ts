import { useRef, useEffect, useState } from 'react';

interface PerformanceMonitorOptions {
  updateInterval?: number;
  lowPerformanceThreshold?: number;
  highPerformanceThreshold?: number;
}

interface PerformanceData {
  fps: number;
  isLowPerformance: boolean;
  isHighPerformance: boolean;
  frameCount: number;
  averageFps: number;
}

export const usePerformanceMonitor = (options: PerformanceMonitorOptions = {}) => {
  const {
    updateInterval = 1000,
    lowPerformanceThreshold = 30,
    highPerformanceThreshold = 50
  } = options;

  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    fps: 60,
    isLowPerformance: false,
    isHighPerformance: true,
    frameCount: 0,
    averageFps: 60
  });

  const performanceRef = useRef({
    lastFrameTime: performance.now(),
    frameCount: 0,
    lastUpdateTime: performance.now(),
    fpsHistory: [] as number[],
    maxHistoryLength: 10
  });

  const updatePerformance = () => {
    const currentTime = performance.now();
    const deltaTime = currentTime - performanceRef.current.lastFrameTime;
    performanceRef.current.lastFrameTime = currentTime;
    performanceRef.current.frameCount++;

    if (currentTime - performanceRef.current.lastUpdateTime > updateInterval) {
      const fps = Math.round((performanceRef.current.frameCount * 1000) / (currentTime - performanceRef.current.lastUpdateTime));
      
      // Update FPS history
      performanceRef.current.fpsHistory.push(fps);
      if (performanceRef.current.fpsHistory.length > performanceRef.current.maxHistoryLength) {
        performanceRef.current.fpsHistory.shift();
      }

      // Calculate average FPS
      const averageFps = Math.round(
        performanceRef.current.fpsHistory.reduce((sum, value) => sum + value, 0) / 
        performanceRef.current.fpsHistory.length
      );

      setPerformanceData({
        fps,
        isLowPerformance: fps < lowPerformanceThreshold,
        isHighPerformance: fps > highPerformanceThreshold,
        frameCount: performanceRef.current.frameCount,
        averageFps
      });

      performanceRef.current.frameCount = 0;
      performanceRef.current.lastUpdateTime = currentTime;
    }
  };

  useEffect(() => {
    const animationId = requestAnimationFrame(function animate() {
      updatePerformance();
      requestAnimationFrame(animate);
    });

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [updateInterval, lowPerformanceThreshold, highPerformanceThreshold]);

  return performanceData;
};