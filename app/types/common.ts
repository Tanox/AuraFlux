/**
 * File: app/types/common.ts
 * Version: v1.9.36
 * Author: Sut
 */

// @fix: Add 'pt' to Language type
export type Language = 'en' | 'zh' | 'tw' | 'ja' | 'es' | 'ko' | 'de' | 'fr' | 'ar' | 'ru' | 'pt';

export type Region = 'global' | 'US' | 'CN' | 'JP' | 'KR' | 'EU' | 'LATAM';

export type Position = 'tl' | 'tc' | 'tr' | 'ml' | 'mc' | 'mr' | 'bl' | 'bc' | 'br';

export type AIProvider = 'GEMINI' | 'OPENAI' | 'GROQ' | 'CLAUDE' | 'DEEPSEEK' | 'QWEN' | 'MOCK';