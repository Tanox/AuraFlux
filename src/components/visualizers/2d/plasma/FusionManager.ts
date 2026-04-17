// File: src/components/visualizers/2d/plasma/FusionManager.ts | Version: v2.3.3

import { FusionEffect } from './types';
import { ObjectPool } from './objectPool';

export class FusionManager {
  private fusionEffects: FusionEffect[] = [];
  private fusionEffectPool: ObjectPool<FusionEffect>;

  constructor() {
    this.fusionEffectPool = new ObjectPool<FusionEffect>(() => ({
      x: 0,
      y: 0,
      z: 0,
      size: 0,
      alpha: 1,
      color: '#ffffff'
    }));
  }

  /**
   * 鍒涘缓铻嶅悎鏁堟灉
   */
  createFusionEffect(x: number, y: number, z: number, size: number, color: string): FusionEffect {
    const fusionEffect = this.fusionEffectPool.get();
    fusionEffect.x = x;
    fusionEffect.y = y;
    fusionEffect.z = z;
    fusionEffect.size = size;
    fusionEffect.alpha = 1;
    fusionEffect.color = color;
    this.fusionEffects.push(fusionEffect);
    return fusionEffect;
  }

  /**
   * 鏇存柊铻嶅悎鏁堟灉
   */
  updateFusionEffects(): void {
    const activeFusionEffects: FusionEffect[] = [];
    for (const effect of this.fusionEffects) {
      effect.alpha -= 0.02;
      effect.size += 0.5;
      if (effect.alpha > 0) {
        activeFusionEffects.push(effect);
      } else {
        this.fusionEffectPool.release(effect);
      }
    }
    this.fusionEffects = activeFusionEffects;
  }

  /**
   * 鑾峰彇铻嶅悎鏁堟灉
   */
  getFusionEffects(): FusionEffect[] {
    return this.fusionEffects;
  }

  /**
   * 娣卞害鎺掑簭
   */
  sortByDepth(): void {
    this.fusionEffects.sort((a, b) => b.z - a.z);
  }

  /**
   * 娓呴櫎鎵€鏈夎瀺鍚堟晥鏋?   */
  clear(): void {
    for (const effect of this.fusionEffects) {
      this.fusionEffectPool.release(effect);
    }
    this.fusionEffects = [];
  }
}
