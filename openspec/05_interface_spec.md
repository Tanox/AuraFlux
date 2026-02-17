# OpenSpec: UI/UX 与交互规范 (05)

## 1. 界面理念 (v1.9.36)
Aura Flux 采用 **Bento Grid (便当盒)** 布局，将复杂的专业控件组织在非对称的卡片容器中，确保界面在信息密度极高时依然保持整洁。

## 2. 控制面板结构
- **顶部弹出层:** `Controls.tsx` 负责多标签页切换。
- **分层管理:**
  - `VisualSettingsPanel`: 细分为 `CoreVisuals`, `AiBackground`, `ModeSelector`。
  - `AudioSettingsPanel`: 细分为 `InputSettings`, `AiSettings`。
  - `PlaybackPanel`: 包含播放器逻辑、专辑封面预览及歌单管理器。
- **文字叠加层:** 支持 `AUTO`（自动同步歌曲信息）、`CLOCK`、`CUSTOM` 三种模式，支持 3D 挤出效果。

## 3. 交互标准
- **全屏手势:** 左右滑动切换模式，上下滑动调节增益，长按开关 AI 图层。
- **拖放逻辑:** 根容器检测 `Files` 拖入并触发 `importFiles` 逻辑。
- **沉浸模式:** `useIdleTimer` 在 3 秒后淡出 UI 且隐藏鼠标指针。

## 4. 实时反馈
- **Toast 系统:** 位于 `bottom-24`，对导出、错误及 AI 状态进行即时通知。
- **录制状态:** 工作室面板支持“武装（Armed）”状态，根据音频信号自动触发录制起始。

---
*Aura Flux Interface Specification - Version 1.9.36*
*Author: Sut*