<!-- openspec/22_api_routes.md v2.3.11 -->
# API 路由规范

## 版本信息
- **版本**: v2.3.11
- **更新日期**: 2026-05-21
- **作者**: Sut

## 目录

1. [API 路由概述](#1-api-路由概述)
2. [健康检查端点](#2-健康检查端点)
3. [主 API 端点](#3-主-api-端点)
4. [请求与响应格式](#4-请求与响应格式)
5. [限流机制](#5-限流机制)
6. [数据验证](#6-数据验证)
7. [错误处理](#7-错误处理)
8. [使用示例](#8-使用示例)

---

## 1. API 路由概述

### 1.1 路由结构

```
src/app/api/
├── gemini/
│   ├── route.ts
│   └── health/
│       └── route.ts
```

### 1.2 文件位置

| 路由 | 文件 | 方法 | 功能 |
|------|------|------|
| /api/gemini | src/app/api/gemini/route.ts | POST | 主 API 端点 |
| /api/gemini/health | src/app/api/gemini/health/route.ts | GET | 健康检查 |

---

## 2. 健康检查端点

### 2.1 端点信息

- **路径**: `/api/gemini/health`
- **方法**: `GET`
- **无需认证**

### 2.2 请求格式

无请求参数。

### 2.3 响应格式

#### 成功响应（服务可用）

```json
{
  "available": true
}
```

**状态码**: 200

#### 失败响应（服务不可用）

```json
{
  "available": false
}
```

**状态码**: 503

### 2.4 实现代码

```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.startsWith('demo')) {
    return NextResponse.json({ available: false }, { status: 503 });
  }
  return NextResponse.json({ available: true });
}
```

### 2.5 使用示例

```typescript
// 健康检查
async function checkApiAvailability() {
  try {
    const response = await fetch('/api/gemini/health');
    const data = await response.json();
    
    if (data.available) {
      console.log('AI 服务可用');
    } else {
      console.log('AI 服务不可用');
    }
  } catch (error) {
    console.error('健康检查失败:', error);
  }
}
```

---

## 3. 主 API 端点

### 3.1 端点信息

- **路径**: `/api/gemini`
- **方法**: `POST`
- **Content-Type**: `application/json`

### 3.2 支持的操作

| Action | 功能 |
|--------|------|
| generateVisualConfig | 从音频生成可视化配置 |
| generateBackground | 生成艺术背景 |
| identifySong | 识别歌曲 |

---

## 4. 请求与响应格式

### 4.1 请求格式

```typescript
interface ApiRequest {
  action: 'generateVisualConfig' | 'generateBackground' | 'identifySong';
  data: {
    audio?: string;      // Base64 编码的音频数据
    prompt?: string;   // 用于生成背景的提示词
  };
}
```

### 4.2 响应格式

```typescript
interface ApiResponse {
  data?: unknown;
  error?: string;
}
```

---

## 5. 限流机制

### 5.1 限流配置

| 配置项 | 值 | 说明 |
|--------|-----|------|
| RATE_LIMIT_WINDOW | 60000ms | 时间窗口 1 分钟 |
| MAX_REQUESTS_PER_WINDOW | 10 | 每个窗口最大请求数 |

### 5.2 实现原理

```typescript
// 内存限流（生产环境建议使用 Redis）
const requestCounts = new Map<string, { count: number; resetTime: number }>();

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
```

### 5.3 限流响应

```json
{
  "error": "Rate limit exceeded"
}
```

**状态码**: 429

---

## 6. 数据验证

### 6.1 可视化配置验证

```typescript
const VALID_MODES = new Set([
  VisualizerMode.DIGITAL_GRID,
  VisualizerMode.SILK_WAVE,
  VisualizerMode.OCEAN_WAVE,
  VisualizerMode.NEURAL_FLOW,
  VisualizerMode.CUBE_FIELD,
  VisualizerMode.KINETIC_WALL,
  VisualizerMode.LASERS
]);

function validateVisualConfig(config: unknown): config is VisualConfig {
  if (!config || typeof config !== 'object') return false;
  const c = config as Record<string, unknown>;
  if (!('mode' in c) || typeof c.mode !== 'string' || !VALID_MODES.has(c.mode as VisualizerMode)) return false;
  if (!('colors' in c) || !Array.isArray(c.colors) || c.colors.length < 3) return false;
  if (!('sensitivity' in c) || typeof c.sensitivity !== 'number' || c.sensitivity < 0.5 || c.sensitivity > 2.0) return false;
  return true;
}
```

**有效响应示例：

```json
{
  "data": {
    "mode": "DIGITAL_GRID",
    "colors": ["#00ffff", "#ff00ff", "#ffff00"],
    "sensitivity": 1.5
  }
}
```

### 6.2 歌曲识别验证

```typescript
function validateSongIdentification(identification: unknown): identification is SongIdentification {
  if (!identification || typeof identification !== 'object') return false;
  const i = identification as Record<string, unknown>;
  if (!('title' in i) || typeof i.title !== 'string') return false;
  if (!('artist' in i) || typeof i.artist !== 'string') return false;
  return true;
}
```

有效响应示例：

```json
{
  "data": {
    "title": "Song Title",
    "artist": "Artist Name",
    "album": "Album Name"
  }
}
```

---

## 7. 错误处理

### 7.1 错误响应格式

```typescript
{
  "error": "Error message here"
}
```

### 7.2 状态码

| 状态码 | 说明 |
|--------|------|
| 400 | 无效的请求 |
| 429 | 超过请求频率限制 |
| 500 | 服务器内部错误 |
| 503 | 服务不可用（健康检查） |

### 7.3 常见错误

| 错误 | 状态码 | 说明 |
|------|--------|------|
| Invalid audio data | 400 | 无效的音频数据 |
| Invalid prompt | 400 | 无效的提示词 |
| Invalid JSON in request body | 400 | 请求体 JSON 格式无效 |
| Action is required | 400 | 缺少 action 参数 |
| Invalid action | 400 | 无效的 action 值 |
| Data is required | 400 | 缺少 data 参数 |
| API Key not configured | 500 | API 密钥未配置 |
| Rate limit exceeded | 429 | 超过请求频率限制 |

---

## 8. 使用示例

### 8.1 生成可视化配置

```typescript
async function generateVisualConfig(audioBase64: string) {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'generateVisualConfig',
        data: {
          audio: audioBase64
        }
      })
    });

    const result = await response.json();
    
    if (result.error) {
      console.error('Error:', result.error);
      return null;
    }
    
    if (result.data) {
      const config = result.data as VisualConfig;
      console.log('Visual config:', config);
      return config;
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
}
```

### 8.2 生成背景

```typescript
async function generateBackground(prompt: string) {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'generateBackground',
        data: {
          prompt
        }
      })
    });

    const result = await response.json();
    
    if (result.error) {
      console.error('Error:', result.error);
      return null;
    }
    
    if (result.data) {
      const imageData = result.data as string;
      console.log('Generated image:', imageData);
      return imageData;
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
}
```

### 8.3 识别歌曲

```typescript
async function identifySong(audioBase64: string) {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'identifySong',
        data: {
          audio: audioBase64
        }
      })
    });

    const result = await response.json();
    
    if (result.error) {
      console.error('Error:', result.error);
      return null;
    }
    
    if (result.data) {
      const songInfo = result.data as SongIdentification;
      console.log('Identified song:', songInfo);
      return songInfo;
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
}
```

### 8.4 React Hook 封装

```typescript
import { useState } from 'react';

export function useGeminiApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callApi = async (action: ApiAction, data: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          data
        })
      });

      const result = await response.json();
      
      if (result.error) {
        setError(result.error);
        return null;
      }
      
      return result.data;
    } catch (err) {
      setError('Request failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    generateVisualConfig: (audio: string) => 
      callApi('generateVisualConfig', { audio }),
    generateBackground: (prompt: string) => 
      callApi('generateBackground', { prompt }),
    identifySong: (audio: string) => 
      callApi('identifySong', { audio }),
  };
}
```

---

## 附录 A: 完整实现

### A.1 主 API 路由

```typescript
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

const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60000;
const MAX_REQUESTS_PER_WINDOW = 10;

function checkRateLimit(ip: string): boolean {
  // 实现略...
}

function validateVisualConfig(config: unknown): config is VisualConfig {
  // 实现略...
}

function validateSongIdentification(identification: unknown): identification is SongIdentification {
  // 实现略...
}

async function handleVisualConfig(ai: GoogleGenAI, data: { audio: string }): Promise<NextResponse<ApiResponse>> {
  try {
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
              text: 'Analyze this audio and suggest a visualizer configuration...'
            }
          ]
        }
      ],
      config: {
        responseMimeType: 'application/json'
      }
    });

    if (response.text) {
      const parsed = JSON.parse(response.text);
      if (validateVisualConfig(parsed)) {
        return NextResponse.json({ data: parsed });
      }
    }
    return NextResponse.json({ data: null });
  } catch (error) {
    logger.error('Visual config generation error:', error);
    throw error;
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.startsWith('demo')) {
      return NextResponse.json({ error: 'API Key not configured' }, { status: 500 });
    }

    const body = await request.json();
    const { action, data } = body as Record<string, unknown>;

    const ai = new GoogleGenAI({ apiKey });

    switch (action as ApiAction) {
      case 'generateVisualConfig':
        return await handleVisualConfig(ai, data as { audio: string });
      case 'generateBackground':
        return await handleBackgroundGeneration(ai, data as { prompt: string });
      case 'identifySong':
        return await handleSongIdentification(ai, data as { audio: string });
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: unknown) {
    logger.error('API Route Error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
```
