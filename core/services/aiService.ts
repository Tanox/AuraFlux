
/**
 * File: core/services/aiService.ts
 * Version: 2.3.0
 * Author: Sut
 * Updated: 2025-07-26 10:30
 */

import { GoogleGenAI, Type } from "@google/genai";
import { SongInfo, Language, AIProvider, Region } from '../types';

const GEMINI_MODEL = 'gemini-3-flash-preview';
const GEMINI_PRO_MODEL = 'gemini-3-pro-preview';
const IMAGEN_MODEL = 'gemini-2.5-flash-image';

const PLAYLIST_PARSE_SCHEMA = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING },
            artist: { type: Type.STRING },
            albumArtUrl: { type: Type.STRING, description: "Cover image URL." },
            audioPreviewUrl: { type: Type.STRING, description: "Direct audio source if found." }
        },
        required: ['title', 'artist']
    }
};

/**
 * v2.3.0: 智能解析引擎
 * 结合正则提取与 AI 搜索
 */
export const parsePlaylistSmart = async (url: string, apiKey: string): Promise<any[]> => {
    const key = apiKey || process.env.API_KEY;
    if (!key) return [];

    // 1. 尝试特定的“硬核代码”快速解析 (针对网易云等已知模式)
    const neteaseMatch = url.match(/playlist\?id=(\d+)/) || url.match(/id=(\d+)/);
    if (neteaseMatch && url.includes('163.com')) {
        // 这里理论上可以调用某些公开的 Netease 解析接口
        // 但为了通用性和稳定性，我们依然将 ID 喂给 AI，让它通过 Search 拿最新数据
        console.log("[Parser] Netease ID detected:", neteaseMatch[1]);
    }

    // 2. 通用 AI 解析逻辑 (使用 Gemini Pro + Google Search)
    // 这是最强大的“代码实现”，因为它能理解网页结构的变化
    const aiInstance = new GoogleGenAI({ apiKey: key });
    const prompt = `Task: Extract all songs from this playlist URL: ${url}
    Platforms supported: Netease Music, QQ Music, Spotify, YouTube Music, Apple Music.
    Action: Use Google Search to find the playlist page, parse the song titles and artists.
    Return: A strict JSON array of objects with 'title' and 'artist'. Try to find cover art URLs.`;

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

        let text = response.text || "";
        if (text.startsWith('```')) {
            text = text.replace(/^```[a-z]*\n/, '').replace(/\n```$/, '');
        }
        return JSON.parse(text);
    } catch (e) {
        console.error("[AI] Smart Parsing Failed:", e);
        return [];
    }
};

// ... 保持其他方法（identifySongFromAudio, generateArtisticBackground 等）不变
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
