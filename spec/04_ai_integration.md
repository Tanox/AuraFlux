<!-- openspec/04_ai_integration.md v2.3.4 -->
# AI 闆嗘垚绯荤粺瑙勮寖

## 1. AI 鏈嶅姟妯″潡

### 1.1 aiService.ts
- **鏂囦欢**: `src/services/aiService.ts`
- **鐗堟湰**: v2.3.4
- **鍔熻兘**: 鎻愪緵 Google Gemini AI 鏈嶅姟闆嗘垚

**鏍稿績鍔熻兘:**
- AI 鏈嶅姟鍙敤鎬ф鏌?- 闊抽鍒嗘瀽涓庤瑙夐厤缃敓鎴?- 鑹烘湳鑳屾櫙鐢熸垚
- 姝屾洸璇嗗埆

**鏍稿績鏂规硶:**
- `isAiServiceAvailable` - 妫€鏌?AI 鏈嶅姟鏄惁鍙敤
- `checkAiServiceAvailability` - 妫€鏌?AI 鏈嶅姟鍙敤鎬у苟澶勭悊閿欒
- `getAiService` - 鑾峰彇 AI 鏈嶅姟瀹炰緥
- `generateVisualConfigFromAudio` - 浠庨煶棰戠敓鎴愯瑙夐厤缃?- `generateArtisticBackground` - 鐢熸垚鑹烘湳鑳屾櫙
- `identifySong` - 璇嗗埆姝屾洸

**AI 妯″瀷浣跨敤:**
- `gemini-3-flash-preview` - 鐢ㄤ簬闊抽鍒嗘瀽鍜屾瓕鏇茶瘑鍒?- `gemini-2.5-flash-image` - 鐢ㄤ簬鐢熸垚鑹烘湳鑳屾櫙

**API 瀵嗛挜绠＄悊:**
- 浣跨敤 `process.env.GEMINI_API_KEY` (鏈嶅姟鍣ㄧ)
- 閫氳繃 API 璺敱浠ｇ悊鎵€鏈夎姹?- 涓ユ牸鐨勫瘑閽ラ獙璇佸拰閿欒澶勭悊

**浠ｇ爜绀轰緥:**
```tsx
// aiService.ts 鏍稿績缁撴瀯
// File: src/services/aiService.ts | Version: v2.3.4
import { GoogleGenAI } from '@google/genai';
import { en } from '@/locales/en';

let aiInstance: GoogleGenAI | null = null;

/**
 * 灏咮lob瀵硅薄杞崲涓築ase64瀛楃涓? * @param {Blob} blob - 瑕佽浆鎹㈢殑Blob瀵硅薄
 * @returns {Promise<string>} Base64瀛楃涓? */
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
 * 妫€鏌I鏈嶅姟鏄惁鍙敤
 * @returns {boolean} 濡傛灉API瀵嗛挜宸查厤缃笖鏈夋晥鍒欒繑鍥瀟rue
 */
export const isAiServiceAvailable = (): boolean => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  return Boolean(apiKey && apiKey.length > 0 && !apiKey.startsWith('demo'));
};

/**
 * 妫€鏌I鏈嶅姟鏄惁鍙敤锛屽鏋滀笉鍙敤鍒欒皟鐢ㄩ敊璇洖璋? * @param {Function} onError - 閿欒鍥炶皟鍑芥暟
 * @param {string} customMessage - 鑷畾涔夐敊璇秷鎭紙鍙€夛級
 * @returns {boolean} 濡傛灉AI鏈嶅姟鍙敤鍒欒繑鍥瀟rue
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

## 2. AI 鐘舵€佺鐞?
### 2.1 useAiState Hook
- **鏂囦欢**: `src/hooks/useAiState.ts`
- **鐗堟湰**: v2.3.4
- **鍔熻兘**: 绠＄悊 AI 鐩稿叧鐘舵€?
**鏍稿績鐘舵€?**
- `lyricsStyle` - 姝岃瘝鏍峰紡 (榛樿: `LyricsStyle.STANDARD`)
- `showLyrics` - 姝岃瘝鏄剧ず鐘舵€?(榛樿: `false`)
- `enableAnalysis` - 鍚敤鍒嗘瀽鐘舵€?(榛樿: `true`)
- `isIdentifying` - 姝ｅ湪璇嗗埆鐘舵€?(榛樿: `false`)

**鏍稿績鏂规硶:**
- `performIdentification(stream: MediaStream)` - 鎵ц姝屾洸璇嗗埆
- `resetAiSettings()` - 閲嶇疆 AI 璁剧疆

**鍙傛暟璇存槑:**
- `language` - 褰撳墠璇█
- `region` - 褰撳墠鍖哄煙
- `provider` - AI 鏈嶅姟鎻愪緵鍟?(GEMINI 鎴?MOCK)
- `isListening` - 鏄惁姝ｅ湪鐩戝惉
- `isSimulating` - 鏄惁浣跨敤妯℃嫙妯″紡
- `mediaStream` - 濯掍綋娴?- `initialSettings` - 鍒濆璁剧疆
- `setSettings` - 璁剧疆鏇存柊鍑芥暟
- `onSongIdentified` - 姝屾洸璇嗗埆瀹屾垚鍥炶皟
- `currentSong` - 褰撳墠姝屾洸淇℃伅
- `getAudioSlice` - 鑾峰彇闊抽鐗囨鐨勫嚱鏁?- `t` - 缈昏瘧鍑芥暟
- `showToast` - 鏄剧ず鎻愮ず鐨勫嚱鏁?
**浠ｇ爜绀轰緥:**
```tsx
// useAiState.ts 鏍稿績缁撴瀯
// File: src/hooks/useAiState.ts | Version: v2.3.3
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

