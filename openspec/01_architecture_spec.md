# OpenSpec: 系统架构规范 (01)

## 1. 核心架构概述 (v1.9.36)
Aura Flux 采用 **React 19** 作为 UI 框架，利用其 Concurrent Mode 和改进的 Hook 系统实现极速响应。视觉系统结合了 **Three.js (R182+)** 高性能 3D 渲染与基于 **OffscreenCanvas Worker** 的 2D 渲染引擎。AI 层通过 **Google Gemini 3.0** 提供实时通感分析。

## 2. 技术栈标准
- **UI 框架:** React 19.0.0。
- **状态管理:** 模块化 **Context API** (`UIContext`, `VisualsContext`, `AudioContext`, `AIContext`)。
- **渲染引擎:**
  - **3D:** `@react-three/fiber` (R3F) 与 `@react-three/postprocessing`。
  - **2D:** 通过 `visualizer.worker.ts` 在独立线程中处理绘图，确保 UI 零卡顿。
- **AI 引擎:** `@google/genai` (v1.40+)，主模型 `gemini-3-flash-preview`。
- **构建工具:** Vite 6.0，采用 ESM 模块化加载方案。

## 3. 核心文件结构 (v1.9.36)
- `index.html`: 包含动态优化的 `importmap`，已剔除所有构建期依赖。
- `App.tsx`: 顶层布局，集成了 PWA 更新检测与全局拖拽事件处理。
- `app/AppContext.tsx`: 汇聚所有领域状态，提供 PWA 更新执行方法 (`performUpdate`)。
- `app/workers/visualizer.worker.ts`: 2D 渲染的核心逻辑，包含自适应噪声滤波。

## 4. 依赖管理规范
- **运行时:** 依赖由 ESM.sh 在线分发，版本严格锁定以匹配 `package.json`。
- **JSX:** 显式映射 `react/jsx-runtime` 以支持 React 19 的新版编译转换。

---
*Aura Flux Architecture Specification - Version 1.9.36*
*Author: Sut*