/**
 * File: core/services/playlistParser.ts
 * Version: 1.0.1
 * Author: Sut
 */

import { GoogleGenAI, Type } from "@google/genai";

const GEMINI_PRO_MODEL = 'gemini-3-pro-preview';
const PARSE_TIMEOUT_MS = 2500;

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

async function parseWithCodeStrategy(url: string): Promise<any[] | null> {
    if (url.endsWith('.json')) {
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error("Fetch failed");
            const data = await res.json();
            const list = Array.isArray(data) ? data : (data.tracks || data.playlist || data.songs);
            if (list && Array.isArray(list) && list.length > 0) {
                return list.map((item: any) => ({
                    title: item.title || item.name || "Unknown",
                    artist: item.artist || (item.artists && item.artists[0]?.name) || "Unknown",
                    albumArtUrl: item.albumArtUrl || item.picUrl || item.cover,
                    audioPreviewUrl: item.url || item.mp3Url
                }));
            }
        } catch (e) { /* ignore */ }
    }
    return null;
}

export const parsePlaylistSmart = async (url: string, apiKey: string): Promise<any[]> => {
    const key = apiKey || process.env.API_KEY;
    if (!key) return [];

    try {
        const codePromise = parseWithCodeStrategy(url);
        const timeoutPromise = new Promise<null>((_, reject) => 
            setTimeout(() => reject(new Error("Code Parse Timeout")), PARSE_TIMEOUT_MS)
        );
        const codeResult = await Promise.race([codePromise, timeoutPromise]);
        if (codeResult && codeResult.length > 0) return codeResult;
    } catch (e) {}

    const aiInstance = new GoogleGenAI({ apiKey: key });
    const prompt = `Task: Extract all songs from this playlist URL: ${url}
    Platforms: Netease Music, QQ Music, Spotify, YouTube Music, Apple Music.
    Action: Search for the content and parse titles/artists.
    Return: Strict JSON array of objects.`;

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
        console.error("[PlaylistParser] Smart Parsing Failed:", e);
        return [];
    }
};