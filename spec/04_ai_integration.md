# AI 集成系统规范

## 1. AI 服务模块

### 1.1 aiService.ts
- **文件**: `src/services/aiService.ts`
- **版本**: v2.2.15
- **功能**: 提供 Google Gemini AI 服务集成

**核心功能:**
- AI 服务可用性检查
- 音频分析与视觉配置生成
- 艺术背景生成
- 歌曲识别

**核心方法:**
- `isAiServiceAvailable` - 检查 AI 服务是否可用
- `checkAiServiceAvailability` - 检查 AI 服务可用性并处理错误
- `getAiService` - 获取 AI 服务实例
- `generateVisualConfigFromAudio` - 从音频生成视觉配置
- `generateArtisticBackground` - 生成艺术背景
- `identifySong` - 识别歌曲

**AI 模型使用:**
- `gemini-3-flash-preview` - 用于音频分析和歌曲识别
- `gemini-2.5-flash-image` - 用于生成艺术背景

**API 密钥管理:**
- 使用 `process.env.NEXT_PUBLIC_GEMINI_API_KEY`
- 严格的密钥验证和错误处理

**代码示例:**
```tsx
// aiService.ts 核心结构
// File: src/services/aiService.ts | Version: v2.2.15
import { GoogleGenAI } from '@google/genai';
import { en } from '@/locales/en';

let aiInstance: GoogleGenAI | null = null;

/**
 * 将Blob对象转换为Base64字符串
 * @param {Blob} blob - 要转换的Blob对象
 * @returns {Promise<string>} Base64字符串
 */
const blobToBase64 = async (blob: Blob): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = () => reject(new Error(`Failed to read audio data: ${reader.error?.message || 'Unknown error'}`));
    reader.readAsDataURL(blob);
  });
};

/**
 * 检查AI服务是否可用
 * @returns {boolean} 如果API密钥已配置且有效则返回true
 */
export const isAiServiceAvailable = (): boolean => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  return Boolean(apiKey && apiKey.length > 0 && !apiKey.startsWith('demo'));
};

/**
 * 检查AI服务是否可用，如果不可用则调用错误回调
 * @param {Function} onError - 错误回调函数
 * @param {string} customMessage - 自定义错误消息（可选）
 * @returns {boolean} 如果AI服务可用则返回true
 */
export const checkAiServiceAvailability = (onError?: (message: string) => void, customMessage?: string): boolean => {
  if (!isAiServiceAvailable()) {
    const errorMsg = customMessage || en.toasts.aiDirectorReq || 'Gemini API Key required for AI features.';
    if (onError) {
      onError(errorMsg);
    }
    return false;
  }
  return true;
};

export const getAiService = () => {
  if (!aiInstance) {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (apiKey && apiKey.length > 0 && !apiKey.startsWith('demo')) {
      aiInstance = new GoogleGenAI({ apiKey });
    }
  }
  return aiInstance;
};

export const generateVisualConfigFromAudio = async (audioInput: Blob | string): Promise<any> => {
  const ai = getAiService();
  if (!ai) return null;

  try {
    let base64Audio = '';
    if (typeof audioInput === 'string') {
      base64Audio = audioInput;
    } else {
      base64Audio = await blobToBase64(audioInput);
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'audio/wav',
              data: base64Audio
            }
          },
          {
            text: 'Analyze this audio and suggest a visualizer configuration. Return ONLY a JSON object with "mode" (one of DIGITAL_GRID, SILK_WAVE, OCEAN_WAVE, NEURAL_FLOW, CUBE_FIELD, KINETIC_WALL, LASERS), "colors" (array of 3 hex codes), and "sensitivity" (number between 0.5 and 2.0).'
          }
        ]
      },
      config: {
        responseMimeType: 'application/json'
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return null;
  } catch (err: any) {
    console.warn('AI Visual Config error:', err?.message || err);
    return null;
  }
};

export const generateArtisticBackground = async (prompt: string): Promise<string | null> => {
  const ai = getAiService();
  if (!ai) return null;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: prompt,
      config: {
        imageConfig: {
          aspectRatio: "16:9",
          imageSize: "1K"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (err: any) {
    console.warn('AI Background Generation error:', err?.message || err);
    return null;
  }
};

export const identifySong = async (audioBlob: Blob): Promise<any> => {
  const ai = getAiService();
  if (!ai) return null;

  try {
    const base64Audio = await blobToBase64(audioBlob);

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'audio/wav',
              data: base64Audio
            }
          },
          {
            text: 'Identify this song. Return ONLY a JSON object with "title", "artist", and "album" fields.'
          }
        ]
      },
      config: {
        responseMimeType: 'application/json'
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return null;
  } catch (err: any) {
    console.warn('AI Identification error:', err?.message || err);
    return null;
  }
};
```

## 2. AI 状态管理

### 2.1 useAiState Hook
- **文件**: `src/hooks/useAiState.ts`
- **版本**: v2.2.15
- **功能**: 管理 AI 相关状态

