'use client';
// File: src/components/visualizers/3d/laser/LaserScene.tsx | Version: v2.2.23
// Author: Sut

import React, { useRef, useMemo, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { InstancedMesh, Object3D, Color, AdditiveBlending, Mesh, SphereGeometry, MeshBasicMaterial, Vector3, Line, LineBasicMaterial, BufferGeometry } from 'three';
import { VisualizerSettings } from '@/types';
import { useAudioReactive } from '@/hooks/audio/useAudioReactive';
import { SceneBackground } from '../../ui/SceneBackground';
import { SceneProps, LaserState, CollisionEffect, ReflectionEffect } from './types';
import { initializeLaserStates, calculateLaserPosition, calculateLaserScale, calculateLaserFlicker } from './laserState';
import { detectLaserCollisions, updateCollisionEffects, updateReflectionEffects } from './effects';

export const LaserScene: React.FC<SceneProps> = ({ analyser, analyserR, colors, settings }) => {
  const meshRef = useRef<InstancedMesh>(null);
  const collisionEffectsRef = useRef<CollisionEffect[]>([]);
  const reflectionEffectsRef = useRef<ReflectionEffect[]>([]);
  const { features, smoothedColors } = useAudioReactive({ analyser, analyserR, colors, settings });
  const { volume, bass, treble, isBeat } = features;
  
  const count = 64;
  const dummy = useMemo(() => new Object3D(), []);
  const color = useMemo(() => new Color(), []);

  const laserData = useMemo(() => {
    return initializeLaserStates(count);
  }, [count]);

  // Initialize instance colors
  React.useLayoutEffect(() => {
    if (meshRef.current) {
      const tempColor = new Color();
      for (let i = 0; i < count; i++) {
        tempColor.setHex(0xffffff);
        meshRef.current.setColorAt(i, tempColor);
      }
      meshRef.current.instanceColor!.needsUpdate = true;
    }
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    const delta = state.clock.getDelta();
    
    // 更新激光束
    laserData.forEach((data, i) => {
      const position = calculateLaserPosition(data, time, volume, bass, treble);
      const { scaleXZ, scaleY } = calculateLaserScale(volume, bass, treble);
      const flickerIntensity = calculateLaserFlicker(data, time, volume);
      
      dummy.position.set(position.x, position.y, position.z);
      
      // 指向中心或稍微偏移
      dummy.lookAt(0, Math.sin(time) * 5, 0);
      
      dummy.scale.set(scaleXZ, scaleXZ, scaleY);
      
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
      
      // 更新颜色
      const colorIndex = i % smoothedColors.length;
      if (smoothedColors[colorIndex]) {
        color.copy(smoothedColors[colorIndex]);
        // 基于音量和闪烁效果调整亮度
        color.multiplyScalar(flickerIntensity);
        meshRef.current!.setColorAt(i, color);
      }
      
      // 检测碰撞
      const { collisionEffects, reflectionEffects } = detectLaserCollisions(
        data, 
        dummy.position,
        dummy.getWorldDirection(new Vector3()),
        scaleY,
        time,
        color
      );
      
      collisionEffectsRef.current.push(...collisionEffects);
      reflectionEffectsRef.current.push(...reflectionEffects);
    });

    // 更新碰撞效果
    collisionEffectsRef.current = updateCollisionEffects(collisionEffectsRef.current, delta);
    
    // 更新反射效果
    reflectionEffectsRef.current = updateReflectionEffects(reflectionEffectsRef.current, delta);

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    
    // Camera controlled by OrbitControls
  });

  return (
    <>
      <SceneBackground enabled={!settings.albumArtBackground} color="#000000" />
      <group name="laser-scene">
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial 
            transparent 
            opacity={0.8} 
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </instancedMesh>
        
        {/* 碰撞效果 */}
        {collisionEffectsRef.current.map((effect, index) => (
          <mesh key={`collision-${index}`} position={effect.position}>
            <sphereGeometry args={[effect.size, 16, 16]} />
            <meshBasicMaterial 
              color={effect.color} 
              transparent 
              opacity={effect.alpha} 
              blending={AdditiveBlending}
            />
          </mesh>
        ))}
        
        {/* 中心光晕 */}
        <mesh>
          <sphereGeometry args={[2, 32, 32]} />
          <meshBasicMaterial 
            color={smoothedColors[0] || '#ffffff'} 
            transparent 
            opacity={0.2 * volume} 
            blending={AdditiveBlending}
          />
        </mesh>
      </group>
    </>
  );
};
