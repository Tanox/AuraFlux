# 核心架构规范

## 1. 应用入口结构

### 1.1 主应用组件 (App.tsx)
- **文件**: `src/components/App.tsx`
- **版本**: v2.0.6
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

**代码示例:**
```tsx
// App.tsx 核心结构
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AppProvider, useUI } from '@/context/AppContext';
import { WelcomeScreen } from './visualizers/ui/WelcomeScreen';
import { OnboardingOverlay } from './visualizers/ui/onboarding/OnboardingOverlay';
import { HelpModal } from './visualizers/ui/HelpModal';
import { SongOverlay } from './visualizers/ui/SongOverlay';
import { LyricsOverlay } from './visualizers/ui/LyricsOverlay';
import { CustomTextOverlay } from './visualizers/ui/CustomTextOverlay';
import { FPSCounter } from './visualizers/ui/FPSCounter';
import { VisualizerCanvas } from './visualizers/VisualizerCanvas';
import { ThreeVisualizer } from './visualizers/ThreeVisualizer';
import { Controls } from './controls/Controls';

function AppContent() {
  const { isExpanded, setIsExpanded, onboarded, setOnboarded, isIdle, setIsIdle } = useUI();
  
  // 处理拖放文件
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    // 处理文件导入逻辑
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* 可视化组件 */}
      <VisualizerCanvas />
      <ThreeVisualizer />
      
      {/* 控制界面 */}
      <Controls />
      
      {/* 覆盖层 */}
      <WelcomeScreen />
      <OnboardingOverlay />
      <HelpModal />
      <SongOverlay />
      <LyricsOverlay />
      <CustomTextOverlay />
      <FPSCounter />
    </div>
  );
}

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
```

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

**状态结构:**
- `uiState`: 管理界面状态（展开/收起、引导状态等）
- `visualState`: 管理可视化设置（模式、颜色、灵敏度等）
- `audioState`: 管理音频状态（输入源、设备、播放状态等）
- `aiState`: 管理 AI 状态（处理状态、歌词显示等）

**代码示例:**
```tsx
// AppContext.tsx 核心结构
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// UI 状态类型
type UIState = {
  isExpanded: boolean;
  onboarded: boolean;
  isIdle: boolean;
  setIsExpanded: (expanded: boolean) => void;
  setOnboarded: (onboarded: boolean) => void;
  setIsIdle: (idle: boolean) => void;
};

// 应用上下文类型
type AppContextType = {
  ui: UIState;
  // 其他状态...
};

// 创建上下文
const AppContext = createContext<AppContextType | undefined>(undefined);

// 上下文提供者
export function AppProvider({ children }: { children: ReactNode }) {
  // UI 状态
  const [isExpanded, setIsExpanded] = useState(false);
  const [onboarded, setOnboarded] = useState(() => {
    const stored = localStorage.getItem('av_v1_onboarded');
    return stored === 'true';
  });
  const [isIdle, setIsIdle] = useState(false);

  // 当引导状态改变时，持久化到本地存储
  useEffect(() => {
    localStorage.setItem('av_v1_onboarded', onboarded.toString());
  }, [onboarded]);

  const ui: UIState = {
    isExpanded,
    onboarded,
    isIdle,
    setIsExpanded,
    setOnboarded,
    setIsIdle,
  };

  const value: AppContextType = {
    ui,
    // 其他状态...
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// 自定义钩子
export function useUI() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useUI must be used within an AppProvider');
  }
  return context.ui;
}

// 其他自定义钩子...
```

## 3. 核心常量

### 3.1 版本常量 (version.ts)
- **文件**: `src/constants/version.ts`
- **功能**: 定义应用版本号

**内容:**
```typescript
export const APP_VERSION = '2.0.6';
```

### 3.2 通用常量 (index.ts)
- **文件**: `src/constants/index.ts`
- **功能**: 定义应用中使用的常量

**主要常量:**
- 视觉模式定义
- 颜色主题
- 音频分析参数
- UI 配置选项

**代码示例:**
```typescript
// 视觉模式定义
export enum VisualizerMode {
  BARS = 'BARS',
  WAVEFORM = 'WAVEFORM',
  RINGS = 'RINGS',
  PLASMA = 'PLASMA',
  NEBULA = 'NEBULA',
  TUNNEL = 'TUNNEL',
  FLUID_CURVES = 'FLUID_CURVES',
  PARTICLES = 'PARTICLES',
}

// 颜色主题
export const COLOR_THEMES = {
  default: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#ec4899',
    background: '#0f172a',
    text: '#f8fafc',
  },
  // 其他主题...
};

// 音频分析参数
export const AUDIO_ANALYSIS = {
  fftSize: 2048,
  smoothingTimeConstant: 0.8,
  minDecibels: -90,
  maxDecibels: -10,
};

// UI 配置选项
export const UI_CONFIG = {
  idleTimeout: 30000, // 30秒
  animationDuration: 300,
  responsiveBreakpoints: {
    mobile: 640,
    tablet: 768,
    desktop: 1024,
  },
};
```