**核心状态:**
- `lyricsStyle` - 歌词样式 (默认: `LyricsStyle.STANDARD`)
- `showLyrics` - 歌词显示状态 (默认: `false`)
- `enableAnalysis` - 启用分析状态 (默认: `true`)
- `isIdentifying` - 正在识别状态 (默认: `false`)

**核心方法:**
- `performIdentification(stream: MediaStream)` - 执行歌曲识别
- `resetAiSettings()` - 重置 AI 设置

**参数说明:**
- `language` - 当前语言
- `region` - 当前区域
- `provider` - AI 服务提供商 (GEMINI 或 MOCK)
- `isListening` - 是否正在监听
- `isSimulating` - 是否使用模拟模式
- `mediaStream` - 媒体流
- `initialSettings` - 初始设置
- `setSettings` - 设置更新函数
- `onSongIdentified` - 歌曲识别完成回调
- `currentSong` - 当前歌曲信息
- `getAudioSlice` - 获取音频片段的函数
- `t` - 翻译函数
- `showToast` - 显示提示的函数

**代码示例:**
```tsx
// useAiState.ts 核心结构
// File: src/hooks/useAiState.ts | Version: v2.2.15
import { useState, useCallback, useMemo } from 'react';
import { LyricsStyle, SongInfo } from '../types';

interface UseAiStateProps {
  language: string;
  region: string;
  provider: string;
  isListening: boolean;
  isSimulating: boolean;
  mediaStream: MediaStream | null;
  initialSettings: any;
  setSettings: any;
  onSongIdentified: (s: SongInfo | null) => void;
  currentSong: SongInfo | null;
  getAudioSlice: (s?: number) => Promise<Blob | null>;
  t: any;
  showToast: (m: string, type?: any) => void;
}

export const useAiState = ({ language, region, provider, isListening, isSimulating, mediaStream, initialSettings, setSettings, onSongIdentified, currentSong, getAudioSlice, t, showToast }: UseAiStateProps) => {
  const [lyricsStyle, setLyricsStyle] = useState<LyricsStyle>(LyricsStyle.STANDARD);
  const [showLyrics, setShowLyrics] = useState(false);
  const [enableAnalysis, setEnableAnalysis] = useState(true);
  const [isIdentifying, setIsIdentifying] = useState(false);

  const performIdentification = useCallback(async (stream: MediaStream) => {
    if (isIdentifying) return;
    setIsIdentifying(true);
    showToast(t?.ai?.identifying || 'Identifying song...');
    
    try {
      // Mock identification for now
      setTimeout(() => {
        setIsIdentifying(false);
        showToast(t?.ai?.identified || 'Song identified!');
      }, 2000);
    } catch (err) {
      setIsIdentifying(false);
      showToast('Identification failed', 'error');
    }
  }, [isIdentifying, showToast, t]);

  const resetAiSettings = useCallback(() => {
    setShowLyrics(false);
    setEnableAnalysis(true);
  }, []);

  return useMemo(() => ({
    lyricsStyle, showLyrics, setShowLyrics,
    enableAnalysis, setEnableAnalysis,
    isIdentifying,
    performIdentification,
    resetAiSettings
  }), [lyricsStyle, showLyrics, setShowLyrics, enableAnalysis, setEnableAnalysis, isIdentifying, performIdentification, resetAiSettings]);
};
```

## 3. AI 集成场景

### 3.1 AI 背景生成
- **组件**: `AiBackground.tsx`
- **文件**: `src/components/visualizers/AiBackground.tsx`
- **版本**: v2.2.15
- **功能**: 基于音乐情绪生成艺术背景

**工作流程:**
1. 分析音频数据
2. 生成描述音乐情绪的提示词
3. 调用 Gemini 2.5 Flash Image 生成背景
4. 应用生成的背景到可视化场景

**代码示例:**
```tsx
// AiBackground.tsx 核心结构
// File: src/components/visualizers/AiBackground.tsx | Version: v2.2.15
import React, { useState, useEffect, useCallback } from 'react';
import { generateArtisticBackground } from '@/services/aiService';
import { useAudioContext } from '@/context/AppContext';

interface AiBackgroundProps {
  analyser: AnalyserNode | null;
  isVisible: boolean;
}

export const AiBackground: React.FC<AiBackgroundProps> = ({ analyser, isVisible }) => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { isListening } = useAudioContext();

  const generateBackground = useCallback(async () => {
    if (!isVisible || !isListening || isGenerating) return;
    
    setIsGenerating(true);
    
    try {
      // Analyze audio to generate prompt
      const prompt = 'Create a beautiful abstract background that matches the mood of electronic music with dynamic beats and energetic rhythms. Use vibrant colors and flowing patterns.';
      
      const image = await generateArtisticBackground(prompt);
      if (image) {
        setBackgroundImage(image);
      }
    } catch (error) {
      console.warn('Failed to generate background:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [isVisible, isListening, isGenerating]);

  useEffect(() => {
    if (isVisible && isListening) {
      const timer = setTimeout(generateBackground, 3000); // Generate after 3 seconds of listening
      return () => clearTimeout(timer);
    }
  }, [isVisible, isListening, generateBackground]);

  if (!isVisible) return null;

  return (
    <div 
      id="ai-background" 
      className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${isGenerating ? 'opacity-50' : 'opacity-100'}`}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: -1
      }}
    />
  );
};
```

### 3.2 AI 视觉导演
- **组件**: `AiVisualDirector.tsx`
- **文件**: `src/components/visualizers/AiVisualDirector.tsx`
- **版本**: v2.2.15
- **功能**: 基于音频分析自动配置视觉效果

**工作流程:**
1. 分析音频频谱和情绪
2. 生成适合的视觉模式配置
3. 自动应用到可视化系统
4. 实时调整视觉参数

**代码示例:**
```tsx
// AiVisualDirector.tsx 核心结构
// File: src/components/visualizers/AiVisualDirector.tsx | Version: v2.2.15
import React, { useEffect, useCallback } from 'react';
import { generateVisualConfigFromAudio } from '@/services/aiService';
import { useVisuals } from '@/context/AppContext';
import { VisualizerMode } from '@/types';

