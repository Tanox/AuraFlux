# OpenSpec: 视觉生成渲染规范 (03)

## 1. 混合渲染管线 (v1.9.72)

### 1.1. 2D Worker 渲染器
- **控制权转移:** 使用 `transferControlToOffscreen` 将控制权移至独立线程。
- **同步机制:** 主线程仅发送原始 `Uint8Array` 数据帧，Worker 内部实现 60FPS 循环。
- **渲染库:** 纯原生 Canvas API，通过策略模式动态加载渲染类（如 `NebulaRenderer`）。

### 1.2. 3D R3F 渲染器
- **架构:** 基于 `@react-three/fiber` 和 `@react-three/drei`。
- **Shader 驱动:**
  - `DigitalGridScene`: 使用 `DataTexture` 传入音频频谱。
  - `SilkWaveScene`: 利用 `InstancedMesh` 渲染高精度丝绸纤维。
- **后期处理:** 统一使用 `EffectComposer` 管理 `Bloom` (辉光) 和 `Noise` (去色阶噪点)。

## 2. 质量等级定义 (`settings.quality`)
- **Low:** 0.8 DPR，禁用后期 Bloom 模糊。
- **Med:** 1.0 DPR，标准 Bloom 配置。
- **High:** 匹配设备原生 DPR (最高 1.5)，全粒子量，高采样 Bloom。

---
*Aura Flux Rendering Specification - Version 1.9.72*
*Author: Sut*