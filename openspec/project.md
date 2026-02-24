# 项目规范文档 (Project Specification)

## 项目概述
**项目名称**: Music Visualizer Next
**版本**: v1.0.1
**描述**: 一个基于 Next.js 16 和 Tailwind CSS v4 构建的音乐可视化应用基础框架。

## 技术栈
- **框架**: Next.js 16.1.6 (App Router)
- **UI 样式**: Tailwind CSS v4.0.0-alpha.13
- **动画**: Motion (Framer Motion)
- **图标**: Lucide React
- **语言**: TypeScript

## 核心功能
1. **基础架构**: 搭建了 Next.js App Router 的基础结构 (`layout.tsx`, `page.tsx`)。
2. **样式系统**: 配置了全局 Tailwind CSS 样式 (`globals.css`)，支持深色模式 (Dark Mode) 变量。
3. **国际化 (i18n)**: 提供了多语言基础支持，包含 11 种语言的 JSON 配置文件 (`en`, `zh-CN`, `zh-TW`, `es`, `ar`, `fr`, `pt-BR`, `de`, `ja`, `ko`, `ru`)。
4. **鲁棒性 (Robustness)**: 
   - 实现了全局错误边界 (`error.tsx`) 捕获运行时异常。
   - 实现了全局 404 页面 (`not-found.tsx`) 处理未匹配路由。

## 目录结构
- `src/app/`: Next.js 核心路由目录。
- `src/locales/`: 国际化语言文件目录。
- `openspec/`: 项目规范文档目录。

## 开发规范
- 所有代码文件头部必须包含文件名与统一版本号注释（如 `v1.0.1`）。
- 页面容器需添加语义化 `id` 便于调试。
- 每次修改递增 PATCH 版本，并记录至 `changelog.md`。
