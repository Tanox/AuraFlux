# OpenSpec: 视觉生成渲染规范 (03)

## 1. 混合渲染管线 (v1.9.36)

### 1.1. 2D Worker 渲染器
- **控制权转移:** `VisualizerCanvas` 将 `<canvas>` 控制权转移至独立 Worker。
- **帧更新:** 主线程仅发送原始 `Uint8Array` 数据，Worker 内部实现 `requestAnimationFrame` 循环。
- **渲染策略:** 采用策略模式（Strategy Pattern），动态加载 `BarsRenderer`, `PlasmaRenderer`, `NebulaRenderer` 等。
- **优化:** 2D 拖尾（Trails）通过 `destination-out` 或半透明矩形覆盖实现。

### 1.2. 3D R3F 渲染器
- **场景切换:** 基于 `SceneSwitcher` 动态卸载/挂载模式。
- **着色器驱动:**
  - `DigitalGridScene`: 基于 `DataTexture` 将音频频谱直接作为 Uniform 传入着色器。
  - `SilkWaveScene`: 利用 `InstancedMesh` 渲染 50+ 条高精度丝绸纤维，CPU 仅负责 Uniform 更新。
  - `ResonanceOrb`: 利用 `IcosahedronGeometry` 的顶点置换模拟液体波动。
- **后期处理:** 统一使用 `EffectComposer` 管理 `Bloom` 辉光和 `Noise` 噪点（去色阶）。

## 2. 质量等级定义 (`settings.quality`)
- **Low:** 0.8 DPR，禁用 Bloom。
- **Med:** 1.0 DPR，标准 Bloom。
- **High:** 匹配设备 DPR（最高 1.5），高精度粒子数量，全开后期特效。

---
*Aura Flux Rendering Specification - Version 1.9.36*
*Author: Sut*