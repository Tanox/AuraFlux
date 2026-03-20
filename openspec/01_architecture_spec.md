# OpenSpec: 系统架构规范 (01)

## 1. 核心架构概述 (v1.9.85)
Aura Flux 采用 **React 19** 作为 UI 框架。视觉系统结合了 **Three.js (R182+)** 高性能 3D 渲染与基于 **OffscreenCanvas Worker** 的 2D 渲染引擎。AI 层通过 **Google Gemini 3.0** 提供实时通感分析。新增 **版本更新检测** 机制，确保客户端与服务端版本同步。

## 2. 技术栈标准
- **UI 框架:** React 19.0.0 (Strict Mode)。
- **渲染引擎:** Hybrid (WebGL + Worker Canvas)。
- **状态管理:** 模块化 **Context API** (`UIContext`, `VisualsContext`, `AudioContext`, `AIContext`)。
- **版本控制:** 客户端轮询 (`useVersionCheck`) + 静态元数据 (`public/version.json`)。
- **路径解析:** 
    - 统一支持 `@/` 别名解析。
    - **模块解析优化:** 移除了导入路径中的 `.ts`/`.tsx` 显式后缀，确保 Next.js 构建系统的块加载 (Chunk Loading) 稳定性。

## 3. 核心目录结构 (v1.9.85)
- `App.tsx`: 顶层入口。
- `app/components/`: 视觉场景与 UI 组件。
- `app/hooks/`: 核心逻辑 Hook。
- `app/services/`: 纯逻辑服务（音频算法、AI 封装）。
- `app/workers/`: 离屏渲染线程。
- `public/`: 唯一合规的静态资产（Assets）存放地，包含 `version.json`。

## 4. 资产移除准则
- **禁用目录:** `app/assets/` 已被彻底移除。
- **原因:** 为了简化构建流程并符合 PWA/静态部署标准，所有图标、Logo 和元数据资产必须存放于 `public/` 目录下。

---
*Aura Flux Architecture Specification - Version 2.4.1*
*Author: Sut*