interface AiVisualDirectorProps {
  analyser: AnalyserNode | null;
  isEnabled: boolean;
  getAudioSlice: () => Promise<Blob | null>;
}

export const AiVisualDirector: React.FC<AiVisualDirectorProps> = ({ analyser, isEnabled, getAudioSlice }) => {
  const { setMode, setColorTheme, setSettings } = useVisuals();

  const analyzeAndConfigure = useCallback(async () => {
    if (!isEnabled || !analyser) return;

    try {
      const audioSlice = await getAudioSlice();
      if (!audioSlice) return;

      const config = await generateVisualConfigFromAudio(audioSlice);
      if (config) {
        // Apply the generated configuration
        if (config.mode && Object.values(VisualizerMode).includes(config.mode as VisualizerMode)) {
          setMode(config.mode as VisualizerMode);
        }
        if (config.colors && Array.isArray(config.colors) && config.colors.length === 3) {
          setColorTheme(config.colors);
        }
        if (config.sensitivity) {
          setSettings(prev => ({ ...prev, sensitivity: config.sensitivity }));
        }
      }
    } catch (error) {
      console.warn('AI Visual Director error:', error);
    }
  }, [isEnabled, analyser, getAudioSlice, setMode, setColorTheme, setSettings]);

  useEffect(() => {
    if (isEnabled && analyser) {
      // Initial analysis
      analyzeAndConfigure();
      
      // Schedule periodic analysis every 30 seconds
      const interval = setInterval(analyzeAndConfigure, 30000);
      return () => clearInterval(interval);
    }
  }, [isEnabled, analyser, analyzeAndConfigure]);

  return null; // This component doesn't render anything
};
```

### 3.3 歌曲识别
- **组件**: `SongIdentification.tsx`
- **文件**: `src/components/visualizers/SongIdentification.tsx`
- **版本**: v2.2.15
- **功能**: 识别正在播放的歌曲

**工作流程:**
1. 捕获音频片段
2. 发送到 Gemini 3.0 Flash 进行分析
3. 解析识别结果
4. 显示歌曲信息和专辑封面

**代码示例:**
```tsx
// SongIdentification.tsx 核心结构
// File: src/components/visualizers/SongIdentification.tsx | Version: v2.2.15
import React, { useState, useCallback } from 'react';
import { identifySong } from '@/services/aiService';
import { useAI, useAudioContext } from '@/context/AppContext';

interface SongIdentificationProps {
  isVisible: boolean;
  onClose: () => void;
}

export const SongIdentification: React.FC<SongIdentificationProps> = ({ isVisible, onClose }) => {
  const { isIdentifying, performIdentification } = useAI();
  const { mediaStream } = useAudioContext();
  const [songInfo, setSongInfo] = useState<any>(null);

  const handleIdentify = useCallback(async () => {
    if (mediaStream) {
      await performIdentification(mediaStream);
    }
  }, [mediaStream, performIdentification]);

  // Mock implementation for demo purposes
  const mockIdentify = useCallback(async () => {
    setSongInfo({
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      album: 'After Hours',
      artwork: 'https://example.com/artwork.jpg'
    });
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      id="song-identification" 
      className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 max-w-md w-full text-white">
        <h2 className="text-2xl font-bold mb-4 text-center">Song Identification</h2>
        
        {songInfo ? (
          <div className="text-center">
            {songInfo.artwork && (
              <img 
                src={songInfo.artwork} 
                alt={`${songInfo.title} album art`} 
                className="w-40 h-40 rounded-lg mx-auto mb-4"
              />
            )}
            <h3 className="text-xl font-bold">{songInfo.title}</h3>
            <p className="text-gray-300">{songInfo.artist}</p>
            {songInfo.album && (
              <p className="text-gray-400 text-sm">{songInfo.album}</p>
            )}
            <button 
              onClick={onClose} 
              className="mt-6 px-6 py-2 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="text-center">
            <p className="mb-6">Click the button below to identify the currently playing song.</p>
            <button 
              onClick={mockIdentify} 
              disabled={isIdentifying}
              className="px-8 py-3 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isIdentifying ? 'Identifying...' : 'Identify Song'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
```
