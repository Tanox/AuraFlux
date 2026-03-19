// File: src/components/visualizers/scenes/LaserScene.tsx | Version: v2.0.1
// Author: Sut

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { InstancedMesh, Object3D, Color, AdditiveBlending } from 'three';
import { VisualizerSettings } from '../../../types/index';
import { useAudioReactive } from '../../../hooks/useAudioReactive';

export const LaserScene: React.FC<{ analyser: AnalyserNode; colors: string[]; settings: VisualizerSettings; }> = ({ analyser, colors, settings }) => {
  const meshRef = useRef<InstancedMesh>(null);
  const { features, smoothedColors } = useAudioReactive({ analyser, colors, settings });
  const { volume, bass, treble } = features;
  
  const count = 128; // Increased count
  const dummy = useMemo(() => new Object3D(), []);
  const color = useMemo(() => new Color(), []);
  
  // Cylinder geometry for laser look
  const geometry = useMemo(() => new THREE.CylinderGeometry(0.05, 0.05, 1, 8), []);

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
      
      // Concert laser show: originate from bottom stage area
      const stageWidth = 100;
      const x = (i / count - 0.5) * stageWidth;
      const y = -30;
      const z = Math.sin(i * 0.1) * 10 - 20;

      dummy.position.set(x, y, z);
      
      // Sweep back and forth
      const sweepAngle = Math.sin(time * speed + offset) * Math.PI / 3;
      const pitchAngle = Math.PI / 4 + Math.cos(time * speed * 0.5 + phase) * Math.PI / 6;
      
      dummy.rotation.set(pitchAngle, sweepAngle, 0);
      dummy.rotateX(Math.PI / 2); // Cylinder needs to be rotated to look right
      
      // Scale based on audio
      const scaleY = 100 + volume * 200 + bass * 100;
      const scaleXZ = 0.1 + treble * 0.2;
      dummy.scale.set(scaleXZ, scaleXZ, scaleY);
      
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
      
      // Update color
      const colorIndex = i % smoothedColors.length;
      if (smoothedColors[colorIndex]) {
        color.copy(smoothedColors[colorIndex]);
        // Brighten based on volume
        color.multiplyScalar(1.0 + volume * 3.0);
        meshRef.current!.setColorAt(i, color);
      }
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    
    // Camera controlled by OrbitControls
  });

  return (
    <group name="laser-scene">
      <instancedMesh ref={meshRef} args={[geometry, undefined, count]}>
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
  );
};
