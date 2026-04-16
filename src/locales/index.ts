// File: src\locales\index.ts | Version: v2.3.0
// 从每个语言的模块导入所有翻译内容
import { translations as en } from './en';
import { translations as zh } from './zh';

// 为其他语言创建基本翻译结构
export const TRANSLATIONS: Record<string, any> = {
  en,
  zh,
  'zh-TW': zh, // 使用简体中文作为默认
  es: en, // 暂时使用英语作为默认
  ar: en, // 暂时使用英语作为默认
  fr: en, // 暂时使用英语作为默认
  pt: en, // 暂时使用英语作为默认
  'pt-BR': en, // 暂时使用英语作为默认
  de: en, // 暂时使用英语作为默认
  ja: en, // 暂时使用英语作为默认
  ko: en, // 暂时使用英语作为默认
  ru: en, // 暂时使用英语作为默认
};

export type TranslationSchema = typeof en;

