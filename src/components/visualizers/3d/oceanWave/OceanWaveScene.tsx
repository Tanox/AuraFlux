'use client';
// File: src\components\visualizers\3d\oceanWave\OceanWaveScene.tsx | Version: v2.3.6

import React, { useRef, useMemo, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { InstancedMesh, Color, DataTexture, RedFormat, UnsignedByteType, LinearFilter, Object3D, ShaderMaterial, NearestFilter, InstancedBufferAttribute, SphereGeometry } from 'three';
import { VisualizerSettings } from '@/types';
import { useAudioReactive } from '@/hooks/audio/useAudioReactive';
import { SceneBackground } from '../../ui/SceneBackground';

import { oceanWaveVertexShader, oceanWaveFragmentShader } from '../shaders/OceanWaveShaders';

interface SceneProps {
  analyser: AnalyserNode;
  analyserR?: AnalyserNode | null;
  colors: string[];
  settings: VisualizerSettings;
}

export const OceanWaveScene: React.FC<SceneProps> = ({ analyser, analyserR, colors, settings }) => {
  const meshRef = useRef<InstancedMesh>(null);
  const frameCounterRef = useRef(0);
  
  const { features, smoothedColors } = useAudioReactive({ analyser, colors, settings });
  const { isBeat } = features;
  const [c0, , c2] = smoothedColors;

  const PARTICLE_COUNT = settings.quality === 'high' ? 2048 : (settings.quality === 'med' ? 1024 : 512);
  const bins = (settings.fftSize || 512) / 2;
  const historyData = useMemo(() => {
    if (!bins || bins <= 0) return new Uint8Array(0);
    return new Uint8Array(bins * 16);
  }, [bins]);
  
  const audioTexture = useMemo(() => {
    if (!historyData || historyData.length === 0 || bins <= 0) {
        return new DataTexture(new Uint8Array(1), 1, 1, RedFormat, UnsignedByteType);
    }
    const tex = new DataTexture(historyData, bins, 16, RedFormat, UnsignedByteType);
    tex.magFilter = LinearFilter;
    tex.minFilter = NearestFilter;
    return tex;
  }, [historyData, bins]);

  const dummy = useMemo(() => new Object3D(), []);
  
  const particlePositionAttr = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // 更有规律的网格分布，模拟海浪
      const gridSize = Math.sqrt(PARTICLE_COUNT);
      const gridX = (i % gridSize) / gridSize * 2 - 1;
      const gridZ = Math.floor(i / gridSize) / gridSize * 2 - 1;
      const x = gridX * 90 + (Math.random() - 0.5) * 5;
      const z = gridZ * 50 + (Math.random() - 0.5) * 3;
      arr[i * 3] = x;
      arr[i * 3 + 1] = 0;
      arr[i * 3 + 2] = z;
    }
    return new InstancedBufferAttribute(arr, 3);
  }, [PARTICLE_COUNT]);

  useLayoutEffect(() => {
      if (meshRef.current) {
          for (let i = 0; i < PARTICLE_COUNT; i++) {
              dummy.position.set(0, 0, 0);
              dummy.updateMatrix();
              meshRef.current.setMatrixAt(i, dummy.matrix);
          }
          meshRef.current.instanceMatrix.needsUpdate = true;
          meshRef.current.geometry.setAttribute('aParticlePosition', particlePositionAttr);
      }
  }, [PARTICLE_COUNT, dummy, particlePositionAttr]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uAudioHistory: { value: audioTexture },
    uColor: { value: new Color(0xffffff) },
    uSensitivity: { value: 1.0 },
    uBeat: { value: 0.0 },
  }), [audioTexture]);

  const tempL = useMemo(() => new Uint8Array(bins), [bins]);
  const tempR = useMemo(() => new Uint8Array(bins), [bins]);

  useFrame((state) => {
    if (!historyData || historyData.length < bins) return;

    frameCounterRef.current++;
    if (frameCounterRef.current >= 2) {
        frameCounterRef.current = 0;
        historyData.copyWithin(bins, 0, historyData.length - bins);

        try {
            analyser.getByteFrequencyData(tempL);
            if (analyserR) analyserR.getByteFrequencyData(tempR);
            else tempR.set(tempL);
        } catch (e) { return; }

        const limit = Math.floor(bins * 0.7); 
        for (let x = 0; x < bins; x++) {
            const nx = (x / bins) * 2 - 1; 
            const bin = Math.floor(Math.abs(nx) * limit);
            historyData[x] = (nx < 0) ? tempL[bin] : tempR[bin];
        }
        audioTexture.needsUpdate = true;
    }

    if (meshRef.current) {
        const mat = meshRef.current.material as ShaderMaterial;
        mat.uniforms.uTime.value = state.clock.getElapsedTime();
        mat.uniforms.uSensitivity.value = settings.sensitivity * 1.5;
        mat.uniforms.uBeat.value += ((isBeat ? 1.0 : 0.0) - mat.uniforms.uBeat.value) * 0.15;
        if (c2) mat.uniforms.uColor.value.copy(c2); 
        else if (c0) mat.uniforms.uColor.value.copy(c0);
    }
    
    // Camera controlled by OrbitControls
  });

  if (!historyData || historyData.length === 0) return <group />;

  return (
    <>
      <SceneBackground enabled={!settings.albumArtBackground} color="#000000" />
      <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
        <sphereGeometry args={[1, 8, 8]} />
        <shaderMaterial
          uniforms={uniforms}
          transparent={true}
          vertexShader={oceanWaveVertexShader}
          fragmentShader={oceanWaveFragmentShader}
        />
      </instancedMesh>
    </>
  );
};
