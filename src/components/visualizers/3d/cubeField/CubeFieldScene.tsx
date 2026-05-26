'use client';

// src/components/visualizers/3d/cubeField/CubeFieldScene.tsx v2.3.11


import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { InstancedMesh, PointLight, Object3D, MeshStandardMaterial, AdditiveBlending } from 'three';
import { useAudioReactive } from '@/hooks/audio/useAudioReactive';
import { SceneBackground } from '../../ui/SceneBackground';
import { SceneProps } from '@/types';

import { initializeCubeStates, updateCubeState } from './cubeState';
import { detectCollisions, updateCollisionEffects } from './collisionEffects';
import { CollisionEffect } from './types';

export const CubeFieldScene: React.FC<SceneProps> = ({ analyser, analyserR, colors, settings }) => {
  const meshRef = useRef<InstancedMesh>(null);
  const coreLightRef = useRef<PointLight>(null);
  const collisionEffectsRef = useRef<CollisionEffect[]>([]);
  const timeCounterRef = useRef(0);
  
  const { features, smoothedColors } = useAudioReactive({ analyser, analyserR, colors, settings });
  const { bass, mids, treble, volume, isBeat } = features;
  
  const [c0, c1, c2] = smoothedColors;
  
  const count = settings.quality === 'high' ? 1200 : settings.quality === 'medium' ? 800 : 400;
  const dummy = useMemo(() => new Object3D(), []);
  
  // Use a local data array for spectral mapping if needed, but ensure it's safe
  const binCount = Math.max(16, 512);
  const localDataArray = useMemo(() => new Uint8Array(binCount), [binCount]);

  const particles = useMemo(() => {
    return initializeCubeStates(count);
  }, [count]);

  const initialSetupRef = useRef(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const delta = state.clock.getDelta();
    
    if (analyser) {
      analyser.getByteFrequencyData(localDataArray);
    } else {
      timeCounterRef.current += 0.05;
      for (let i = 0; i < localDataArray.length; i++) {
        const frequency = i / localDataArray.length * Math.PI * 2;
        const value = Math.sin(timeCounterRef.current + frequency * 3) * 64 + 
                      Math.sin(timeCounterRef.current * 1.5 + frequency * 2) * 64 + 128;
        localDataArray[i] = Math.max(0, Math.min(255, Math.floor(value)));
      }
    }
    
    const globalSpeed = settings.speed * 4.5 * (1.0 + volume * 2.0 + (isBeat ? 2.5 : 0));
    const centerX = Math.sin(time * 0.2) * 35;
    const centerY = Math.cos(time * 0.7) * 25;
    
    // Camera controlled by OrbitControls
    
    if (coreLightRef.current) {
      coreLightRef.current.position.set(centerX, centerY, -80);
      coreLightRef.current.color.set(c1);
      coreLightRef.current.intensity = 15 + bass * 35 + (isBeat ? 50 : 0);
    }

    const mat = meshRef.current.material as MeshStandardMaterial;
    if (mat) {
      mat.color.set(c0);
      mat.emissive.set(c1);
      mat.emissiveIntensity = 0.4 + treble * 4.0 + (isBeat ? 3.5 : 0);
      // Add glow effect
      mat.emissiveIntensity *= 1.5;
    }

    const rotationBoost = 1.0 + mids * 2.0 + treble * 2.5;
    const binLimit = Math.floor(localDataArray.length * 0.6);
    
    // Check for cube collisions
    collisionEffectsRef.current = detectCollisions(particles, collisionEffectsRef.current, c1);
    
    particles.forEach((p, i) => {
      const spectralIdx = Math.floor(p.spectralAffinity * binLimit);
      const reaction = (localDataArray[spectralIdx] / 255) * settings.sensitivity;
      
      updateCubeState(p, time, delta, globalSpeed, centerX, centerY, rotationBoost, reaction, isBeat, settings);
      
      const dF = Math.max(0, -p.z / 350);
      dummy.position.set(
        p.x + centerX * Math.pow(dF, 1.2),
        p.y + centerY * Math.pow(dF, 1.2),
        p.z
      );
      
      if (!initialSetupRef.current) dummy.rotation.copy(p.initialRotation);
      dummy.rotateOnAxis(
        p.rotationAxis,
        (p.rotationSpeed + p.torque) * rotationBoost * p.speedMult *
        (1.0 + 0.5 * Math.sin(time * p.tumbleRate + p.tumblePhase)) *
        (1.0 + reaction * 4.0) * 0.1
      );
      dummy.rotateX(p.randomTumbleX * 0.15);
      dummy.rotateY(p.randomTumbleY * 0.15);
      dummy.rotateZ(p.randomTumbleZ * 0.15);
      
      // Apply deformation effect
      const deformation = p.deformation;
      const scaleX = p.currentScale * (1 - deformation);
      const scaleY = p.currentScale * (1 + deformation);
      const scaleZ = p.currentScale * (1 - deformation);
      
      dummy.scale.set(scaleX, scaleY, scaleZ);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    
    // Update collision effects
    collisionEffectsRef.current = updateCollisionEffects(collisionEffectsRef.current, delta);
    
    initialSetupRef.current = true;
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <SceneBackground enabled={!settings.albumArtBackground} color="#000000" />
      {!settings.albumArtBackground && <fog attach="fog" args={['#000000', 30, 220]} />}
      <ambientLight intensity={0.2} />
      <pointLight ref={coreLightRef} distance={350} decay={2.0} />
      <pointLight position={[0, 0, 20]} intensity={3} color={c2 || 0xffffff} distance={150} />
      <directionalLight position={[40, 40, 20]} intensity={1.2} color={c0 || 0xffffff} />
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.1} metalness={0.95} />
      </instancedMesh>
      
      {/* 纰板挒鏁堟灉 */}
      {collisionEffectsRef.current.map((effect, index) => (
        <mesh key={`collision-${index}`} position={effect.position}>
          <sphereGeometry args={[effect.size, 16, 16]} />
          <meshBasicMaterial
            color={[effect.color.x, effect.color.y, effect.color.z]}
            transparent
            opacity={effect.alpha}
            blending={AdditiveBlending}
          />
        </mesh>
      ))}
    </>
  );
};
