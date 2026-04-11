// File: src\services\aiService.ts | Version: v2.0.6
import { GoogleGenAI } from '@google/genai';
import { en } from '@/locales/en';

let aiInstance: GoogleGenAI | null = null;

/**
 * 将Blob对象转换为Base64字符串
 * @param {Blob} blob - 要转换的Blob对象
 * @returns {Promise<string>} Base64字符串 */
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
            text: 'Analyze this audio and suggest a visualizer configuration. Return ONLY a JSON object with "mode" (one of DIGITAL_GRID, SILK_WAVE, OCEAN_WAVE, NEURAL_FLOW, CUBE_FIELD, KINETIC_WALL, VORTEX, LASERS), "colors" (array of 3 hex codes), and "sensitivity" (number between 0.5 and 2.0).'
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

