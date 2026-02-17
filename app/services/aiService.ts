// File: app/services/aiService.ts | Version: v1.9.36 | Author: Sut
import { GoogleGenAI, Type } from "@google/genai";
import { SongInfo, Language, AIProvider, Region } from '../types';

// --- Constants: Model Names ---
const GEMINI_MODEL = 'gemini-3-flash-preview';
const IMAGEN_MODEL = 'gemini-2.5-flash-image';

// --- Constants: API Schemas for structured responses ---

/**
 * Schema for the `identifySongFromAudio` function.
 * Ensures the AI returns a structured JSON object with song details.
 */
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

/**
 * Schema for the `generateVisualConfigFromAudio` function.
 * Ensures the AI returns a structured JSON object with visual parameters.
 */
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

// --- Constants: Prompts ---

const IDENTIFY_SONG_PROMPT = (language: Language, region: Region) => 
    `Analyze the attached audio snippet. Identify the track name, artist, and emotional vibe. Language: ${language}, Region: ${region}.`;

const GENERATE_VISUAL_CONFIG_PROMPT = "Listen to this audio and choose the best visual parameters to match its frequency distribution and rhythm.";

const GENERATE_ARTISTIC_BACKGROUND_PROMPT = (moodKeywords: string) => 
    `Breathtaking high-fidelity digital art background for a music visualizer. Concept: ${moodKeywords}. Style: Abstract, atmospheric lighting, volumetric depth, cinematic 8k.`;

// --- Helper Functions ---

/**
 * Cleans a JSON string that might be wrapped in Markdown code blocks.
 * @param str The raw string from the AI response.
 * @returns A clean, parsable JSON string.
 */
const cleanJsonString = (str: string): string => {
    if (!str) return "{}";
    return str.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/, '').trim();
};

/**
 * Retrieves the API key, prioritizing the provided key, then falling back to environment variables.
 * Safe for environments where process is undefined.
 * @param apiKey An optional API key provided directly.
 * @returns The API key string, or null if none is available.
 */
const getApiKey = (apiKey?: string): string | null => {
    if (apiKey) return apiKey;
    // Safely check for process.env
    try {
        if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
            return process.env.API_KEY;
        }
    } catch (e) {
        // Ignore reference errors for process
    }
    return null;
}

// --- Service Functions ---

/**
 * Validates a Gemini API Key by performing a minimal content generation request.
 * @param provider The AI provider (currently only validates 'GEMINI').
 * @param apiKey The API key to validate.
 * @returns A boolean indicating if the key is valid.
 */
export const validateApiKey = async (provider: AIProvider, apiKey: string): Promise<boolean> => {
    if (provider !== 'GEMINI') return true; 
    if (!apiKey || !apiKey.startsWith('AIza')) return false;
    try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: "ping",
            config: { 
                maxOutputTokens: 10,
                thinkingConfig: { thinkingBudget: 0 }
            }
        });
        return !!response.text;
    } catch (e) { 
        return false; 
    }
};

/**
 * Identifies a song from a base64 audio snippet.
 * @param base64Audio Base64 encoded audio data.
 * @param mimeType The MIME type of the audio data.
 * @param language The target language for the response.
 * @param region The geographical region for context.
 * @param provider The AI provider to use.
 * @param apiKey Optional API key.
 * @returns A promise that resolves to a `SongInfo` object or null on failure.
 */
export const identifySongFromAudio = async (
    base64Audio: string, 
    mimeType: string, 
    language: Language = 'en', 
    region: Region = 'global', 
    provider: AIProvider = 'GEMINI', 
    apiKey?: string
): Promise<SongInfo | null> => {
    const key = getApiKey(apiKey);
    if (!key) return null;
    
    const ai = new GoogleGenAI({ apiKey: key });
    
    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: [
                { inlineData: { mimeType, data: base64Audio } }, 
                { text: IDENTIFY_SONG_PROMPT(language, region) }
            ],
            config: { 
                responseMimeType: "application/json", 
                responseSchema: SONG_IDENTIFICATION_SCHEMA
            }
        });
        
        const text = response.text;
        if (!text) return null;
        
        const result = JSON.parse(cleanJsonString(text));
        return { ...result, matchSource: provider };
    } catch (e) { 
        console.error("[AI] Song Identification failed:", e);
        return null; 
    }
};

/**
 * Generates an optimized visual configuration from an audio snippet.
 * @param base64Audio Base64 encoded audio data (WAV format).
 * @param apiKey The API key.
 * @returns A promise resolving to a configuration object or null.
 */
export const generateVisualConfigFromAudio = async (base64Audio: string, apiKey: string): Promise<any> => {
    const key = getApiKey(apiKey);
    if (!key) return null;
    
    const ai = new GoogleGenAI({ apiKey: key });
    
    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: [
                { inlineData: { mimeType: 'audio/wav', data: base64Audio } }, 
                { text: GENERATE_VISUAL_CONFIG_PROMPT }
            ],
            config: { 
                responseMimeType: "application/json", 
                responseSchema: VISUAL_CONFIG_SCHEMA 
            }
        });
        
        const text = response.text;
        if (!text) return null;
        
        return JSON.parse(cleanJsonString(text));
    } catch (e) { 
        console.error("[AI] Visual auto-direction failed:", e);
        return null; 
    }
};

/**
 * Generates an artistic background image based on mood keywords.
 * @param moodKeywords A string of keywords describing the desired mood.
 * @param apiKey The API key.
 * @returns A promise resolving to a base64 data URL string or null.
 */
export const generateArtisticBackground = async (moodKeywords: string, apiKey: string): Promise<string | null> => {
    const key = getApiKey(apiKey);
    if (!key) return null;
    
    const ai = new GoogleGenAI({ apiKey: key });
    try {
        const response = await ai.models.generateContent({
            model: IMAGEN_MODEL,
            contents: { parts: [{ text: GENERATE_ARTISTIC_BACKGROUND_PROMPT(moodKeywords) }] },
            config: { 
                imageConfig: { aspectRatio: "16:9" } 
            }
        });
        
        if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    return `data:image/png;base64,${part.inlineData.data}`;
                }
            }
        }
        return null;
    } catch (e) { 
        console.error("[AI] AI Background generation failed:", e);
        return null; 
    }
};