'use client';

// src/components/visualizers/3d/oceanWave/OceanWaveScene.tsx v2.3.11
import React, { useRef, useMemo, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { InstancedMesh, Color, DataTexture, RedFormat, UnsignedByteType, LinearFilter, Object3D, ShaderMaterial, NearestFilter, InstancedBufferAttribute, SphereGeometry, Vector3 } from 'three';
import { VisualizerSettings } from '@/types';
import { useAudioReactive } from '@/hooks/audio/useAudioReactive';
import { SceneBackground } from '../../ui/SceneBackground';
import { logger } from '@/utils/logger';
import { useAdaptiveComplexity } from '@/hooks/performance/useAdaptiveComplexity';

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
  
  // 使用自适应复杂度钩子
  const { adaptiveSettings, performanceData } = useAdaptiveComplexity({
    baseSettings: settings
  });
  
  const { features, smoothedColors } = useAudioReactive({ analyser, colors, settings: adaptiveSettings });
  const { isBeat } = features;
  const [c0, , c2] = smoothedColors;

  // Get initial particle count based on quality setting
  const getInitialParticleCount = (): number => {
    return adaptiveSettings.quality === 'high' ? 2048 : (adaptiveSettings.quality === 'medium' ? 1024 : 512);
  };

  // State variables
  const [particleCount, setParticleCount] = React.useState<number>(getInitialParticleCount());
  const [mousePosition, setMousePosition] = React.useState<Vector3>(new Vector3(0, 0, 0));
  
  // LOD system - adjust particle count based on camera distance
  const updateParticleCount = (cameraDistance: number) => {
    let newCount;
    if (cameraDistance < 50) {
      newCount = adaptiveSettings.quality === 'high' ? 2048 : (adaptiveSettings.quality === 'medium' ? 1024 : 512);
    } else if (cameraDistance < 100) {
      newCount = adaptiveSettings.quality === 'high' ? 1024 : (adaptiveSettings.quality === 'medium' ? 512 : 256);
    } else {
      newCount = adaptiveSettings.quality === 'high' ? 512 : (adaptiveSettings.quality === 'medium' ? 256 : 128);
    }
    setParticleCount(newCount);
  };
  
  // Handle mouse movement and convert to 3D coordinates
  const handleMouseMove = (event: any) => {
    // Convert mouse coordinates to normalized device coordinates
    const x = ((event.clientX / window.innerWidth) * 2 - 1) * 90;
    const z = -((event.clientY / window.innerHeight) * 2 - 1) * 50;
    
    // Update mouse position in 3D space
    setMousePosition(new Vector3(x, 0, z));
  };
  const bins = 256;
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
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      // 更有规律的网格分布，模拟海浪
      const gridSize = Math.sqrt(particleCount);
      const gridX = (i % gridSize) / gridSize * 2 - 1;
      const gridZ = Math.floor(i / gridSize) / gridSize * 2 - 1;
      const x = gridX * 90 + (Math.random() - 0.5) * 5;
      const z = gridZ * 50 + (Math.random() - 0.5) * 3;
      arr[i * 3] = x;
      arr[i * 3 + 1] = 0;
      arr[i * 3 + 2] = z;
    }
    return new InstancedBufferAttribute(arr, 3);
  }, [particleCount]);

  useLayoutEffect(() => {
    try {
      if (meshRef.current) {
          for (let i = 0; i < particleCount; i++) {
              dummy.position.set(0, 0, 0);
              dummy.updateMatrix();
              meshRef.current.setMatrixAt(i, dummy.matrix);
          }
          meshRef.current.instanceMatrix.needsUpdate = true;
          meshRef.current.geometry.setAttribute('aParticlePosition', particlePositionAttr);
      }
    } catch (error) {
      logger.error('Error in OceanWaveScene useLayoutEffect:', error);
    }
  }, [particleCount, dummy, particlePositionAttr]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uAudioHistory: { value: audioTexture },
    uColor: { value: new Color(0xffffff) },
    uSensitivity: { value: 1.0 },
    uBeat: { value: 0.0 },
    uLightPosition: { value: new Vector3(100, 50, 100) },
    uMousePosition: { value: new Vector3(0, 0, 0) },
  }), [audioTexture]);

  const tempL = useMemo(() => new Uint8Array(bins), [bins]);
  const tempR = useMemo(() => new Uint8Array(bins), [bins]);

  // 添加性能检测
  const performanceRef = useRef({
    lastFrameTime: 0,
    frameCount: 0,
    fps: 60,
    lastUpdateTime: 0,
    updateInterval: 1000
  });

  // Update audio texture with frequency data
  const updateAudioTexture = () => {
    try {
      analyser.getByteFrequencyData(tempL);
      if (analyserR) analyserR.getByteFrequencyData(tempR);
      else tempR.set(tempL);
    } catch (e) {
      logger.error('Error getting audio frequency data:', e);
      return false;
    }

    const limit = Math.floor(bins * 0.7); 
    for (let x = 0; x < bins; x++) {
      const nx = (x / bins) * 2 - 1; 
      const bin = Math.floor(Math.abs(nx) * limit);
      historyData[x] = (nx < 0) ? tempL[bin] : tempR[bin];
    }
    audioTexture.needsUpdate = true;
    return true;
  };

  // Update shader uniforms
  const updateShaderUniforms = (state: any) => {
    if (!meshRef.current) return;
    
    const mat = meshRef.current.material as ShaderMaterial;
    const time = state.clock.getElapsedTime();
    
    // Update time and sensitivity
    mat.uniforms.uTime.value = time;
    mat.uniforms.uSensitivity.value = adaptiveSettings.sensitivity * 1.5;
    
    // Update beat reaction
    mat.uniforms.uBeat.value += ((isBeat ? 1.0 : 0.0) - mat.uniforms.uBeat.value) * 0.15;
    
    // Update color
    if (c2) mat.uniforms.uColor.value.copy(c2); 
    else if (c0) mat.uniforms.uColor.value.copy(c0);
    
    // Update performance mode
    mat.uniforms.uPerformanceMode = mat.uniforms.uPerformanceMode || { value: 0 };
    mat.uniforms.uPerformanceMode.value = performanceData.isLowPerformance ? 1 : 0;
    
    // Update light position (dynamic)
    const lightX = Math.sin(time * 0.2) * 100;
    const lightZ = Math.cos(time * 0.2) * 100;
    mat.uniforms.uLightPosition.value.set(lightX, 50, lightZ);
    
    // Update mouse position
    mat.uniforms.uMousePosition.value.copy(mousePosition);
  };

  // Update performance data
  const updatePerformanceData = () => {
    const currentTime = performance.now();
    const deltaTime = currentTime - performanceRef.current.lastFrameTime;
    performanceRef.current.lastFrameTime = currentTime;
    performanceRef.current.frameCount++;

    if (currentTime - performanceRef.current.lastUpdateTime > performanceRef.current.updateInterval) {
      performanceRef.current.fps = Math.round((performanceRef.current.frameCount * 1000) / (currentTime - performanceRef.current.lastUpdateTime));
      performanceRef.current.frameCount = 0;
      performanceRef.current.lastUpdateTime = currentTime;
    }
  };

  useFrame((state) => {
    try {
      if (!historyData || historyData.length < bins) return;

      // Calculate camera distance for LOD
      const cameraDistance = state.camera.position.length();
      updateParticleCount(cameraDistance);

      // Update performance data
      updatePerformanceData();

      // Adjust update interval based on performance
      const isLowPerformance = performanceData.isLowPerformance;
      const updateInterval = isLowPerformance ? 4 : 2;

      // Update audio texture at specified interval
      frameCounterRef.current++;
      if (frameCounterRef.current >= updateInterval) {
        frameCounterRef.current = 0;
        historyData.copyWithin(bins, 0, historyData.length - bins);
        updateAudioTexture();
      }

      // Update shader uniforms
      updateShaderUniforms(state);
      
      // Camera controlled by OrbitControls
    } catch (error) {
      logger.error('Error in OceanWaveScene useFrame:', error);
    }
  });

  if (!historyData || historyData.length === 0) return <group />;

  return (
    <>
      <SceneBackground enabled={!settings.albumArtBackground} color="#000000" />
      <instancedMesh 
        ref={meshRef} 
        args={[undefined, undefined, particleCount]}
        onPointerMove={handleMouseMove}
      >
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
