# OpenSpec: UI/UX 与交互规范 (05)

## 1. 设计语言 (v1.9.74)
Aura Flux 采用 **Bento Grid (便当盒)** 布局，结合高斯模糊 (Glassmorphism) 和霓虹光效，构建沉浸式控制界面。

## 2. 面板组织
- **顶部扩展层:** `Controls.tsx` 采用多标签分页（Visual, Audio, Playback, Text, Studio, System）。
- **底部条 (BottomBar):** 核心播放控制、随机化按钮及全屏切换。
- **智能 HUD:** 包含 `SongOverlay` (歌曲信息) 和 `LyricsOverlay` (动态歌词)。
- **全局通知:** `Toast` 系统用于显示操作反馈及 **版本更新提示**。

## 3. 交互标准
- **手势操作:** 
  - 左右滑动: 切换视觉模式。
  - 上下滑动: 调节音频增益 (Gain)。
  - 长按: 开关 AI 信息图层。
- **智能淡出:** UI 在 3 秒静止后自动隐藏，提升观赏性。
- **快捷键:** 数字键 1-6 快速切换设置面板。
- **更新机制:** 检测到新版本时，顶部弹出持久化通知，引导用户刷新。

---
*Aura Flux Interface Specification - Version 1.9.74*
*Author: Sut*