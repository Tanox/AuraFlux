// File: src/utils/performance/FPSMonitor.ts | Version: v2.3.5

import { PerformanceLevel, DevicePerformance } from './DevicePerformance';

/**
 * 帧率监控器
 */
export class FPSMonitor {
  private static instance: FPSMonitor;
  private frameCount: number = 0;
  private lastTime: number = 0;
  private fps: number = 60;
  private averageFps: number = 60;
  private fpsHistory: number[] = [];
  private maxHistorySize: number = 30;
  private targetFps: number = 60;
  private performanceLevel: PerformanceLevel = PerformanceLevel.MEDIUM;
  private isMonitoring: boolean = false;
  private rafId: number | null = null;

  private constructor() {}

  /**
   * 获取单例实例
   */
  public static getInstance(): FPSMonitor {
    if (!FPSMonitor.instance) {
      FPSMonitor.instance = new FPSMonitor();
    }
    return FPSMonitor.instance;
  }

  /**
   * 开始监控
   */
  public startMonitoring(): void {
    if (this.isMonitoring) {
      return;
    }

    this.isMonitoring = true;
    this.lastTime = performance.now();
    this.frameCount = 0;
    this.fpsHistory = [];

    this.updateFPS();
  }

  /**
   * 停止监控
   */
  public stopMonitoring(): void {
    this.isMonitoring = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  /**
   * 更新FPS
   */
  private updateFPS(): void {
    if (!this.isMonitoring) {
      return;
    }

    this.frameCount++;
    const currentTime = performance.now();
    const elapsed = currentTime - this.lastTime;

    if (elapsed >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / elapsed);
      this.fpsHistory.push(this.fps);
      
      if (this.fpsHistory.length > this.maxHistorySize) {
        this.fpsHistory.shift();
      }

      this.averageFps = this.fpsHistory.reduce((sum, fps) => sum + fps, 0) / this.fpsHistory.length;
      this.lastTime = currentTime;
      this.frameCount = 0;
    }

    this.rafId = requestAnimationFrame(() => this.updateFPS());
  }

  /**
   * 获取当前FPS
   */
  public getFPS(): number {
    return this.fps;
  }

  /**
   * 获取平均FPS
   */
  public getAverageFPS(): number {
    return this.averageFps;
  }

  /**
   * 设置目标FPS
   */
  public setTargetFPS(fps: number): void {
    this.targetFps = Math.max(30, Math.min(144, fps));
  }

  /**
   * 获取目标FPS
   */
  public getTargetFPS(): number {
    return this.targetFps;
  }

  /**
   * 检查是否达到目标FPS
   */
  public isAchievingTargetFPS(): boolean {
    return this.averageFps >= this.targetFps * 0.95;
  }

  /**
   * 根据性能等级调整目标FPS
   */
  public async adjustTargetFPSBasedOnPerformance(): Promise<void> {
    const devicePerformance = DevicePerformance.getInstance();
    this.performanceLevel = await devicePerformance.getPerformanceLevel();

    switch (this.performanceLevel) {
      case PerformanceLevel.HIGH:
        this.targetFps = 60;
        break;
      case PerformanceLevel.MEDIUM:
        this.targetFps = 45;
        break;
      case PerformanceLevel.LOW:
        this.targetFps = 30;
        break;
    }
  }

  /**
   * 获取推荐的3D复杂度
   */
  public getRecommendedComplexity(): {
    particleCount: number;
    meshCount: number;
    shaderQuality: 'low' | 'medium' | 'high';
  } {
    switch (this.performanceLevel) {
      case PerformanceLevel.HIGH:
        return {
          particleCount: 12000,
          meshCount: 10000,
          shaderQuality: 'high'
        };
      case PerformanceLevel.MEDIUM:
        return {
          particleCount: 6000,
          meshCount: 5000,
          shaderQuality: 'medium'
        };
      case PerformanceLevel.LOW:
        return {
          particleCount: 2000,
          meshCount: 1000,
          shaderQuality: 'low'
        };
    }
  }

  /**
   * 根据当前FPS获取调整因子
   */
  public getPerformanceAdjustmentFactor(): number {
    if (this.averageFps >= this.targetFps) {
      return 1.0;
    }

    // 线性调整因子
    const factor = this.averageFps / this.targetFps;
    return Math.max(0.3, factor);
  }

  /**
   * 重置监控
   */
  public reset(): void {
    this.frameCount = 0;
    this.lastTime = 0;
    this.fps = 60;
    this.averageFps = 60;
    this.fpsHistory = [];
  }
}
