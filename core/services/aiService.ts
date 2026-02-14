/**
 * File: core/services/aiService.ts
 * Version: 2.5.0
 * Author: Sut
 */

import { GoogleGenAI, Type } from "@google/genai";
import { SongInfo, Language, AIProvider, Region } from '../types';

const GEMINI_MODEL = 'gemini-3-flash-preview';
const IMAGEN_MODEL = 'gemini-2.5-flash-image';

export const validateApiKey = async (provider: AIProvider, apiKey: string): Promise<boolean> => {
    if (provider !== 'GEMINI') return true; 
    if (!apiKey || !apiKey.startsWith('AIza')) return false;
    try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: { parts: [{ text: "ping" }] },
            config: { maxOutputTokens: 10, thinkingConfig: { thinkingBudget: 0 } }
        });
        return !!response.text;
    } catch (e) { return false; }
};

export const identifySongFromAudio = async (base64Audio: string, mimeType: string, language: Language = 'en', region: Region = 'global', provider: AIProvider = 'GEMINI', apiKey?: string): Promise<SongInfo | null> => {
    const key = apiKey || process.env.API_KEY;
    if (!key) return null;
    const ai = new GoogleGenAI({ apiKey: key });
    
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
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: { 
                parts: [
                    { inlineData: { mimeType, data: base64Audio } }, 
                    { text: `Identify this music track. Response Language: ${language}, Logic Region: ${region}. Provide mood and artist details.` }
                ] 
            },
            config: { 
                responseMimeType: "application/json", 
                responseSchema: SONG_SCHEMA
            }
        });
        const result = JSON.parse(response.text || "{}");
        return { ...result, matchSource: provider };
    } catch (e) { 
        console.error("[AI] Identification failed:", e);
        return null; 
    }
};

export const generateVisualConfigFromAudio = async (base64Audio: string, apiKey: string, language: Language = 'en'): Promise<any> => {
    const key = apiKey || process.env.API_KEY;
    if (!key) return null;
    const ai = new GoogleGenAI({ apiKey: key });
    
    const CONFIG_SCHEMA = {
        type: Type.OBJECT,
        properties: {
            mode: { type: Type.STRING, description: "Enum: PLASMA, BARS, DIGITAL_GRID, SILK_WAVE, OCEAN_WAVE, PARTICLES, TUNNEL, RINGS, LASERS, FLUID_CURVES, WAVEFORM, NEBULA, NEURAL_FLOW, CUBE_FIELD, KINETIC_WALL, RESONANCE_ORB" },
            colors: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array of 3 hex codes" },
            speed: { type: Type.NUMBER },
            sensitivity: { type: Type.NUMBER },
            explanation: { type: Type.STRING }
        },
        required: ['mode', 'colors', 'speed', 'sensitivity', 'explanation']
    };

    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: { 
                parts: [
                    { inlineData: { mimeType: 'audio/wav', data: base64Audio } }, 
                    { text: "Analyze this audio segment and forge an aesthetic visual configuration." }
                ] 
            },
            config: { responseMimeType: "application/json", responseSchema: CONFIG_SCHEMA }
        });
        return JSON.parse(response.text || "{}");
    } catch (e) { return null; }
};

export const generateArtisticBackground = async (moodKeywords: string, apiKey: string): Promise<string | null> => {
    const key = apiKey || process.env.API_KEY;
    if (!key) return null;
    const ai = new GoogleGenAI({ apiKey: key });
    try {
        const response = await ai.models.generateContent({
            model: IMAGEN_MODEL,
            contents: { parts: [{ text: `High fidelity digital art for music background. Style: atmospheric, cinematic, 8k. Subject: ${moodKeywords}. Abstract lighting.` }] },
            config: { imageConfig: { aspectRatio: "16:9" } }
        });
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
        }
        return null;
    } catch (e) { return null; }
};