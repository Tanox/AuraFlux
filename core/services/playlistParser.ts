
/**
 * File: core/services/playlistParser.ts
 * Version: 1.0.0
 * Author: Sut
 * Extracted from aiService.ts for better modularity.
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

/**
 * Strategy: Code-Based Parsing
 * Tries to extract data via regex or simple fetch if possible.
 */
async function parseWithCodeStrategy(url: string): Promise<any[] | null> {
    // 1. Direct JSON support (user drops a raw json file link)
    if (url.endsWith('.json')) {
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error("Fetch failed");
            const data = await res.json();
            // Try to detect common array structures
            const list = Array.isArray(data) ? data : (data.tracks || data.playlist || data.songs);
            if (list && Array.isArray(list) && list.length > 0) {
                // Normalize keys
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

/**
 * Intelligent Hybrid Parsing
 * Race Condition: Code Parse vs Timeout -> AI
 */
export const parsePlaylistSmart = async (url: string, apiKey: string): Promise<any[]> => {
    const key = apiKey || process.env.API_KEY;
    if (!key) return [];

    // Step 1: Attempt Code Parsing with Timeout
    try {
        const codePromise = parseWithCodeStrategy(url);
        const timeoutPromise = new Promise<null>((_, reject) => 
            setTimeout(() => reject(new Error("Code Parse Timeout")), PARSE_TIMEOUT_MS)
        );

        const codeResult = await Promise.race([codePromise, timeoutPromise]);
        
        if (codeResult && codeResult.length > 0) {
            console.log("[PlaylistParser] Code parsing successful.");
            return codeResult;
        }
    } catch (e) {
        console.log("[PlaylistParser] Code parsing skipped or timed out, falling back to Gemini.");
    }

    // Step 2: General AI Parsing (Gemini Pro + Search)
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
        console.error("[PlaylistParser] Smart Parsing Failed:", e);
        return [];
    }
};
