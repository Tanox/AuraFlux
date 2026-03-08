/**
 * File: app/components/visualizers/scenes/DigitalGridScene.tsx
 * Version: v1.10.7
 * Author: Sut
 */

import React, { useRef, useMemo, useLayoutEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { InstancedMesh, Object3D, Color, DataTexture, RedFormat, UnsignedByteType, LinearFilter, DoubleSide } from 'three';
import { MeshReflectorMaterial } from '@react-three/drei';
import { VisualizerSettings } from '../../../types/index';
import { useAudioReactive } from '../../../hooks/useAudioReactive';
import { useDigitalGrid } from './hooks/useDigitalGrid';
import { injectDigitalGridShader } from './shaders/DigitalGridShaders';

type Shader = {
  uniforms: { [key: string]: any };
  vertexShader: string;
  fragmentShader: string;
};

export const DigitalGridScene: React.FC<{ analyser: AnalyserNode; colors: string[]; settings: VisualizerSettings; }> = ({ analyser, colors, settings }) => {
  const meshRef = useRef<InstancedMesh>(null);
  
  const { features, smoothedColors } = useAudioReactive({ analyser, colors, settings });
  const { isBeat } = features;
  const [c0, c1, c2] = smoothedColors;
  
  const { grid, lAttr, rAttr } = useDigitalGrid(settings);

  useLayoutEffect(() => {
    if (meshRef.current) {
      const dummy = new Object3D(), startA = -((grid.COLS - 1) * grid.STEP) / 2, startY = -( (grid.ROWS - 1) * (grid.BRICK_H + grid.GAP_Y)) / 2;
      for (let c = 0; c < grid.COLS; c++) {
        const theta = startA + c * grid.STEP;
        for (let r = 0; r < grid.ROWS; r++) {
          dummy.position.set(Math.sin(theta)*grid.RADIUS, startY + r*(grid.BRICK_H+grid.GAP_Y), grid.RADIUS-(Math.cos(theta)*grid.RADIUS));
          dummy.lookAt(0, dummy.position.y, grid.RADIUS); dummy.scale.set(grid.BRICK_W, grid.BRICK_H, 1.0); dummy.updateMatrix();
          meshRef.current.setMatrixAt(c*grid.ROWS+r, dummy.matrix);
        }
      }
      meshRef.current.instanceMatrix.needsUpdate = true; meshRef.current.geometry.setAttribute('aLayout', lAttr); meshRef.current.geometry.setAttribute('aRandom', rAttr);
    }
  }, [grid, lAttr, rAttr]);

  const data = useMemo(() => new Uint8Array(Math.max(16, analyser.frequencyBinCount)), [analyser]);
  const tex = useMemo(() => { 
    if (!data || data.length === 0) return new DataTexture(new Uint8Array(1), 1, 1, RedFormat, UnsignedByteType);
    const t = new DataTexture(data, data.length, 1, RedFormat, UnsignedByteType); 
    t.magFilter = LinearFilter; 
    return t; 
  }, [data]);
  const uniforms = useMemo(() => ({ uAudioTexture: { value: tex }, uTime: { value: 0 }, uColor1: { value: new Color() }, uColor2: { value: new Color() }, uColor3: { value: new Color() }, uBeat: { value: 0.0 }, uSensitivity: { value: 1.0 } }), [tex]);
  
  const onCompile = useMemo(() => (s: Shader) => {
    injectDigitalGridShader(s, uniforms);
  }, [uniforms]);

  const beatRef = useRef(0);

  useFrame((state) => {
    analyser.getByteFrequencyData(data); tex.needsUpdate = true; if (isBeat) beatRef.current = 1.0; beatRef.current *= 0.92;
    uniforms.uTime.value = state.clock.getElapsedTime(); uniforms.uBeat.value = beatRef.current; uniforms.uSensitivity.value = settings.sensitivity;
    if(c1) uniforms.uColor1.value.copy(c1); if(c0) uniforms.uColor2.value.copy(c0); if(c2) uniforms.uColor3.value.copy(c2);
    // Camera controlled by OrbitControls
  });

  if (!lAttr || !rAttr) return <group />;

  return (
    <>
      {!settings.albumArtBackground && <color attach="background" args={['#000000']} />}
      <ambientLight intensity={0.1}/><instancedMesh ref={meshRef} args={[undefined, undefined, grid.COLS * grid.ROWS]} position={[0,0,-50]}><planeGeometry args={[1.414, 1.414]}/><meshStandardMaterial onBeforeCompile={onCompile} roughness={0.2} metalness={0.9} side={DoubleSide} transparent depthWrite={false}/></instancedMesh>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,-30,-20]}>
        <planeGeometry args={[200,200]}/>
        {/* @ts-ignore */}
        <MeshReflectorMaterial 
          blur={[400,100]} 
          resolution={1024} 
          mixBlur={1} 
          mixStrength={10} 
          roughness={0.7} 
          depthScale={1} 
          minDepthThreshold={0.4} 
          maxDepthThreshold={1.4} 
          color="#050505" 
          metalness={0.8} 
          mirror={0.5}
        />
      </mesh>
    </>
  );
};