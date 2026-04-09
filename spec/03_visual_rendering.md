# 视觉渲染系统规范

## 1. 2D 可视化系统

### 1.1 VisualizerCanvas 组件
- **文件**: `src/components/visualizers/VisualizerCanvas.tsx`
- **版本**: v2.0.5
- **功能**: 2D 音频可视化画布

**核心特性:**
- 使用 Canvas 2D API 渲染
- 支持多种可视化模式
- 响应式布局（ResizeObserver）
- 高 DPI 支持
- 实时音频数据处理

**支持的可视化模式:**
- `BARS` - 频谱柱状图
- `WAVEFORM` - 波形图
- `PLASMA` - 等离子效果
- `TUNNEL` - 隧道效果
- `STARFIELD` - 星场效果

**对应枚举值:**
- `VisualizerMode.BARS`
- `VisualizerMode.WAVEFORM`
- `VisualizerMode.PLASMA`
- `VisualizerMode.TUNNEL`
- `VisualizerMode.STARFIELD`

**渲染流程:**
1. 获取音频频谱数据
2. 根据选择的模式调用相应的渲染函数
3. 处理画布大小调整
4. 清理动画帧

**代码示例:**
```tsx
// VisualizerCanvas.tsx 核心结构
// File: src/components/visualizers/VisualizerCanvas.tsx | Version: v2.0.5
import React, { useRef, useEffect } from 'react';
import { VisualizerMode, VisualizerSettings } from '@/types';
import { renderBarsMode } from './modes/BarsMode';
import { renderWaveformMode } from './modes/WaveformMode';
import { renderPlasmaMode } from './modes/PlasmaMode';
import { renderTunnelMode } from './modes/TunnelMode';
import { renderStarfieldMode } from './modes/StarfieldMode';

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  speed: number;
  color: string;
}

interface Props {
  analyser: AnalyserNode | null;
  analyserR: AnalyserNode | null;
  colors: string[];
  settings: VisualizerSettings;
  mode: VisualizerMode;
}

const VisualizerCanvas: React.FC<Props> = ({ analyser, colors, settings, mode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);

  useEffect(() => {
    if (!canvasRef.current || !analyser) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const peaks = new Float32Array(bufferLength);

    // 初始化星星数据
    const initStars = (width: number, height: number) => {
      if (mode === VisualizerMode.STARFIELD) {
        starsRef.current = [];
        const starCount = 200;
        for (let i = 0; i < starCount; i++) {
          starsRef.current.push({
            x: Math.random() * width,
            y: Math.random() * height,
            z: Math.random() * 1000,
            size: Math.random() * 3 + 1,
            speed: Math.random() * 2 + 0.5,
            color: colors[Math.floor(Math.random() * colors.length)]
          });
        }
      }
    };

    // 初始初始化
    const width = canvas.width;
    const height = canvas.height;
    initStars(width, height);

    const draw = () => {
      animationId = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      switch (mode) {
        case VisualizerMode.BARS:
          renderBarsMode({
            ctx,
            dataArray,
            peaks,
            width,
            height,
            colors,
            sensitivity: settings.sensitivity
          });
          break;
        case VisualizerMode.WAVEFORM:
          renderWaveformMode({
            ctx,
            dataArray,
            width,
            height,
            colors,
            analyser
          });
          break;
        case VisualizerMode.PLASMA:
          renderPlasmaMode({
            ctx,
            dataArray,
            width,
            height,
            colors,
            sensitivity: settings.sensitivity
          });
          break;
        case VisualizerMode.TUNNEL:
          renderTunnelMode({
            ctx,
            dataArray,
            width,
            height,
            colors,
            sensitivity: settings.sensitivity
          });
          break;
        case VisualizerMode.STARFIELD:
          renderStarfieldMode({
            ctx,
            dataArray,
            width,
            height,
            colors,
            sensitivity: settings.sensitivity,
            stars: starsRef.current
          });
          break;
      }
    };

    const parent = canvas.parentElement;
    if (!parent) return;

    const resizeObserver = new ResizeObserver(() => {
      canvas.width = parent.clientWidth * window.devicePixelRatio;
      canvas.height = parent.clientHeight * window.devicePixelRatio;
      // 重新初始化星星数据以适应新的画布尺寸
      initStars(canvas.width, canvas.height);
    });

    resizeObserver.observe(parent);
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      // 清理星星数据
      if (mode === VisualizerMode.STARFIELD) {
        starsRef.current = [];
      }
    };
  }, [analyser, colors, settings.sensitivity, mode]);

  return (
    <canvas 
      ref={canvasRef} 
      id="visualizer-canvas-2d"
      className="absolute inset-0 w-full h-full block"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default VisualizerCanvas;
```

## 2. 3D 可视化系统

