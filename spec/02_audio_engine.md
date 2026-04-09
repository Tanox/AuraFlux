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
- `importFromUrl` - 从URL导入音频
- `importPlaylistFromUrl` - 从URL导入播放列表

**音频设备管理:**
- 自动枚举可用音频输入设备
- 支持设备切换
- 处理麦克风权限

**代码示例:**
```tsx
// useAudio.ts 核心结构
// File: src/hooks/useAudio.ts | Version: v2.0.6
import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { VisualizerSettings, AudioDevice, Track, PlaybackMode, SongInfo } from '../types';

interface UseAudioProps {
  settings: VisualizerSettings;
  language: string;
  setCurrentSong: (s: SongInfo | null) => void;
  t: any;
  showToast: (m: string, type?: any) => void;
}

export const useAudio = ({ settings, language, setCurrentSong, t, showToast }: UseAudioProps) => {
  const [sourceType, setSourceType] = useState<'microphone' | 'file' | 'url'>('microphone');
  const [isListening, setIsListening] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [analyserR, setAnalyserR] = useState<AnalyserNode | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [audioDevices, setAudioDevices] = useState<AudioDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playbackMode, setPlaybackMode] = useState<PlaybackMode>(PlaybackMode.SEQUENCE);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioNode | null>(null);

  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devices
          .filter(d => d.kind === 'audioinput')
          .map(d => ({ deviceId: d.deviceId, label: d.label || `Microphone ${d.deviceId.slice(0, 5)}` }));
        setAudioDevices(audioInputs);
      } catch (err: any) {
        console.warn('Error getting devices:', err?.message || err);
      }
    };
    getDevices();
  }, []);

  const toggleMicrophone = useCallback(async (deviceId: string) => {
    try {
      if (isListening) {
        mediaStream?.getTracks().forEach(t => t.stop());
        setIsListening(false);
        setMediaStream(null);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: deviceId ? { deviceId: { exact: deviceId } } : true
      });

      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const ctx = audioContextRef.current;
      const source = ctx.createMediaStreamSource(stream);
      const ana = ctx.createAnalyser();
      ana.fftSize = 2048;
      source.connect(ana);

      setAnalyser(ana);
      setMediaStream(stream);
      setIsListening(true);
      setSourceType('microphone');
      setSelectedDeviceId(deviceId);
    } catch (err: any) {
      console.warn('Microphone access skipped or denied:', err?.message || err);
      showToast('Microphone access denied. Running in silent mode.', 'error');
    }
  }, [isListening, mediaStream, showToast]);

  const importFiles = useCallback(async (files: FileList | File[]) => {
    const newTracks: Track[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).slice(2),
      file: file as File,
      title: (file as File).name.replace(/\.[^/.]+$/, ""),
      artist: 'Unknown Artist'
    }));
    setPlaylist(prev => [...prev, ...newTracks]);
    setSourceType('file');
    showToast(`Imported ${newTracks.length} tracks`);
  }, [showToast]);

  const togglePlayback = useCallback(() => setIsPlaying(prev => !prev), []);
  const seekFile = useCallback((t: number) => setCurrentTime(t), []);
  const playNext = useCallback(() => setCurrentIndex(prev => (prev + 1) % playlist.length), [playlist.length]);
  const playPrev = useCallback(() => setCurrentIndex(prev => (prev - 1 + playlist.length) % playlist.length), [playlist.length]);
  const playTrackByIndex = useCallback((i: number) => setCurrentIndex(i), []);
  const removeFromPlaylist = useCallback((i: number) => setPlaylist(prev => prev.filter((_, idx) => idx !== i)), []);
  const clearPlaylist = useCallback(() => setPlaylist([]), []);
  
  const getAudioSlice = useCallback(async (s?: number) => {
      // Mock implementation for now
      return null;
  }, []);

  return useMemo(() => ({
    sourceType, isListening, isPending,
    analyser, analyserR,
    mediaStream, audioDevices,
    selectedDeviceId, onDeviceChange: setSelectedDeviceId,
    toggleMicrophone,
    playlist, currentIndex, playbackMode,
    setPlaybackMode,
    importFiles,
    importFromUrl: async () => ({} as any),
    importPlaylistFromUrl: async () => [],
    togglePlayback, seekFile,
    playNext, playPrev,
    playTrackByIndex, removeFromPlaylist,
    clearPlaylist, getAudioSlice,
    isPlaying, duration, currentTime,
    audioContext: audioContextRef.current
  }), [sourceType, isListening, isPending, analyser, analyserR, mediaStream, audioDevices, selectedDeviceId, setSelectedDeviceId, toggleMicrophone, playlist, currentIndex, playbackMode, setPlaybackMode, importFiles, togglePlayback, seekFile, playNext, playPrev, playTrackByIndex, removeFromPlaylist, clearPlaylist, getAudioSlice, isPlaying, duration, currentTime]);
};
```

## 2. 音频工具服务

### 2.1 音频工具 (audioUtils.ts)
- **文件**: `src/services/audioUtils.ts`
- **版本**: v1.9.80
- **功能**: 提供音频处理工具函数

**主要功能:**
- 音频格式转换
- 频谱分析工具
- 音频数据处理
- 节拍检测

**核心方法:**
- `getAverage` - 计算音频数据平均值
- `getAudioSlice` - 提取音频切片
- `audioBufferToWav` - 将 AudioBuffer 转换为 WAV 格式

**代码示例:**
```tsx
// audioUtils.ts 核心结构
// File: src/services/audioUtils.ts | Version: v1.9.80

export const getAverage = (dataArray: Uint8Array, start?: number, end?: number): number => {
  const startIndex = start || 0;
  const endIndex = end || dataArray.length;
  let sum = 0;
  for (let i = startIndex; i < endIndex; i++) {
    sum += dataArray[i];
  }
  return sum / (endIndex - startIndex);
};

export const getAudioSlice = async (file: File, duration: number = 10): Promise<Blob | null> => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const offlineContext = new OfflineAudioContext(
      audioBuffer.numberOfChannels,
      audioContext.sampleRate * duration,
      audioContext.sampleRate
    );

    const source = offlineContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(offlineContext.destination);
    source.start(0);

    const renderedBuffer = await offlineContext.startRendering();
    
    // Convert AudioBuffer to WAV Blob
    const wavBlob = audioBufferToWav(renderedBuffer);
    return wavBlob;
  } catch (err) {
    console.warn('Failed to get audio slice:', err);
    return null;
  }
};

function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  
  let result: Float32Array;
  if (numChannels === 2) {
    const left = buffer.getChannelData(0);
    const right = buffer.getChannelData(1);
    result = new Float32Array(left.length * 2);
    for (let i = 0; i < left.length; i++) {
      result[i * 2] = left[i];
      result[i * 2 + 1] = right[i];
    }
  } else {
    result = buffer.getChannelData(0);
  }

  const dataLength = result.length * (bitDepth / 8);
  const bufferLength = 44 + dataLength;
  const arrayBuffer = new ArrayBuffer(bufferLength);
  const view = new DataView(arrayBuffer);

  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * (bitDepth / 8), true);
  view.setUint16(32, numChannels * (bitDepth / 8), true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataLength, true);

  const offset = 44;
  for (let i = 0; i < result.length; i++) {
    const s = Math.max(-1, Math.min(1, result[i]));
    view.setInt16(offset + i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }

  return new Blob([view], { type: 'audio/wav' });
}
```

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
