# Aura Flux - API 接口文档

## 1. 接口概述

本项目采用 **Serverless / Client-side Architecture**，主要依赖前端直接调用 Google Gemini API。本项目**不提供**传统的后端 RESTful API 服务。

本文档主要描述：
1.  **外部依赖接口**: Google Gemini API 的集成方式。
2.  **内部服务接口**: 前端服务层的方法定义，供 UI 组件调用。

## 2. 外部依赖接口 (Google Gemini API)

本项目使用 `@google/genai` SDK 与 Gemini 模型进行交互。

| 接口名称 | 模型版本 | 用途 |
| :--- | :--- | :--- |
| **Generate Content** | `gemini-3-flash-preview` | 文本生成、歌词获取、情感分析 |
| **Multimodal Input** | `gemini-3-flash-preview` | 音频片段识别、歌曲信息提取 |
| **Image Generation** | `gemini-2.5-flash-image` | 生成艺术背景图像 |

### 2.1 鉴权方式
- **方式**: API Key
- **配置**: 环境变量 `NEXT_PUBLIC_GEMINI_API_KEY`

## 3. 内部服务接口

### 3.1 AI 服务接口 (aiService.ts)

以下方法定义在 `src/services/aiService.ts` 中，作为单例服务供应用调用。

#### 3.1.1 检查 AI 服务可用性 (isAiServiceAvailable)

检查 AI 服务是否可用。

- **方法签名**:
  ```typescript
  isAiServiceAvailable(): boolean
  ```

- **返回值**: `boolean` - AI 服务是否可用

#### 3.1.2 检查 AI 服务可用性 (checkAiServiceAvailability)

检查 AI 服务可用性并处理错误。

- **方法签名**:
  ```typescript
  checkAiServiceAvailability(): { available: boolean; error?: string }
  ```

- **返回值**:
  ```typescript
  {
    available: boolean; // AI 服务是否可用
    error?: string;     // 错误信息（如果不可用）
  }
  ```

#### 3.1.3 获取 AI 服务实例 (getAiService)

获取 AI 服务实例。

- **方法签名**:
  ```typescript
  getAiService(): GenerativeModel
  ```

- **返回值**: `GenerativeModel` - Google Gemini 生成模型实例

#### 3.1.4 从音频生成视觉配置 (generateVisualConfigFromAudio)

从音频生成视觉配置。

- **方法签名**:
  ```typescript
  async generateVisualConfigFromAudio(audioBlob: Blob): Promise<VisualConfig>
  ```

- **参数说明**:
  | 参数名 | 类型 | 必填 | 说明 |
  | :--- | :--- | :--- | :--- |
  | `audioBlob` | `Blob` | 是 | 音频片段 |

- **返回格式 (VisualConfig)**:
  ```typescript
  interface VisualConfig {
    mode: string;        // 推荐的视觉模式
    colorPalette: string[]; // 推荐的颜色 palette
    sensitivity: number; // 推荐的灵敏度设置
    speed: number;       // 推荐的速度设置
  }
  ```

#### 3.1.5 生成艺术背景 (generateArtisticBackground)

生成艺术背景。

- **方法签名**:
  ```typescript
  async generateArtisticBackground(prompt: string): Promise<string>
  ```

- **参数说明**:
  | 参数名 | 类型 | 必填 | 说明 |
  | :--- | :--- | :--- | :--- |
  | `prompt` | `string` | 是 | 生成背景的提示词 |

- **返回值**: `string` - 生成的背景图像 URL

#### 3.1.6 识别歌曲 (identifySong)

上传音频片段，识别歌曲信息。

- **方法签名**:
  ```typescript
  async identifySong(audioBlob: Blob): Promise<SongInfo>
  ```

- **参数说明**:
  | 参数名 | 类型 | 必填 | 说明 |
  | :--- | :--- | :--- | :--- |
  | `audioBlob` | `Blob` | 是 | 录制的音频片段 (建议 5-10秒, WebM/WAV 格式) |

- **返回格式 (SongInfo)**:
  ```typescript
  interface SongInfo {
    title: string;       // 歌曲标题
    artist: string;      // 艺术家
    album?: string;      // 专辑名称 (可选)
    artwork?: string;    // 封面图 URL (可选)
    lyrics?: string;     // 歌词内容 (可选)
  }
  ```

- **错误码**:
  - `AUDIO_PROCESS_ERROR`: 音频处理失败 (FileReader 错误)。
  - `API_ERROR`: Gemini API 调用失败。
  - `NO_MATCH`: 未找到匹配歌曲。

### 3.2 音频工具接口 (audioUtils.ts)

