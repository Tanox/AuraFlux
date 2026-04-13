# UI 与交互系统规范

## 1. 控制界面系统

### 1.1 Controls 组件
- **文件**: `src/components/controls/Controls.tsx`
- **版本**: v2.2.15
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

**代码示例:**
```tsx
// Controls.tsx 核心结构
// File: src/components/controls/Controls.tsx | Version: v2.0.6
import React, { useState, useMemo } from 'react';
import { VisualizerMode, ColorTheme } from '@/types';

interface ControlsProps {
  mode: VisualizerMode;
  setMode: (mode: VisualizerMode) => void;
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
  sensitivity: number;
  setSensitivity: (value: number) => void;
  smoothing: number;
  setSmoothing: (value: number) => void;
  useGradient: boolean;
  setUseGradient: (value: boolean) => void;
  isListening: boolean;
  setIsListening: (value: boolean) => void;
  showLyrics: boolean;
  setShowLyrics: (value: boolean) => void;
  enableAnalysis: boolean;
  setEnableAnalysis: (value: boolean) => void;
  language: string;
  setLanguage: (value: string) => void;
  region: string;
  setRegion: (value: string) => void;
  isSimulating: boolean;
  setIsSimulating: (value: boolean) => void;
  isMobile: boolean;
  t: (key: string) => string;
  availableThemes: { value: ColorTheme; label: string }[];
  availableModes: { value: VisualizerMode; label: string }[];
  availableLanguages: { value: string; label: string }[];
  availableRegions: { value: string; label: string }[];
  performIdentification: (stream: MediaStream) => void;
  mediaStream: MediaStream | null;
  isIdentifying: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  mode, setMode, colorTheme, setColorTheme,
  sensitivity, setSensitivity, smoothing, setSmoothing,
  useGradient, setUseGradient, isListening, setIsListening,
  showLyrics, setShowLyrics, enableAnalysis, setEnableAnalysis,
  language, setLanguage, region, setRegion, isSimulating, setIsSimulating,
  isMobile, t, availableThemes, availableModes, availableLanguages, availableRegions,
  performIdentification, mediaStream, isIdentifying
}) => {
  const [activeTab, setActiveTab] = useState('visuals');

  const tabs = useMemo(() => [
    { id: 'visuals', label: t('controls.visuals') || 'Visuals' },
    { id: 'audio', label: t('controls.audio') || 'Audio' },
    { id: 'ai', label: t('controls.ai') || 'AI' },
    { id: 'settings', label: t('controls.settings') || 'Settings' },
  ], [t]);

  return (
    <div id="controls-container" className={`fixed top-4 right-4 z-50 ${isMobile ? 'w-3/4' : 'w-80'}`}>
      <div className="bg-black/70 backdrop-blur-lg border border-white/20 rounded-lg p-4">
        <div className="flex border-b border-white/20 mb-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`px-3 py-2 text-sm font-medium ${activeTab === tab.id ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="tab-content">
          {/* Visuals Tab */}
          {activeTab === 'visuals' && (
            <div className="space-y-4">
              {/* Visualizer Mode */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  {t('controls.visualizerMode') || 'Visualizer Mode'}
                </label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as VisualizerMode)}
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 text-sm"
                >
                  {availableModes.map(m => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Color Theme */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  {t('controls.colorTheme') || 'Color Theme'}
                </label>
                <select
                  value={colorTheme}
                  onChange={(e) => setColorTheme(e.target.value as ColorTheme)}
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 text-sm"
                >
                  {availableThemes.map(theme => (
                    <option key={theme.value} value={theme.value}>
                      {theme.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sensitivity */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="block text-sm font-medium text-gray-300">
                    {t('controls.sensitivity') || 'Sensitivity'}
                  </label>
                  <span className="text-xs text-gray-400">{sensitivity.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.1"
                  value={sensitivity}
                  onChange={(e) => setSensitivity(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Smoothing */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="block text-sm font-medium text-gray-300">
                    {t('controls.smoothing') || 'Smoothing'}
                  </label>
                  <span className="text-xs text-gray-400">{smoothing.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={smoothing}
                  onChange={(e) => setSmoothing(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Use Gradient */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="useGradient"
                  checked={useGradient}
                  onChange={(e) => setUseGradient(e.target.checked)}
                />
                <label htmlFor="useGradient" className="text-sm text-gray-300">
                  {t('controls.useGradient') || 'Use Gradient'}
                </label>
              </div>
            </div>
          )}

          {/* Audio Tab */}
          {activeTab === 'audio' && (
            <div className="space-y-4">
              {/* Listen Toggle */}
              <button
                className={`w-full py-2 rounded ${isListening ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-700 hover:bg-gray-600'} text-white font-medium`}
                onClick={() => setIsListening(!isListening)}
              >
                {isListening ? t('controls.stopListening') || 'Stop Listening' : t('controls.startListening') || 'Start Listening'}
              </button>

              {/* Simulate Audio */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isSimulating"
                  checked={isSimulating}
                  onChange={(e) => setIsSimulating(e.target.checked)}
                />
                <label htmlFor="isSimulating" className="text-sm text-gray-300">
                  {t('controls.simulateAudio') || 'Simulate Audio'}
                </label>
              </div>
            </div>
          )}

          {/* AI Tab */}
          {activeTab === 'ai' && (
            <div className="space-y-4">
              {/* Show Lyrics */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showLyrics"
                  checked={showLyrics}
                  onChange={(e) => setShowLyrics(e.target.checked)}
                />
                <label htmlFor="showLyrics" className="text-sm text-gray-300">
                  {t('controls.showLyrics') || 'Show Lyrics'}
                </label>
              </div>

              {/* Enable Analysis */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="enableAnalysis"
                  checked={enableAnalysis}
                  onChange={(e) => setEnableAnalysis(e.target.checked)}
                />
                <label htmlFor="enableAnalysis" className="text-sm text-gray-300">
                  {t('controls.enableAnalysis') || 'Enable Analysis'}
                </label>
              </div>

              {/* Identify Song */}
              <button
                className="w-full py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium"
                onClick={() => mediaStream && performIdentification(mediaStream)}
                disabled={!mediaStream || isIdentifying}
              >
                {isIdentifying ? t('controls.identifying') || 'Identifying...' : t('controls.identifySong') || 'Identify Song'}
              </button>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              {/* Language */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  {t('controls.language') || 'Language'}
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 text-sm"
                >
                  {availableLanguages.map(lang => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Region */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  {t('controls.region') || 'Region'}
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 text-sm"
                >
                  {availableRegions.map(reg => (
                    <option key={reg.value} value={reg.value}>
                      {reg.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Controls;
```

### 1.2 BottomBar 组件
- **文件**: `src/components/controls/BottomBar.tsx`
- **功能**: 底部控制栏

**核心功能:**
- 播放控制按钮
- 视觉模式切换
- 随机化按钮
- 全屏切换
- 展开/收起控制界面

**代码示例:**
```tsx
// BottomBar.tsx 核心结构
// File: src/components/controls/BottomBar.tsx | Version: v2.0.6
import React, { useState } from 'react';
import { Track, SongInfo } from '@/types';

interface BottomBarProps {
  isPlaying: boolean;
  setIsPlaying: (value: boolean) => void;
  volume: number;
  setVolume: (value: number) => void;
  tracks: Track[];
  currentTrack: Track | null;
  onTrackSelect: (track: Track) => void;
  onAddTrack: () => void;
  onRemoveTrack: (track: Track) => void;
  isRecording: boolean;
  setIsRecording: (value: boolean) => void;
  isMobile: boolean;
  t: (key: string) => string;
  currentSong: SongInfo | null;
  recordingTime: string;
}

const BottomBar: React.FC<BottomBarProps> = ({
  isPlaying, setIsPlaying, volume, setVolume,
  tracks, currentTrack, onTrackSelect, onAddTrack, onRemoveTrack,
  isRecording, setIsRecording, isMobile, t, currentSong, recordingTime
}) => {
  const [showPlaylist, setShowPlaylist] = useState(false);

  return (
    <div id="bottom-bar" className="fixed bottom-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-lg border-t border-white/20 p-4">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Song Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {currentSong ? (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center">
                <span className="text-white text-sm">{currentSong.title?.charAt(0) || '?'}</span>
              </div>
              <div className="min-w-0">
                <h4 className="text-white font-medium truncate">{currentSong.title || 'Unknown'}</h4>
                <p className="text-gray-400 text-xs truncate">{currentSong.artist || 'Unknown Artist'}</p>
              </div>
            </div>
          ) : (
            <div className="text-gray-400 text-sm">{t('bottomBar.noSongPlaying') || 'No song playing'}</div>
          )}
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-4 flex-1 justify-center">
          <button
            className="text-white hover:text-blue-400 transition-colors"
            onClick={() => setShowPlaylist(!showPlaylist)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
          <button
            className="text-white hover:text-blue-400 transition-colors"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isPlaying ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              )}
            </svg>
          </button>
          <button
            className={`text-white ${isRecording ? 'text-red-500' : 'text-white'} hover:text-blue-400 transition-colors`}
            onClick={() => setIsRecording(!isRecording)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 10a7 7 0 017 7m-7-4a1 1 0 112 0 1 1 0 01-2 0z" />
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-24"
          />
        </div>

        {/* Recording Time */}
        {isRecording && (
          <div className="text-white text-sm ml-4">
            {recordingTime}
          </div>
        )}
      </div>

      {/* Playlist */}
      {showPlaylist && (
        <div className="absolute bottom-full left-0 right-0 bg-black/90 border-t border-white/20 p-4 max-h-60 overflow-y-auto">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-white font-medium">{t('bottomBar.playlist') || 'Playlist'}</h3>
            <button
              className="text-blue-400 text-sm"
              onClick={onAddTrack}
            >
              {t('bottomBar.addTrack') || 'Add Track'}
            </button>
          </div>
          <div className="space-y-1">
            {tracks.length === 0 ? (
              <div className="text-gray-400 text-sm text-center py-4">
                {t('bottomBar.emptyPlaylist') || 'Empty playlist'}
              </div>
            ) : (
              tracks.map((track) => (
                <div
                  key={track.id}
                  className={`flex items-center justify-between p-2 rounded ${currentTrack?.id === track.id ? 'bg-blue-900/30' : 'hover:bg-gray-800/50'}`}
                  onClick={() => onTrackSelect(track)}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-white text-sm truncate">{track.name}</p>
                    <p className="text-gray-400 text-xs truncate">{track.url}</p>
                  </div>
                  <button
                    className="text-gray-400 hover:text-red-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveTrack(track);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BottomBar;
```

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
