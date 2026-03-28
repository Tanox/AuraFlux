# 核心架构规范

## 1. 应用入口结构

### 1.1 主应用组件 (App.tsx)
- **文件**: `src/components/App.tsx`
- **版本**: v2.0.4
- **功能**: 应用的顶层入口组件

**核心特性:**
- 支持客户端渲染 (`'use client'`)
- 使用 `AppProvider` 提供全局状态管理
- 实现懒加载和 `Suspense` 优化
- 包含欢迎屏幕和引导覆盖层
- 支持文件拖放导入
- 响应式主题切换
- 版本检查和更新提示
- 唤醒锁管理

**主要组件:**
- `WelcomeScreen` - 初始欢迎界面
- `OnboardingOverlay` - 首次使用引导
- `HelpModal` - 帮助模态框
- `SongOverlay` - 歌曲信息覆盖层
- `LyricsOverlay` - 歌词显示覆盖层
- `CustomTextOverlay` - 自定义文本覆盖层
- `FPSCounter` - 帧率计数器
- `VisualizerCanvas` - 2D 可视化画布
- `ThreeVisualizer` - 3D 可视化场景
- `Controls` - 控制界面

**状态管理:**
- `isExpanded` - 控制界面展开状态
- `onboarded` - 引导完成状态（持久化到 localStorage）
- `isIdle` - 空闲状态（用于自动隐藏 UI）

**事件处理:**
- 拖放文件导入
- 双击全屏
- 版本更新提示
- 手势支持

## 2. 状态管理系统

### 2.1 应用上下文 (AppContext.tsx)
- **文件**: `src/context/AppContext.tsx`
- **功能**: 提供全局状态管理和共享功能

**核心功能:**
- 提供 UI 状态管理 (`useUI`)
- 提供视觉状态管理 (`useVisuals`)
- 提供音频状态管理 (`useAudioContext`)
- 提供 AI 状态管理 (`useAI`)
- 管理全局设置和配置

## 3. 核心常量

### 3.1 版本常量 (version.ts)
- **文件**: `src/constants/version.ts`
- **功能**: 定义应用版本号

**内容:**
```typescript
export const APP_VERSION = '2.0.4';
```

### 3.2 通用常量 (index.ts)
- **文件**: `src/constants/index.ts`
- **功能**: 定义应用中使用的常量

**主要常量:**
- 视觉模式定义
- 颜色主题
- 音频分析参数
- UI 配置选项