以下方法定义在 `src/services/audioUtils.ts` 中，提供音频处理工具函数。

#### 3.2.1 解码音频数据 (decodeAudioData)

解码音频数据。

- **方法签名**:
  ```typescript
  decodeAudioData(audioContext: AudioContext, arrayBuffer: ArrayBuffer): Promise<AudioBuffer>
  ```

- **参数说明**:
  | 参数名 | 类型 | 必填 | 说明 |
  | :--- | :--- | :--- | :--- |
  | `audioContext` | `AudioContext` | 是 | 音频上下文 |
  | `arrayBuffer` | `ArrayBuffer` | 是 | 音频数据缓冲区 |

- **返回值**: `Promise<AudioBuffer>` - 解码后的音频缓冲区

#### 3.2.2 提取音频特征 (extractAudioFeatures)

提取音频特征。

- **方法签名**:
  ```typescript
  extractAudioFeatures(audioBuffer: AudioBuffer): AudioFeatures
  ```

- **参数说明**:
  | 参数名 | 类型 | 必填 | 说明 |
  | :--- | :--- | :--- | :--- |
  | `audioBuffer` | `AudioBuffer` | 是 | 音频缓冲区 |

- **返回格式 (AudioFeatures)**:
  ```typescript
  interface AudioFeatures {
    duration: number;     // 音频时长（秒）
    sampleRate: number;   // 采样率
    channels: number;     // 声道数
    energy: number;       // 能量值
    spectralCentroid: number; // 频谱中心
  }
  ```

### 3.3 视觉服务接口 (visualService.ts)

以下方法定义在 `src/services/visualService.ts` 中，提供视觉渲染相关功能。

#### 3.3.1 获取视觉模式列表 (getVisualModes)

获取可用的视觉模式列表。

- **方法签名**:
  ```typescript
  getVisualModes(): VisualMode[]
  ```

- **返回格式 (VisualMode)**:
  ```typescript
  interface VisualMode {
    id: string;          // 模式 ID
    name: string;        // 模式名称
    description: string; // 模式描述
    type: '2d' | '3d';   // 模式类型
  }
  ```

#### 3.3.2 生成颜色 palette (generateColorPalette)

生成颜色 palette。

- **方法签名**:
  ```typescript
  generateColorPalette(mood: string): string[]
  ```

- **参数说明**:
  | 参数名 | 类型 | 必填 | 说明 |
  | :--- | :--- | :--- | :--- |
  | `mood` | `string` | 是 | 情感关键词 |

- **返回值**: `string[]` - 颜色 palette（Hex 代码数组）

## 4. 状态管理接口

### 4.1 UI 状态接口 (useUI)

- **文件**: `src/context/AppContext.tsx`
- **功能**: 管理 UI 相关状态

**返回值**:
```typescript
interface UIContextType {
  language: Language; setLanguage: React.Dispatch<React.SetStateAction<Language>>;
  region: Region; setRegion: React.Dispatch<React.SetStateAction<Region>>;
  hasStarted: boolean; setHasStarted: React.Dispatch<React.SetStateAction<boolean>>;
  resetSettings: () => void;
  manageWakeLock: (enabled: boolean) => Promise<void>;
  toggleFullscreen: () => void; t: TranslationSchema;
  showToast: (message: string, type?: 'success' | 'info' | 'error', duration?: number, position?: 'top' | 'bottom') => void;
  showHelpModal: boolean;
  setShowHelpModal: React.Dispatch<React.SetStateAction<boolean>>;
  helpModalInitialTab: HelpTab;
  setHelpModalInitialTab: React.Dispatch<React.SetStateAction<HelpTab>>;
  isDragging: boolean;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
}
```

### 4.2 视觉状态接口 (useVisuals)

- **文件**: `src/context/AppContext.tsx`
- **功能**: 管理视觉相关状态

**返回值**:
```typescript
interface VisualsContextType {
  mode: VisualizerMode; setMode: React.Dispatch<React.SetStateAction<VisualizerMode>>;
  colorTheme: string[]; setColorTheme: React.Dispatch<React.SetStateAction<string[]>>;
  settings: VisualizerSettings; setSettings: React.Dispatch<React.SetStateAction<VisualizerSettings>>;
  activePreset: string; setActivePreset: React.Dispatch<React.SetStateAction<string>>;
  isThreeMode: boolean;
  randomizeSettings: () => void; resetVisualSettings: () => void;
  resetTextSettings: () => void; resetAudioSettings: () => void;
  applyPreset: (preset: SmartPreset) => void;
}
```

### 4.3 音频状态接口 (useAudioContext)

- **文件**: `src/context/AppContext.tsx`
- **功能**: 管理音频相关状态

