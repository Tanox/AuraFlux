// File: src/hooks/performance/usePerformance.ts | Version: v2.3.5

import { useState, useEffect, useCallback } from 'react';
import { DevicePerformance, PerformanceLevel } from '@/utils/performance/DevicePerformance';
import { FPSMonitor } from '@/utils/performance/FPSMonitor';

/**
 * 性能Hook返回类型
 */
export interface UsePerformanceReturn {
  performanceLevel: PerformanceLevel;
  currentFPS: number;
  averageFPS: number;
  targetFPS: number;
  isAchievingTargetFPS: boolean;
  adjustmentFactor: number;
  recommendedComplexity: {
    particleCount: number;
    meshCount: number;
    shaderQuality: 'low' | 'medium' | 'high';
  };
  refreshPerformance: () => Promise<void>;
  setTargetFPS: (fps: number) => void;
}

/**
 * 性能管理Hook
 */
export const usePerformance = (): UsePerformanceReturn => {
  const [performanceLevel, setPerformanceLevel] = useState<PerformanceLevel>(PerformanceLevel.MEDIUM);
  const [currentFPS, setCurrentFPS] = useState<number>(60);
  const [averageFPS, setAverageFPS] = useState<number>(60);
  const [targetFPS, setTargetFPS] = useState<number>(60);
  const [isAchievingTargetFPS, setIsAchievingTargetFPS] = useState<boolean>(true);
  const [adjustmentFactor, setAdjustmentFactor] = useState<number>(1.0);
  const [recommendedComplexity, setRecommendedComplexity] = useState({
    particleCount: 6000,
    meshCount: 5000,
    shaderQuality: 'medium' as const
  });

  const devicePerformance = DevicePerformance.getInstance();
  const fpsMonitor = FPSMonitor.getInstance();

  // 初始化性能监控
  useEffect(() => {
    const initPerformance = async () => {
      // 运行性能测试
      const result = await devicePerformance.runPerformanceTest();
      setPerformanceLevel(result.level);

      // 调整目标FPS
      await fpsMonitor.adjustTargetFPSBasedOnPerformance();
      setTargetFPS(fpsMonitor.getTargetFPS());

      // 更新推荐复杂度
      setRecommendedComplexity(fpsMonitor.getRecommendedComplexity());

      // 开始FPS监控
      fpsMonitor.startMonitoring();
    };

    initPerformance();

    // 定期更新FPS数据
    const intervalId = setInterval(() => {
      setCurrentFPS(fpsMonitor.getFPS());
      setAverageFPS(fpsMonitor.getAverageFPS());
      setIsAchievingTargetFPS(fpsMonitor.isAchievingTargetFPS());
      setAdjustmentFactor(fpsMonitor.getPerformanceAdjustmentFactor());
    }, 1000);

    return () => {
      clearInterval(intervalId);
      fpsMonitor.stopMonitoring();
    };
  }, []);

  // 刷新性能数据
  const refreshPerformance = useCallback(async () => {
    const result = await devicePerformance.runPerformanceTest();
    setPerformanceLevel(result.level);

    await fpsMonitor.adjustTargetFPSBasedOnPerformance();
    setTargetFPS(fpsMonitor.getTargetFPS());

    setRecommendedComplexity(fpsMonitor.getRecommendedComplexity());
  }, []);

  // 设置目标FPS
  const handleSetTargetFPS = useCallback((fps: number) => {
    fpsMonitor.setTargetFPS(fps);
    setTargetFPS(fps);
  }, []);

  return {
    performanceLevel,
    currentFPS,
    averageFPS,
    targetFPS,
    isAchievingTargetFPS,
    adjustmentFactor,
    recommendedComplexity,
    refreshPerformance,
    setTargetFPS: handleSetTargetFPS
  };
};
