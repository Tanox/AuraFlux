# OpenSpec: 系统架构规范 (01)

## 1. 核心架构概述 (v1.9.70)
Aura Flux 采用 **React 19** 作为 UI 框架。视觉系统结合了 **Three.js (R182+)** 高性能 3D 渲染与基于 **OffscreenCanvas Worker** 的 2D 渲染引擎。AI 层通过 **Google Gemini 3.0** 提供实时通感分析。

## 2. 技术栈标准
- **UI 框架:** React 19.0.0 (Strict Mode)。
- **渲染引擎:** Hybrid (WebGL + Worker Canvas)。
- **状态管理:** 模块化 **Context API** (`UIContext`, `VisualsContext`, `AudioContext`, `AIContext`)。
- **路径解析:** 
    - 统一支持 `@/` 别名解析。
    - **浏览器原生支持:** 通过 `index.html` 的 `importmap` 确保别名映射。

## 3. 核心目录结构 (v1.9.70)
- `App.tsx`: 顶层入口。
- `app/components/`: 视觉场景与 UI 组件。
- `app/hooks/`: 核心逻辑 Hook。
- `app/services/`: 纯逻辑服务（音频算法、AI 封装）。
- `app/workers/`: 离屏渲染线程。
- `public/`: 唯一合规的静态资产（Assets）存放地。

## 4. 资产移除准则
- **禁用目录:** `app/assets/` 已被彻底移除。
- **原因:** 为了简化构建流程并符合 PWA/静态部署标准，所有图标、Logo 和元数据资产必须存放于 `public/` 目录下。

---
*Aura Flux Architecture Specification - Version 1.9.70*
*Author: Sut*