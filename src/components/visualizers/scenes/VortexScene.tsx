'use client';
/**
 * File: app/components/visualizers/scenes/VortexScene.tsx
 * Version: v1.10.7
 * Author: Sut
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, Color, AdditiveBlending, ShaderMaterial } from 'three';
import { VisualizerSettings } from '../../../types/index';
import { useAudioReactive } from '../../../hooks/useAudioReactive';
import { vortexVertexShader, vortexFragmentShader } from './shaders/VortexShaders';
import { SceneBackground } from '../../ui/SceneBackground';

interface SceneProps { analyser: AnalyserNode; colors: string[]; settings: VisualizerSettings; }

export const VortexScene: React.FC<SceneProps> = ({ analyser, colors, settings }) => {
  const pointsRef = useRef<Points>(null);
  const { features, smoothedColors } = useAudioReactive({ analyser, colors, settings });
  const [c0, c1] = smoothedColors;
  
  const count = settings.quality === 'high' ? 15000 : settings.quality === 'med' ? 10000 : 5000;
  
  const [positions, randomness] = useMemo(() => {
    const pos = new Float32Array(count * 3), rnd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Create a spiral/vortex distribution
      const angle = Math.random() * Math.PI * 2;
      const radius = 5 + Math.random() * 80;
      const height = (Math.random() - 0.5) * 100;
      
      pos[i*3] = Math.cos(angle) * radius;
      pos[i*3+1] = height;
      pos[i*3+2] = Math.sin(angle) * radius;
      
      rnd[i] = Math.random();
    }
    return [pos, rnd];
  }, [count]);

  const uniforms = useMemo(() => ({ 
    uTime:{value:0}, uBass:{value:0}, uMids:{value:0}, uTreble:{value:0}, 
    uBeat:{value:0}, uVolume:{value:0}, uColor1:{value:new Color()}, uColor2:{value:new Color()} 
  }), []);
  
  const beatTimerRef = useRef(0), accumulatedTimeRef = useRef(0);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const mat = pointsRef.current.material as ShaderMaterial, sysTime = state.clock.getElapsedTime();
    
    accumulatedTimeRef.current += delta * settings.speed * (0.3 + features.volume * 2.0) * 0.04; // Reduced to 20% (0.2 * 0.2 = 0.04)
    if (features.isBeat) beatTimerRef.current = sysTime;
    
    mat.uniforms.uTime.value = accumulatedTimeRef.current; 
    mat.uniforms.uBass.value = features.bass; 
    mat.uniforms.uMids.value = features.mids; 
    mat.uniforms.uTreble.value = features.treble; 
    mat.uniforms.uVolume.value = features.volume;
    
    const beatPhase = Math.max(0, Math.exp(-(sysTime - beatTimerRef.current) * 3.0));
    mat.uniforms.uBeat.value = beatPhase; 
    
    if (c0) mat.uniforms.uColor1.value.copy(c0); 
    if (c1) mat.uniforms.uColor2.value.copy(c1);
    
    pointsRef.current.rotation.y = accumulatedTimeRef.current * 0.1; 
  });

  if (!positions || !randomness || positions.length === 0) return <group />;

  return (
    <>
      <SceneBackground enabled={!settings.albumArtBackground} color="#000000" />
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-aRandom" args={[randomness, 1]} />
        </bufferGeometry>
        <shaderMaterial transparent depthWrite={false} blending={AdditiveBlending} uniforms={uniforms}
          vertexShader={vortexVertexShader}
          fragmentShader={vortexFragmentShader}
        />
      </points>
    </>
  );
};
