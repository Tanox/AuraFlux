<!-- openspec/03_visual_rendering.md v2.4.0 -->
# 视觉渲染系统规范

## 1. 2D 可视化系统
### 1.1 VisualizerCanvas 组件
- **文件**: `src/components/visualizers/VisualizerCanvas.tsx`
- **版本**: v2.4.0
- **功能**: 2D 音频可视化画布
**核心特性**
- 使用 Canvas 2D API 渲染
- 支持等离子效果可视化模式
- 响应式调整 (ResizeObserver)
- 高 DPI 支持
- 实时音频数据处理

**支持的可视化模式**:
- `PLASMA` - 等离子效果
**对应枚举值**
- `VisualizerMode.PLASMA`

**渲染流程**:
1. 获取音频频率数据
2. 根据选择的模式调用相应的渲染函数
3. 处理音频能量大小调整
4. 清理画布并重绘
**代码示例**:
```tsx
// VisualizerCanvas.tsx 核心结构
// File: src/components/visualizers/VisualizerCanvas.tsx | Version: v2.4.0
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
    // 渲染逻辑...
  }, [analyser, analyserR, colors, settings, mode]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default VisualizerCanvas;
```

### 1.2 2D 可视化模式

#### 1.2.1 Plasma 模式
- **文件**: `src/components/visualizers/2d/plasma/PlasmaMode.ts`
- **版本**: v2.4.0
- **功能**: 等离子效果可视化
**核心特性**:
- 动态粒子效果
- 音频响应式颜色变化
- 粒子融合效果
- 3D 视觉效果

**技术实现**:
- 使用 Canvas 2D API 绘制
- 粒子系统与对象池
- 音频能量驱动的粒子行为
- 颜色混合与渐变

#### 1.2.2 Waveform 模式
- **文件**: `src/components/visualizers/2d/waveform/WaveformMode.ts`
- **版本**: v2.4.0
- **功能**: 波形可视化模式
**核心特性**:
- 实时音频波形显示
- 支持左右声道立体声
- 波形颜色渐变
- 平滑动画效果

#### 1.2.3 Bars 模式
- **文件**: `src/components/visualizers/2d/bars/BarsMode.ts`
- **版本**: v2.4.0
- **功能**: 频谱柱状图可视化
**核心特性**:
- 频率范围柱状图
- 音频能量响应
- 柱状图颜色渐变
- 平滑过渡动画

#### 1.2.4 Starfield 模式
- **文件**: `src/components/visualizers/2d/starfield/StarfieldMode.ts`
- **版本**: v2.4.0
- **功能**: 星空效果可视化
**核心特性**:
- 3D 透视效果
- 音频响应式粒子速度
- 星点颜色变化
- 高速穿越效果

#### 1.2.5 Tunnel 模式
- **文件**: `src/components/visualizers/2d/tunnel/TunnelMode.ts`
- **版本**: v2.4.0
- **功能**: 隧道效果可视化
**核心特性**:
- 3D 隧道视觉效果
- 音频响应式旋转
- 颜色渐变动画
- 深度透视效果

## 2. 3D 可视化系统

### 2.1 ThreeVisualizer 组件
- **文件**: `src/components/visualizers/ThreeVisualizer.tsx`
- **版本**: v2.4.0
- **功能**: 3D 音频可视化场景
**核心特性**:
- 使用 Three.js 渲染
- 支持多种 3D 可视化模式
- 音频响应式动画
- 高性能渲染

**支持的 3D 模式**:
- `SILK_WAVE` - 丝绸波浪
- `NEON_CITY` - 霓虹城市
- `COSMIC_VOID` - 宇宙虚空
- `OCEAN_WAVE` - 海洋波浪
- `DIGITAL_GRID` - 数字网格
- `NEURAL_FLOW` - 神经流
- `KINETIC_WALL` - 动态墙
- `LASER` - 激光效果
- `CUBE_FIELD` - 立方体场

### 2.2 3D 场景实现

#### 2.2.1 Silk Wave 场景
- **文件**: `src/components/visualizers/3d/silkWave/SilkWaveScene.tsx`
- **版本**: v2.3.10
- **功能**: 丝绸波浪效果
**核心特性**:
- 平滑的波浪动画
- 音频响应式振幅
- 渐变颜色效果

#### 2.2.2 Neon City 场景
- **文件**: `src/components/visualizers/3d/neonCity/NeonCityScene.tsx`
- **版本**: v2.3.10
- **功能**: 霓虹城市效果
**核心特性**:
- 城市轮廓动画
- 灯光效果
- 音频响应式建筑高度

#### 2.2.3 Cosmic Void 场景
- **文件**: `src/components/visualizers/3d/cosmicVoid/CosmicVoidScene.tsx`
- **版本**: v2.3.10
- **功能**: 宇宙虚空效果
**核心特性**:
- 粒子系统
- 星空背景
- 音频响应式粒子密度

