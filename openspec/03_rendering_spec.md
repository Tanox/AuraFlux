# OpenSpec: 视觉生成渲染规范 (03)

## 1. 渲染性能分级 (v1.8.99)
- **Low (Eco):**
  - 降低 `dpr` 至 0.8。
  - 3D 模式禁用 Bloom 与 Post-processing。
  - 减少粒子密度 50%。
- **Med (Standard):**
  - `dpr` 锁定为 1.0。
  - 开启基础 Bloom 效果。
- **High (HQ):**
  - `dpr` 跟随设备 (最高 1.5)。
  - 开启高阶 Shader 效果与高频更新。

## 2. 3D 场景准则 (R3F)
- **Instancing:** 所有重复几何体（如 `CubeField`, `KineticWall`）必须使用 `InstancedMesh` 以降低 Draw Calls。
- **Shaders:** 核心动效通过 GLSL 顶点着色器处理，最大限度减轻 CPU 负担。
- **Post-processing:** 统一使用 `@react-three/postprocessing` 的 `EffectComposer`。

## 3. 2D 策略
- **Trails (运动拖尾):** 使用不完全清屏 (`fillRect` 配合 alpha) 实现。
- **Glow (辉光):** 使用 `shadowBlur` 配合 API 模拟，仅在非高性能消耗模式下开启。

---
*Aura Flux Rendering Specification - Version 1.8.99*
*Author: Sut*