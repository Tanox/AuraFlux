/**
 * File: app/components/visualizers/scenes/VortexScene.tsx
 * Version: v1.9.73
 * Author: Sut
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, Color, AdditiveBlending, ShaderMaterial } from 'three';
import { VisualizerSettings } from '../../../types/index.ts';
import { useAudioReactive } from '../../../hooks/useAudioReactive.ts';

interface SceneProps { analyser: AnalyserNode; colors: string[]; settings: VisualizerSettings; }

export const VortexScene: React.FC<SceneProps> = ({ analyser, colors, settings }) => {
  const pointsRef = useRef<Points>(null);
  const { features, smoothedColors } = useAudioReactive({ analyser, colors, settings });
    if (!smoothedColors || smoothedColors.length < 2) return null;
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
    
    accumulatedTimeRef.current += delta * settings.speed * (0.3 + features.volume * 2.0);
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

  if (!positions || !randomness || positions.length === 0) return null;

  return (
    <>
      {!settings.albumArtBackground && <color attach="background" args={['#000000']} />}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-aRandom" args={[randomness, 1]} />
        </bufferGeometry>
        <shaderMaterial transparent depthWrite={false} blending={AdditiveBlending} uniforms={uniforms}
          vertexShader={`
            uniform float uTime;
            uniform float uBass;
            uniform float uMids;
            uniform float uTreble;
            uniform float uBeat;
            attribute float aRandom;
            varying float vDist;
            varying float vRandom;
            varying float vCameraDist;

            void main() {
              vec3 pos = position;
              vRandom = aRandom;
              
              float angle = atan(pos.z, pos.x);
              float dist = length(pos.xz);
              vDist = dist;
              
              // Vortex motion
              float swirl = uTime * (2.0 + uBass * 3.0) / (dist * 0.1 + 1.0);
              float newAngle = angle + swirl + aRandom * 2.0;
              
              float x = cos(newAngle) * dist;
              float z = sin(newAngle) * dist;
              float y = pos.y + sin(dist * 0.1 - uTime * 2.0) * (5.0 + uMids * 10.0);
              
              // Beat expansion
              float expansion = 1.0 + uBeat * 0.2 * (1.0 - dist / 100.0);
              vec3 newPos = vec3(x * expansion, y, z * expansion);
              
              vec4 mvPos = modelViewMatrix * vec4(newPos, 1.0);
              gl_Position = projectionMatrix * mvPos;
              vCameraDist = -mvPos.z;
              
              gl_PointSize = (2.0 + aRandom * 4.0 + uTreble * 5.0) * (300.0 / vCameraDist);
            }
          `}
          fragmentShader={`
            uniform vec3 uColor1;
            uniform vec3 uColor2;
            uniform float uTime;
            uniform float uBass;
            varying float vDist;
            varying float vRandom;
            varying float vCameraDist;

            void main() {
              float d = distance(gl_PointCoord, vec2(0.5));
              if(d > 0.5) discard;
              
              float alpha = pow(1.0 - smoothstep(0.0, 0.5, d), 2.0);
              vec3 col = mix(uColor1, uColor2, sin(vDist * 0.05 - uTime + vRandom) * 0.5 + 0.5);
              
              // Glow near center
              col += vec3(1.0, 0.8, 0.5) * (1.0 - smoothstep(0.0, 20.0, vDist)) * uBass;
              
              // LOD: Fade out distant particles
              float lodAlpha = 1.0 - smoothstep(80.0, 150.0, vCameraDist);

              gl_FragColor = vec4(col, alpha * (0.7 + uBass * 0.3) * lodAlpha);
            }
          `}
        />
      </points>
    </>
  );
};
