'use client';

// src/components/visualizers/3d/neuralFlow/NeuralFlowScene.tsx v2.3.10


import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, AdditiveBlending, ShaderMaterial } from 'three';
import { VisualizerSettings } from '@/types';
import { useAudioReactive } from '@/hooks/audio/useAudioReactive';
import { neuralFlowVertexShader, neuralFlowFragmentShader } from '../shaders/NeuralFlowShaders';
import { SceneBackground } from '../../ui/SceneBackground';

interface SceneProps {
  analyser: AnalyserNode;
  analyserR?: AnalyserNode | null;
  colors: string[];
  settings: VisualizerSettings;
}

export const NeuralFlowScene: React.FC<SceneProps> = ({ analyser, analyserR, colors, settings }) => {
  const pointsRef = useRef<any>(null);
  const { features, smoothedColors } = useAudioReactive({ analyser, analyserR, colors, settings });
  const [c0, c1] = smoothedColors;
  
  const count = settings.quality === 'high' ? 12000 : settings.quality === 'medium' ? 8000 : 4000;
  const [positions, randomness] = useMemo(() => {
    const pos = new Float32Array(count * 3), rnd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 30 + Math.random() * 50, th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
      const b = Math.sin(th * 3) * Math.cos(ph * 5) * 10.0;
      pos[i * 3] = (r + b) * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = (r + b) * Math.sin(ph) * Math.sin(th);
      pos[i * 3 + 2] = (r + b) * Math.cos(ph);
      rnd[i] = Math.random();
    }
    return [pos, rnd];
  }, [count]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uBass: { value: 0 },
    uMids: { value: 0 },
    uTreble: { value: 0 },
    uBeat: { value: 0 },
    uVolume: { value: 0 },
    uColor1: { value: new Color() },
    uColor2: { value: new Color() }
  }), []);
  
  const beatTimerRef = useRef(0);
  const accumulatedTimeRef = useRef(0);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const mat = pointsRef.current.material as ShaderMaterial;
    const sysTime = state.clock.getElapsedTime();
    
    // Use features from useAudioReactive which are updated in its own useFrame
    accumulatedTimeRef.current += delta * settings.speed * (0.2 + features.volume * 2.5);
    if (features.isBeat) beatTimerRef.current = sysTime;
    
    mat.uniforms.uTime.value = accumulatedTimeRef.current;
    mat.uniforms.uBass.value = Math.pow(features.bass, 1.5);
    mat.uniforms.uMids.value = features.mids;
    mat.uniforms.uTreble.value = features.treble;
    mat.uniforms.uVolume.value = features.volume;
    
    const beatPhase = Math.max(0, Math.exp(-(sysTime - beatTimerRef.current) * 4.0));
    mat.uniforms.uBeat.value = beatPhase;
    
    if (c0) mat.uniforms.uColor1.value.copy(c0);
    if (c1) mat.uniforms.uColor2.value.copy(c1);
    
    pointsRef.current.rotation.y = accumulatedTimeRef.current * 0.05;
    pointsRef.current.rotation.z = Math.sin(accumulatedTimeRef.current * 0.1) * 0.1;
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
          vertexShader={neuralFlowVertexShader}
          fragmentShader={neuralFlowFragmentShader}
        />
      </points>
    </>
  );
};
