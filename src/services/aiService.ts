// File: src\services\aiService.ts | Version: v2.3.1
import i18n from '@/i18n';

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
 * @returns {Promise<boolean>} 如果API服务可用则返回true
 */
export const isAiServiceAvailable = async (): Promise<boolean> => {
  try {
    const response = await fetch('/api/gemini/health', {
      method: 'GET'
    });
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * 检查AI服务是否可用，如果不可用则调用错误回调
 * @param {Function} onError - 错误回调函数
 * @param {string} customMessage - 自定义错误消息（可选）
 * @returns {Promise<boolean>} 如果AI服务可用则返回true
 */
export const checkAiServiceAvailability = async (onError?: (message: string) => void, customMessage?: string): Promise<boolean> => {
  const available = await isAiServiceAvailable();
  if (!available) {
    const errorMsg = customMessage || i18n.t('toasts.aiDirectorReq') || 'AI service unavailable. Please check configuration.';
    if (onError) {
      onError(errorMsg);
    }
    return false;
  }
  return true;
};



export const generateVisualConfigFromAudio = async (audioInput: Blob | string): Promise<any> => {
  try {
    let base64Audio = '';
    if (typeof audioInput === 'string') {
      base64Audio = audioInput;
    } else {
      base64Audio = await blobToBase64(audioInput);
    }

    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'generateVisualConfig',
        data: { audio: base64Audio }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (err: any) {
    console.warn('AI Visual Config error:', err?.message || err);
    return null;
  }
};

export const generateArtisticBackground = async (prompt: string): Promise<string | null> => {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'generateBackground',
        data: { prompt }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (err: any) {
    console.warn('AI Background Generation error:', err?.message || err);
    return null;
  }
};

export const identifySong = async (audioBlob: Blob): Promise<any> => {
  try {
    const base64Audio = await blobToBase64(audioBlob);

    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'identifySong',
        data: { audio: base64Audio }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (err: any) {
    console.warn('AI Identification error:', err?.message || err);
    return null;
  }
};

