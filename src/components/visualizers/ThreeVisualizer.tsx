// File: src\components\visualizers\ThreeVisualizer.tsx | Version: v2.3.3
import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { VisualizerMode, VisualizerSettings } from '@/types';
import { LaserScene } from './3d/laser/LaserScene';
import { CubeFieldScene } from './3d/cubeField/CubeFieldScene';
import { DigitalGridScene } from './3d/digitalGrid/DigitalGridScene';
import { KineticWallScene } from './3d/kineticWall/KineticWallScene';
import { NeuralFlowScene } from './3d/neuralFlow/NeuralFlowScene';
import { OceanWaveScene } from './3d/oceanWave/OceanWaveScene';
import { SilkWaveScene } from './3d/silkWave/SilkWaveScene';
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
    switch (mode) {
      case VisualizerMode.DIGITAL_GRID:
        return DigitalGridScene;
      case VisualizerMode.SILK_WAVE:
        return SilkWaveScene;
      case VisualizerMode.OCEAN_WAVE:
        return OceanWaveScene;
      case VisualizerMode.NEURAL_FLOW:
        return NeuralFlowScene;
      case VisualizerMode.CUBE_FIELD:
        return CubeFieldScene;
      case VisualizerMode.KINETIC_WALL:
        return KineticWallScene;
      case VisualizerMode.LASERS:
        return LaserScene;
      default:
        return LaserScene;
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
      <div className="absolute bottom-0 right-0 text-white text-opacity-60 font-sans" style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif', padding: '16px' }}>
        Aura Flux {APP_VERSION}
      </div>
    </div>
  );
};

export default ThreeVisualizer;

