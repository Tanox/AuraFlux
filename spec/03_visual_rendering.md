<!-- openspec/03_visual_rendering.md v2.3.4 -->
# 瑙嗚娓叉煋绯荤粺瑙勮寖

## 1. 2D 鍙鍖栫郴缁?
### 1.1 VisualizerCanvas 缁勪欢
- **鏂囦欢**: `src/components/visualizers/VisualizerCanvas.tsx`
- **鐗堟湰**: v2.3.4
- **鍔熻兘**: 2D 闊抽鍙鍖栫敾甯?
**鏍稿績鐗规€?**
- 浣跨敤 Canvas 2D API 娓叉煋
- 鏀寔绛夌瀛愭晥鏋滃彲瑙嗗寲妯″紡
- 鍝嶅簲寮忓竷灞€锛圧esizeObserver锛?- 楂?DPI 鏀寔
- 瀹炴椂闊抽鏁版嵁澶勭悊

**鏀寔鐨勫彲瑙嗗寲妯″紡:**
- `PLASMA` - 绛夌瀛愭晥鏋?
**瀵瑰簲鏋氫妇鍊?**
- `VisualizerMode.PLASMA`

**娓叉煋娴佺▼:**
1. 鑾峰彇闊抽棰戣氨鏁版嵁
2. 鏍规嵁閫夋嫨鐨勬ā寮忚皟鐢ㄧ浉搴旂殑娓叉煋鍑芥暟
3. 澶勭悊鐢诲竷澶у皬璋冩暣
4. 娓呯悊鍔ㄧ敾甯?
**浠ｇ爜绀轰緥:**
```tsx
// VisualizerCanvas.tsx 鏍稿績缁撴瀯
// File: src/components/visualizers/VisualizerCanvas.tsx | Version: v2.3.4
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

    // 鍒濆鍖栨槦鏄熸暟閲?    const initStars = (width: number, height: number) => {
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

    // 鍒濆鍖?    const width = canvas.width;
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

      // 缁樺埗搴旂敤鍚嶇О鍜岀増鏈彿锛堝崟琛屾樉绀猴級
      ctx.font = '12px Inter, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      const appName = 'Aura Flux';
      const versionText = APP_VERSION;
      const padding = 16;
      
      // 鍗曡鏄剧ず搴旂敤鍚嶇О鍜岀増鏈彿
      const text = `${appName} ${versionText}`;
      ctx.fillText(text, width - padding, height - padding);
    };

    const parent = canvas.parentElement;
    if (!parent) return;

    const resizeObserver = new ResizeObserver(() => {
      canvas.width = parent.clientWidth * window.devicePixelRatio;
      canvas.height = parent.clientHeight * window.devicePixelRatio;
      // 閲嶆柊鍒濆鍖栨槦鏄熸暟鎹互閫傚簲鏂扮殑鐢诲竷灏哄
      initStars(canvas.width, canvas.height);
    });

    resizeObserver.observe(parent);
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      // 娓呯悊鏄熸槦鏁版嵁
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

## 2. 3D 鍙鍖栫郴缁?
### 2.1 ThreeVisualizer 缁勪欢
- **鏂囦欢**: `src/components/visualizers/ThreeVisualizer.tsx`
- **鐗堟湰**: v2.3.4
- **鍔熻兘**: 3D 闊抽鍙鍖栧満鏅?
**鏍稿績鐗规€?**
- 浣跨敤 React Three Fiber (R3F) 鏋勫缓
- 鏀寔婵€鍏夋晥鏋?3D 鍦烘櫙
- 鍝嶅簲寮忓竷灞€
- 楂樻€ц兘娓叉煋

**鏀寔鐨?3D 鍦烘櫙:**
- `LaserScene` - 婵€鍏夋晥鏋?
**瀵瑰簲鏋氫妇鍊?**
- `VisualizerMode.LASERS`

**浠ｇ爜绀轰緥:**
```tsx
// ThreeVisualizer.tsx 鏍稿績缁撴瀯
// File: src/components/visualizers/ThreeVisualizer.tsx | Version: v2.3.3
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
      
      {/* 搴旂敤鍚嶇О鍜岀増鏈彿锛堝崟琛屾樉绀猴級 */}
      <div className="absolute bottom-4 right-4 text-white text-opacity-60 font-sans" style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif', padding: '16px' }}>
        Aura Flux {APP_VERSION}
      </div>
    </div>
  );
};

export default ThreeVisualizer;
```

## 3. 鍙鍖栨ā寮忓疄鐜?
### 3.1 2D 妯″紡瀹炵幇

#### 3.1.1 PlasmaMode
- **鏂囦欢**: `src/components/visualizers/2d/plasma/PlasmaMode.ts`
- **鍔熻兘**: 绛夌瀛愭晥鏋?
### 3.2 3D 鍦烘櫙瀹炵幇

#### 3.2.1 LaserScene
- **鏂囦欢**: `src/components/visualizers/3d/laser/LaserScene.tsx`
- **鍔熻兘**: 婵€鍏夋晥鏋滃満鏅?
## 4. 鐫€鑹插櫒绯荤粺

### 4.1 鐫€鑹插櫒瀹炵幇

#### 4.1.1 DigitalGridShaders
- **鏂囦欢**: `src/components/visualizers/3d/shaders/DigitalGridShaders.ts`
- **鍔熻兘**: 鏁板瓧缃戞牸鐫€鑹插櫒

#### 4.1.2 NeuralFlowShaders
- **鏂囦欢**: `src/components/visualizers/3d/shaders/NeuralFlowShaders.ts`
- **鍔熻兘**: 绁炵粡缃戠粶娴佺潃鑹插櫒

#### 4.1.3 OceanWaveShaders
- **鏂囦欢**: `src/components/visualizers/3d/shaders/OceanWaveShaders.ts`
- **鍔熻兘**: 娴锋磱娉㈡氮鐫€鑹插櫒

#### 4.1.4 SilkWaveShaders
- **鏂囦欢**: `src/components/visualizers/3d/shaders/SilkWaveShaders.ts`
- **鍔熻兘**: 涓濈桓娉㈡氮鐫€鑹插櫒
