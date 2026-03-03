// File: src/components/visualizers/ThreeVisualizer.tsx | Version: v1.9.82
import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { VisualizerMode, VisualizerSettings } from '@/src/types';
import { DigitalGridScene } from './scenes/DigitalGridScene';
import { OceanWaveScene } from './scenes/OceanWaveScene';
import { VortexScene } from './scenes/VortexScene';
import { SilkWaveScene } from './scenes/SilkWaveScene';
import { KineticWallScene } from './scenes/KineticWallScene';
import { CubeFieldScene } from './scenes/CubeFieldScene';
import { LiquidSphereScene } from './scenes/LiquidSphereScene';
import { NeuralFlowScene } from './scenes/NeuralFlowScene';

interface Props {
  analyser: AnalyserNode;
  analyserR: AnalyserNode | null;
  colors: string[];
  settings: VisualizerSettings;
  mode: VisualizerMode;
}

const ThreeVisualizer: React.FC<Props> = ({ analyser, analyserR, colors, settings, mode }) => {
  const Scene = useMemo(() => {
    switch (mode) {
      case VisualizerMode.DIGITAL_GRID: return DigitalGridScene;
      case VisualizerMode.OCEAN_WAVE: return OceanWaveScene;
      case VisualizerMode.VORTEX: return VortexScene;
      case VisualizerMode.SILK_WAVE: return SilkWaveScene;
      case VisualizerMode.KINETIC_WALL: return KineticWallScene;
      case VisualizerMode.CUBE_FIELD: return CubeFieldScene;
      case VisualizerMode.LIQUID_SPHERE: return LiquidSphereScene;
      case VisualizerMode.NEURAL_FLOW: return NeuralFlowScene;
      default: return DigitalGridScene;
    }
  }, [mode]);

  return (
    <div id="three-visualizer-container" className="absolute inset-0 w-full h-full bg-black">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
        style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
      >
        <color attach="background" args={['#000000']} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        <Suspense fallback={null}>
          <Scene analyser={analyser} analyserR={analyserR} colors={colors} settings={settings} />
        </Suspense>

        <OrbitControls enablePan={false} enableZoom={true} minDistance={5} maxDistance={50} />
      </Canvas>
    </div>
  );
};

export default ThreeVisualizer;
