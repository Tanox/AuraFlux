// File: src\services\aiService.ts | Version: v2.3.3
import i18n from '@/i18n';
import { logger } from '@/utils/logger';

/**
 * Convert Blob object to Base64 string
 * @param {Blob} blob - The Blob object to convert
 * @returns {Promise<string>} Base64 string
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
 * Check if AI service is available
 * @returns {Promise<boolean>} Returns true if AI service is available
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
 * Check if AI service is available, if not call error callback
 * @param {Function} onError - Error callback function
 * @param {string} customMessage - Custom error message (optional)
 * @returns {Promise<boolean>} Returns true if AI service is available
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

