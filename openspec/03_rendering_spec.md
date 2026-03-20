# OpenSpec: 视觉生成渲染规范 (03)

## 1. 混合渲染管线 (v1.9.85)

### 1.1. 2D 渲染器
- **架构:** 采用 React 状态驱动的 Canvas 2D 渲染。
- **自适应布局:** 使用 `ResizeObserver` 实时监听容器尺寸变化，动态调整 Canvas 的物理像素分辨率 (`width`/`height`) 与 CSS 尺寸。
- **性能优化:** 
    - 移除了全局 `window.resize` 监听，减少不必要的重绘。
    - 确保可视化容器在全局布局中保持 `w-full h-full`，解决渲染区域塌陷问题。

### 1.2. 3D R3F 渲染器
- **架构:** 基于 `@react-three/fiber` (R3F) 和 `@react-three/drei` 构建声明式 3D 场景。
- **场景管理:** `ThreeVisualizer` 组件通过 `Suspense` 和 `lazy` 加载实现按需渲染，使用 `SceneSwitcher` 动态切换场景。
- **核心场景:**
  - `KineticWallScene`: 动态响应音频的几何墙体。
  - `LiquidSphereScene` (`RESONANCE_ORB`): 基于物理模拟的液态球体。
  - `CubeFieldScene`: 大规模立方体场，通过 `InstancedMesh` 优化性能。
  - `NeuralFlowScene`: 模拟神经网络信号传输的粒子流。
  - `DigitalGridScene`: 赛博朋克风格的数字网格，使用 `DataTexture` 驱动高度图。
  - `SilkWaveScene`: 高精度丝绸纤维模拟。
  - `OceanWaveScene`: 基于顶点位移的海洋波浪模拟。
  - `VortexScene`: 粒子引力扭曲场景，模拟黑洞吸积盘效果。
- **性能优化:**
  - **DPR 缩放:** 根据 `settings.quality` 动态调整像素比 (Low: 0.8, Med: 1.0, High: Device Native/Max 1.5)。
  - **资源管理:** 自动处理 WebGL 上下文丢失与恢复。

## 2. 质量等级定义 (`settings.quality`)
- **Low:** 0.8 DPR，简化粒子数量，禁用高开销后期处理。
- **Med:** 1.0 DPR，标准渲染配置。
- **High:** 匹配设备原生 DPR (最高 1.5)，全粒子量，启用高级光照和后期处理。

---
*Aura Flux Rendering Specification - Version 2.4.1*
*Author: Sut*