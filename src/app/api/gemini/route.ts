import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// 简单的内存限流（生产环境建议使用 Redis）
const requestCounts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = requestCounts.get(ip);
  
  if (!limit || now > limit.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + 60000 }); // 1分钟
    return true;
  }
  
  if (limit.count >= 10) { // 每分钟最多10次
    return false;
  }
  
  limit.count++;
  return true;
}

async function handleVisualConfig(ai: any, data: { audio: string }) {
  const model = ai.getGenerativeModel({ model: 'gemini-3-flash-preview' });
  const response = await model.generateContent({
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
    generationConfig: {
      responseMimeType: 'application/json'
    }
  });

  if (response.response?.text) {
    return NextResponse.json({ data: JSON.parse(response.response.text) });
  }
  return NextResponse.json({ data: null });
}

async function handleBackgroundGeneration(ai: any, data: { prompt: string }) {
  const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash-image' });
  const response = await model.generateContent({
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
    generationConfig: {
      aspectRatio: "16:9",
      imageSize: "1K"
    }
  });

  for (const part of response.response?.candidates?.[0]?.content?.parts || []) {
    if ('inlineData' in part) {
      return NextResponse.json({
        data: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`
      });
    }
  }
  return NextResponse.json({ data: null });
}

async function handleSongIdentification(ai: any, data: { audio: string }) {
  const model = ai.getGenerativeModel({ model: 'gemini-3-flash-preview' });
  const response = await model.generateContent({
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
    generationConfig: {
      responseMimeType: 'application/json'
    }
  });

  if (response.response?.text) {
    return NextResponse.json({ data: JSON.parse(response.response.text) });
  }
  return NextResponse.json({ data: null });
}

export async function POST(request: NextRequest) {
  try {
    // 限流检查
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

    const body = await request.json();
    const { action, data } = body;

    const ai = new GoogleGenAI({ apiKey });

    switch (action) {
      case 'generateVisualConfig':
        return await handleVisualConfig(ai, data);
      case 'generateBackground':
        return await handleBackgroundGeneration(ai, data);
      case 'identifySong':
        return await handleSongIdentification(ai, data);
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
