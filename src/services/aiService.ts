// File: src/services/aiService.ts | Version: v1.9.76
import { GoogleGenAI } from '@google/genai';

let aiInstance: GoogleGenAI | null = null;

export const getAiService = () => {
  if (!aiInstance) {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (apiKey) {
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
      base64Audio = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(audioInput);
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'audio/wav',
              data: base64Audio
            }
          },
          {
            text: 'Analyze this audio and suggest a visualizer configuration. Return ONLY a JSON object with "mode" (one of DIGITAL_GRID, SILK_WAVE, OCEAN_WAVE, NEURAL_FLOW, CUBE_FIELD, KINETIC_WALL, RESONANCE_ORB, VORTEX, LIQUID_SPHERE), "colors" (array of 3 hex codes), and "sensitivity" (number between 0.5 and 2.0).'
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
  } catch (err) {
    console.error('AI Visual Config error:', err);
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
  } catch (err) {
    console.error('AI Background Generation error:', err);
    return null;
  }
};
export const identifySong = async (audioBlob: Blob): Promise<any> => {
  const ai = getAiService();
  if (!ai) return null;

  try {
    const base64Audio = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(audioBlob);
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
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
  } catch (err) {
    console.error('AI Identification error:', err);
    return null;
  }
};
