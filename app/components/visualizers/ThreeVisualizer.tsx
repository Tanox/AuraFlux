// File: app/components/visualizers/ThreeVisualizer.tsx | Version: v1.9.73
import React, { Suspense, useMemo, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing';
import { VisualizerMode, VisualizerSettings } from '../../types/index.ts';
import { BLOOM_CONFIG } from '../../constants/index.ts';
import { 
    KineticWallScene, 
    LiquidSphereScene, 
    CubeFieldScene, 
    NeuralFlowScene,
    DigitalGridScene,
    SilkWaveScene,
    OceanWaveScene,
    VortexScene
} from './ThreeScenes.tsx';

interface ThreeVisualizerProps {
  analyser: AnalyserNode | null;
  analyserR?: AnalyserNode | null; 
  colors: string[];
  settings: VisualizerSettings;
  mode: VisualizerMode; 
}

const BackgroundController: React.FC<{ isTransparent: boolean }> = ({ isTransparent }) => {
    const { gl } = useThree();
    useEffect(() => {
        gl.setClearColor('#000000', isTransparent ? 0 : 1);
    }, [isTransparent, gl]);
    return <group />;
};

const SceneSwitcher: React.FC<ThreeVisualizerProps> = ({ mode, analyser, analyserR, colors, settings }) => {
  // Robust safety guard for array properties
  if (!analyser || !settings || !Array.isArray(colors) || colors.length === 0) return <group />;
  
  const sceneProps = { analyser, analyserR, colors, settings };

  switch (mode) {
      case VisualizerMode.KINETIC_WALL: return <KineticWallScene {...sceneProps} />;
      case VisualizerMode.RESONANCE_ORB: return <LiquidSphereScene {...sceneProps} />;
      case VisualizerMode.CUBE_FIELD: return <CubeFieldScene {...sceneProps} />;
      case VisualizerMode.NEURAL_FLOW: return <NeuralFlowScene {...sceneProps} />;
      case VisualizerMode.DIGITAL_GRID: return <DigitalGridScene {...sceneProps} />;
      case VisualizerMode.SILK_WAVE: return <SilkWaveScene {...sceneProps} />;
      case VisualizerMode.OCEAN_WAVE: return <OceanWaveScene {...sceneProps} />;
      case VisualizerMode.VORTEX: return <VortexScene {...sceneProps} />;
      default: return <NeuralFlowScene {...sceneProps} />;
  }
};

const PostProcessing: React.FC<{ settings: VisualizerSettings; mode: VisualizerMode }> = ({ settings, mode }) => {
    const bloomIntensity = useMemo(() => {
        if (!mode) return 2.0;
        return BLOOM_CONFIG[mode] || 2.0;
    }, [mode]);

    return (
        <EffectComposer multisampling={0}>
            <Bloom 
                key="bloom"
                luminanceThreshold={0.2} 
                luminanceSmoothing={0.9} 
                intensity={settings?.glow ? bloomIntensity : 0} 
                mipmapBlur={true} 
                radius={0.6}
            />
            <Noise key="noise" opacity={0.025} premultiply />
        </EffectComposer>
    );
};

const ThreeVisualizer: React.FC<ThreeVisualizerProps> = ({ analyser, analyserR, colors, settings, mode }) => {
  
  const dpr = useMemo(() => {
    if (!settings) return 1;
    const quality = settings.quality;
    if (quality === 'low') return 0.8;
    if (quality === 'med') return 1.0;
    const deviceDpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    return Math.max(0.5, Math.min(deviceDpr, 1.5));
  }, [settings?.quality]);

  const cameraConfig = useMemo(() => {
      const base = { position: [0, 2, 16] as [number, number, number], fov: 55 };
      if (mode === VisualizerMode.OCEAN_WAVE) {
          base.position = [0, 8, 15];
          base.fov = 60;
      }
      return base;
  }, [mode]);

  const glConfig = useMemo(() => ({ 
    antialias: false,
    alpha: true, 
    stencil: false,
    depth: true,
    powerPreference: "high-performance" as WebGLPowerPreference
  }), []);

  const safeColors = useMemo(() => {
    if (Array.isArray(colors) && colors.length > 0) return colors;
    return ['#ffffff', '#808080', '#000000'];
  }, [colors]);

  const visualKey = useMemo(() => {
    if (!settings) return mode;
    return `${mode}-${settings.quality}-${settings.glow}`;
  }, [mode, settings?.quality, settings?.glow]);

  // Comprehensive fallback
  if (!analyser || !settings) {
    return <div id="visualizer-three-wrapper" className="w-full h-full bg-black"></div>;
  }
  
  return (
    <div id="visualizer-three-wrapper" className="w-full h-full">
      <Canvas 
        key={visualKey}
        shadows={false}
        camera={cameraConfig}
        dpr={dpr} 
        gl={glConfig}
        onCreated={(state) => {
          const gl = state.gl;
          if (gl) {
            gl.setClearColor('#000000', 1);
            const handleContextLost = (event: Event) => { event.preventDefault(); };
            gl.domElement.addEventListener('webglcontextlost', handleContextLost, false);
          }
        }}
      >
        <BackgroundController isTransparent={!!settings.albumArtBackground} />
        <Suspense fallback={null}>
          <SceneSwitcher analyser={analyser} analyserR={analyserR} colors={safeColors} settings={settings} mode={mode} />
        </Suspense>
        {settings && <PostProcessing settings={settings} mode={mode} />}
      </Canvas>
    </div>
  );
};

export default ThreeVisualizer;