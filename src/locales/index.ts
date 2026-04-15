// File: src\locales\index.ts | Version: v2.2.23
import { en } from './en';
import { zh } from './zh';
import { tw } from './tw';
import { es } from './es';
import { ar } from './ar';
import { fr } from './fr';
import { pt } from './pt';
import { ptBR } from './pt-BR';
import { de } from './de';
import { ja } from './ja';
import { ko } from './ko';
import { ru } from './ru';

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

