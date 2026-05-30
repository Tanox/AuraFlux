'use client';

// src/components/visualizers/3d/laser/LaserScene.tsx v2.3.11

// Author: Sut

import React, { useRef, useMemo, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { InstancedMesh, Object3D, Color, AdditiveBlending, Mesh, SphereGeometry, BoxGeometry, MeshBasicMaterial, Vector3, Line, LineBasicMaterial, BufferGeometry, BufferAttribute } from 'three';
import { VisualizerSettings } from '@/types';
import { useAudioReactive } from '@/hooks/audio/useAudioReactive';
import { SceneBackground } from '../../ui/SceneBackground';
import { SceneProps } from '@/types';

import { initializeLaserStates, calculateLaserPosition, calculateLaserScale, calculateLaserFlicker } from './laserState';
import { detectLaserCollisions, updateCollisionEffects, updateReflectionEffects } from './effects';
import { LaserState, CollisionEffect, ReflectionEffect } from './types';

export const LaserScene: React.FC<SceneProps> = ({ analyser, analyserR, colors, settings }) => {
  const meshRef = useRef<InstancedMesh>(null);
  const collisionEffectsRef = useRef<CollisionEffect[]>([]);
  const reflectionEffectsRef = useRef<ReflectionEffect[]>([]);
  const { features, smoothedColors } = useAudioReactive({ analyser, analyserR, colors, settings });
  const { volume, bass, treble, isBeat } = features;
  
  const count = 64;
  const dummy = useMemo(() => new Object3D(), []);
  const color = useMemo(() => new Color(), []);
  const directionVector = useMemo(() => new Vector3(), []);

  const laserData = useMemo(() => {
    return initializeLaserStates(count);
  }, [count]);

  // Create geometries and materials to improve performance
  const sphereGeometry = useMemo(() => new SphereGeometry(1, 16, 16), []);
  const centerSphereGeometry = useMemo(() => new SphereGeometry(2, 32, 32), []);
  const collisionMaterial = useMemo(() => new MeshBasicMaterial({
    transparent: true,
    blending: AdditiveBlending
  }), []);
  const centerMaterial = useMemo(() => new MeshBasicMaterial({
    transparent: true,
    blending: AdditiveBlending
  }), []);

  // Initialize instance colors
  React.useLayoutEffect(() => {
    if (meshRef.current) {
      const tempColor = new Color();
      for (let i = 0; i < count; i++) {
        tempColor.setHex(0xffffff);
        meshRef.current.setColorAt(i, tempColor);
      }
      if (meshRef.current.instanceColor) {
        meshRef.current.instanceColor.needsUpdate = true;
      }
    }
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    const delta = state.clock.getDelta();
    
    // Update laser endpoints
    laserData.forEach((data, i) => {
      const position = calculateLaserPosition(data, time, volume, bass, treble);
      const { scaleXZ, scaleY } = calculateLaserScale(volume, bass, treble);
      const flickerIntensity = calculateLaserFlicker(data, time, volume);
      
      dummy.position.set(position.x, position.y, position.z);
      
      // Look towards center or with slight offset
      dummy.lookAt(0, Math.sin(time) * 5, 0);
      
      dummy.scale.set(scaleXZ, scaleXZ, scaleY);
      
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
      
      // Update color
      const colorIndex = i % smoothedColors.length;
      if (smoothedColors[colorIndex]) {
        color.copy(smoothedColors[colorIndex]);
        // Adjust brightness based on volume and flicker effect
        color.multiplyScalar(flickerIntensity);
        meshRef.current!.setColorAt(i, color);
      }
      
      // Check for collisions - reuse direction vector
      dummy.getWorldDirection(directionVector);
      const { collisionEffects, reflectionEffects } = detectLaserCollisions(
        data, 
        dummy.position,
        directionVector,
        scaleY,
        time,
        color
      );
      
      // Limit collision effects count to improve performance
      if (collisionEffectsRef.current.length < 50) {
        collisionEffectsRef.current.push(...collisionEffects);
      }
      if (reflectionEffectsRef.current.length < 30) {
        reflectionEffectsRef.current.push(...reflectionEffects);
      }
    });

    // Update collision effects
    collisionEffectsRef.current = updateCollisionEffects(collisionEffectsRef.current, delta);
    
    // Update reflection effects
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
        
        {/* Collision effects */}
        {collisionEffectsRef.current.slice(0, 50).map((effect, index) => (
          <mesh key={`collision-${index}`} position={effect.position}>
            <primitive object={sphereGeometry} />
            <meshBasicMaterial 
              color={effect.color} 
              transparent 
              opacity={effect.alpha} 
              blending={AdditiveBlending}
            />
          </mesh>
        ))}
        
        {/* Center glow sphere */}
        <mesh>
          <primitive object={centerSphereGeometry} />
          <meshBasicMaterial 
            color={smoothedColors[0] || '#ffffff'} 
            transparent 
            opacity={0.2 * volume} 
            blending={AdditiveBlending}
          />
        </mesh>
        
        {/* Reflection effects */}
        {reflectionEffectsRef.current.slice(0, 30).map((effect, index) => (
          <line key={`reflection-${index}`}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([
                  effect.start.x, effect.start.y, effect.start.z,
                  effect.end.x, effect.end.y, effect.end.z
                ])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color={effect.color}
              transparent
              opacity={effect.alpha}
              blending={AdditiveBlending}
            />
          </line>
        ))}
      </group>
    </>
  );
};
