# OpenSpec: 系统架构规范 (01)

## 1. 核心架构概述 (v1.9.7)
Aura Flux 采用 **React 19** 作为 UI 框架，结合 **Three.js (@react-three/fiber)** 进行高性能 3D 渲染，并通过 **Google Gemini 3** 提供智能通感分析。系统设计遵循“边缘计算优先”原则，最大限度减少云端依赖。

## 2. 技术栈标准
- **UI 框架:** React 19.0+ (利用 Concurrent Mode 与 Suspense)。
- **状态管理:** 采用多维度 **Context API** (UIContext, VisualsContext, AudioContext, AIContext)。
- **渲染引擎:** 
  - **3D:** Three.js R160+ 与 @react-three/fiber。
  - **2D:** OffscreenCanvas (Worker) 与 标准 Canvas API。
- **AI 引擎:** @google/genai SDK (Gemini-3-flash-preview)。
- **构建工具:** Vite 6.0+。

## 3. 目录结构规范
- `/components`: 视图层，分为 UI 组建、控制面板和渲染器。
- `/core`: 核心逻辑层。
  - `/hooks`: 封装音频、视觉状态与 AI 逻辑。
  - `/services`: 处理计算密集型任务（如频谱分析、AI 请求）。
  - `/types`: 统一的 TypeScript 类型定义。
- `/assets`: 静态资源、本地化文件与全局样式。
- `/openspec`: 项目规范文档。

## 4. 渲染管线决策
系统根据 `settings.mode` 自动切换渲染路径：
- **WebGL Path:** 针对复杂 3D 场景，使用 ShaderMaterial 动态接收音频 Uniforms。
- **Canvas Path:** 针对低功耗模式或特定 2D 风格，通过 `requestAnimationFrame` 保持 60FPS。

---
*Aura Flux Architecture Specification - Version 1.9.7*
*Author: Sut*
