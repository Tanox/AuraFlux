# OpenSpec: 视觉生成渲染规范 (03)

## 1. 3D 渲染场景 (R3F)
- **Kinetic Wall:** LED 舞台墙，采用 InstancedMesh 与 DataTexture 实时映射。
- **Resonance Orb:** 几何内核形变，基于音频特征的顶点位移。
- **Digital Grid:** 弯曲 LED 墙，集成反射材质 (MeshReflectorMaterial)。
- **Silk Wave, Ocean Wave, Neural Flow:** 高性能生成式着色器。

## 2. 2D 渲染模式 (Canvas)
- 包含 `Bars`, `Rings`, `Nebula`, `Particles`, `Tunnel`, `Plasma`, `Lasers`, `Ripples`。
- **Enhanced Tunnel (v1.9.1):** 
  - **Focal Warping:** `fov = fovBase * (1.0 - bass * 0.4)`，实现基于低音压力的动态透视拉伸。
  - **Hyper-warp Lines:** 引入 15 条高速流光线，模拟空间跳跃视觉感。
  - **Quadratic Smoothing:** 使用二阶贝塞尔曲线平滑环体顶点，消除几何生硬感。
  - **Debris System:** 150+ 独立微粒的伪 3D 深度管理。

## 3. 后处理增强
- **Mipmap Bloom:** 针对 3D 场景的动态光晕强度配置（3.0 - 4.0）。
- **运动残影:** 通过 `destination-out` 实现丝滑的视觉余晖。

---
*Aura Flux Rendering Specification - Version 1.8.91*
*Author: Sut*