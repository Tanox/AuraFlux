// src/components/visualizers/3d/laser/effects.ts v2.3.11


import { Vector3, Color } from 'three';
import { CollisionEffect, ReflectionEffect, LaserState } from './types';


export function detectLaserCollisions(
  laser: LaserState,
  position: Vector3,
  direction: Vector3,
  scaleY: number,
  time: number,
  color: Color
): { collisionEffects: CollisionEffect[]; reflectionEffects: ReflectionEffect[] } {
  const collisionEffects: CollisionEffect[] = [];
  const reflectionEffects: ReflectionEffect[] = [];
  
  if (time - laser.lastCollision > 0.5) {
    const laserEnd = position.clone().add(direction.multiplyScalar(scaleY));
    const distanceToCenter = laserEnd.distanceTo(new Vector3(0, 0, 0));
    
    if (distanceToCenter < 10) {
      // 鍙戠敓纰版挒
      collisionEffects.push({
        position: laserEnd.clone(),
        size: 0.5 + Math.random() * 1.5,
        alpha: 1,
        color: color.clone()
      });
      
      // 鐢熸垚鍙嶅皠鏁堟灉
      const reflectionDirection = laserEnd.clone().reflect(new Vector3(0, 1, 0)).normalize();
      reflectionEffects.push({
        start: laserEnd.clone(),
        end: laserEnd.clone().add(reflectionDirection.multiplyScalar(30)),
        alpha: 1,
        color: color.clone()
      });
      
      laser.collisionCount++;
      laser.lastCollision = time;
    }
  }
  
  return { collisionEffects, reflectionEffects };
}

/**
 * 鏇存柊纰版挒鏁堟灉
 */
export function updateCollisionEffects(
  collisionEffects: CollisionEffect[],
  delta: number
): CollisionEffect[] {
  return collisionEffects.filter(effect => {
    effect.alpha -= delta * 3;
    effect.size += delta * 2;
    return effect.alpha > 0;
  });
}

/**
 * 鏇存柊鍙嶅皠鏁堟灉
 */
export function updateReflectionEffects(
  reflectionEffects: ReflectionEffect[],
  delta: number
): ReflectionEffect[] {
  return reflectionEffects.filter(effect => {
    effect.alpha -= delta * 2;
    return effect.alpha > 0;
  });
}
