<!-- openspec/02_audio_engine.md v2.3.5 -->
# 音频引擎规范

## 1. 核心音频 Hook

### 1.1 useAudio Hook
- **文件**: `src/hooks/audio/useAudio.ts`
- **版本**: v2.3.5
- **功能**: 提供音频处理和分析功能
**核心状态**
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
- `audioContext` - 音频上下文

**核心方法**:
- `toggleMicrophone` - 切换麦克风状态
- `onDeviceChange` - 设备变更处理
- `importFiles` - 导入音频文件
- `importFromUrl` - 从URL导入音频
- `importPlaylistFromUrl` - 从URL导入播放列表
- `togglePlayback` - 切换播放状态
- `seekFile` - 跳转播放位置
- `playNext` - 播放下一曲
- `playPrev` - 播放上一曲
- `playTrackByIndex` - 播放指定索引的歌曲
- `removeFromPlaylist` - 从播放列表中移除歌曲
- `clearPlaylist` - 清空播放列表
- `getAudioSlice` - 获取音频片段
- `setPlaybackMode` - 设置播放模式
- `handleSourceTypeChange` - 切换音频源类型

**音频设备管理**:
- 自动检测可用音频输入设备
- 支持设备切换
- 处理麦克风权限
**代码示例**:
```tsx
// useAudio.ts 核心结构
// File: src/hooks/audio/useAudio.ts | Version: v2.3.5
'use client';
import { useCallback, useState, useEffect } from 'react';
import { UseAudioProps, UseAudioReturn } from './types';
import { useMicrophoneManager } from './microphoneManager';
import { useFilePlayer } from './filePlayer';

export function useAudio({ settings, language, setCurrentSong, showToast }: UseAudioProps): UseAudioReturn {
  const [sourceType, setSourceType] = useState<'microphone' | 'file' | 'url'>('microphone');
  const [isPending, setIsPending] = useState(false);

  // 麦克风管理
  const {
    isListening,
    mediaStream,
    audioDevices,
    selectedDeviceId,
    toggleMicrophone,
    onDeviceChange,
    audioContext: micAudioContext,
    analyser: micAnalyser,
  } = useMicrophoneManager({ showToast });

  // 文件播放管理
  const {
    playlist,
    currentIndex,
    playbackMode,
    setPlaybackMode,
    isPlaying,
    duration,
    currentTime,
    analyser: fileAnalyser,
    analyserR: fileAnalyserR,
    audioContext: fileAudioContext,
    importFiles,
    importFromUrl,
    importPlaylistFromUrl,
    togglePlayback,
    seekFile,
    playNext,
    playPrev,
    playTrackByIndex,
    removeFromPlaylist,
    clearPlaylist,
    getAudioSlice,
  } = useFilePlayer({ setCurrentSong, showToast });

  // 选择当前的 analyser
  const analyser = sourceType === 'microphone' ? micAnalyser : fileAnalyser;
  const analyserR = sourceType === 'microphone' ? micAnalyser : fileAnalyserR;
  const audioContext = sourceType === 'microphone' ? micAudioContext : fileAudioContext;

  // 切换源类型时的处理
  const handleSourceTypeChange = useCallback((type: 'microphone' | 'file' | 'url') => {
    setSourceType(type);
  }, []);

  // 清理函数
  useEffect(() => {
    return () => {
      // 清理麦克风
      mediaStream?.getTracks().forEach(t => t.stop());
      
      // 清理音频上下文
      micAudioContext?.close();
      fileAudioContext?.close();
    };
  }, [mediaStream, micAudioContext, fileAudioContext]);

  return {
    sourceType,
    isListening,
    isPending,
    analyser,
    analyserR,
    mediaStream,
    audioDevices,
    selectedDeviceId,
    onDeviceChange,
    toggleMicrophone,
    playlist,
    currentIndex,
    playbackMode,
    setPlaybackMode,
    importFiles,
    importFromUrl,
    importPlaylistFromUrl,
    togglePlayback,
    seekFile,
    playNext,
    playPrev,
    playTrackByIndex,
    removeFromPlaylist,
    clearPlaylist,
    getAudioSlice,
    isPlaying,
    duration,
    currentTime,
    audioContext,
    handleSourceTypeChange,
  };
}
```

