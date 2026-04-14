// File: /src/components/visualizers/ThreeVisualizer.tsx | Version: v2.2.22
import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { VisualizerMode, VisualizerSettings } from '@/types';
import { DigitalGridScene } from './scenes/DigitalGridScene';
import { OceanWaveScene } from './scenes/OceanWaveScene';
import { SilkWaveScene } from './scenes/SilkWaveScene';
import { KineticWallScene } from './scenes/KineticWallScene';
import { CubeFieldScene } from './scenes/CubeFieldScene';
import { NeuralFlowScene } from './scenes/NeuralFlowScene';
import { LaserScene } from './scenes/LaserScene';

interface Props {
  analyser: AnalyserNode;
  analyserR: AnalyserNode | null;
  colors: string[];
  settings: VisualizerSettings;
  mode: VisualizerMode;
}

const ThreeVisualizer: React.FC<Props> = ({ analyser, analyserR, colors, settings, mode }) => {
  const Scene = useMemo(() => {
    // Handle deprecated modes that might be stored in user configs
    const modeStr = mode as string;
    if (modeStr === 'RESONANCE_ORB' || modeStr === 'LIQUID_SPHERE') {
      return OceanWaveScene; // Fallback to OceanWaveScene for deprecated modes
    }
    
    switch (mode) {
      case VisualizerMode.DIGITAL_GRID: return DigitalGridScene;
      case VisualizerMode.OCEAN_WAVE: return OceanWaveScene;
      case VisualizerMode.SILK_WAVE: return SilkWaveScene;
      case VisualizerMode.KINETIC_WALL: return KineticWallScene;
      case VisualizerMode.CUBE_FIELD: return CubeFieldScene;
      case VisualizerMode.NEURAL_FLOW: return NeuralFlowScene;
      case VisualizerMode.LASERS: return LaserScene;
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

