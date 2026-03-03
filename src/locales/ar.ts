// File: src/locales/ar.ts | Version: v1.9.85
import { common } from './ar/common';
import { onboarding } from './ar/onboarding';
import { panels } from './ar/panels';
import { helpModal } from './ar/help';
import { settings } from './ar/settings';
import { messages } from './ar/messages';

export const ar = {
  common,
  appVersion: "v1.9.85",
  appTitle: "Aura Flux",
  welcomeSubtitle: "محرك الذكاء الحسي",
  startExperience: "بدء النظام",
  onboarding,
  ...settings,
  ...panels,
  ...messages,
  helpModal,
};
