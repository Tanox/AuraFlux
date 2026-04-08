# 音频引擎规范

## 1. 核心音频 Hook

### 1.1 useAudio Hook
- **文件**: `src/hooks/useAudio.ts`
- **版本**: v2.0.6
- **功能**: 提供音频处理和分析功能

**核心状态:**
- `sourceType` - 音频源类型 (`'microphone' | 'file' | 'url'`)
- `isListening` - 麦克风监听状态
- `isPending` - 处理中状态
- `analyser` - 左声道分析器
- `analyserR` - 右声道分析器
- `mediaStream` - 媒体流
- `audioDevices` - 可用音频设备列表
- `selectedDeviceId` - 当前选择的设备 ID
- `playlist` - 播放列表
- `currentIndex` - 当前播放索引
- `playbackMode` - 播放模式
- `isPlaying` - 播放状态
- `duration` - 音频时长
- `currentTime` - 当前播放时间

**核心方法:**
- `toggleMicrophone` - 切换麦克风状态
- `importFiles` - 导入音频文件
- `togglePlayback` - 切换播放状态
- `seekFile` - 跳转播放位置
- `playNext` - 播放下一首
- `playPrev` - 播放上一首
- `playTrackByIndex` - 播放指定索引的歌曲
- `removeFromPlaylist` - 从播放列表移除歌曲
- `clearPlaylist` - 清空播放列表
- `getAudioSlice` - 获取音频片段

**音频设备管理:**
- 自动枚举可用音频输入设备
- 支持设备切换
- 处理麦克风权限

## 2. 音频工具服务

### 2.1 音频工具 (audioUtils.ts)
- **文件**: `src/services/audioUtils.ts`
- **功能**: 提供音频处理工具函数

**主要功能:**
- 音频格式转换
- 频谱分析工具
- 音频数据处理
- 节拍检测

## 3. 音频响应式系统

### 3.1 useAudioReactive Hook
- **文件**: `src/hooks/useAudioReactive.ts`
- **功能**: 将音频数据转换为视觉响应

**核心功能:**
- 处理音频频谱数据
- 生成视觉响应值
- 支持不同频率范围的分析
- 提供平滑过渡效果

### 3.2 useAudioPulse Hook
- **文件**: `src/hooks/useAudioPulse.ts`
- **功能**: 检测音频脉冲和节拍

**核心功能:**
- 分析音频能量变化
- 检测节拍和脉冲
- 生成脉冲触发事件
