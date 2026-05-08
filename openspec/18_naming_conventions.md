# Aura Flux 命名规范

## 版本信息
- **版本**: v2.3.10
- **更新日期**: 2026-04-23
- **作者**: Sut

## 目录

1. [文件命名规范](#1-文件命名规范)
2. [目录命名规范](#2-目录命名规范)
3. [组件命名规范](#3-组件命名规范)
4. [Hook 命名规范](#4-hook-命名规范)
5. [类型命名规范](#5-类型命名规范)
6. [常量命名规范](#6-常量命名规范)
7. [函数命名规范](#7-函数命名规范)
8. [CSS 类名规范](#8-css-类名规范)

---

## 1. 文件命名规范

### 1.1 通用规则
- 所有文件使用 **UTF-8** 编码
- 行尾序列使用 **CRLF** (Windows 标准)
- 文件名中避免使用特殊字符和空格
- 使用有意义的描述性名称

### 1.2 代码文件

| 文件类型 | 命名规范 | 示例 |
|---------|---------|------|
| React 组件 | PascalCase | `App.tsx`, `VisualizerCanvas.tsx` |
| Hook 文件 | camelCase (以 use 开头) | `useAudio.ts`, `useMobileGestures.ts` |
| 类型定义 | PascalCase | `types.ts`, `index.ts` |
| 工具函数 | camelCase | `audioUtils.ts`, `lyricsUtils.ts` |
| 服务文件 | camelCase | `aiService.ts` |
| 常量文件 | camelCase | `version.ts`, `index.ts` |
| 样式文件 | 与组件同名 | `App.module.css` |

### 1.3 配置文件

| 文件类型 | 命名规范 | 示例 |
|---------|---------|------|
| 配置文件 | kebab-case | `next.config.js`, `tailwind.config.ts` |
| 环境变量 | `.env.xxx` | `.env.local`, `.env.production` |
| 测试文件 | `*.test.ts` 或 `*.spec.ts` | `logger.test.ts` |

### 1.4 资源文件

| 文件类型 | 命名规范 | 示例 |
|---------|---------|------|
| 图标文件 | kebab-case | `icon-128x128.svg` |
| 图片文件 | kebab-case | `hero-image.png` |
| 字体文件 | kebab-case | `inter-font.woff2` |

---

## 2. 目录命名规范

### 2.1 通用规则
- 目录名使用 **kebab-case** (小写字母，单词间用连字符分隔)
- 目录名应使用复数形式表示集合概念
- 避免使用缩写，保持名称清晰易懂

### 2.2 目录结构示例

```
src/
├── components/           # 组件目录
│   ├── controls/         # 控制组件
│   ├── visualizers/     # 可视化组件
│   └── ui/              # UI 组件
├── hooks/               # Hook 目录
│   ├── audio/           # 音频相关 Hook
│   ├── state/           # 状态管理 Hook
│   └── utils/           # 工具 Hook
├── utils/               # 工具函数
│   └── tests/           # 测试文件
├── types/               # 类型定义
├── services/            # 服务层
├── constants/           # 常量定义
├── locales/             # 国际化文件
│   ├── en/              # 英语
│   └── zh/              # 中文
└── app/                 # Next.js App Router
```

### 2.3 目录命名参考

| 目录名 | 用途 | 备注 |
|-------|------|------|
| `components/` | React 组件 | 放置可复用组件 |
| `hooks/` | 自定义 Hooks | 以 `use` 开头的函数 |
| `utils/` | 工具函数 | 无业务逻辑依赖的纯函数 |
| `services/` | 服务层 | 包含业务逻辑的服务 |
| `types/` | 类型定义 | TypeScript 类型和接口 |
| `constants/` | 常量定义 | 应用级别的常量 |
| `locales/` | 国际化 | i18n 翻译文件 |
| `public/` | 静态资源 | 直接暴露给用户的文件 |
| `scripts/` | 工具脚本 | 构建和部署脚本 |

---

## 3. 组件命名规范

### 3.1 组件文件
- **文件名**: PascalCase
- **导出名称**: PascalCase，与文件名一致
- **默认导出**: 允许，但不推荐

### 3.2 组件命名示例

```tsx
// File: src/components/visualizers/ui/WelcomeScreen.tsx
export const WelcomeScreen: React.FC = () => {
  return <div>Welcome</div>;
};

// 使用命名导出而非默认导出
```

### 3.3 组件结构组织

每个组件文件应按以下顺序组织：

```tsx
// 1. 头部注释 (文件路径和版本)
// File: src/components/xxx.tsx | Version: v2.3.10

// 2. 导入语句
import React from 'react';
import { useState, useEffect } from 'react';

// 3. 类型定义 (如有)
// interface Props { ... }

// 4. 组件定义
export const ComponentName: React.FC<Props> = ({ prop1, prop2 }) => {
  // Hooks
  const [state, setState] = useState();

  // 副作用
  useEffect(() => { ... }, []);

  // 回调函数
  const handleClick = () => { ... };

  // 渲染
  return ( ... );
};

// 5. 辅助函数 (如有)
// const helperFunction = () => { ... };
```

---

## 4. Hook 命名规范

### 4.1 Hook 文件
- **文件名**: 必须以 `use` 开头，使用 camelCase
- **返回值**: 如果返回数组，使用 `[xxx, xxx]` 格式

### 4.2 Hook 命名示例

```typescript
// File: src/hooks/audio/useAudio.ts
export function useAudio({ settings, language }: UseAudioProps): UseAudioReturn {
  // ...
  return { ... };
}

// 如果返回多个相关值，使用数组
export const useAudioAnalyzer = (analyser: AnalyserNode) => {
  const [frequencyData, setFrequencyData] = useState<Uint8Array>(new Uint8Array(0));

  // ...

  return [frequencyData, { getByteFrequencyData, getByteTimeDomainData }];
};
```

### 4.3 Hook 分类

| Hook 类型 | 目录 | 示例 |
|----------|------|------|
| 状态管理 | `hooks/state/` | `useAppState.ts`, `useVisualsState.ts` |
| 音频相关 | `hooks/audio/` | `useAudio.ts`, `useAudioAnalyzer.ts` |
| 性能相关 | `hooks/performance/` | `useAdaptiveComplexity.ts`, `usePerformanceMonitor.ts` |
| 工具类 | `hooks/utils/` | `useIdleTimer.ts`, `useLocalStorage.ts` |
| 视觉效果 | `hooks/visuals/` | `useColorManager.ts` |
| 动画相关 | `hooks/animation/` | `useAnimationLoop.ts` |

---

## 5. 类型命名规范

### 5.1 类型文件
- **文件名**: PascalCase 或与功能相关的小写
- **类型前缀**: 根据类型种类添加前缀

### 5.2 类型命名示例

```typescript
// File: src/types/index.ts

// 枚举类型 - PascalCase，枚举值 UPPER_SNAKE_CASE
export enum VisualizerMode {
  DIGITAL_GRID = 'DIGITAL_GRID',
  SILK_WAVE = 'SILK_WAVE',
}

// 接口 - PascalCase
export interface VisualizerSettings {
  sensitivity: number;
  mode: VisualizerMode;
}

// 类型别名 - PascalCase
export type Language = 'en' | 'zh' | 'es';

// Props 类型 - PascalCase，以 Props 结尾
export interface AudioSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// 回调类型 - PascalCase，以 Handler 或 Callback 结尾
export type EventHandler = (event: Event) => void;
export type CompletionCallback = (result: Result) => void;
```

### 5.3 类型前缀参考

| 前缀 | 用途 | 示例 |
|-----|------|------|
| `I` | 接口 (可选) | `IComponentProps` |
| `Props` | 组件属性 | `WelcomeScreenProps` |
| `Handler` | 事件处理 | `ClickHandler` |
| `Callback` | 回调函数 | `SuccessCallback` |
| `on` | 事件绑定 | `onClick`, `onChange` |

---

## 6. 常量命名规范

### 6.1 常量文件
- **文件名**: camelCase
- **常量名**: UPPER_SNAKE_CASE (对于真正的常量) 或 camelCase (对于配置对象)

### 6.2 常量命名示例

```typescript
// File: src/constants/index.ts

// 真正的常量 - UPPER_SNAKE_CASE
export const MAX_FPS = 60;
export const DEFAULT_SENSITIVITY = 1.0;

// 配置对象 - PascalCase
export const APP_NAME = 'Aura Flux';
export const APP_VERSION = '2.3.8';

// 相关常量组 - PascalCase 对象
export const THEMES = {
  DARK: 'dark',
  LIGHT: 'light'
} as const;

export const COLOR_THEMES = [
  { id: 'neon', name: 'Neon', colors: ['#ff00ff', '#00ffff'] },
  { id: 'ocean', name: 'Ocean', colors: ['#2193b0', '#6dd5ed'] },
] as const;
```

---

## 7. 函数命名规范

### 7.1 通用规则
- **普通函数**: camelCase，使用动词或动词短语
- **事件处理函数**: 以 `handle` 开头
- **事件绑定函数**: 以 `on` 开头
- **判断函数**: 以 `is`, `are`, `has`, `can` 开头
- **获取函数**: 以 `get` 开头
- **设置函数**: 以 `set` 开头
- **渲染函数**: 以 `render` 开头
- **私有函数**: 可以用 `_` 开头或放在文件底部

### 7.2 函数命名示例

```typescript
// 事件处理
const handleClick = () => { ... };
const handleSubmit = (data: FormData) => { ... };

// 事件绑定
const onChange = (value: string) => { ... };
const onSubmit = () => { ... };

// 判断函数
const isValidEmail = (email: string) => { ... };
const hasPermission = (user: User, action: string) => { ... };
const canEdit = (user: User) => { ... };

// 获取和设置
const getUserData = () => { ... };
const setUserData = (data: UserData) => { ... };

// 渲染函数
const renderHeader = () => { ... };
const renderFooter = () => { ... };
```

---

## 8. CSS 类名规范

### 8.1 通用规则
- **推荐使用 Tailwind CSS** 进行样式编写
- **自定义类名**: 使用 kebab-case
- **语义化命名**: 避免使用表现性命名

### 8.2 Tailwind CSS 使用示例

```tsx
// 使用 Tailwind 类名
<div className="flex items-center justify-between p-4 bg-white dark:bg-black">
  <h1 className="text-2xl font-bold">Title</h1>
</div>

// 条件类名
<button
  className={`px-4 py-2 rounded ${
    isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
  }`}
>
  Button
</button>
```

### 8.3 ID 命名

- **页面容器**: 使用有意义的 id，如 `id="app-root"`, `id="visualizer-container"`
- **表单元素**: 使用 `id="input-xxx"`, `id="select-xxx"`
- **按钮**: 使用 `id="btn-xxx"`

---

## 附录

### A. 命名检查清单

- [ ] 文件名符合规范
- [ ] 目录名使用 kebab-case
- [ ] 组件名使用 PascalCase
- [ ] Hook 名以 use 开头
- [ ] 类型名使用 PascalCase
- [ ] 常量名清晰易懂
- [ ] 函数名使用动词开头
- [ ] CSS 类名简洁有意义

### B. 命名反模式

```typescript
// 避免使用
const a = 10;                    // 无意义名称
const data = getData();          // 过于通用
const temp = processTemp();      // 临时变量
const fn = () => { };           // 缩写

// 推荐使用
const maxRetries = 10;
const userData = getUserProfile();
const temperature = convertTemperature();
const handleClick = () => { };
```

---

## 修订历史

| 版本 | 日期 | 修改内容 | 作者 |
|-----|------|---------|------|
| v2.3.10 | 2026-04-23 | 初始版本 | Sut |
