// File: src\components\visualizers\ThreeVisualizer.tsx | Version: v2.2.23
import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { VisualizerMode, VisualizerSettings } from '@/types';
import { DigitalGridScene } from './3d/digitalGrid/DigitalGridScene';
import { OceanWaveScene } from './3d/oceanWave/OceanWaveScene';
import { SilkWaveScene } from './3d/silkWave/SilkWaveScene';
import { KineticWallScene } from './3d/kineticWall/KineticWallScene';
import { CubeFieldScene } from './3d/cubeField/CubeFieldScene';
import { NeuralFlowScene } from './3d/neuralFlow/NeuralFlowScene';
import { LaserScene } from './3d/laser/LaserScene';
import { APP_VERSION } from '@/constants/version';

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
      
      {/* 应用名称和版本号（单行显示） */}
      <div className="absolute bottom-16 right-16 text-white text-opacity-60 font-sans" style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>
        Aura Flux {APP_VERSION}
      </div>
    </div>
  );
};

export default ThreeVisualizer;

