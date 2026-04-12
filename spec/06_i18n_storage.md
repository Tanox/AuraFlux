# 国际化与存储系统规范

## 版本信息
- **版本**: v2.1.1
- **更新日期**: 2026-04-08
- **作者**: Sut

## 1. 国际化 (i18n) 系统

### 1.1 语言文件结构
- **目录**: `src/locales/`
- **功能**: 提供多语言支持

**支持的语言:**
- `en` - 英语
- `zh` - 简体中文
- `tw` - 繁体中文
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
// File: src/locales/index.ts | Version: v2.0.6
import en from './en';
import zhCN from './zh-CN';
import zhTW from './zh-TW';
import es from './es';
import ar from './ar';
import fr from './fr';
import ptBR from './pt-BR';
import de from './de';
import ja from './ja';
import ko from './ko';
import ru from './ru';

type LocaleType = typeof en;

export const locales = {
  en,
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  es,
  ar,
  fr,
  'pt-BR': ptBR,
  de,
  ja,
  ko,
  ru
};

export const getTranslations = (lang: string): LocaleType => {
  return locales[lang as keyof typeof locales] || en;
};

export const availableLanguages = [
  { value: 'en', label: 'English' },
  { value: 'zh-CN', label: '中文 (简体)' },
  { value: 'zh-TW', label: '中文 (繁體)' },
  { value: 'es', label: 'Español' },
  { value: 'ar', label: 'العربية' },
  { value: 'fr', label: 'Français' },
  { value: 'pt-BR', label: 'Português (Brasil)' },
  { value: 'de', label: 'Deutsch' },
  { value: 'ja', label: '日本語' },
  { value: 'ko', label: '한국어' },
  { value: 'ru', label: 'Русский' }
];

export const availableRegions = [
  { value: 'US', label: 'United States' },
  { value: 'CN', label: 'China' },
  { value: 'TW', label: 'Taiwan' },
  { value: 'ES', label: 'Spain' },
  { value: 'AR', label: 'Arab World' },
  { value: 'FR', label: 'France' },
  { value: 'BR', label: 'Brazil' },
  { value: 'DE', label: 'Germany' },
  { value: 'JP', label: 'Japan' },
  { value: 'KR', label: 'Korea' },
  { value: 'RU', label: 'Russia' }
];
```

### 1.3 RTL 支持
- **功能**: 阿拉伯语等 RTL 语言的支持

**特性:**
- 自动检测 RTL 语言
- 界面布局自动调整
- 文本方向处理

## 2. 存储系统

### 2.1 LocalStorage 存储
- **文件**: `src/hooks/useLocalStorage.ts`
- **功能**: 本地存储管理

**核心功能:**
- 数据持久化
- 响应式存储
- 类型安全
- 错误处理

**存储键前缀:**
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
// File: src/hooks/useLocalStorage.ts | Version: v2.0.6
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

export const getLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

export const setLocalStorage = <T>(key: string, value: T): void => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
};

export const removeLocalStorage = (key: string): void => {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
  }
};

export const clearLocalStorage = (): void => {
  try {
    window.localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};
```

### 2.2 IndexedDB 存储
- **功能**: 存储大型数据

**核心功能:**
- 存储完整的 `Track` 对象
- 存储 File Blob 和专辑封面
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
