'use client';
/**
 * File: app/components/visualizers/scenes/LiquidSphereScene.tsx
 * Version: v1.9.85
 * Author: Sut
 * Description: "Resonance Orb" - High-fidelity reactive sphere with fixed real-time feature access.
 */

import React, { useRef, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { VisualizerSettings } from '../../../types/index';
import { useAudioReactive } from '../../../hooks/useAudioReactive';
import { Stars } from '@react-three/drei';
import { ReactiveSphere } from './liquid/ReactiveSphere';
import { SceneLighting } from './liquid/SceneLighting';

interface SceneProps {
  analyser: AnalyserNode;
  colors: string[];
  settings: VisualizerSettings;
}

export const LiquidSphereScene: React.FC<SceneProps> = ({ analyser, colors, settings }) => {
  const starsRef = useRef<any>(null);
  const { features, smoothedColors } = useAudioReactive({ analyser, colors, settings });
  
  // Convert THREE.Color[] to string[] if necessary, though useAudioReactive usually returns Colors.
  // However, SceneLighting expects string[] based on our definition.
  // Let's check SceneLighting definition. It expects string[].
  // smoothedColors from useAudioReactive returns THREE.Color[].
  // We need to cast or convert.
  const colorStrings = smoothedColors.map(c => '#' + c.getHexString());

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime() * settings.speed * 0.4;
    if (starsRef.current) {
        starsRef.current.rotation.x = time * 0.05 * settings.speed;
        starsRef.current.rotation.y = time * 0.03 * settings.speed;
    }
  });

  return (
    <>
      {!settings.albumArtBackground && <color attach="background" args={['#050505']} />}
      
      <SceneLighting settings={settings} features={features} smoothedColors={colorStrings} />
      <ReactiveSphere settings={settings} colors={colors} features={features} smoothedColors={colorStrings} />

      <Suspense fallback={null}>
        <Stars ref={starsRef} radius={100} depth={50} count={5000} factor={4} saturation={1} fade speed={1} />
      </Suspense>
    </>
  );
};
