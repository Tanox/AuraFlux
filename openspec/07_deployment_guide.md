# OpenSpec: 部署与环境规范 (07)

## 1. 构建环境 (v1.9.73)
- **构建工具:** Vite 6.0+。
- **注入变量:** `process.env.API_KEY` (必须)。
- **目标平台:** `esnext`，压缩采用 `esbuild`。

## 2. PWA 规范 (当前已停用)
- **状态:** Service Worker (`sw.js`) 注册逻辑已暂时移除，以增强受限执行环境下的稳定性。
- **资产清理:** `public/manifest.json` 与 `sw.js` 仍保留在代码库中，但不在 `index.html` 中引用。

## 3. 生产发布
- **基准路径:** `./` (支持任意子路径部署)。
- **权限申请:** `metadata.json` 中必须显式声明 `camera` 和 `microphone` 权限。

---
*Aura Flux Deployment Guide - Version 1.9.73*
*Author: Sut*