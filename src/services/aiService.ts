// File: src\services\aiService.ts | Version: v2.3.3
import i18n from '@/i18n';
import { logger } from '@/utils/logger';

/**
 * 灏咮lob瀵硅薄杞崲涓築ase64瀛楃涓? * @param {Blob} blob - 瑕佽浆鎹㈢殑Blob瀵硅薄
 * @returns {Promise<string>} Base64瀛楃涓?*/
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
 * @returns {Promise<boolean>} 濡傛灉API鏈嶅姟鍙敤鍒欒繑鍥瀟rue
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
 * 妫€鏌I鏈嶅姟鏄惁鍙敤锛屽鏋滀笉鍙敤鍒欒皟鐢ㄩ敊璇洖璋? * @param {Function} onError - 閿欒鍥炶皟鍑芥暟
 * @param {string} customMessage - 鑷畾涔夐敊璇秷鎭紙鍙€夛級
 * @returns {Promise<boolean>} 濡傛灉AI鏈嶅姟鍙敤鍒欒繑鍥瀟rue
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
    logger.warn('AI Visual Config error:', err?.message || err);
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
    logger.warn('AI Background Generation error:', err?.message || err);
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
    logger.warn('AI Identification error:', err?.message || err);
    return null;
  }
};

