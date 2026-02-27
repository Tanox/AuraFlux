/**
 * File: app/components/visualizers/scenes/SilkWaveScene.tsx
 * Version: v1.9.70
 * Author: Sut
 * Description: "Lumina Silk" - Optimized fluid ribbons with staggered pulses to avoid clumping.
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { InstancedMesh, ShaderMaterial, Color, AdditiveBlending, MathUtils, DoubleSide, InstancedBufferAttribute } from 'three';
import { VisualizerSettings } from '../../../types/index.ts';
import { useAudioReactive } from '../../../hooks/useAudioReactive';

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
  const RIBBON_WIDTH = 260;

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
    mat.uniforms.uBass.value += (features.bass - mat.uniforms.uBass.value) * ls;
    mat.uniforms.uEnergyL.value += (features.energyL - mat.uniforms.uEnergyL.value) * ls;
    mat.uniforms.uEnergyR.value += (features.energyR - mat.uniforms.uEnergyR.value) * ls;
    
    if (c0) mat.uniforms.uColor1.value.copy(c0); 
    if (c1) mat.uniforms.uColor2.value.copy(c1); 
    if (c2) mat.uniforms.uColor3.value.copy(c2);
    
    state.camera.position.x = Math.sin(time * 0.05) * 12; 
    state.camera.position.y = Math.cos(time * 0.07) * 4 + 2; 
    state.camera.lookAt(0, 0, -40);
  });

  if (!channels || !randoms || !layerIndices) return null;

  return (
    <>
      {!settings.albumArtBackground && <color attach="background" args={['#000000']} />}
      <instancedMesh ref={meshRef} args={[undefined, undefined, MAX_LINES]}>
        <planeGeometry args={[RIBBON_WIDTH, 1.0, SEGMENTS_X, 1]}>
            <primitive attach="attributes-aChannel" object={channels} />
            <primitive attach="attributes-aRandom" object={randoms} />
            <primitive attach="attributes-aLayerIndex" object={layerIndices} />
        </planeGeometry>
        <shaderMaterial transparent depthWrite={false} side={DoubleSide} blending={AdditiveBlending} uniforms={uniforms}
          vertexShader={`
            uniform float uTime, uSpeed, uBass, uEnergyL, uEnergyR, uShockwave, uDensity; 
            attribute float aChannel, aRandom, aLayerIndex; 
            varying float vIntensity, vDepth, vSideFade, vVisibility, vRandom; 
            varying vec2 vUv; 
            vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; } 
            vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; } 
            vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); } 
            vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; } 
            float snoise(vec3 v) { const vec2 C = vec2(1.0/6.0, 1.0/3.0); const vec4 D = vec4(0.0, 0.5, 1.0, 2.0); vec3 i = floor(v + dot(v, C.yyy)); vec3 x0 = v - i + dot(i, C.xxx); vec3 g = step(x0.yzx, x0.xyz); vec3 l = 1.0 - g; vec3 i1 = min(g.xyz, l.zxy); vec3 i2 = max(g.xyz, l.zxy); vec3 x1 = x0 - i1 + C.xxx; vec3 x2 = x0 - i2 + C.yyy; vec3 x3 = x0 - D.yyy; i = mod289(i); vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0)); vec4 j = p - 49.0 * floor(p * (1.0/49.0)); vec4 x_ = floor(j * (1.0/7.0)); vec4 y_ = floor(j - 7.0 * x_); vec4 x = x_ * (1.0/7.0) - 0.5; vec4 y = y_ * (1.0/7.0) - 0.5; vec4 h = 1.0 - abs(x) - abs(y); vec4 b0 = vec4(x.xy, y.xy); vec4 b1 = vec4(x.zw, y.zw); vec4 s0 = floor(b0)*2.0 + 1.0; vec4 s1 = floor(b1)*2.0 + 1.0; vec4 sh = -step(h, vec4(0.0)); vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy; vec4 a1 = b1.xzyw + s1.zzww*sh.zzww; vec3 p0 = vec3(a0.xy,h.x); vec3 p1 = vec3(a0.zw,h.y); vec3 p2 = vec3(a1.xy,h.z); vec3 p3 = vec3(a1.zw,h.w); vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3))); p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w; vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0); m = m * m; return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3))); } 
            void main() { 
                vUv = uv; vRandom = aRandom; 
                vec3 pos = position; 
                float time = uTime * 0.6 * uSpeed; 
                float wave1 = sin(pos.x * 0.012 + time + aRandom * 6.28) * 12.0 * (1.0 + uBass * 1.5); 
                float wave2 = sin(pos.x * 0.02 + time * 1.4 + aRandom * 2.1) * 8.0 * (1.0 + uEnergyL * 1.8); 
                float noise = snoise(vec3(pos.x * 0.01, aRandom * 5.0, time * 0.5)) * 14.0 * (1.0 + uEnergyR * 1.8); 
                pos.y += wave1 + wave2 + noise; 
                pos.z -= 110.0 * aLayerIndex; 
                pos.z += sin(pos.x*0.02+time+aRandom*3.0)*5.0*(1.0+uBass); 
                float shock = uShockwave * 12.0 * sin(uv.x * 3.14159) * (1.0-aLayerIndex); pos.y += shock; 
                vIntensity = pow(abs(wave1 + noise)*0.02, 2.0); 
                vDepth = aLayerIndex; 
                vSideFade = 1.0 - pow(abs(uv.x-0.5)*2.0, 3.0); 
                vVisibility = step(aRandom, uDensity); 
                gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(pos, 1.0); 
            }`
          }
          fragmentShader={`
            uniform vec3 uColor1, uColor2, uColor3; 
            varying float vIntensity, vDepth, vSideFade, vVisibility, vRandom; 
            varying vec2 vUv; 
            void main() { 
                if (vVisibility < 0.5) discard; 
                float edge = smoothstep(0.0, 0.05, abs(vUv.y-0.5)*2.0); 
                float alpha = (0.3 + vIntensity * 3.0) * (1.0 - vDepth * 0.8) * vSideFade * (1.0 - edge); 
                if (alpha < 0.01) discard; 
                vec3 c1 = mix(uColor1, uColor2, vRandom); 
                vec3 c2 = mix(uColor2, uColor3, vRandom); 
                vec3 finalColor = mix(c1, c2, smoothstep(0.0, 0.6, vIntensity)); 
                gl_FragColor = vec4(finalColor, alpha); 
            }`
          }
        />
      </instancedMesh>
    </>
  );
};