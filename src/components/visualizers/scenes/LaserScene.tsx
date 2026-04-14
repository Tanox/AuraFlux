'use client';
// File: src\components\visualizers\scenes\LaserScene.tsx | Version: v2.2.16
// Author: Sut

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { InstancedMesh, Object3D, Color, AdditiveBlending } from 'three';
import { VisualizerSettings } from '@/types';
import { useAudioReactive } from '@/hooks/useAudioReactive';
import { SceneBackground } from '../ui/SceneBackground';

export const LaserScene: React.FC<{ analyser: AnalyserNode; analyserR?: AnalyserNode | null; colors: string[]; settings: VisualizerSettings; }> = ({ analyser, analyserR, colors, settings }) => {
  const meshRef = useRef<InstancedMesh>(null);
  const { features, smoothedColors } = useAudioReactive({ analyser, analyserR, colors, settings });
  const { volume, bass, treble } = features;
  
  const count = 64;
  const dummy = useMemo(() => new Object3D(), []);
  const color = useMemo(() => new Color(), []);

  const laserData = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      angle: (i / count) * Math.PI * 2,
      speed: 0.2 + Math.random() * 0.5,
      offset: Math.random() * Math.PI * 2,
      phase: Math.random() * Math.PI * 2,
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
    
    laserData.forEach((data, i) => {
      const { angle, speed, offset, phase } = data;
      
      // Dynamic rotation
      const r = 15 + Math.sin(time * 0.5 + offset) * 5;
      const x = Math.cos(angle + time * 0.1 * speed) * r;
      const z = Math.sin(angle + time * 0.1 * speed) * r;
      const y = Math.sin(time * 0.2 + phase) * 10;

      dummy.position.set(x, y, z);
      
      // Point towards center or slightly offset
      dummy.lookAt(0, Math.sin(time) * 5, 0);
      
      // Scale based on audio
      const scaleY = 50 + volume * 100 + bass * 50;
      const scaleXZ = 0.05 + treble * 0.1;
      dummy.scale.set(scaleXZ, scaleXZ, scaleY);
      
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
      
      // Update color
      const colorIndex = i % smoothedColors.length;
      if (smoothedColors[colorIndex]) {
        color.copy(smoothedColors[colorIndex]);
        // Brighten based on volume
        color.multiplyScalar(1.0 + volume * 2.0);
        meshRef.current!.setColorAt(i, color);
      }
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
        
        {/* Central glow */}
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

