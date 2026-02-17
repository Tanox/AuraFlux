/**
 * File: app/locales/index.ts
 * Version: v1.9.36
 * Author: Sut
 */

import { Language } from '../types';
import { en } from './en';
import { zh } from './zh';
import { tw } from './tw';
import { ja } from './ja';
import { es } from './es';
import { ko } from './ko';
import { de } from './de';
import { fr } from './fr';
import { ar } from './ar';
import { ru } from './ru';
import { ptBR as pt } from './pt-BR';

export type TranslationSchema = typeof en;

export const TRANSLATIONS: Record<Language, TranslationSchema> = {
  en, zh, tw, ja, es, ko, de, fr, ar, ru, pt
};