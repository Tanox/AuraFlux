
/**
 * File: core/services/aiService.ts
 * Version: 2.2.0
 * Author: Sut
 * Updated: 2025-07-25 10:30
 */

import { GoogleGenAI, Type } from "@google/genai";
import { SongInfo, Language, AIProvider, Region } from '../types';

const GEMINI_MODEL = 'gemini-3-flash-preview';
const GEMINI_PRO_MODEL = 'gemini-3-pro-preview';
const IMAGEN_MODEL = 'gemini-2.5-flash-image';

const SONG_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Track title or poetic description." },
    artist: { type: Type.STRING, description: "Artist or genre description." },
    lyrics: { type: Type.STRING, description: "Full unsynchronized lyrics." },
    lyricsSnippet: { type: Type.STRING, description: "A key lyric snippet." },
    mood: { type: Type.STRING, description: "A aesthetic summary." },
    mood_en_keywords: { type: Type.STRING, description: "Keywords for visual styling." },
    identified: { type: Type.BOOLEAN, description: "True if a known song." }
  },
  required: ['title', 'artist', 'mood', 'mood_en_keywords', 'identified', 'lyricsSnippet']
};

const PLAYLIST_PARSE_SCHEMA = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING },
            artist: { type: Type.STRING },
            albumArtUrl: { type: Type.STRING, description: "Try to find the public cover image URL." },
            platformUrl: { type: Type.STRING, description: "The original track URL on the platform." },
            audioPreviewUrl: { type: Type.STRING, description: "If available, the direct MP3/AAC preview link." }
        },
        required: ['title', 'artist']
    }
};

const parseAiJson = (text: string | undefined): any => {
    if (!text) return null;
    let clean = text.trim();
    if (clean.startsWith('```')) {
        clean = clean.replace(/^```[a-z]*\n/, '').replace(/\n```$/, '');
    }
    try {
        return JSON.parse(clean);
    } catch (e) {
        console.error("[AI] JSON Parse Failed:", e);
        return null;
    }
};

/**
 * v2.2.0: 利用 Gemini 3 Pro + Google Search 解析跨平台歌单
 */
export const parsePlaylistWithSearch = async (url: string, apiKey: string): Promise<any[]> => {
    const key = apiKey || process.env.API_KEY;
    if (!key) return [];
    
    const aiInstance = new GoogleGenAI({ apiKey: key });
    const prompt = `Use Google Search to find the tracks contained in this music playlist URL: ${url}. 
    This could be from NetEase Cloud Music, QQ Music, Spotify, YouTube Music, or Apple Music.
    For each track, provide the title, artist, and if possible, a high-quality cover image URL and a direct playable audio preview link (if publicly accessible).
    Return the result as a structured JSON array.`;

    try {
        const response = await aiInstance.models.generateContent({
            model: GEMINI_PRO_MODEL,
            contents: { parts: [{ text: prompt }] },
            config: {
                tools: [{ googleSearch: {} }],
                responseMimeType: "application/json",
                responseSchema: PLAYLIST_PARSE_SCHEMA
            }
        });
        return parseAiJson(response.text) || [];
    } catch (e) {
        console.error("[AI] Playlist Parsing Failed:", e);
        return [];
    }
};

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
    } catch (e) {
        console.error("[AI] Key Validation Failed:", e);
        return false;
    }
};

export const generateVisualConfigFromAudio = async (base64Audio: string, apiKey: string, language: Language = 'en'): Promise<any> => {
    const key = apiKey || process.env.API_KEY;
    if (!key) return null;
    const aiInstance = new GoogleGenAI({ apiKey: key });
    const systemInstruction = `Analyze the provided audio snippet. Determine visual choices in JSON. Explanation in ${language}.`;
    try {
        const response = await aiInstance.models.generateContent({
            model: GEMINI_MODEL,
            contents: [{ parts: [{ inlineData: { mimeType: 'audio/wav', data: base64Audio } }, { text: "Generate visual config." }] }],
            config: { systemInstruction, responseMimeType: "application/json" }
        });
        return parseAiJson(response.text);
    } catch (e) { return null; }
};

export const generateArtisticBackground = async (moodKeywords: string, apiKey: string): Promise<string | null> => {
    const key = apiKey || process.env.API_KEY;
    if (!key) return null;
    const aiInstance = new GoogleGenAI({ apiKey: key });
    const prompt = `Detailed immersive background for mood: ${moodKeywords}. 4k cinematic.`;
    try {
        const response = await aiInstance.models.generateContent({
            model: IMAGEN_MODEL,
            contents: { parts: [{ text: prompt }] },
            config: { imageConfig: { aspectRatio: "16:9" } }
        });
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
        }
        return null;
    } catch (e) { return null; }
};

export const identifySongFromAudio = async (base64Audio: string, mimeType: string, language: Language = 'en', region: Region = 'global', provider: AIProvider = 'GEMINI', apiKey?: string): Promise<SongInfo | null> => {
    const key = apiKey || process.env.API_KEY;
    if (!key) return null;
    const aiInstance = new GoogleGenAI({ apiKey: key });
    const systemInstruction = `Music identifier. Provide lyrics. Language: ${language}.`;
    try {
        const response = await aiInstance.models.generateContent({
            model: GEMINI_MODEL,
            contents: [{ parts: [{ inlineData: { mimeType, data: base64Audio } }, { text: "Identify song." }] }],
            config: { systemInstruction, responseMimeType: "application/json", responseSchema: SONG_SCHEMA }
        });
        const result = parseAiJson(response.text);
        return result ? { ...result, matchSource: provider } : null;
    } catch (e) { return null; }
};
