# 视觉渲染系统规范

## 1. 2D 可视化系统

### 1.1 VisualizerCanvas 组件
- **文件**: `src/components/visualizers/VisualizerCanvas.tsx`
- **版本**: v2.2.25
- **功能**: 2D 音频可视化画布

**核心特性:**
- 使用 Canvas 2D API 渲染
- 支持等离子效果可视化模式
- 响应式布局（ResizeObserver）
- 高 DPI 支持
- 实时音频数据处理

**支持的可视化模式:**
- `PLASMA` - 等离子效果

**对应枚举值:**
- `VisualizerMode.PLASMA`

**渲染流程:**
1. 获取音频频谱数据
2. 根据选择的模式调用相应的渲染函数
3. 处理画布大小调整
4. 清理动画帧

**代码示例:**
```tsx
// VisualizerCanvas.tsx 核心结构
// File: src/components/visualizers/VisualizerCanvas.tsx | Version: v2.2.25
import React, { useRef, useEffect } from 'react';
import { VisualizerMode, VisualizerSettings } from '@/types';
import { renderPlasmaMode } from './2d/plasma/PlasmaMode';
import { APP_VERSION } from '@/constants/version';

interface Props {
  analyser: AnalyserNode | null;
  analyserR: AnalyserNode | null;
  colors: string[];
  settings: VisualizerSettings;
  mode: VisualizerMode;
}

const VisualizerCanvas: React.FC<Props> = ({ analyser, analyserR, colors, settings, mode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<any[]>([]);

  useEffect(() => {
    if (!canvasRef.current || !analyser) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const peaks = new Float32Array(bufferLength);

    // 初始化星星数量
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
            brightness: Math.random() * 0.8 + 0.2
          });
        }
      }
    };

    // 初始化
    const width = canvas.width;
    const height = canvas.height;
    initStars(width, height);

    let dataArrayR: Uint8Array | undefined;
    if (analyserR) {
      dataArrayR = new Uint8Array(analyserR.frequencyBinCount);
    }

    const draw = () => {
      animationId = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      if (analyserR && dataArrayR) {
        analyserR.getByteFrequencyData(dataArrayR as Uint8Array<ArrayBuffer>);
      }

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Only PlasmaMode is available
      renderPlasmaMode({
        ctx,
        dataArray,
        width,
        height,
        colors,
        sensitivity: settings.sensitivity
      });

      // 绘制应用名称和版本号（单行显示）
      ctx.font = '12px Inter, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      const appName = 'Aura Flux';
      const versionText = APP_VERSION;
      const padding = 16;
      
      // 单行显示应用名称和版本号
      const text = `${appName} ${versionText}`;
      ctx.fillText(text, width - padding, height - padding);
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
- **版本**: v2.2.25
- **功能**: 3D 音频可视化场景

**核心特性:**
- 使用 React Three Fiber (R3F) 构建
- 支持激光效果 3D 场景
- 响应式布局
- 高性能渲染

**支持的 3D 场景:**
- `LaserScene` - 激光效果

**对应枚举值:**
- `VisualizerMode.LASERS`

**代码示例:**
```tsx
// ThreeVisualizer.tsx 核心结构
// File: src/components/visualizers/ThreeVisualizer.tsx | Version: v2.2.25
import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { VisualizerMode, VisualizerSettings } from '@/types';
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
    // Only LaserScene is available
    return LaserScene;
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
      <div className="absolute bottom-4 right-4 text-white text-opacity-60 font-sans" style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif', padding: '16px' }}>
        Aura Flux {APP_VERSION}
      </div>
    </div>
  );
};

export default ThreeVisualizer;
```

## 3. 可视化模式实现

### 3.1 2D 模式实现

#### 3.1.1 PlasmaMode
- **文件**: `src/components/visualizers/2d/plasma/PlasmaMode.ts`
- **功能**: 等离子效果

### 3.2 3D 场景实现

#### 3.2.1 LaserScene
- **文件**: `src/components/visualizers/3d/laser/LaserScene.tsx`
- **功能**: 激光效果场景

## 4. 着色器系统

### 4.1 着色器实现

#### 4.1.1 DigitalGridShaders
- **文件**: `src/components/visualizers/3d/shaders/DigitalGridShaders.ts`
- **功能**: 数字网格着色器

#### 4.1.2 NeuralFlowShaders
- **文件**: `src/components/visualizers/3d/shaders/NeuralFlowShaders.ts`
- **功能**: 神经网络流着色器

#### 4.1.3 OceanWaveShaders
- **文件**: `src/components/visualizers/3d/shaders/OceanWaveShaders.ts`
- **功能**: 海洋波浪着色器

#### 4.1.4 SilkWaveShaders
- **文件**: `src/components/visualizers/3d/shaders/SilkWaveShaders.ts`
- **功能**: 丝绸波浪着色器
