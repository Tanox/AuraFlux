// File: src/components/visualizers/scenes/cubeField/collisionEffects.ts | Version: v2.2.23

import { Vector3, Color } from 'three';
import { CubeState, CollisionEffect } from './types';

/**
 * 检测立方体碰撞并生成碰撞效果
 */
export function detectCollisions(
  cubes: CubeState[],
  collisionEffects: CollisionEffect[],
  color: Color
): CollisionEffect[] {
  const newEffects: CollisionEffect[] = [...collisionEffects];
  
  for (let i = 0; i < cubes.length; i++) {
    for (let j = i + 1; j < cubes.length; j++) {
      const p1 = cubes[i];
      const p2 = cubes[j];
      const distance = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) + Math.pow(p1.z - p2.z, 2));
      const minDistance = (p1.currentScale + p2.currentScale) * 0.8;
      
      if (distance < minDistance) {
        // 发生碰撞
        if (!p1.isColliding || !p2.isColliding) {
          const collisionX = (p1.x + p2.x) / 2;
          const collisionY = (p1.y + p2.y) / 2;
          const collisionZ = (p1.z + p2.z) / 2;
          
          newEffects.push({
            position: new Vector3(collisionX, collisionY, collisionZ),
            size: (p1.currentScale + p2.currentScale) / 2,
            alpha: 1,
            color: new Vector3(color.r, color.g, color.b)
          });
          
          // 碰撞响应
          const normal = new Vector3(p2.x - p1.x, p2.y - p1.y, p2.z - p1.z).normalize();
          const pushForce = 0.5;
          
          p1.x -= normal.x * pushForce;
          p1.y -= normal.y * pushForce;
          p1.z -= normal.z * pushForce;
          
          p2.x += normal.x * pushForce;
          p2.y += normal.y * pushForce;
          p2.z += normal.z * pushForce;
          
          // 触发变形效果
          p1.deformation = 0.2;
          p2.deformation = 0.2;
        }
        
        p1.isColliding = true;
        p2.isColliding = true;
        p1.collisionTimer = 0.5;
        p2.collisionTimer = 0.5;
      }
    }
  }
  
  return newEffects;
}

/**
 * 更新碰撞效果
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
