// File: src\locales\ar.ts
import { common } from './ar/common';
import { onboarding } from './ar/onboarding';
import { panels } from './ar/panels';
import { helpModal } from './ar/help';
import { settings } from './ar/settings';
import { messages } from './ar/messages';

export const ar = {
  common,
  appTitle: "Aura Flux",
  welcomeSubtitle: "محرك الذكاء الإحساسي",
  startExperience: "تهيئة النظام",
  appVersion: "v2.2.18",
  onboarding,
  ...settings,
  ...panels,
  ...messages,
  helpModal,
};