### 2.1 ThreeVisualizer 组件
- **文件**: `src/components/visualizers/ThreeVisualizer.tsx`
- **版本**: v2.0.2
- **功能**: 3D 音频可视化场景

**核心特性:**
- 使用 React Three Fiber (R3F) 构建
- 支持多种 3D 场景
- 响应式布局
- 高性能渲染

**支持的 3D 场景:**
- `DigitalGridScene` - 数字网格
- `OceanWaveScene` - 海洋波浪
- `VortexScene` - 粒子引力扭曲
- `SilkWaveScene` - 丝绸纤维
- `KineticWallScene` - 动态几何墙体
- `CubeFieldScene` - 立方体场
- `NeuralFlowScene` - 神经网络粒子流
- `LaserScene` - 激光效果

**对应枚举值:**
- `VisualizerMode.DIGITAL_GRID`
- `VisualizerMode.OCEAN_WAVE`
- `VisualizerMode.VORTEX`
- `VisualizerMode.SILK_WAVE`
- `VisualizerMode.KINETIC_WALL`
- `VisualizerMode.CUBE_FIELD`
- `VisualizerMode.NEURAL_FLOW`
- `VisualizerMode.LASERS`

**代码示例:**
```tsx
// ThreeVisualizer.tsx 核心结构
// File: src/components/visualizers/ThreeVisualizer.tsx | Version: v2.0.2
import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { VisualizerMode, VisualizerSettings } from '@/types';
import { DigitalGridScene } from './scenes/DigitalGridScene';
import { OceanWaveScene } from './scenes/OceanWaveScene';
import { VortexScene } from './scenes/VortexScene';
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
      case VisualizerMode.VORTEX: return VortexScene;
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
```

## 3. 可视化模式实现

### 3.1 2D 模式实现

#### 3.1.1 BarsMode
- **文件**: `src/components/visualizers/modes/BarsMode.ts`
- **功能**: 频谱柱状图可视化

#### 3.1.2 WaveformMode
- **文件**: `src/components/visualizers/modes/WaveformMode.ts`
- **功能**: 波形图可视化

#### 3.1.3 PlasmaMode
- **文件**: `src/components/visualizers/modes/PlasmaMode.ts`
- **功能**: 等离子效果

#### 3.1.4 TunnelMode
- **文件**: `src/components/visualizers/modes/TunnelMode.ts`
- **功能**: 隧道效果

#### 3.1.5 StarfieldMode
- **文件**: `src/components/visualizers/modes/StarfieldMode.ts`
- **功能**: 星场效果

### 3.2 3D 场景实现

#### 3.2.1 DigitalGridScene
- **文件**: `src/components/visualizers/scenes/DigitalGridScene.tsx`
- **功能**: 数字网格场景

#### 3.2.2 OceanWaveScene
- **文件**: `src/components/visualizers/scenes/OceanWaveScene.tsx`
- **功能**: 海洋波浪场景

#### 3.2.3 VortexScene
- **文件**: `src/components/visualizers/scenes/VortexScene.tsx`
- **功能**: 粒子引力扭曲场景

#### 3.2.4 SilkWaveScene
- **文件**: `src/components/visualizers/scenes/SilkWaveScene.tsx`
- **功能**: 丝绸纤维场景

#### 3.2.5 KineticWallScene
- **文件**: `src/components/visualizers/scenes/KineticWallScene.tsx`
- **功能**: 动态几何墙体场景

#### 3.2.6 CubeFieldScene
- **文件**: `src/components/visualizers/scenes/CubeFieldScene.tsx`
- **功能**: 立方体场场景

#### 3.2.7 NeuralFlowScene
- **文件**: `src/components/visualizers/scenes/NeuralFlowScene.tsx`
- **功能**: 神经网络粒子流场景

#### 3.2.8 LaserScene
- **文件**: `src/components/visualizers/scenes/LaserScene.tsx`
- **功能**: 激光效果场景

## 4. 着色器系统

### 4.1 着色器实现

#### 4.1.1 DigitalGridShaders
- **文件**: `src/components/visualizers/scenes/shaders/DigitalGridShaders.ts`
- **功能**: 数字网格着色器

#### 4.1.2 NeuralFlowShaders
- **文件**: `src/components/visualizers/scenes/shaders/NeuralFlowShaders.ts`
- **功能**: 神经网络流着色器

#### 4.1.3 OceanWaveShaders
- **文件**: `src/components/visualizers/scenes/shaders/OceanWaveShaders.ts`
- **功能**: 海洋波浪着色器

#### 4.1.4 SilkWaveShaders
- **文件**: `src/components/visualizers/scenes/shaders/SilkWaveShaders.ts`
- **功能**: 丝绸波浪着色器

#### 4.1.5 VortexShaders
- **文件**: `src/components/visualizers/scenes/shaders/VortexShaders.ts`
- **功能**: 漩涡着色器
