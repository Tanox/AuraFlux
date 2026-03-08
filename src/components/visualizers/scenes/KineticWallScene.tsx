/**
 * File: app/components/visualizers/scenes/KineticWallScene.tsx
 * Version: v1.9.73
 * Author: Sut
 * Description: "Kinetic Wall" - Massive LED stage wall with rhythmic pulsing.
 */

import React, { useRef, useMemo, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { InstancedMesh, Object3D, MeshStandardMaterial } from 'three';
import { VisualizerSettings } from '../../../types/index';
import { useAudioReactive } from '../../../hooks/useAudioReactive';

interface SceneProps {
  analyser: AnalyserNode;
  analyserR?: AnalyserNode | null;
  colors: string[];
  settings: VisualizerSettings;
}

export const KineticWallScene: React.FC<SceneProps> = ({ analyser, analyserR, colors, settings }) => {
  const meshRef = useRef<InstancedMesh>(null);
  
  const { features, smoothedColors } = useAudioReactive({ analyser, analyserR, colors, settings });
  const [c0, c1, c2] = smoothedColors;
  
  const COLS = Math.floor(128 * Math.sqrt(0.3)); // Reduce total count to ~30%
  const ROWS = Math.floor(64 * Math.sqrt(0.3));  // Reduce total count to ~30%
  const COUNT = COLS * ROWS;
  const SPACING = 0.8 * 3; // Increase spacing to match larger cubes
  
  const dummy = useMemo(() => new Object3D(), []);
  
  useLayoutEffect(() => {
    if (meshRef.current) {
      const offsetX = (COLS * SPACING) / 2;
      const offsetY = (ROWS * SPACING) / 2;
      
      for (let i = 0; i < COUNT; i++) {
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        
        dummy.position.set(
          col * SPACING - offsetX,
          row * SPACING - offsetY,
          0
        );
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [dummy, COLS, ROWS, COUNT, SPACING]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    
    const time = clock.getElapsedTime() * settings.speed;
    const { bass, mids, treble, isBeat } = features;
    
    const offsetX = (COLS * SPACING) / 2;
    const offsetY = (ROWS * SPACING) / 2;
    
    for (let i = 0; i < COUNT; i++) {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      
      const dx = (col - COLS / 2);
      const dy = (row - ROWS / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      const wave = Math.sin(dist * 0.5 - time * 2.0);
      const beatImpulse = isBeat ? Math.exp(-dist * 0.2) * 2.0 : 0;
      
      const z = wave * (1.0 + bass * 2.0) + beatImpulse * 3.0 + Math.sin(col * 0.5 + time) * mids * 2.0;
      
      const scale = 1.0 + treble * 0.5 + Math.max(0, wave * 0.3);
      
      dummy.position.set(
        col * SPACING - offsetX,
        row * SPACING - offsetY,
        z
      );
      
      dummy.scale.set(scale, scale, scale);
      
      if (isBeat) {
          dummy.rotation.z = Math.sin(time * 5.0 + dist) * 0.1;
      } else {
          dummy.rotation.z *= 0.9;
      }
      
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    
    const mat = meshRef.current.material as MeshStandardMaterial;
    if (mat) {
        if (c0) mat.color.lerp(c0, 0.1);
        if (c1) mat.emissive.lerp(c1, 0.1);
        mat.emissiveIntensity = 0.2 + bass * 0.5 + (isBeat ? 0.5 : 0);
    }
  });

  return (
    <>
      {!settings.albumArtBackground && <color attach="background" args={['#050505']} />}
      
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 20]} intensity={1} color={c2} />
      <pointLight position={[0, 0, 10]} intensity={2 + features.bass * 5} color={c0} distance={50} />
      
      <instancedMesh 
        ref={meshRef} 
        args={[undefined, undefined, COUNT]} 
        position={[0, 0, -20]}
      >
        <boxGeometry args={[3, 3, 3]} />
        <meshStandardMaterial 
            roughness={0.2} 
            metalness={0.8} 
        />
      </instancedMesh>
    </>
  );
};