'use client';
// File: /src/components/visualizers/scenes/CubeFieldScene.tsx | Version: v2.2.22

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { InstancedMesh, PointLight, Vector3, Euler, Object3D, MeshStandardMaterial, BoxGeometry, AmbientLight, DirectionalLight, Fog, Mesh, SphereGeometry, MeshBasicMaterial, AdditiveBlending } from 'three';
import { VisualizerSettings } from '@/types';
import { useAudioReactive } from '@/hooks/useAudioReactive';
import { SceneBackground } from '../ui/SceneBackground';

interface SceneProps {
  analyser: AnalyserNode;
  analyserR?: AnalyserNode | null;
  colors: string[];
  settings: VisualizerSettings;
}

interface CubeState {
  x: number;
  y: number;
  z: number;
  scale: number;
  currentScale: number;
  isStructure: boolean;
  speedOffset: number;
  rotationAxis: Vector3;
  initialRotation: Euler;
  rotationSpeed: number;
  speedMult: number;
  torque: number;
  phase: number;
  driftX: number;
  driftY: number;
  spectralAffinity: number;
  tumbleRate: number;
  tumblePhase: number;
  collisionTimer: number;
  isColliding: boolean;
  deformation: number;
}

interface CollisionEffect {
  position: Vector3;
  size: number;
  alpha: number;
  color: Vector3;
}