#### 2.2.4 Ocean Wave 场景
- **文件**: `src/components/visualizers/3d/oceanWave/OceanWaveScene.tsx`
- **版本**: v2.3.10
- **功能**: 海洋波浪效果
**核心特性**:
- 波浪动画
- 水面材质
- 音频响应式波浪高度

#### 2.2.5 Digital Grid 场景
- **文件**: `src/components/visualizers/3d/digitalGrid/DigitalGridScene.tsx`
- **版本**: v2.3.10
- **功能**: 数字网格效果
**核心特性**:
- 网格动画
- 发光效果
- 音频响应式网格变形

#### 2.2.6 Neural Flow 场景
- **文件**: `src/components/visualizers/3d/neuralFlow/NeuralFlowScene.tsx`
- **版本**: v2.3.10
- **功能**: 神经流效果
**核心特性**:
- 神经网络动画
- 节点连接效果
- 音频响应式网络密度

#### 2.2.7 Kinetic Wall 场景
- **文件**: `src/components/visualizers/3d/kineticWall/KineticWallScene.tsx`
- **版本**: v2.3.10
- **功能**: 动态墙效果
**核心特性**:
- 墙块动画
- 碰撞效果
- 音频响应式墙块高度

#### 2.2.8 Laser 场景
- **文件**: `src/components/visualizers/3d/laser/LaserScene.tsx`
- **版本**: v2.3.10
- **功能**: 激光效果
**核心特性**:
- 激光束动画
- 光影效果
- 音频响应式激光强度

#### 2.2.9 Cube Field 场景
- **文件**: `src/components/visualizers/3d/cubeField/CubeFieldScene.tsx`
- **版本**: v2.3.10
- **功能**: 立方体场效果
**核心特性**:
- 立方体阵列
- 旋转动画
- 音频响应式立方体大小

## 3. 着色器系统

### 3.1 着色器文件结构
- **目录**: `src/components/visualizers/3d/shaders/`
- **功能**: 提供 3D 场景的着色器

**着色器文件**:
- `DigitalGridShaders.ts` - 数字网格着色器
- `NeuralFlowShaders.ts` - 神经流着色器
- `OceanWaveShaders.ts` - 海洋波浪着色器
- `SilkWaveShaders.ts` - 丝绸波浪着色器

### 3.2 着色器技术
- **技术**: WebGL Shaders
- **语言**: GLSL
- **功能**:
  - 自定义材质效果
  - 光线计算
  - 动画效果
  - 音频响应式着色

## 4. 性能优化

### 4.1 渲染优化
- **策略**:
  - 使用 requestAnimationFrame
  - 优化 Canvas 绘制
  - 减少 DOM 操作
  - 使用 WebGL 加速

### 4.2 资源管理
- **策略**:
  - 对象池
  - 资源预加载
  - 内存管理
  - 资源释放

### 4.3 计算优化
- **策略**:
  - 使用 Web Workers 处理密集计算
  - 优化数学计算
  - 减少不必要的计算
  - 缓存计算结果

## 5. 响应式设计

### 5.1 画布调整
- **技术**:
  - ResizeObserver
  - 响应式布局
  - 高 DPI 支持
  - 设备像素比处理

### 5.2 性能适配
- **策略**:
  - 基于设备性能调整渲染质量
  - 动态调整粒子数量
  - 自适应帧率
  - 低性能设备降级方案

## 6. 错误处理与边界情况

### 6.1 渲染错误
- **错误类型**:
  - Canvas 不支持
  - WebGL 不支持
  - 内存不足
- **处理策略**:
  - 优雅降级
  - 错误提示
  - 备用渲染方案

### 6.2 性能边界
- **边界情况**:
  - 高音频频率
  - 复杂可视化模式
  - 低性能设备
- **处理策略**:
  - 动态调整复杂度
  - 性能监控
  - 用户可配置的质量设置

## 7. 测试与验证

### 7.1 渲染测试
- **测试类型**:
  - 单元测试
  - 集成测试
  - 性能测试
- **测试工具**:
  - Jest
  - Playwright
  - 自定义性能测试工具

### 7.2 兼容性测试
- **测试场景**:
  - 不同浏览器
  - 不同设备
  - 不同屏幕尺寸

### 7.3 性能测试
- **测试指标**:
  - FPS
  - 内存使用
  - CPU 使用率
  - 渲染时间

## 8. 未来发展

### 8.1 计划功能
- **新可视化模式**:
  - 更多 2D 模式
  - 更多 3D 模式
  - 混合模式
- **交互增强**:
  - 用户自定义可视化
  - 交互式调整
  - 分享功能

### 8.2 技术改进
- **性能优化**:
  - WebAssembly 加速
  - 更高效的渲染算法
  - 更好的资源管理
- **架构改进**:
  - 模块化可视化系统
  - 可扩展的着色器系统
  - 更好的错误处理机制