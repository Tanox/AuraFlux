# OpenSpec: 系统架构规范 (01)

## 1. 核心设计哲学
Aura Flux 采用 **"离屏优先" (Offscreen-First)** 与 **"混合引擎" (Hybrid Engine)** 架构，旨在实现 UI 交互与高频图形渲染的完全解耦。

## 2. 线程模型与解耦策略
- **主线程 (Main Thread):**
  - 管理 React 18 组件树、UI 状态、AI 服务通信及音频采集路由。
  - 承载 **React Three Fiber (R3F)** 指令流，负责高保真 3D 场景渲染。
- **Worker 线程 (Visualizer Worker):**
  - 使用 `OffscreenCanvas` 处理 2D 绘图逻辑，确保 UI 线程无阻塞。
- **GPU 渲染管线:**
  - 3D 场景通过 WebGL 2.0 进行硬件加速。
  - 2D 效果通过 2D Context 实现亚像素级平滑渲染。

## 3. 数值安全性与稳定性
- **NaN 保护:** 在涉及除法或对数的计算中引入 `EPSILON (1e-6)`。
- **音频流隔离:** 引入 `killExistingFileSource` 机制，强制在播放新曲目前释放旧有 BufferSource，防止重叠播放。
- **上下文自动恢复:** 监听 `webglcontextlost` 并自动重置。

---
*Aura Flux Architecture Specification - Version 1.8.82*
*Author: Sut*