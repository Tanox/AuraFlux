// File: src\locales\index.ts | Version: v2.2.23
// 直接从子目录导入语言文件
import { messages as en } from './en/messages';
import { messages as zh } from './zh/messages';
import { messages as tw } from './tw/messages';
import { messages as es } from './es/messages';
import { messages as ar } from './ar/messages';
import { messages as fr } from './fr/messages';
import { messages as pt } from './pt/messages';
import { messages as ptBR } from './pt-BR/messages';
import { messages as de } from './de/messages';
import { messages as ja } from './ja/messages';
import { messages as ko } from './ko/messages';
import { messages as ru } from './ru/messages';

export const TRANSLATIONS: Record<string, any> = {
  en,
  zh,
  'zh-TW': tw,
  es,
  ar,
  fr,
  pt,
  'pt-BR': ptBR,
  de,
  ja,
  ko,
  ru,
};

export type TranslationSchema = typeof en;

