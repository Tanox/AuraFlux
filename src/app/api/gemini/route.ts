// src/app/api/gemini/route.ts v2.4.0
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { logger } from '@/utils/logger';
import { VisualConfig, SongIdentification, VisualizerMode } from '@/types';

type ApiAction = 'generateVisualConfig' | 'generateBackground' | 'identifySong';

interface ApiRequest {
  action: ApiAction;
  data: {
    audio?: string;
    prompt?: string;
  };
}

interface ApiResponse {
  data?: unknown;
  error?: string;
}

// 简单的内存限流（生产环境建议使用 Redis）
const requestCounts = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60000; // 1分钟
const MAX_REQUESTS_PER_WINDOW = 10;
const VALID_MODES = new Set([
  VisualizerMode.DIGITAL_GRID,
  VisualizerMode.SILK_WAVE,
  VisualizerMode.OCEAN_WAVE,
  VisualizerMode.NEURAL_FLOW,
  VisualizerMode.CUBE_FIELD,
  VisualizerMode.KINETIC_WALL,
  VisualizerMode.LASERS
]);

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  
  // 清理所有过期条目
  for (const [key, limit] of requestCounts.entries()) {
    if (now > limit.resetTime) {
      requestCounts.delete(key);
    }
  }

  const limit = requestCounts.get(ip);
  
  if (!limit || now > limit.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (limit.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  
  limit.count++;
  return true;
}

function validateVisualConfig(config: unknown): config is VisualConfig {
  if (!config || typeof config !== 'object') return false;
  const c = config as Record<string, unknown>;
  if (!('mode' in c) || typeof c.mode !== 'string' || !VALID_MODES.has(c.mode as VisualizerMode)) return false;
  if (!('colors' in c) || !Array.isArray(c.colors) || c.colors.length < 3) return false;
  if (!('sensitivity' in c) || typeof c.sensitivity !== 'number' || c.sensitivity < 0.5 || c.sensitivity > 2.0) return false;
  return true;
}

function validateSongIdentification(identification: unknown): identification is SongIdentification {
  if (!identification || typeof identification !== 'object') return false;
  const i = identification as Record<string, unknown>;
  if (!('title' in i) || typeof i.title !== 'string') return false;
  if (!('artist' in i) || typeof i.artist !== 'string') return false;
  return true;
}

async function handleVisualConfig(ai: GoogleGenAI, data: { audio: string }): Promise<NextResponse<ApiResponse>> {
  try {
    if (!data.audio || typeof data.audio !== 'string') {
      return NextResponse.json({ error: 'Invalid audio data' }, { status: 400 });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: 'audio/wav',
                data: data.audio
              }
            },
            {
              text: 'Analyze this audio and suggest a visualizer configuration. Return ONLY a JSON object with "mode" (one of DIGITAL_GRID, SILK_WAVE, OCEAN_WAVE, NEURAL_FLOW, CUBE_FIELD, KINETIC_WALL, LASERS), "colors" (array of 3 hex codes), and "sensitivity" (number between 0.5 and 2.0).'
            }
          ]
        }
      ],
      config: {
        responseMimeType: 'application/json'
      }
    });

    if (response.text) {
      try {
        const parsed = JSON.parse(response.text);
        if (validateVisualConfig(parsed)) {
          return NextResponse.json({ data: parsed });
        }
        logger.warn('Invalid visual config received:', parsed);
      } catch {
        logger.warn('Failed to parse visual config');
      }
    }
    return NextResponse.json({ data: null });
  } catch (error) {
    logger.error('Visual config generation error:', error);
    throw error;
  }
}

async function handleBackgroundGeneration(ai: GoogleGenAI, data: { prompt: string }): Promise<NextResponse<ApiResponse>> {
  try {
    if (!data.prompt || typeof data.prompt !== 'string' || data.prompt.trim().length === 0) {
      return NextResponse.json({ error: 'Invalid prompt' }, { status: 400 });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: data.prompt
            }
          ]
        }
      ],
      config: {
        responseModalities: ['image']
      }
    });

    for (const candidate of response.candidates || []) {
      for (const part of candidate.content?.parts || []) {
        if ('inlineData' in part && part.inlineData) {
          return NextResponse.json({
            data: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`
          });
        }
      }
    }
    return NextResponse.json({ data: null });
  } catch (error) {
    logger.error('Background generation error:', error);
    throw error;
  }
}

async function handleSongIdentification(ai: GoogleGenAI, data: { audio: string }): Promise<NextResponse<ApiResponse>> {
  try {
    if (!data.audio || typeof data.audio !== 'string') {
      return NextResponse.json({ error: 'Invalid audio data' }, { status: 400 });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: 'audio/wav',
                data: data.audio
              }
            },
            {
              text: 'Identify this song. Return ONLY a JSON object with "title", "artist", and "album" fields.'
            }
          ]
        }
      ],
      config: {
        responseMimeType: 'application/json'
      }
    });

    if (response.text) {
      try {
        const parsed = JSON.parse(response.text);
        if (validateSongIdentification(parsed)) {
          return NextResponse.json({ data: parsed });
        }
        logger.warn('Invalid song identification received:', parsed);
      } catch {
        logger.warn('Failed to parse song identification');
      }
    }
    return NextResponse.json({ data: null });
  } catch (error) {
    logger.error('Song identification error:', error);
    throw error;
  }
}

function isValidAction(action: string): action is ApiAction {
  return ['generateVisualConfig', 'generateBackground', 'identifySong'].includes(action);
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.startsWith('demo')) {
      return NextResponse.json(
        { error: 'API Key not configured' },
        { status: 500 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body format' },
        { status: 400 }
      );
    }

    const { action, data } = body as Record<string, unknown>;
    
    if (!action || typeof action !== 'string') {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      );
    }

    if (!isValidAction(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    if (!data || typeof data !== 'object') {
      return NextResponse.json(
        { error: 'Data is required' },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    switch (action) {
      case 'generateVisualConfig':
        return await handleVisualConfig(ai, data as { audio: string });
      case 'generateBackground':
        return await handleBackgroundGeneration(ai, data as { prompt: string });
      case 'identifySong':
        return await handleSongIdentification(ai, data as { audio: string });
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error: unknown) {
    logger.error('API Route Error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
