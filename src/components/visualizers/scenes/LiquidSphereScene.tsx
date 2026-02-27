/**
 * File: app/components/visualizers/scenes/LiquidSphereScene.tsx
 * Version: v1.9.73
 * Author: Sut
 * Description: "Resonance Orb" - High-fidelity reactive sphere with fixed real-time feature access.
 */

import React, { useRef, useMemo, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { IcosahedronGeometry, BufferAttribute, DoubleSide, MeshPhysicalMaterial, PointLight, RectAreaLight, Mesh } from 'three';
import { VisualizerSettings } from '../../../types/index.ts';
import { useAudioReactive } from '../../../hooks/useAudioReactive';
import { Stars } from '@react-three/drei';

interface SceneProps {
  analyser: AnalyserNode;
  colors: string[];
  settings: VisualizerSettings;
}

export const LiquidSphereScene: React.FC<SceneProps> = ({ analyser, colors, settings }) => {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<MeshPhysicalMaterial>(null);
  const light1Ref = useRef<PointLight>(null);
  const light2Ref = useRef<PointLight>(null);
  const light3Ref = useRef<PointLight>(null);
  const rectLightRef = useRef<RectAreaLight>(null);
  const starsRef = useRef<any>(null);

  const { features, smoothedColors } = useAudioReactive({ analyser, colors, settings });
  const [c0, c1, c2] = smoothedColors;

  const geometry = useMemo(() => {
      let detail = 1;
      if (settings.quality === 'med') detail = 2;
      if (settings.quality === 'high') detail = 3;
      return new IcosahedronGeometry(4, detail);
  }, [settings.quality]);
  
  const originalPositions = useMemo(() => {
     const pos = geometry.attributes.position;
     const count = pos.count;
     const array = new Float32Array(count * 3);
     for(let i=0; i<count; i++) {
         array[i*3] = pos.getX(i);
         array[i*3+1] = pos.getY(i);
         array[i*3+2] = pos.getZ(i);
     }
     return array;
  }, [geometry]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime() * settings.speed * 0.4;
    const { bass, treble, volume, isBeat } = features;

    if (materialRef.current) {
        materialRef.current.color.set(c0);
        materialRef.current.emissive.set(c1);
        
        const beatFlash = isBeat ? 2.5 : 0;
        const currentEmissive = materialRef.current.emissiveIntensity;
        const targetEmissive = 0.2 + bass * 1.5 + beatFlash;
        materialRef.current.emissiveIntensity = targetEmissive * 0.15 + currentEmissive * 0.85; // Manual lerp
    }
    
    if (light1Ref.current) {
        light1Ref.current.color.set(c0);
        light1Ref.current.position.x = Math.sin(time * 0.5) * 20;
        light1Ref.current.position.z = Math.cos(time * 0.5) * 20;
        light1Ref.current.intensity = 15 + bass * 50;
    }
    if (light2Ref.current) {
        light2Ref.current.color.set(c1);
        light2Ref.current.position.y = Math.cos(time * 0.7) * 20;
        light2Ref.current.intensity = 10 + volume * 40;
    }
    if (light3Ref.current) {
        light3Ref.current.color.set(c2 || c0);
        light3Ref.current.position.x = Math.cos(time * 0.3) * -15;
        light3Ref.current.intensity = 5 + treble * 30;
    }
    if (rectLightRef.current) {
        rectLightRef.current.intensity = 5 + treble * 40; 
        rectLightRef.current.lookAt(0,0,0);
    }

    if (meshRef.current) {
      meshRef.current.rotation.x = time * 0.1;
      meshRef.current.rotation.y = time * 0.15;

      const positionAttribute = meshRef.current.geometry.attributes.position as BufferAttribute;
      const vertex = new Float32Array(3);

      for (let i = 0; i < positionAttribute.count; i++) {
        const x = originalPositions[i * 3];
        const y = originalPositions[i * 3 + 1];
        const z = originalPositions[i * 3 + 2];

        // Apply audio reactive displacement
        const displacement = (bass * 0.5 + treble * 0.3 + volume * 0.2) * settings.sensitivity * 0.5;
        const noise = Math.sin(x * 0.8 + time * 0.5) * 0.1 + Math.cos(y * 0.7 + time * 0.6) * 0.1;
        const pulse = Math.sin(x * 1.2 + y * 1.2 + z * 1.2 + time * 5.0) * 0.1;

        vertex[0] = x * (1 + displacement + noise * 0.5 + pulse * 0.3);
        vertex[1] = y * (1 + displacement + noise * 0.5 + pulse * 0.3);
        vertex[2] = z * (1 + displacement + noise * 0.5 + pulse * 0.3);

        positionAttribute.setXYZ(i, vertex[0], vertex[1], vertex[2]);
      }
      positionAttribute.needsUpdate = true;
      meshRef.current.geometry.computeVertexNormals();
    }

    if (starsRef.current) {
        starsRef.current.rotation.x = time * 0.05 * settings.speed;
        starsRef.current.rotation.y = time * 0.03 * settings.speed;
    }
  });

  return (
    <>
      {!settings.albumArtBackground && <color attach="background" args={['#050505']} />}
      
      <ambientLight intensity={0.2} />
      <pointLight ref={light1Ref} position={[20, 10, 0]} intensity={20} distance={50} decay={2} />
      <pointLight ref={light2Ref} position={[-20, -10, 0]} intensity={15} distance={50} decay={2} />
      <pointLight ref={light3Ref} position={[0, 0, 15]} intensity={10} distance={40} decay={2} />
      <rectAreaLight ref={rectLightRef} position={[0, 0, 10]} width={20} height={20} intensity={10} color={c0} />

      <mesh ref={meshRef} geometry={geometry}>
        <meshPhysicalMaterial 
          ref={materialRef}
          color={c0} 
          metalness={0.9} 
          roughness={0.1} 
          clearcoat={1} 
          clearcoatRoughness={0.1} 
          emissive={c1}
          emissiveIntensity={0.2}
          reflectivity={0.8}
          side={DoubleSide}
        />
      </mesh>

      <Suspense fallback={null}>
        <Stars ref={starsRef} radius={100} depth={50} count={5000} factor={4} saturation={1} fade speed={1} />
      </Suspense>
    </>
  );
};