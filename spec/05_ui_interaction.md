# UI 与交互系统规范

## 1. 控制界面系统

### 1.1 Controls 组件
- **文件**: `src/components/controls/Controls.tsx`
- **版本**: v2.0.3
- **功能**: 主控制界面组件

**核心特性:**
- 多标签页布局（Bento Grid 风格）
- 键盘快捷键支持
- 响应式设计
- 动态展开/收起

**标签页结构:**
- `visual` - 视觉设置面板
- `input` - 音频输入设置面板
- `playback` - 播放控制面板
- `text` - 文本设置面板
- `studio` - 工作室设置面板
- `system` - 系统设置面板

**快捷键支持:**
- `R` - 随机化设置
- `1-6` - 快速切换标签页

### 1.2 BottomBar 组件
- **文件**: `src/components/controls/BottomBar.tsx`
- **功能**: 底部控制栏

**核心功能:**
- 播放控制按钮
- 视觉模式切换
- 随机化按钮
- 全屏切换
- 展开/收起控制界面

## 2. 控制面板实现

### 2.1 视觉设置面板
- **文件**: `src/components/controls/panels/VisualSettingsPanel.tsx`
- **功能**: 视觉效果设置

**核心功能:**
- 视觉模式选择
- 颜色主题配置
- 灵敏度调整
- 质量设置
- AI 背景设置

### 2.2 音频设置面板
- **文件**: `src/components/controls/panels/AudioSettingsPanel.tsx`
- **功能**: 音频输入设置

**核心功能:**
- 音频设备选择
- 输入源切换
- 增益调整
- AI 设置

### 2.3 播放控制面板
- **文件**: `src/components/controls/panels/PlaybackPanel.tsx`
- **功能**: 播放控制

**核心功能:**
- 播放/暂停
- 上一首/下一首
- 播放列表管理
- 播放模式设置

### 2.4 文本设置面板
- **文件**: `src/components/controls/panels/CustomTextSettingsPanel.tsx`
- **功能**: 自定义文本设置

**核心功能:**
- 文本内容输入
- 文本样式配置
- 文本位置调整
- 文本动画设置

### 2.5 工作室设置面板
- **文件**: `src/components/controls/panels/StudioPanel.tsx`
- **功能**: 工作室功能设置

**核心功能:**
- 视频录制
- 录制设置
- 预览功能
- 导出选项

### 2.6 系统设置面板
- **文件**: `src/components/controls/panels/SystemSettingsPanel.tsx`
- **功能**: 系统配置

**核心功能:**
- 语言选择
- 主题切换
- 预设管理
- 系统信息

## 3. UI 覆盖层组件

### 3.1 歌曲信息覆盖层
- **文件**: `src/components/visualizers/ui/SongOverlay.tsx`
- **功能**: 显示当前歌曲信息

### 3.2 歌词覆盖层
- **文件**: `src/components/visualizers/ui/LyricsOverlay.tsx`
- **功能**: 显示歌词

### 3.3 自定义文本覆盖层
- **文件**: `src/components/visualizers/ui/CustomTextOverlay.tsx`
- **功能**: 显示自定义文本

### 3.4 帮助模态框
- **文件**: `src/components/visualizers/ui/HelpModal.tsx`
- **功能**: 显示帮助信息

### 3.5 欢迎屏幕
- **文件**: `src/components/visualizers/ui/WelcomeScreen.tsx`
- **功能**: 初始欢迎界面

### 3.6 引导覆盖层
- **文件**: `src/components/visualizers/ui/onboarding/OnboardingOverlay.tsx`
- **功能**: 首次使用引导

### 3.7 帧率计数器
- **文件**: `src/components/visualizers/ui/FPSCounter.tsx`
- **功能**: 显示帧率

## 4. 交互功能

### 4.1 手势支持
- **文件**: `src/hooks/useMobileGestures.ts`
- **功能**: 移动设备手势支持

**支持的手势:**
- 左右滑动 - 切换视觉模式
- 上下滑动 - 调节音频增益
- 长按 - 开关 AI 信息图层

### 4.2 空闲检测
- **文件**: `src/hooks/useIdleTimer.ts`
- **功能**: 检测用户空闲状态

**核心功能:**
- 自动隐藏 UI
- 响应式唤醒
- 可配置的空闲时间

### 4.3 版本检查
- **文件**: `src/hooks/useVersionCheck.ts`
- **功能**: 检查应用版本更新

**核心功能:**
- 定期检查版本
- 显示更新提示
- 引导用户刷新

### 4.4 视频录制
- **文件**: `src/hooks/useVideoRecorder.ts`
- **功能**: 视频录制功能

**核心功能:**
- 屏幕录制
- 录制控制
- 视频导出
- 录制设置

## 5. UI 组件库

### 5.1 控制组件

#### 5.1.1 滑块组件
- **文件**: `src/components/visualizers/ui/controls/Slider.tsx`
- **功能**: 滑动调节控件

#### 5.1.2 开关组件
- **文件**: `src/components/visualizers/ui/controls/SettingsToggle.tsx`
- **功能**: 设置开关

#### 5.1.3 分段控制
- **文件**: `src/components/visualizers/ui/controls/SegmentedControl.tsx`
- **功能**: 分段选择控件

#### 5.1.4 自定义选择器
- **文件**: `src/components/visualizers/ui/controls/CustomSelect.tsx`
- **功能**: 自定义选择控件

#### 5.1.5 工具提示
- **文件**: `src/components/visualizers/ui/controls/Tooltip.tsx`
- **功能**: 工具提示

### 5.2 布局组件

#### 5.2.1 Bento 卡片
- **文件**: `src/components/visualizers/ui/layout/BentoCard.tsx`
- **功能**: Bento 风格卡片

## 6. 响应式设计

### 6.1 布局策略
- 移动设备优化
- 桌面设备增强
- 自适应布局
- 响应式字体

### 6.2 触摸优化
- 触摸友好的控件尺寸
- 手势支持
- 触摸反馈
- 防误触设计
