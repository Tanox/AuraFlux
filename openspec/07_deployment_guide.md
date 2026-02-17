# OpenSpec: 部署与环境规范 (07)

## 1. 环境配置 (v1.9.36)
- **API 注入:** 通过 Vite 的 `define` 插件将 `process.env.API_KEY` 注入。
- **构建目标:** `esnext`，压缩工具 `esbuild`。

## 2. PWA 规范
- **Service Worker (`sw.js`):** 
  - 采用 **Stale-While-Revalidate** 策略。
  - **更新逻辑:** 监听 `SKIP_WAITING` 消息。当 `onupdatefound` 触发时，UI 展示“立即刷新”横幅，点击后触发 `postMessage` 并调用 `window.location.reload()`。
- **Manifest:** `manifest.json` 包含 `maskable` 图标支持。

## 3. 构建发布
- **目录:** `dist/` 为发布目录。
- **权限:** `metadata.json` 显式声明 `microphone` 权限。

---
*Aura Flux Deployment Guide - Version 1.9.36*
*Author: Sut*