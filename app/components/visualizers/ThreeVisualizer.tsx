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
    return null;
};

const SceneSwitcher: React.FC<ThreeVisualizerProps> = ({ mode, analyser, analyserR, colors, settings }) => {
  // Robust safety guard for array properties
  if (!analyser || !settings || !Array.isArray(colors) || colors.length === 0) return null;
  
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

  const bloomIntensity = useMemo(() => {
      if (!mode) return 2.0;
      return BLOOM_CONFIG[mode] || 2.0;
  }, [mode]);

  const postProcessingEffects = useMemo(() => {
      if (!settings) return null;
      const ditheringNoise = <Noise opacity={0.025} premultiply />;

      if (!settings.glow) return (
        <EffectComposer multisampling={0}>
            {ditheringNoise}
        </EffectComposer>
      );

      return (
          <EffectComposer multisampling={0}>
              <Bloom 
                  luminanceThreshold={0.2} 
                  luminanceSmoothing={0.9} 
                  intensity={bloomIntensity} 
                  mipmapBlur={true} 
                  radius={0.6}
              />
              {ditheringNoise}
          </EffectComposer>
      );
  }, [settings?.glow, bloomIntensity, settings]);

  const safeColors = useMemo(() => {
    if (Array.isArray(colors) && colors.length > 0) return colors;
    return ['#ffffff', '#808080', '#000000'];
  }, [colors]);

  // Comprehensive fallback
  if (!analyser || !settings) {
    return <div id="visualizer-three-wrapper" className="w-full h-full bg-black"></div>;
  }
  
  return (
    <div id="visualizer-three-wrapper" className="w-full h-full">
      <Canvas 
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
        {postProcessingEffects || null}
      </Canvas>
    </div>
  );
};

export default ThreeVisualizer;