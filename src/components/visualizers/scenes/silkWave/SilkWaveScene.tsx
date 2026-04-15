'use client';
// File: src\components\visualizers\scenes\silkWave\SilkWaveScene.tsx | Version: v2.2.23

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { InstancedMesh, ShaderMaterial, Color, AdditiveBlending, MathUtils, DoubleSide, InstancedBufferAttribute } from 'three';
import { VisualizerSettings } from '@/types';
import { useAudioReactive } from '@/hooks/useAudioReactive';
import { silkWaveVertexShader, silkWaveFragmentShader } from '../shaders/SilkWaveShaders';
import { SceneBackground } from '../../ui/SceneBackground';

interface SceneProps {
  analyser: AnalyserNode;
  analyserR?: AnalyserNode | null;
  colors: string[];
  settings: VisualizerSettings;
}

export const SilkWaveScene: React.FC<SceneProps> = ({ analyser, analyserR, colors, settings }) => {
  const meshRef = useRef<InstancedMesh>(null);
  const { features, smoothedColors } = useAudioReactive({ analyser, analyserR, colors, settings });
  const [c0, c1, c2] = smoothedColors;

  const SEGMENTS_X = settings.quality === 'high' ? 512 : (settings.quality === 'med' ? 320 : 160);
  const MAX_LINES = 50; 
  const RIBBON_WIDTH = 780; // Increased 3x from 260

  const { channels, randoms, layerIndices } = useMemo(() => {
    const ch = new Float32Array(MAX_LINES), rnd = new Float32Array(MAX_LINES), idx = new Float32Array(MAX_LINES);
    for (let i = 0; i < MAX_LINES; i++) { 
        idx[i] = i / Math.max(1, MAX_LINES - 1); 
        ch[i] = i % 2 === 0 ? 1.0 : -1.0; 
        rnd[i] = Math.random(); 
    }
    return { 
        channels: new InstancedBufferAttribute(ch, 1), 
        randoms: new InstancedBufferAttribute(rnd, 1), 
        layerIndices: new InstancedBufferAttribute(idx, 1) 
    };
  }, [MAX_LINES]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 }, uSpeed: { value: 1.0 }, uBass: { value: 0 }, uEnergyL: { value: 0 }, 
    uEnergyR: { value: 0 }, uShockwave: { value: 0 }, uDensity: { value: 0.1 }, 
    uColor1: { value: new Color() }, uColor2: { value: new Color() }, uColor3: { value: new Color() }
  }), []);

  const shockwaveRef = useRef(0), densityRef = useRef(0.1);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    if (features.isBeat) shockwaveRef.current = 1.0; 
    shockwaveRef.current = MathUtils.lerp(shockwaveRef.current, 0, 0.06); 

    const targetDensity = MathUtils.clamp(0.1 + features.volume * 1.5, 0.1, 1.0);
    densityRef.current = MathUtils.lerp(densityRef.current, targetDensity, 0.03);

    const mat = meshRef.current.material as ShaderMaterial, time = state.clock.getElapsedTime();
    mat.uniforms.uTime.value = time; 
    mat.uniforms.uSpeed.value = settings.speed; 
    mat.uniforms.uShockwave.value = shockwaveRef.current; 
    mat.uniforms.uDensity.value = densityRef.current;
    
    const ls = 0.15; 
    mat.uniforms.uBass.value += (features.bass * 0.3 - mat.uniforms.uBass.value) * ls;
    mat.uniforms.uEnergyL.value += (features.energyL * 0.3 - mat.uniforms.uEnergyL.value) * ls;
    mat.uniforms.uEnergyR.value += (features.energyR * 0.3 - mat.uniforms.uEnergyR.value) * ls;
    
    if (c0) mat.uniforms.uColor1.value.copy(c0); 
    if (c1) mat.uniforms.uColor2.value.copy(c1); 
    if (c2) mat.uniforms.uColor3.value.copy(c2);
    
    // Camera controlled by OrbitControls
  });

  if (!channels || !randoms || !layerIndices) return null;

  return (
    <>
      <SceneBackground enabled={!settings.albumArtBackground} color="#000000" />
      <instancedMesh ref={meshRef} args={[undefined, undefined, MAX_LINES]}>
        <planeGeometry args={[RIBBON_WIDTH, 1.0, SEGMENTS_X, 1]}>
            <primitive attach="attributes-aChannel" object={channels} />
            <primitive attach="attributes-aRandom" object={randoms} />
            <primitive attach="attributes-aLayerIndex" object={layerIndices} />
        </planeGeometry>
        <shaderMaterial transparent depthWrite={false} side={DoubleSide} blending={AdditiveBlending} uniforms={uniforms}
          vertexShader={silkWaveVertexShader}
          fragmentShader={silkWaveFragmentShader}
        />
      </instancedMesh>
    </>
  );
};