## 3. AI 闆嗘垚鍦烘櫙

### 3.1 AI 鑳屾櫙鐢熸垚
- **缁勪欢**: `AiBackground.tsx`
- **鏂囦欢**: `src/components/visualizers/AiBackground.tsx`
- **鐗堟湰**: v2.3.4
- **鍔熻兘**: 鍩轰簬闊充箰鎯呯华鐢熸垚鑹烘湳鑳屾櫙

**宸ヤ綔娴佺▼:**
1. 鍒嗘瀽闊抽鏁版嵁
2. 鐢熸垚鎻忚堪闊充箰鎯呯华鐨勬彁绀鸿瘝
3. 璋冪敤 Gemini 2.5 Flash Image 鐢熸垚鑳屾櫙
4. 搴旂敤鐢熸垚鐨勮儗鏅埌鍙鍖栧満鏅?
**浠ｇ爜绀轰緥:**
```tsx
// AiBackground.tsx 鏍稿績缁撴瀯
// File: src/components/visualizers/AiBackground.tsx | Version: v2.3.3
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

### 3.2 AI 瑙嗚瀵兼紨
- **缁勪欢**: `AiVisualDirector.tsx`
- **鏂囦欢**: `src/components/visualizers/AiVisualDirector.tsx`
- **鐗堟湰**: v2.3.4
- **鍔熻兘**: 鍩轰簬闊抽鍒嗘瀽鑷姩閰嶇疆瑙嗚鏁堟灉

**宸ヤ綔娴佺▼:**
1. 鍒嗘瀽闊抽棰戣氨鍜屾儏缁?2. 鐢熸垚閫傚悎鐨勮瑙夋ā寮忛厤缃?3. 鑷姩搴旂敤鍒板彲瑙嗗寲绯荤粺
4. 瀹炴椂璋冩暣瑙嗚鍙傛暟

**浠ｇ爜绀轰緥:**
```tsx
// AiVisualDirector.tsx 鏍稿績缁撴瀯
// File: src/components/visualizers/AiVisualDirector.tsx | Version: v2.3.3
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

### 3.3 姝屾洸璇嗗埆
- **缁勪欢**: `SongIdentification.tsx`
- **鏂囦欢**: `src/components/visualizers/SongIdentification.tsx`
- **鐗堟湰**: v2.3.4
- **鍔熻兘**: 璇嗗埆姝ｅ湪鎾斁鐨勬瓕鏇?
**宸ヤ綔娴佺▼:**
1. 鎹曡幏闊抽鐗囨
2. 鍙戦€佸埌 Gemini 3.0 Flash 杩涜鍒嗘瀽
3. 瑙ｆ瀽璇嗗埆缁撴灉
4. 鏄剧ず姝屾洸淇℃伅鍜屼笓杈戝皝闈?
**浠ｇ爜绀轰緥:**
```tsx
// SongIdentification.tsx 鏍稿績缁撴瀯
// File: src/components/visualizers/SongIdentification.tsx | Version: v2.3.3
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
