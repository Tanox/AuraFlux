// File: app/services/aiService.ts | Version: v1.9.73
import { GoogleGenAI, Type } from "@google/genai";
import { SongInfo, Language, AIProvider, Region } from '../types/index.ts';

const GEMINI_MODEL = 'gemini-3-flash-preview';
const IMAGEN_MODEL = 'gemini-2.5-flash-image';

const SONG_IDENTIFICATION_SCHEMA = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "The song title" },
      artist: { type: Type.STRING, description: "The artist name" },
      lyricsSnippet: { type: Type.STRING, description: "Short snippet of lyrics" },
      mood: { type: Type.STRING, description: "A descriptive mood adjective" },
      mood_en_keywords: { type: Type.STRING, description: "Mood keywords in English" },
      identified: { type: Type.BOOLEAN, description: "Identification success status" }
    },
    required: ['title', 'artist', 'mood', 'identified']
};

const VISUAL_CONFIG_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        mode: { type: Type.STRING, description: "Visualizer mode: PLASMA, BARS, DIGITAL_GRID, SILK_WAVE, OCEAN_WAVE, PARTICLES, TUNNEL, RINGS, LASERS, FLUID_CURVES, WAVEFORM, NEBULA, NEURAL_FLOW, CUBE_FIELD, KINETIC_WALL, RESONANCE_ORB" },
        colors: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array of 3 vibrant hex colors" },
        speed: { type: Type.NUMBER, description: "Animation speed multiplier (0.5 - 2.5)" },
        sensitivity: { type: Type.NUMBER, description: "Audio gain sensitivity (1.0 - 3.0)" },
        explanation: { type: Type.STRING, description: "Short justification for these choices" }
    },
    required: ['mode', 'colors', 'speed', 'sensitivity', 'explanation']
};

const IDENTIFY_SONG_PROMPT = (language: Language, region: Region) => 
    `Analyze the attached audio snippet. Identify the track name, artist, and emotional vibe. Language: ${language}, Region: ${region}.`;

const GENERATE_VISUAL_CONFIG_PROMPT = "Listen to this audio and choose the best visual parameters to match its frequency distribution and rhythm.";

const GENERATE_ARTISTIC_BACKGROUND_PROMPT = (moodKeywords: string) => 
    `Breathtaking high-fidelity digital art background for a music visualizer. Concept: ${moodKeywords}. Style: Abstract, atmospheric lighting, volumetric depth, cinematic 8k.`;

const cleanJsonString = (str: string): string => {
    if (!str) return "{}";
    return str.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/, '').trim();
};

export const identifySongFromAudio = async (base64Audio: string, mimeType: string, language: Language = 'en', region: Region = 'global', provider: AIProvider = 'GEMINI'): Promise<SongInfo | null> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: { parts: [{ inlineData: { mimeType, data: base64Audio } }, { text: IDENTIFY_SONG_PROMPT(language, region) }] },
            config: { 
                responseMimeType: "application/json", 
                responseSchema: SONG_IDENTIFICATION_SCHEMA,
                thinkingConfig: { thinkingBudget: 0 }
            }
        });
        const text = response.text;
        if (!text) return null;
        try {
            const result = JSON.parse(cleanJsonString(text));
            return { ...result, matchSource: provider };
        } catch (parseErr) {
            console.error("[AI] JSON Parse failed for song ID:", text);
            return null;
        }
    } catch (e) { 
        console.error("[AI] Song Identification failed:", e);
        return null; 
    }
};

export const generateVisualConfigFromAudio = async (base64Audio: string): Promise<any> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: { parts: [{ inlineData: { mimeType: 'audio/wav', data: base64Audio } }, { text: GENERATE_VISUAL_CONFIG_PROMPT }] },
            config: { 
                responseMimeType: "application/json", 
                responseSchema: VISUAL_CONFIG_SCHEMA,
                thinkingConfig: { thinkingBudget: 1024 }
            }
        });
        const text = response.text;
        if (!text) return null;
        try {
            return JSON.parse(cleanJsonString(text));
        } catch (parseErr) {
            console.error("[AI] JSON Parse failed for visual config:", text);
            return null;
        }
    } catch (e) { 
        console.error("[AI] Visual auto-direction failed:", e);
        return null; 
    }
};

export const generateArtisticBackground = async (moodKeywords: string): Promise<string | null> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: IMAGEN_MODEL,
            contents: { parts: [{ text: GENERATE_ARTISTIC_BACKGROUND_PROMPT(moodKeywords) }] },
            config: { imageConfig: { aspectRatio: "16:9" } }
        });
        if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        return null;
    } catch (e) { 
        console.error("[AI] AI Background generation failed:", e);
        return null; 
    }
};