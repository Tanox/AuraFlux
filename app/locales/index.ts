// File: app/locales/index.ts | Version: v1.9.72
import { Language } from '../types/index.ts';
import { en } from './en.ts';
import { zh } from './zh.ts';
import { tw } from './tw.ts';
import { ja } from './ja.ts';
import { es } from './es.ts';
import { ko } from './ko.ts';
import { de } from './de.ts';
import { fr } from './fr.ts';
import { ar } from './ar.ts';
import { ru } from './ru.ts';
import { ptBR as pt } from './pt-BR.ts';

export type TranslationSchema = typeof en;

export const TRANSLATIONS: Record<Language, TranslationSchema> = {
  en, zh, tw, ja, es, ko, de, fr, ar, ru, pt
};