**返回值**:
```typescript
interface AudioContextType {
  sourceType: AudioSourceType; isListening: boolean; isPending: boolean;
  analyser: AnalyserNode | null; analyserR: AnalyserNode | null;
  mediaStream: MediaStream | null; audioDevices: AudioDevice[];
  selectedDeviceId: string; onDeviceChange: (id: string) => void;
  toggleMicrophone: (id: string) => void;
  currentSong: SongInfo | null; setCurrentSong: (s: SongInfo | null) => void;
  playlist: Track[]; currentIndex: number; playbackMode: PlaybackMode;
  setPlaybackMode: (m: PlaybackMode) => void;
  importFiles: (files: FileList | File[]) => Promise<any>;
  importFromUrl: (url: string) => Promise<Track>;
  importPlaylistFromUrl: (url: string) => Promise<Track[]>;
  togglePlayback: () => void; seekFile: (t: number) => void;
  playNext: () => void; playPrev: () => void;
  playTrackByIndex: (i: number) => void; removeFromPlaylist: (i: number) => void;
  clearPlaylist: () => void; getAudioSlice: (s?: number) => Promise<Blob | null>;
  isPlaying: boolean; duration: number; currentTime: number;
  fileStatus?: 'ready' | 'loading' | 'none';
  fileName?: string;
  audioContext: AudioContext | null;
}
```

### 4.4 AI 状态接口 (useAI)

- **文件**: `src/context/AppContext.tsx`
- **功能**: 管理 AI 相关状态

**返回值**:
```typescript
interface AIContextType {
  lyricsStyle: LyricsStyle; showLyrics: boolean; setShowLyrics: (b: boolean | ((prev: boolean) => boolean)) => void;
  enableAnalysis: boolean; setEnableAnalysis: (b: boolean) => void;
  isIdentifying: boolean;
  performIdentification: (s: MediaStream) => Promise<void>;
  resetAiSettings: () => void; 
}
```

## 5. 调用示例

### 5.1 AI 服务调用示例

```typescript
import { aiService } from '@/services/aiService';

// 示例：识别歌曲并获取分析结果
async function handleIdentify(audioBlob: Blob) {
  try {
    // 1. 检查 AI 服务可用性
    if (!aiService.isAiServiceAvailable()) {
      throw new Error('AI service is not available');
    }

    // 2. 识别歌曲
    const songInfo = await aiService.identifySong(audioBlob);
    console.log('Identified:', songInfo);

    // 3. 生成艺术背景
    const background = await aiService.generateArtisticBackground(
      `Create a beautiful abstract background that matches the mood of the song "${songInfo.title}" by ${songInfo.artist}`
    );
    
    // 4. 从音频生成视觉配置
    const visualConfig = await aiService.generateVisualConfigFromAudio(audioBlob);
    
    // 5. 应用视觉设置
    applyVisualSettings(visualConfig);
    
  } catch (error) {
    console.error('AI Service Error:', error);
  }
} 
```

### 5.2 音频服务调用示例

```typescript
import { decodeAudioData, extractAudioFeatures } from '@/services/audioUtils';

// 示例：处理音频文件
async function processAudioFile(file: File) {
  try {
    // 1. 创建音频上下文
    const audioContext = new AudioContext();
    
    // 2. 读取文件
    const arrayBuffer = await file.arrayBuffer();
    
    // 3. 解码音频数据
    const audioBuffer = await decodeAudioData(audioContext, arrayBuffer);
    
    // 4. 提取音频特征
    const features = extractAudioFeatures(audioBuffer);
    console.log('Audio features:', features);
    
    return features;
  } catch (error) {
    console.error('Audio processing error:', error);
    throw error;
  }
}
```

### 5.3 状态管理使用示例

```typescript
import { useUI, useVisuals, useAudioContext, useAI } from '@/context/AppContext';

function ControlsPanel() {
  // 使用 UI 状态
  const ui = useUI();
  const { isDragging, setIsDragging, showToast, toggleFullscreen } = ui;
  
  // 使用视觉状态
  const visuals = useVisuals();
  const { mode, setMode, colorTheme, setColorTheme, settings, setSettings, isThreeMode } = visuals;
  
  // 使用音频状态
  const audio = useAudioContext();
  const { sourceType, isListening, currentSong, playlist, togglePlayback, playNext, playPrev } = audio;
  
  // 使用 AI 状态
  const ai = useAI();
  const { showLyrics, setShowLyrics, isIdentifying, performIdentification } = ai;
  
  return (
    <div className="controls-panel">
      {/* 控制界面代码 */}
    </div>
  );
}
```