export const CubeFieldScene: React.FC<SceneProps> = ({ analyser, analyserR, colors, settings }) => {
  const meshRef = useRef<InstancedMesh>(null);
  const coreLightRef = useRef<PointLight>(null);
  const collisionEffectsRef = useRef<CollisionEffect[]>([]);
  
  const { features, smoothedColors } = useAudioReactive({ analyser, analyserR, colors, settings });
  const { bass, mids, treble, volume, isBeat } = features;
  
  const [c0, c1, c2] = smoothedColors;
  
  const count = settings.quality === 'high' ? 1200 : settings.quality === 'med' ? 800 : 400;
  const dummy = useMemo(() => new Object3D(), []);
  
  // Use a local data array for spectral mapping if needed, but ensure it's safe
  const binCount = Math.max(16, analyser.frequencyBinCount || 512);
  const localDataArray = useMemo(() => new Uint8Array(binCount), [binCount]);

  const particles = useMemo(() => {
    const temp: CubeState[] = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 300;
      const y = (Math.random() - 0.5) * 200;
      const z = (Math.random() - 0.5) * 450;
      const isStructure = Math.random() > 0.95;
      const scaleBase = isStructure ? (1.5 + Math.random() * 3.0) : (0.1 + Math.random() * 0.4);
      const rotAxis = new Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      ).normalize();
      const initialRotation = new Euler(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      temp.push({
        x,
        y,
        z,
        scale: scaleBase,
        currentScale: scaleBase,
        isStructure,
        speedOffset: isStructure ? 0.3 + Math.random() * 0.9 : 1.5 + Math.random() * 2.5,
        rotationAxis: rotAxis,
        initialRotation,
        rotationSpeed: (Math.random() - 0.5) * (isStructure ? 0.0005 : 0.004),
        speedMult: isStructure ? 0.2 + Math.random() * 1.8 : 0.66 + Math.random() * 0.67,
        torque: 0,
        phase: Math.random() * Math.PI * 2,
        driftX: (Math.random() - 0.5) * (isStructure ? 0.05 : 0.2),
        driftY: (Math.random() - 0.5) * (isStructure ? 0.05 : 0.2),
        spectralAffinity: Math.pow(Math.random(), 1.5),
        tumbleRate: 0.5 + Math.random() * 2.0,
        tumblePhase: Math.random() * Math.PI * 2,
        collisionTimer: 0,
        isColliding: false,
        deformation: 0
      });
    }
    return temp;
  }, [count]);

  const initialSetupRef = useRef(false);

  useFrame((state) => {
    if (!meshRef.current || !analyser) return;
    
    const time = state.clock.getElapsedTime();
    const delta = state.clock.getDelta();
    analyser.getByteFrequencyData(localDataArray);
    
    const globalSpeed = settings.speed * 4.5 * (1.0 + volume * 2.0 + (isBeat ? 2.5 : 0));
    const centerX = Math.sin(time * 0.2) * 35;
    const centerY = Math.cos(time * 0.7) * 25;
    
    // Camera controlled by OrbitControls
    
    if (coreLightRef.current) {
      coreLightRef.current.position.set(centerX, centerY, -80);
      coreLightRef.current.color.set(c1);
      coreLightRef.current.intensity = 15 + bass * 35 + (isBeat ? 50 : 0);
    }

    const mat = meshRef.current.material as MeshStandardMaterial;
    if (mat) {
      mat.color.set(c0);
      mat.emissive.set(c1);
      mat.emissiveIntensity = 0.4 + treble * 4.0 + (isBeat ? 3.5 : 0);
      // 添加发光效果
      mat.emissiveIntensity *= 1.5;
    }

    const rotationBoost = 1.0 + mids * 2.0 + treble * 2.5;
    const binLimit = Math.floor(localDataArray.length * 0.6);
    
    // 检测立方体碰撞
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        const distance = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) + Math.pow(p1.z - p2.z, 2));
        const minDistance = (p1.currentScale + p2.currentScale) * 0.8;
        
        if (distance < minDistance) {
          // 发生碰撞
          if (!p1.isColliding || !p2.isColliding) {
            const collisionX = (p1.x + p2.x) / 2;
            const collisionY = (p1.y + p2.y) / 2;
            const collisionZ = (p1.z + p2.z) / 2;
            
            collisionEffectsRef.current.push({
              position: new Vector3(collisionX, collisionY, collisionZ),
              size: (p1.currentScale + p2.currentScale) / 2,
              alpha: 1,
              color: new Vector3().set(c1.r, c1.g, c1.b)
            });
            
            // 碰撞响应
            const normal = new Vector3(p2.x - p1.x, p2.y - p1.y, p2.z - p1.z).normalize();
            const pushForce = 0.5;
            
            p1.x -= normal.x * pushForce;
            p1.y -= normal.y * pushForce;
            p1.z -= normal.z * pushForce;
            
            p2.x += normal.x * pushForce;
            p2.y += normal.y * pushForce;
            p2.z += normal.z * pushForce;
            
            // 触发变形效果
            p1.deformation = 0.2;
            p2.deformation = 0.2;
          }
          
          p1.isColliding = true;
          p2.isColliding = true;
          p1.collisionTimer = 0.5;
          p2.collisionTimer = 0.5;
        }
      }
    }
    
    particles.forEach((p, i) => {
      // 更新碰撞状态
      if (p.collisionTimer > 0) {
        p.collisionTimer -= delta;
      } else {
        p.isColliding = false;
      }
      
      // 更新变形效果
      if (p.deformation > 0) {
        p.deformation -= delta * 2;
      }
      
      p.z += globalSpeed * p.speedOffset * 0.016;
      if (p.z > 60) {
        p.z -= 450;
        p.x = (Math.random() - 0.5) * 300;
        p.y = (Math.random() - 0.5) * 200;
        p.rotationAxis.set(
          Math.random() - 0.5,
          Math.random() - 0.5,
          Math.random() - 0.5
        ).normalize();
      }
      
      p.x += p.driftX * settings.speed * 0.15;
      p.y += p.driftY * settings.speed * 0.15;
      
      if (p.x > 180) p.x -= 360; else if (p.x < -180) p.x += 360;
      if (p.y > 120) p.y -= 240; else if (p.y < -120) p.y += 240;
      
      const spectralIdx = Math.floor(p.spectralAffinity * binLimit);
      const reaction = (localDataArray[spectralIdx] / 255) * settings.sensitivity;
      
      const dF = Math.max(0, -p.z / 350);
      dummy.position.set(
        p.x + centerX * Math.pow(dF, 1.2),
        p.y + centerY * Math.pow(dF, 1.2),
        p.z
      );
      
      if (isBeat) p.torque += (Math.random() * 0.015 + 0.005) * settings.sensitivity;
      p.torque *= 0.94;
      
      p.rotationAxis.x += Math.sin(time * 0.3 + p.tumblePhase) * 0.01;
      p.rotationAxis.y += Math.cos(time * 0.2 + p.tumblePhase) * 0.01;
      p.rotationAxis.normalize();
      
      if (!initialSetupRef.current) dummy.rotation.copy(p.initialRotation);
      dummy.rotateOnAxis(
        p.rotationAxis,
        (p.rotationSpeed + p.torque) * rotationBoost * p.speedMult *
        (1.0 + 0.5 * Math.sin(time * p.tumbleRate + p.tumblePhase)) *
        (1.0 + reaction * 4.0) * 0.1
      );
      
      const targetS = p.scale * (1.0 + reaction * 1.8);
      p.currentScale += (targetS - p.currentScale) * (targetS > p.currentScale ? 0.3 : 0.1);
      
      // 应用变形效果
      const deformation = p.deformation;
      const scaleX = p.currentScale * (1 - deformation);
      const scaleY = p.currentScale * (1 + deformation);
      const scaleZ = p.currentScale * (1 - deformation);
      
      dummy.scale.set(scaleX, scaleY, scaleZ);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    
    // 更新碰撞效果
    collisionEffectsRef.current = collisionEffectsRef.current.filter(effect => {
      effect.alpha -= delta * 3;
      effect.size += delta * 2;
      return effect.alpha > 0;
    });
    
    initialSetupRef.current = true;
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <SceneBackground enabled={!settings.albumArtBackground} color="#000000" />
      {!settings.albumArtBackground && <fog attach="fog" args={['#000000', 30, 220]} />}
      <ambientLight intensity={0.2} />
      <pointLight ref={coreLightRef} distance={350} decay={2.0} />
      <pointLight position={[0, 0, 20]} intensity={3} color={c2 || 0xffffff} distance={150} />
      <directionalLight position={[40, 40, 20]} intensity={1.2} color={c0 || 0xffffff} />
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.1} metalness={0.95} />
      </instancedMesh>
      
      {/* 碰撞效果 */}
      {collisionEffectsRef.current.map((effect, index) => (
        <mesh key={`collision-${index}`} position={effect.position}>
          <sphereGeometry args={[effect.size, 16, 16]} />
          <meshBasicMaterial 
            color={[effect.color.x, effect.color.y, effect.color.z]} 
            transparent 
            opacity={effect.alpha} 
            blending={AdditiveBlending}
          />
        </mesh>
      ))}
    </>
  );
};