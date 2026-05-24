<!-- openspec/21_react_patterns.md v2.3.11 -->
# React 性能模式与最佳实践规范

## 版本信息
- **版本**: v2.3.11
- **更新日期**: 2026-05-21
- **作者**: Sut

## 目录

1. [useCallback 使用指南](#1-usecallback-使用指南)
2. [useMemo 使用指南](#2-usememo-使用指南)
3. [React.memo 使用规范](#3-reactmemo-使用规范)
4. [动态导入与懒加载](#4-动态导入与懒加载)
5. [ARIA 无障碍属性](#5-aria-无障碍属性)
6. [ErrorBoundary 使用规范](#6-errorboundary-使用规范)
7. [性能监控工具](#7-性能监控工具)
8. [useId 使用指南](#8-useid-使用指南)

---

## 1. useCallback 使用指南

### 1.1 适用场景

使用 `useCallback` 的最佳时机：
- 传递回调函数给子组件
- 回调函数作为 useEffect 依赖项
- 使用 React.memo 优化的组件的 props
- 避免不必要的重新渲染

### 1.2 使用示例

```tsx
import { useCallback } from 'react';

const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  if (e.dataTransfer.types.includes('Files') && setIsDragging) {
    setIsDragging(true);
  }
}, [setIsDragging]);

const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  if (setIsDragging) {
    setIsDragging(false);
  }
}, [setIsDragging]);

const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  if (setIsDragging) {
    setIsDragging(false);
  }
  if (e.dataTransfer.files && e.dataTransfer.files.length > 0 && importFiles) {
    const audioFiles = Array.from(e.dataTransfer.files as FileList)
      .filter((file: File) => file.type.startsWith('audio/'));
    if (audioFiles.length > 0) {
      importFiles(audioFiles);
    }
  }
}, [importFiles, setIsDragging]);

const handleRetryIdentification = useCallback(() => {
  if (performIdentification && mediaStream) {
    performIdentification(mediaStream);
  }
}, [performIdentification, mediaStream]);

const handleCloseSongInfo = useCallback(() => {
  if (setSettings) {
    setSettings((s: any) => ({ ...s, showSongInfo: false }));
  }
}, [setSettings]);
```

### 1.3 反模式 - 过度使用

```tsx
// ❌ 不推荐：过度使用，没有实际收益
const handleClick = useCallback(() => {
  console.log('点击了');
}, []);

// ✅ 推荐：直接定义，没有子组件依赖
const handleClick = () => {
  console.log('点击了');
};
```

---

## 2. useMemo 使用指南

### 2.1 适用场景

使用 `useMemo` 的最佳时机：
- 计算密集型操作
- 避免重复计算
- 作为优化后的组件 props
- 保持引用稳定

### 2.2 使用示例

```tsx
import { useMemo } from 'react';

const uiContextValue = useMemo(() => ({
  ...uiState,
  toggleFullscreen,
  showToast
}), [uiState, toggleFullscreen, showToast]);

const visualsContextValue = useMemo(() => ({ 
  ...visualsState, 
  isThreeMode 
}), [visualsState, isThreeMode]);

const audioContextValue = useMemo(() => ({ 
  ...audioState, 
  currentSong, 
  setCurrentSong, 
  fileStatus, 
  fileName 
}), [audioState, currentSong, fileStatus, fileName]);

const aiContextValue = useMemo(() => aiState, [aiState]);
```

### 2.3 计算密集型示例

```tsx
// 计算密集型操作应该使用 useMemo
const sortedData = useMemo(() => {
  return data.sort((a, b) => {
    // 复杂的排序逻辑
    return a.value - b.value;
  });
}, [data]);
```

---

## 3. React.memo 使用规范

### 3.1 适用场景

使用 `React.memo` 的最佳时机：
- 纯组件，相同 props 总是渲染相同结果
- 经常重新渲染的组件
- 渲染成本较高的组件

### 3.2 使用示例

```tsx
import { memo } from 'react';

interface ExpensiveComponentProps {
  data: any[];
  onSelect: (item: any) => void;
}

const ExpensiveComponent = memo(function ExpensiveComponent({ 
  data, 
  onSelect 
}: ExpensiveComponentProps) {
  // 渲染逻辑
  return <div>{/* 内容 */}</div>;
});
```

### 3.3 自定义比较函数

```tsx
const MyComponent = memo(function MyComponent({ a, b, c }) {
  return <div>{a + b + c}</div>;
}, (prevProps, nextProps) => {
  // 自定义比较逻辑
  return prevProps.a === nextProps.a && 
         prevProps.b === nextProps.b && 
         prevProps.c === nextProps.c;
});
```

---

## 4. 动态导入与懒加载

### 4.1 Next.js 动态导入

```tsx
import dynamic from 'next/dynamic';

// 使用 dynamic 导入避免 SSR 问题
const VisualizerCanvas = dynamic(() => import('@/components/visualizers/VisualizerCanvas'), { ssr: false });
const ThreeVisualizer = dynamic(() => import('@/components/visualizers/ThreeVisualizer'), { ssr: false });
const Controls = dynamic(() => import('@/components/controls/Controls'), { ssr: false });

export default function Home() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
```

### 4.2 动态导入与 Suspense

```tsx
import { Suspense } from 'react';

<Suspense fallback={<div className="w-screen h-screen bg-black" />}>
  <MainContent />
</Suspense>
```

### 4.3 完整页面入口示例

```tsx
'use client';

import dynamic from 'next/dynamic';
import { ErrorBoundary } from '@/components/visualizers/ui/ErrorBoundary';

const App = dynamic(() => import('@/components/App').then(mod => mod.App), { ssr: false });

export default function Home() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
```

---

## 5. ARIA 无障碍属性

### 5.1 按钮无障碍

```tsx
<button className="btn-icon" aria-label="关闭">
  <X size={20} />
</button>
```

### 5.2 标签与输入

```tsx
<div>
  <label htmlFor="volume" className="text-label">音量</label>
  <input 
    id="volume" 
    type="range" 
    aria-describedby="volume-desc"
  />
  <span id="volume-desc" className="sr-only">调节音量大小</span>
</div>
```

### 5.3 状态属性

```tsx
<button 
  aria-pressed={isActive}
  aria-expanded={isOpen}
  aria-disabled={isDisabled}
>
  切换
</button>
```

### 5.4 隐藏但可访问元素

```tsx
<span className="sr-only">屏幕阅读器可读但视觉隐藏的文本</span>
```

---

## 6. ErrorBoundary 使用规范

### 6.1 组件实现

```tsx
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <h2 className="text-xl font-bold mb-2">出了点问题</h2>
          <p className="text-gray-600 mb-4">请刷新页面重试</p>
          <button 
            className="btn-primary"
            onClick={() => window.location.reload()}
          >
            刷新页面
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };
```

### 6.2 使用示例

```tsx
<ErrorBoundary>
  <App />
</ErrorBoundary>

<ErrorBoundary fallback={<CustomFallback />}>
  <VisualizerCanvas />
</ErrorBoundary>
```

---

## 7. 性能监控工具

### 7.1 FPS 计数器

```tsx
import { FPSCounter } from '@/components/visualizers/ui/FPSCounter';

{settings && settings.showFps && <FPSCounter />}
```

### 7.2 Web Vitals

```tsx
import { WebVitals } from '@/components/performance/WebVitals';

// 在 layout 中引入
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WebVitals />
        {children}
      </body>
    </html>
  );
}
```

---

## 8. useId 使用指南

### 8.1 适用场景

使用 `useId` 的最佳时机：
- 生成唯一的 ID 用于 HTML 标签关联
- 需要与服务端渲染匹配的 ID
- 表单标签关联

### 8.2 使用示例

```tsx
import { useId } from 'react';

function FormComponent() {
  const id = useId();
  
  return (
    <div>
      <label htmlFor={`${id}-name`}>姓名</label>
      <input id={`${id}-name`} type="text" />
    </div>
  );
}
```

### 8.3 多输入框示例

```tsx
function LoginForm() {
  const emailId = useId();
  const passwordId = useId();
  
  return (
    <form>
      <div>
        <label htmlFor={emailId}>邮箱</label>
        <input id={emailId} type="email" />
      </div>
      <div>
        <label htmlFor={passwordId}>密码</label>
        <input id={passwordId} type="password" />
      </div>
    </form>
  );
}
```

---

## 附录 A: 综合最佳实践示例

### A.1 完整优化组件

```tsx
'use client';

import { useState, useEffect, Suspense, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { AppProvider, useUI, useVisuals, useAudioContext, useAI } from '@/context/AppContext';
import { useIdleTimer } from '@/hooks/utils/useIdleTimer';
import { useMobileGestures } from '@/hooks/useMobileGestures';
import { useVersionCheck } from '@/hooks/utils/useVersionCheck';
import { COLOR_THEMES, APP_VERSION } from '@/constants';
import { logger } from '@/utils/logger';

const VisualizerCanvas = dynamic(() => import('@/components/visualizers/VisualizerCanvas'), { ssr: false });
const ThreeVisualizer = dynamic(() => import('@/components/visualizers/ThreeVisualizer'), { ssr: false });
const Controls = dynamic(() => import('@/components/controls/Controls'), { ssr: false });

const MainContent = () => {
  const ui = useUI();
  const visuals = useVisuals();
  const audio = useAudioContext();
  const ai = useAI();

  const [isExpanded, setIsExpanded] = useState(false);
  const [onboarded, setOnboarded] = useState(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('av_v1_onboarded');
    }
    return false;
  });

  const { isIdle } = useIdleTimer(isExpanded, visuals?.settings?.autoHideUi);
  const gestures = useMobileGestures();

  useVersionCheck(APP_VERSION, (newVersion) => {
    if (ui) {
      ui.showToast(`${ui.t('common.updateAvailable')} (${newVersion}). Please refresh.`, 'info', 5000, 'top');
    }
  });

  useEffect(() => {
    if (visuals?.settings?.wakeLock && ui) {
      ui.manageWakeLock(true);
    }
    return () => {
      if (ui) {
        ui.manageWakeLock(false);
      }
    };
  }, [visuals?.settings?.wakeLock, ui]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.types.includes('Files') && setIsDragging) {
      setIsDragging(true);
    }
  }, [setIsDragging]);

  const { 
    hasStarted, 
    language, 
    toggleFullscreen
  } = ui || {};
  
  const { 
    mode, 
    colorTheme, 
    settings, 
    isThreeMode 
  } = visuals || {};

  if (!ui || !visuals || !audio || !ai) {
    return null;
  }

  if (!hasStarted) {
    return <WelcomeScreen />;
  }

  return (
    <div id="app-root" className="absolute inset-0 bg-white dark:bg-black select-none overflow-hidden transition-all duration-700">
      <div id="visualizer-container" className="visualizer-container w-full h-full relative">
        <Suspense fallback={null}>
          {isThreeMode ? (
            analyser && settings ? (
              <ThreeVisualizer 
                analyser={analyser} 
                analyserR={analyserR} 
                colors={colorTheme} 
                settings={settings} 
                mode={mode} 
              />
            ) : (
              <div className="w-full h-full bg-black" />
            )
          ) : (
            <VisualizerCanvas 
              analyser={analyser} 
              analyserR={analyserR} 
              colors={colorTheme} 
              settings={settings} 
              mode={mode} 
            />
          )}
        </Suspense>
      </div>
    </div>
  );
};

export const App = () => (
  <AppProvider>
    <Suspense fallback={<div id="app-fallback-loader" className="w-screen h-screen bg-black" />}>
      <MainContent />
    </Suspense>
  </AppProvider>
);
```
