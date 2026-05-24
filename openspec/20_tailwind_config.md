<!-- openspec/20_tailwind_config.md v2.3.11 -->
# Tailwind CSS 配置规范

## 版本信息
- **版本**: v2.3.11
- **更新日期**: 2026-05-21
- **作者**: Sut

## 目录

1. [配置文件概述](#1-配置文件概述)
2. [内容文件配置](#2-内容文件配置)
3. [主题配置](#3-主题配置)
4. [Primary 颜色系列](#4-primary-颜色系列)
5. [自定义动画](#5-自定义动画)
6. [插件配置](#6-插件配置)
7. [完整配置示例](#7-完整配置示例)

---

## 1. 配置文件概述

配置文件位于项目根目录：`tailwind.config.ts`

**导入方式**:
```typescript
import type { Config } from 'tailwindcss';
```

---

## 2. 内容文件配置

指定 Tailwind 需要扫描的文件，用于生成相应的 CSS 类。

```typescript
content: [
  './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
  './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  './src/app/**/*.{js,ts,jsx,tsx,mdx}',
],
```

**说明**:
- 扫描 `src/pages/` 目录下的所有页面文件
- 扫描 `src/components/` 目录下的所有组件文件
- 扫描 `src/app/` 目录下的所有 Next.js App Router 文件
- 支持的文件类型：js, ts, jsx, tsx, mdx

---

## 3. 主题配置

### 3.1 背景图片扩展

```typescript
extend: {
  backgroundImage: {
    'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
    'gradient-conic':
      'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
  },
  // ...
}
```

**使用示例**:
```tsx
<div className="bg-gradient-radial from-blue-500 to-purple-600">
  径向渐变背景
</div>
```

---

## 4. Primary 颜色系列

### 4.1 颜色配置

```typescript
colors: {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  }
}
```

### 4.2 颜色色阶说明

| 色阶 | 十六进制 | 用途 |
|------|----------|------|
| 50 | #eff6ff | 最浅的背景色 |
| 100 | #dbeafe | 浅背景色 |
| 200 | #bfdbfe | 浅边框 |
| 300 | #93c5fd | 边框 |
| 400 | #60a5fa | 次要按钮 |
| 500 | #3b82f6 | 主色调，默认颜色 |
| 600 | #2563eb | 主要按钮 |
| 700 | #1d4ed8 | 按钮悬停 |
| 800 | #1e40af | 按钮激活 |
| 900 | #1e3a8a | 最深的文字颜色 |

### 4.3 使用示例

```tsx
<button className="bg-primary-600 hover:bg-primary-700 text-white">
  主要按钮
</button>

<div className="border border-primary-300 bg-primary-50">
  卡片容器
</div>

<span className="text-primary-900 font-bold">
  重要文本
</span>
```

---

## 5. 自定义动画

### 5.1 动画配置

```typescript
animation: {
  'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
  'fade-in-down': 'fadeInDown 0.5s ease-out forwards',
},
keyframes: {
  fadeInUp: {
    '0%': { opacity: '0', transform: 'translateY(20px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' },
  },
  fadeInDown: {
    '0%': { opacity: '0', transform: 'translateY(-20px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' },
  }
}
```

### 5.2 动画使用示例

```tsx
<div className="animate-fade-in-up">
  从下往上淡入的内容
</div>

<div className="animate-fade-in-down">
  从上往下淡入的内容
</div>
```

---

## 6. 插件配置

```typescript
plugins: [],
```

**说明**:
- 当前未使用自定义插件
- 如需添加插件，在此数组中引入

---

## 7. 完整配置示例

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        }
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.5s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
};

export default config;
```

---

## 附录 A: 相关配置文件

### A.1 globals.css
全局样式文件，包含：
- Tailwind 指令
- CSS 变量定义
- 自定义组件类
- 自定义滚动条样式

**文件位置**: `src/app/globals.css`

详细内容请参考 [19 组件样式系统规范](./19_component_styles.md)。
