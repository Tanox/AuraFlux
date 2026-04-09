# 视觉渲染系统规范

## 1. 2D 可视化系统

### 1.1 VisualizerCanvas 组件
- **文件**: `src/components/visualizers/VisualizerCanvas.tsx`
- **版本**: v2.0.6
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

**渲染流程:**
1. 获取音频频谱数据
2. 根据选择的模式调用相应的渲染函数
3. 处理画布大小调整
4. 清理动画帧

## 2. 3D 可视化系统

### 2.1 ThreeVisualizer 组件
- **文件**: `src/components/visualizers/ThreeVisualizer.tsx`
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
