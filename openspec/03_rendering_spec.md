# OpenSpec: 视觉生成渲染规范 (03)

## 1. 3D 渲染场景 (R3F)
- **Kinetic Wall:** LED 舞台墙，采用 InstancedMesh 与 DataTexture 实时映射。
- **Resonance Orb:** 几何内核形变，基于音频特征的顶点位移。
- **Digital Grid:** 弯曲 LED 墙，集成反射材质 (MeshReflectorMaterial)。
- **Silk Wave, Ocean Wave, Neural Flow:** 高性能生成式着色器。

## 2. 2D 渲染模式 (Canvas)
- 包含 `Bars`, `Rings`, `Nebula`, `Particles`, `Tunnel`, `Plasma`, `Lasers`, `Ripples`。
- **Enhanced Tunnel (v1.9.2):** 
  - **Temporal Jitter Reduction:** 引入 `lastBass` 和 `lastTreble` 状态机，使用 `lerp` 算法对音频反馈进行时间平滑处理，显著降低高感光下的线条抖动。
  - **Windowed Sampling:** 对每个顶点的频率采样采用 4-bin 窗口平均值，消除由于单频跳变导致的几何生硬感。
  - **Focal Warping:** 实现基于低音压力的动态透视拉伸。
  - **Hyper-warp Lines:** 模拟高速空间跳跃流光。
- **默认行为 (v1.8.93+):**
  - **色彩自动循环:** 应用初始化时默认开启色彩轮转。
  - **循环周期:** 默认设置为 5.0 秒，确保视觉动态的连贯性。

## 3. 后处理增强
- **Mipmap Bloom:** 针对 3D 场景的动态光晕强度配置。
- **运动残影:** 通过 `destination-out` 实现丝滑的视觉余晖。

---
*Aura Flux Rendering Specification - Version 1.8.94*
*Author: Sut*