/**
 * File: app/components/visualizers/scenes/OceanWaveScene.tsx
 * Version: v2.4.1
 * Author: Sut
 * Description: "Joy Division" Style Pulsar Terrain with scrolling history.
 */

import React, { useRef, useMemo, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { InstancedMesh, Color, DataTexture, RedFormat, UnsignedByteType, LinearFilter, DoubleSide, Object3D, ShaderMaterial, NearestFilter, InstancedBufferAttribute } from 'three';
import { VisualizerSettings } from '../../../types/index';
import { useAudioReactive } from '../../../hooks/useAudioReactive';

import { oceanWaveVertexShader, oceanWaveFragmentShader } from './shaders/OceanWaveShaders';

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

  const NUM_LINES = settings.quality === 'high' ? 128 : (settings.quality === 'med' ? 96 : 64); // Increased lines for longer history
  const SEGMENTS_X = settings.quality === 'high' ? 384 : (settings.quality === 'med' ? 192 : 128);
  
  const LINE_WIDTH = 180;
  const LINE_HEIGHT = 25; 
  const Z_SPACING = 2.0; // Adjusted spacing for more lines
  
  const bins = (settings.fftSize || 512) / 2;
  const historyData = useMemo(() => {
    if (!bins || !NUM_LINES || bins <= 0 || NUM_LINES <= 0) return new Uint8Array(0);
    return new Uint8Array(bins * NUM_LINES);
  }, [bins, NUM_LINES]);
  
  const audioTexture = useMemo(() => {
    if (!historyData || historyData.length === 0 || bins <= 0 || NUM_LINES <= 0) {
        return new DataTexture(new Uint8Array(1), 1, 1, RedFormat, UnsignedByteType);
    }
    const tex = new DataTexture(historyData, bins, NUM_LINES, RedFormat, UnsignedByteType);
    tex.magFilter = LinearFilter;
    tex.minFilter = NearestFilter;
    return tex;
  }, [historyData, bins, NUM_LINES]);

  const dummy = useMemo(() => new Object3D(), []);
  
  const lineProgressAttr = useMemo(() => {
    const arr = new Float32Array(NUM_LINES);
    for (let i = 0; i < NUM_LINES; i++) arr[i] = i / Math.max(1, NUM_LINES - 1);
    return new InstancedBufferAttribute(arr, 1);
  }, [NUM_LINES]);

  useLayoutEffect(() => {
      if (meshRef.current) {
          for (let i = 0; i < NUM_LINES; i++) {
              dummy.position.set(0, i * 0.4 - 40, -i * Z_SPACING); // Adjusted Y offset for more lines
              dummy.updateMatrix();
              meshRef.current.setMatrixAt(i, dummy.matrix);
          }
          meshRef.current.instanceMatrix.needsUpdate = true;
          meshRef.current.geometry.setAttribute('aLineProgress', lineProgressAttr);
      }
  }, [NUM_LINES, Z_SPACING, dummy, lineProgressAttr]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uAudioHistory: { value: audioTexture },
    uColorRidge: { value: new Color(0xffffff) },
    uColorBody: { value: new Color(0x000000) },
    uSensitivity: { value: 1.0 },
    uBeat: { value: 0.0 },
  }), [audioTexture]);

  const tempL = useMemo(() => new Uint8Array(bins), [bins]);
  const tempR = useMemo(() => new Uint8Array(bins), [bins]);

  useFrame((state) => {
    if (!historyData || historyData.length < bins) return;

    frameCounterRef.current++;
    if (frameCounterRef.current >= 4) { // Lower sampling rate (every 4 frames instead of 2)
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
        mat.uniforms.uSensitivity.value = settings.sensitivity * 0.75; // Lowered sensitivity
        mat.uniforms.uBeat.value += ((isBeat ? 1.0 : 0.0) - mat.uniforms.uBeat.value) * 0.15;
        if (c2) mat.uniforms.uColorRidge.value.copy(c2); 
        else if (c0) mat.uniforms.uColorRidge.value.copy(c0);
    }
    
    // Camera controlled by OrbitControls
  });

  if (!historyData || historyData.length === 0) return <group />;

  return (
    <>{!settings.albumArtBackground && <color attach="background" args={['#000000']} />}
      <instancedMesh ref={meshRef} args={[undefined, undefined, NUM_LINES]}>
        <planeGeometry args={[LINE_WIDTH, LINE_HEIGHT, SEGMENTS_X, 1]} />
        <shaderMaterial
          side={DoubleSide}
          uniforms={uniforms}
          transparent={true}
          vertexShader={oceanWaveVertexShader}
          fragmentShader={oceanWaveFragmentShader}
        />
      </instancedMesh>
    </>
  );
};