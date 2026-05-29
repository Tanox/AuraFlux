<!-- openspec/06_i18n_storage.md v2.3.11 -->
# 国际化与存储系统规范

## 版本信息
- **版本**: v2.3.11
- **更新日期**: 2026-06-23
- **作者**: Sut

## 1. 国际化(i18n) 系统

### 1.1 语言文件结构
- **目录**: `src/locales/`
- **功能**: 提供多语言支持

**支持的语言:**
- `en` - 英语
- `zh` - 简体中文
- `zh-TW` - 繁体中文
- `es` - 西班牙语
- `ar` - 阿拉伯语
- `fr` - 法语
- `pt` - 葡萄牙语
- `pt-BR` - 巴西葡萄牙语
- `de` - 德语
- `ja` - 日语
- `ko` - 韩语
- `ru` - 俄语

**语言文件结构:**
- `common.ts` - 通用文本
- `help.ts` - 帮助文本
- `messages.ts` - 消息文本
- `onboarding.ts` - 引导文本
- `panels.ts` - 面板文本
- `settings.ts` - 设置文本

### 1.2 国际化工具
- **文件**: `src/locales/index.ts`
- **功能**: 国际化工具函数

**核心功能:**
- 语言切换
- 文本翻译
- RTL 支持
- 语言检测

**代码示例:**
```tsx
// locales/index.ts 核心结构
// File: src/locales/index.ts | Version: v2.3.11
import { translations as en } from './en';
import { translations as zh } from './zh';
import { translations as es } from './es';

export const TRANSLATIONS: Record<string, any> = {
  en,
  zh,
  'zh-TW': zh,  // 繁体中文暂复用简体中文
  es,
  ar: en,  // 暂未翻译，回退到英文
  fr: en,
  pt: en,
  'pt-BR': en,
  de: en,
  ja: en,
  ko: en,
  ru: en,
};

export type TranslationSchema = typeof en;
```

> **注意**: 目前仅有 `en`（英语）、`zh`（简体中文）、`es`（西班牙语）三种语言有完整翻译文件。其余 9 种语言暂时回退到英文显示。

### 1.3 i18n 配置
- **文件**: `src/i18n.ts`
- **功能**: i18next 初始化配置

**核心配置:**
- 使用 `i18next` + `react-i18next`
- 默认语言: `en`
- 回退语言: `en`
- localStorage 键: `av_v1_language`
- `useSuspense: false`
- `compatibilityJSON: 'v4'`

**语言文件子模块（每种语言 6 个文件）:**
- `messages.ts` - 消息提示、toast、错误信息、模式名称/描述
- `common.ts` - 通用文本、队列、字体名称、404页面
- `onboarding.ts` - 引导页、步骤、语言选择
- `help.ts` - 帮助弹窗、指南、快捷键、关于页面
- `panels.ts` - 各控制面板文本
- `settings.ts` - 设置项标签、主题、AI提供商、区域等

### 1.4 语言状态管理
- **文件**: `src/hooks/state/useAppState.ts`
- **版本**: v2.3.11
- **功能**: 管理应用语言状态

**核心功能:**
- 语言切换
- 自动保存到 localStorage
- 浏览器语言检测
- i18next 集成

**状态管理:**
- `language` - 当前语言
- `setLanguage` - 语言切换函数

**setLanguage 实现要点:**
- 支持函数式更新 `(prev: Language) => Language`
- 直接更新 React 状态
- 同步保存到 localStorage (`av_v1_language`)
- 调用 `i18n.changeLanguage` 更新 i18next
- 避免在渲染期间更新状态，防止 React 警告

**代码示例:**
```tsx
// useAppState.ts setLanguage 实现
// File: src/hooks/state/useAppState.ts | Version: v2.3.11
const setLanguage = useCallback((lang: Language | ((prev: Language) => Language)) => {
  const next = typeof lang === 'function' ? lang(language) : lang;
  _setLanguage(next);
  localStorage.setItem('av_v1_language', next);
  i18n.changeLanguage(next);
}, [i18n, language]);
```

## 2. 存储系统

### 2.1 LocalStorage 存储
- **文件**: `src/hooks/useLocalStorage.ts`
- **功能**: 本地存储管理

**核心功能:**
- 数据持久化
- 响应式存储
- 类型安全
- 错误处理

**存储前缀:**
- `av_v1_`

**存储的数据:**
- `settings` - 应用设置
- `mode` - 视觉模式
- `theme` - 主题设置
- `language` - 语言设置
- `onboarded` - 引导完成状态

**代码示例:**
```tsx
// useLocalStorage.ts 核心结构
// File: src/hooks/utils/useLocalStorage.ts | Version: v2.3.11
import { useState, useEffect } from 'react';
import { logger } from '@/utils/logger';

export const useLocalStorage = () => {
  const getStorage = <T>(key: string, initialValue: T): T => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error: any) {
      logger.warn(`Error reading localStorage key "${key}":`, error?.message || error);
      return initialValue;
    }
  };

  const setStorage = <T>(key: string, value: T) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error: any) {
      logger.warn(`Error setting localStorage key "${key}":`, error?.message || error);
    }
  };

  return { getStorage, setStorage };
};
```

> **注意**: 此 hook 返回 `{ getStorage, setStorage }` 而非直接状态。额外有 `src/utils/storage.ts` 提供独立的 `safeStorageGet`/`safeStorageSet` 等 SSR 安全包装函数。

### 2.2 IndexedDB 存储
- **功能**: 存储大型数据

**核心功能:**
- 存储完整的 `Track` 对象
- 存储 File Blob 和专属标识符
- 支持离线恢复

**数据库信息:**
- 数据库名: `AuraFluxDB`
- 存储内容: 音频文件和相关元数据

### 2.3 持久化策略
**设置持久化:**
- 每次 `setSettings` 操作自动同步到本地存储
- 应用启动时从本地存储加载设置

**数据持久化:**
- 播放列表自动持久化
- 歌曲信息缓存
- 状态恢复

## 3. 类型定义

### 3.1 核心类型
- **文件**: `src/types/index.ts`
- **功能**: 定义应用中使用的类型

**主要类型:**
- `VisualizerMode` - 可视化模式
- `VisualizerSettings` - 可视化设置
- `AudioDevice` - 音频设备
- `Track` - 音频轨道
- `PlaybackMode` - 播放模式
- `SongInfo` - 歌曲信息
- `LyricsStyle` - 歌词样式
