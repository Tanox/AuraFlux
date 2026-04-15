'use client';
// File: src\components\visualizers\scenes\LaserScene.tsx | Version: v2.2.23
// Author: Sut

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { InstancedMesh, Object3D, Color, AdditiveBlending, Mesh, SphereGeometry, MeshBasicMaterial, Vector3, Line, LineBasicMaterial, BufferGeometry } from 'three';
import { VisualizerSettings } from '@/types';
import { useAudioReactive } from '@/hooks/useAudioReactive';
import { SceneBackground } from '../ui/SceneBackground';

// 激光束状态接口
interface LaserState {
  angle: number;
  speed: number;
  offset: number;
  phase: number;
  flicker: number;
  flickerSpeed: number;
  collisionCount: number;
  lastCollision: number;
}

// 碰撞效果接口
interface CollisionEffect {
  position: Vector3;
  size: number;
  alpha: number;
  color: Color;
}

// 反射效果接口
interface ReflectionEffect {
  start: Vector3;
  end: Vector3;
  alpha: number;
  color: Color;
}

export const LaserScene: React.FC<{ analyser: AnalyserNode; analyserR?: AnalyserNode | null; colors: string[]; settings: VisualizerSettings; }> = ({ analyser, analyserR, colors, settings }) => {
  const meshRef = useRef<InstancedMesh>(null);
  const collisionEffectsRef = useRef<CollisionEffect[]>([]);
  const reflectionEffectsRef = useRef<ReflectionEffect[]>([]);
  const { features, smoothedColors } = useAudioReactive({ analyser, analyserR, colors, settings });
  const { volume, bass, treble, isBeat } = features;
  
  const count = 64;
  const dummy = useMemo(() => new Object3D(), []);
  const color = useMemo(() => new Color(), []);

  const laserData = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      angle: (i / count) * Math.PI * 2,
      speed: 0.2 + Math.random() * 0.5,
      offset: Math.random() * Math.PI * 2,
      phase: Math.random() * Math.PI * 2,
      flicker: Math.random(),
      flickerSpeed: 5 + Math.random() * 10,
      collisionCount: 0,
      lastCollision: 0,
    }));
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
      const { angle, speed, offset, phase, flicker, flickerSpeed } = data;
      
      // 动态旋转
      const r = 15 + Math.sin(time * 0.5 + offset) * 5;
      const x = Math.cos(angle + time * 0.1 * speed) * r;
      const z = Math.sin(angle + time * 0.1 * speed) * r;
      const y = Math.sin(time * 0.2 + phase) * 10;

      dummy.position.set(x, y, z);
      
      // 指向中心或稍微偏移
      dummy.lookAt(0, Math.sin(time) * 5, 0);
      
      // 基于音频缩放
      const scaleY = 50 + volume * 100 + bass * 50;
      const scaleXZ = 0.05 + treble * 0.1;
      dummy.scale.set(scaleXZ, scaleXZ, scaleY);
      
      // 激光束闪烁效果
      const flickerIntensity = 0.7 + Math.sin(time * flickerSpeed + flicker) * 0.3;
      
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
      
      // 更新颜色
      const colorIndex = i % smoothedColors.length;
      if (smoothedColors[colorIndex]) {
        color.copy(smoothedColors[colorIndex]);
        // 基于音量和闪烁效果调整亮度
        color.multiplyScalar((1.0 + volume * 2.0) * flickerIntensity);
        meshRef.current!.setColorAt(i, color);
      }
      
      // 检测碰撞
      if (time - data.lastCollision > 0.5) {
        const laserEnd = new Vector3(x, y, z).add(dummy.getWorldDirection(new Vector3()).multiplyScalar(scaleY));
        const distanceToCenter = laserEnd.distanceTo(new Vector3(0, 0, 0));
        
        if (distanceToCenter < 10) {
          // 发生碰撞
          collisionEffectsRef.current.push({
            position: laserEnd.clone(),
            size: 0.5 + Math.random() * 1.5,
            alpha: 1,
            color: color.clone()
          });
          
          // 生成反射效果
          const reflectionDirection = laserEnd.clone().reflect(new Vector3(0, 1, 0)).normalize();
          reflectionEffectsRef.current.push({
            start: laserEnd.clone(),
            end: laserEnd.clone().add(reflectionDirection.multiplyScalar(30)),
            alpha: 1,
            color: color.clone()
          });
          
          data.collisionCount++;
          data.lastCollision = time;
        }
      }
    });

    // 更新碰撞效果
    collisionEffectsRef.current = collisionEffectsRef.current.filter(effect => {
      effect.alpha -= delta * 3;
      effect.size += delta * 2;
      return effect.alpha > 0;
    });
    
    // 更新反射效果
    reflectionEffectsRef.current = reflectionEffectsRef.current.filter(effect => {
      effect.alpha -= delta * 2;
      return effect.alpha > 0;
    });

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