### 1.2 useAudioPulse Hook
- **文件**: `src/hooks/audio/useAudioPulse.ts`
- **版本**: v2.3.4
- **功能**: 提供音频脉冲和节拍检测功能
**核心功能**:
- 音频脉冲检测
- 节拍检测
- 音频能量分析
- 频率分析

## 2. 音频工具服务

### 2.1 audioUtils.ts
- **文件**: `src/services/audioUtils.ts`
- **版本**: v2.3.4
- **功能**: 提供音频处理工具函数
**核心功能**:
- 音频格式转换
- 音频分析工具
- 音频可视化数据处理
- 音频设备管理

### 2.2 麦克风管理
- **文件**: `src/hooks/audio/microphoneManager.ts`
- **版本**: v2.3.4
- **功能**: 管理麦克风设备和权限
**核心功能**:
- 麦克风设备检测
- 权限管理
- 设备切换
- 音频流处理

## 3. 音频响应式系统

### 3.1 音频分析系统
- **功能**: 实时分析音频数据
- **核心组件**:
  - `AnalyserNode` - 音频分析节点
  - `MediaStreamAudioSourceNode` - 媒体流音频源节点
  - `AudioContext` - 音频上下文

### 3.2 音频可视化数据
- **功能**: 生成用于可视化的数据
- **数据类型**:
  - 时域数据 (波形)
  - 频域数据 (频谱)
  - 能量数据 (音量)
  - 节拍数据 (节奏)

### 3.3 音频效果处理
- **功能**: 应用音频效果
- **支持的效果**:
  - 均衡器
  - 混响
  - 延迟
  - 压缩器

## 4. 错误处理与边界情况

### 4.1 音频设备错误
- **错误类型**:
  - 设备不可用
  - 权限被拒绝
  - 设备连接失败
- **处理策略**:
  - 友好的错误提示
  - 备用设备选择
  - 自动重试机制

### 4.2 音频文件错误
- **错误类型**:
  - 不支持的文件格式
  - 文件读取失败
  - 解码错误
- **处理策略**:
  - 文件类型验证
  - 错误提示
  - 跳过错误文件

### 4.3 网络音频错误
- **错误类型**:
  - 网络连接失败
  - 资源不可用
  - 超时
- **处理策略**:
  - 网络状态检查
  - 重试机制
  - 本地缓存

## 5. 性能优化

### 5.1 音频处理优化
- **策略**:
  - 使用 Web Workers 处理密集计算
  - 优化音频分析器参数
  - 减少不必要的音频处理

### 5.2 内存管理
- **策略**:
  - 及时释放音频资源
  - 避免内存泄漏
  - 优化音频缓冲区大小

### 5.3 响应速度优化
- **策略**:
  - 减少音频处理延迟
  - 优化设备切换速度
  - 预加载音频资源

## 6. 兼容性与跨平台

### 6.1 浏览器兼容性
- **支持的浏览器**:
  - Chrome (最新版本)
  - Firefox (最新版本)
  - Safari (最新版本)
  - Edge (最新版本)
- **兼容性处理**:
  - 特性检测
  - 降级方案
  -  polyfill

### 6.2 跨平台支持
- **支持的平台**:
  - 桌面端
  - 移动端
  - PWA
- **平台特定处理**:
  - 移动设备音频处理
  - PWA 音频限制
  - 平台特定 API 调用

## 7. 测试与验证

### 7.1 音频功能测试
- **测试类型**:
  - 单元测试
  - 集成测试
  - 端到端测试
- **测试工具**:
  - Jest
  - Playwright
  - 自定义音频测试工具

### 7.2 性能测试
- **测试指标**:
  - 音频处理延迟
  - CPU 使用率
  - 内存使用
  - 电池消耗

### 7.3 兼容性测试
- **测试场景**:
  - 不同浏览器
  - 不同设备
  - 不同网络条件

## 8. 未来发展

### 8.1 计划功能
- **音频增强**:
  - 高级音频效果
  - 音频合成
  - 语音识别
- **交互增强**:
  - 音频可视化自定义
  - 音频控制手势
  - 音频分享

### 8.2 技术改进
- **性能优化**:
  - 使用 WebAssembly 加速音频处理
  - 优化音频分析算法
  - 改进音频设备管理
- **架构改进**:
  - 模块化音频处理
  - 可扩展的音频效果系统
  - 更好的错误处理机制