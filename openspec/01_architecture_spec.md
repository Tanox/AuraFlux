# OpenSpec: 系统架构规范 (01)

## 1. 核心设计哲学
Aura Flux 采用 **"离屏优先" (Offscreen-First)** 与 **"混合引擎" (Hybrid Engine)** 架构。

## 2. 线程模型与解耦策略
- **主线程 (Main Thread):** 管理 React 状态、AI 服务通信及 R3F 3D 渲染。
- **Worker 线程:** 使用 `OffscreenCanvas` 处理 2D 绘图。

## 3. 鲁棒性与异常边界 (v1.8.95)
- **防御性 AI 解析:** 引入 `parseAiJson` 钩子，自动清理 Markdown 噪声，防止模型非结构化输出导致的系统崩溃。
- **音频上下文自愈:** 监控 `AudioContext` 状态，对由于系统挂起导致的 Suspended 状态进行强制恢复。
- **内存安全:** 强制执行渲染器 `cleanup` 协议，在模式切换时释放离屏位图缓存。

---
*Aura Flux Architecture Specification - Version 1.8.95*
*Author: Sut*