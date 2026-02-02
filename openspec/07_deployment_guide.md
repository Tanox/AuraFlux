# OpenSpec: 部署与环境规范 (07)

## 1. 编译环境 (v1.8.99)
- **Runtime:** Bun 1.1+ 或 Node.js 20+。
- **Build Engine:** Vite 6.0 (ESM 优先)。

## 2. 环境变量安全
- **API_KEY:** 必须通过环境变量注入。
- **Production:** 生产环境必须配置 CSP (Content Security Policy) 以保护 API 调用安全。

## 3. 部署目标
- 必须支持静态托管 (GitHub Pages, Vercel, Netlify)。
- PWA 支持: 必须包含 Service Worker (`sw.js`) 实现离线资源缓存。

---
*Aura Flux Deployment Guide - Version 1.8.99*
*Author: Sut*