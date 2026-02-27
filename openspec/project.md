# 项目规范文档 (Project Specification)

## 项目概述
**项目名称**: Music Visualizer Next
**版本**: v1.9.75
**描述**: 一个基于 React 和 Three.js 构建的高级 AI 音乐可视化应用。

## 技术栈
- **框架**: Vite + React 19
- **UI 样式**: Tailwind CSS v3.4
- **3D 渲染**: Three.js + React Three Fiber
- **AI 集成**: Google Gemini API
- **语言**: TypeScript

## 核心功能
1. **基础架构**: 搭建了 React + Vite 的基础结构。
2. **样式系统**: 配置了全局 Tailwind CSS 样式。
3. **国际化 (i18n)**: 提供了多语言支持，包含 12 种语言 (`en`, `zh`, `zh-TW`, `es`, `ar`, `fr`, `pt`, `pt-BR`, `de`, `ja`, `ko`, `ru`)。
4. **鲁棒性 (Robustness)**: 
   - 实现了全局错误边界 (`ErrorBoundary`) 捕获运行时异常。
   - 实现了版本更新检测 (`useVersionCheck`)，提示用户刷新以获取最新功能。
5. **可视化**: 提供多种 2D 和 3D 音乐可视化模式。
6. **AI 分析**: 集成 Gemini API 进行歌曲识别和情绪分析。

## 目录结构
- `src/`: 源代码目录。
- `app/locales/`: 国际化语言文件目录。
- `openspec/`: 项目规范文档目录。

## 开发规范
- 所有代码文件头部必须包含文件名与统一版本号注释（如 `v1.0.1`）。
- 页面容器需添加语义化 `id` 便于调试。
- 每次修改递增 PATCH 版本，并记录至 `changelog.md`。
