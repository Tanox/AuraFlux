# Aura Flux - API 接口文档

## 1. 接口概述

本项目采用 **Serverless / Client-side Architecture**，主要依赖前端直接调用 Google Gemini API。本项目**不提供**传统的后端 RESTful API 服务。

本文档主要描述：
1.  **外部依赖接口**: Google Gemini API 的集成方式。
2.  **内部服务接口**: 前端服务层 (`src/services/aiService.ts`) 的方法定义，供 UI 组件调用。

## 2. 外部依赖接口 (Google Gemini API)

本项目使用 `@google/genai` SDK 与 Gemini 模型进行交互。

| 接口名称 | 模型版本 | 用途 |
| :--- | :--- | :--- |
| **Generate Content** | `gemini-3-flash-preview` | 文本生成、歌词获取、情感分析 |
| **Multimodal Input** | `gemini-3-flash-preview` | 音频片段识别、歌曲信息提取 |

### 2.1 鉴权方式
- **方式**: API Key
- **配置**: 环境变量 `NEXT_PUBLIC_GEMINI_API_KEY`

## 3. 内部服务接口 (AI Service)

以下方法定义在 `src/services/aiService.ts` 中，作为单例服务供应用调用。

### 3.1 识别歌曲 (identifySong)

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

### 3.2 获取歌词 (getLyrics)

根据歌曲信息获取歌词。

- **方法签名**:
  ```typescript
  async getLyrics(songTitle: string, artist: string): Promise<LyricsData>
  ```

- **参数说明**:
  | 参数名 | 类型 | 必填 | 说明 |
  | :--- | :--- | :--- | :--- |
  | `songTitle` | `string` | 是 | 歌曲标题 |
  | `artist` | `string` | 是 | 艺术家 |

- **返回格式 (LyricsData)**:
  ```typescript
  interface LyricsData {
    plainText: string;   // 纯文本歌词
    synced?: Array<{     // 同步歌词 (可选)
      time: number;      // 时间戳 (秒)
      text: string;      // 歌词文本
    }>;
  }
  ```

### 3.3 分析情感 (analyzeMood)

分析歌词或音频特征，返回情感描述及视觉建议。

- **方法签名**:
  ```typescript
  async analyzeMood(lyrics: string): Promise<MoodAnalysis>
  ```

- **返回格式 (MoodAnalysis)**:
  ```typescript
  interface MoodAnalysis {
    mood: string;        // 情感关键词 (e.g., "Energetic", "Melancholic")
    colorPalette: string[]; // 推荐色板 (Hex 代码数组)
    energyLevel: number; // 能量等级 (0-10)
    suggestedMode: string; // 推荐的视觉模式 ID
  }
  ```

## 4. 调用示例

```typescript
import { aiService } from '@/services/aiService';

// 示例：识别歌曲并获取分析结果
async function handleIdentify(audioBlob: Blob) {
  try {
    // 1. 识别歌曲
    const songInfo = await aiService.identifySong(audioBlob);
    console.log('Identified:', songInfo);

    // 2. 获取歌词
    const lyrics = await aiService.getLyrics(songInfo.title, songInfo.artist);
    
    // 3. 分析情感
    const mood = await aiService.analyzeMood(lyrics.plainText);
    
    // 4. 应用视觉参数
    applyVisualSettings(mood.suggestedMode, mood.colorPalette);
    
  } catch (error) {
    console.error('AI Service Error:', error);
  }
}
```
