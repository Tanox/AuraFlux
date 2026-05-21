<!-- openspec/19_component_styles.md v2.4.0 -->
# 组件样式系统规范

## 版本信息
- **版本**: v2.4.0
- **更新日期**: 2026-05-21
- **作者**: Sut

## 目录

1. [玻璃态设计系统](#1-玻璃态设计系统)
2. [按钮系统](#2-按钮系统)
3. [面板和卡片组件类](#3-面板和卡片组件类)
4. [文本样式](#4-文本样式)
5. [输入样式](#5-输入样式)
6. [工具提示样式](#6-工具提示样式)
7. [动画类](#7-动画类)
8. [自定义滚动条](#8-自定义滚动条)
9. [无障碍样式](#9-无障碍样式)
10. [选择样式](#10-选择样式)

---

## 1. 玻璃态设计系统

### 1.1 .glass-card
标准玻璃态卡片，用于主要内容区域。

```css
.glass-card {
  @apply bg-white/90 dark:bg-[#0a0a0c]/90 backdrop-blur-2xl border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl;
}
```

**使用示例**:
```tsx
<div className="glass-card p-6">
  <h2>主要内容区域</h2>
  <p>这是一个玻璃态卡片组件</p>
</div>
```

### 1.2 .glass-card-sm
小型玻璃态卡片，用于次要内容或紧凑布局。

```css
.glass-card-sm {
  @apply bg-white/85 dark:bg-[#0a0a0c]/85 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-xl shadow-lg;
}
```

**使用示例**:
```tsx
<div className="glass-card-sm p-4">
  <h3>次要内容</h3>
  <p>这是一个小型玻璃态卡片</p>
</div>
```

---

## 2. 按钮系统

### 2.1 .btn-base
所有按钮的基础类，必须与其他按钮类组合使用。

```css
.btn-base {
  @apply inline-flex items-center justify-center font-bold transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50;
}
```

**特性**:
- 内联弹性布局
- 项目居中对齐
- 粗体字体
- 300ms 过渡动画
- 无轮廓线
- 无障碍焦点环

### 2.2 .btn-primary
主要操作按钮，用于高优先级动作。

```css
.btn-primary {
  @apply btn-base bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-lg;
}
```

**使用示例**:
```tsx
<button className="btn-primary px-6 py-3 rounded-xl">
  开始使用
</button>
```

### 2.3 .btn-secondary
次要操作按钮，用于中等优先级动作。

```css
.btn-secondary {
  @apply btn-base bg-black/5 dark:bg-white/5 text-black/80 dark:text-white/80 hover:bg-black/10 dark:hover:bg-white/10;
}
```

**使用示例**:
```tsx
<button className="btn-secondary px-4 py-2 rounded-lg">
  取消
</button>
```

### 2.4 .btn-ghost
幽灵按钮，用于低优先级动作或工具栏按钮。

```css
.btn-ghost {
  @apply btn-base text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5;
}
```

**使用示例**:
```tsx
<button className="btn-ghost px-3 py-1.5 rounded-md">
  查看详情
</button>
```

### 2.5 .btn-icon
图标按钮，用于仅显示图标的按钮。

```css
.btn-icon {
  @apply btn-base w-10 h-10 rounded-xl;
}
```

**使用示例**:
```tsx
<button className="btn-icon" aria-label="关闭">
  <X size={20} />
</button>
```

---

## 3. 面板和卡片组件类

### 3.1 .panel-container
面板容器，提供最大宽度限制和居中布局。

```css
.panel-container {
  @apply max-w-6xl mx-auto p-4 pt-6;
}
```

### 3.2 .panel-content
面板内容区域，包含玻璃态样式和淡入动画。

```css
.panel-content {
  @apply glass-card overflow-hidden animate-fade-in-down;
}
```

### 3.3 .panel-tabs
面板标签页区域。

```css
.panel-tabs {
  @apply flex justify-center p-2 bg-black/[0.02] dark:bg-white/[0.02] border-b border-black/5 dark:border-white/5 overflow-x-auto no-scrollbar;
}
```

### 3.4 .panel-body
面板主体内容区域，包含滚动条样式。

```css
.panel-body {
  @apply p-4 overflow-y-auto custom-scrollbar max-h-[calc(100vh-200px)];
}
```

**完整面板示例**:
```tsx
<div className="panel-container">
  <div className="panel-content">
    <div className="panel-tabs">
      {/* 标签页内容 */}
    </div>
    <div className="panel-body">
      {/* 主体内容 */}
    </div>
  </div>
</div>
```

---

## 4. 文本样式

### 4.1 .text-label
标签文本，用于表单标签或说明文字。

```css
.text-label {
  @apply text-xs font-bold uppercase text-black/60 dark:text-white/60 tracking-wider;
}
```

**使用示例**:
```tsx
<label className="text-label">音量</label>
<input type="range" />
```

### 4.2 .text-mono
等宽文本，用于显示代码或数值。

```css
.text-mono {
  @apply text-xs font-mono text-black/80 dark:text-white/80;
}
```

**使用示例**:
```tsx
<span className="text-mono">{APP_VERSION}</span>
```

---

## 5. 输入样式

### 5.1 .input-base
输入框基础样式。

```css
.input-base {
  @apply bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 transition-all;
}
```

**使用示例**:
```tsx
<input className="input-base w-full" placeholder="搜索..." />
```

---

## 6. 工具提示样式

### 6.1 .tooltip
工具提示组件样式。

```css
.tooltip {
  @apply absolute z-50 px-2 py-1 text-xs font-bold text-white bg-black/90 dark:bg-white/90 text-black dark:text-white rounded shadow-lg pointer-events-none whitespace-nowrap;
}
```

**使用示例**:
```tsx
<div className="relative">
  <button>悬停查看</button>
  <div className="tooltip bottom-full left-1/2 -translate-x-1/2 mb-2">
    这是工具提示
  </div>
</div>
```

---

## 7. 动画类

### 7.1 .animate-pulse-slow
慢速脉冲动画，3秒周期。

```css
.animate-pulse-slow {
  animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

### 7.2 .animate-bounce-subtle
轻微弹跳动画，2秒周期。

```css
.animate-bounce-subtle {
  animation: bounce-subtle 2s infinite;
}

@keyframes bounce-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
```

---

## 8. 自定义滚动条

### 8.1 .custom-scrollbar
自定义滚动条样式，适用于可滚动内容区域。

```css
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  transition: background 0.2s ease;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.4);
}
```

### 8.2 .no-scrollbar
隐藏滚动条，但保持滚动功能。

```css
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
```

---

## 9. 无障碍样式

### 9.1 焦点可见样式

```css
*:focus-visible {
  outline: 2px solid rgb(var(--color-primary));
  outline-offset: 2px;
}
```

**说明**:
- 仅在键盘导航时显示焦点轮廓
- 使用主色调作为轮廓颜色
- 提供 2px 的偏移量提高可读性

### 9.2 .disabled
禁用状态样式。

```css
.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
```

**使用示例**:
```tsx
<button className={isDisabled ? 'btn-primary disabled' : 'btn-primary'}>
  提交
</button>
```

---

## 10. 选择样式

### 10.1 文本选择

```css
::selection {
  background: rgba(59, 130, 246, 0.3);
}
```

**说明**:
- 使用半透明蓝色作为选择背景
- 保持良好的可读性

---

## 附录 A: CSS 变量

### A.1 颜色变量

```css
:root {
  --color-primary: 59 130 246;
  --color-primary-foreground: 255 255 255;
  --color-secondary: 241 245 249;
  --color-secondary-foreground: 15 23 42;
  --color-accent: 129 140 248;
  --color-accent-foreground: 255 255 255;
  --color-muted: 148 163 184;
  --color-muted-foreground: 100 116 139;
}
```

### A.2 圆角变量

```css
:root {
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;
}
```

### A.3 阴影变量

```css
:root {
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
}
```
