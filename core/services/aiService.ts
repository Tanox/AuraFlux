
/**
 * File: core/services/aiService.ts
 * Version: 2.4.0
 * Author: Sut
 * Updated: 2025-07-27 10:00
 */

import { GoogleGenAI, Type } from "@google/genai";
import { SongInfo, Language, AIProvider, Region } from '../types';

const GEMINI_MODEL = 'gemini-3-flash-preview';
const IMAGEN_MODEL = 'gemini-2.5-flash-image';

export const validateApiKey = async (provider: AIProvider, apiKey: string): Promise<boolean> => {
    if (provider !== 'GEMINI') return true; 
    if (!apiKey || !apiKey.startsWith('AIza')) return false;
    try {
        const aiInstance = new GoogleGenAI({ apiKey });
        const response = await aiInstance.models.generateContent({
            model: GEMINI_MODEL,
            contents: "hi",
            config: { maxOutputTokens: 5, thinkingConfig: { thinkingBudget: 0 } }
        });
        return !!response.text;
    } catch (e) { return false; }
};

export const identifySongFromAudio = async (base64Audio: string, mimeType: string, language: Language = 'en', region: Region = 'global', provider: AIProvider = 'GEMINI', apiKey?: string): Promise<SongInfo | null> => {
    const key = apiKey || process.env.API_KEY;
    if (!key) return null;
    const aiInstance = new GoogleGenAI({ apiKey: key });
    const SONG_SCHEMA = {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          artist: { type: Type.STRING },
          lyricsSnippet: { type: Type.STRING },
          mood: { type: Type.STRING },
          mood_en_keywords: { type: Type.STRING },
          identified: { type: Type.BOOLEAN }
        },
        required: ['title', 'artist', 'mood', 'identified']
    };
    try {
        const response = await aiInstance.models.generateContent({
            model: GEMINI_MODEL,
            contents: [{ parts: [{ inlineData: { mimeType, data: base64Audio } }, { text: "Identify song." }] }],
            config: { responseMimeType: "application/json", responseSchema: SONG_SCHEMA }
        });
        const result = JSON.parse(response.text || "{}");
        return result ? { ...result, matchSource: provider } : null;
    } catch (e) { return null; }
};

export const generateArtisticBackground = async (moodKeywords: string, apiKey: string): Promise<string | null> => {
    const key = apiKey || process.env.API_KEY;
    if (!key) return null;
    const aiInstance = new GoogleGenAI({ apiKey: key });
    try {
        const response = await aiInstance.models.generateContent({
            model: IMAGEN_MODEL,
            contents: { parts: [{ text: `Digital art background for mood: ${moodKeywords}. Cinematic.` }] },
            config: { imageConfig: { aspectRatio: "16:9" } }
        });
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
        }
        return null;
    } catch (e) { return null; }
};

export const generateVisualConfigFromAudio = async (base64Audio: string, apiKey: string, language: Language = 'en'): Promise<any> => {
    const key = apiKey || process.env.API_KEY;
    if (!key) return null;
    const aiInstance = new GoogleGenAI({ apiKey: key });
    try {
        const response = await aiInstance.models.generateContent({
            model: GEMINI_MODEL,
            contents: [{ parts: [{ inlineData: { mimeType: 'audio/wav', data: base64Audio } }, { text: "Generate visual config JSON." }] }],
            config: { responseMimeType: "application/json" }
        });
        return JSON.parse(response.text || "{}");
    } catch (e) { return null; }
};
