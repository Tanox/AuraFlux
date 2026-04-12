// File: src\locales\ar.ts | Version: v2.1.0
import { common } from './ar/common';
import { onboarding } from './ar/onboarding';
import { panels } from './ar/panels';
import { helpModal } from './ar/help';
import { settings } from './ar/settings';
import { messages } from './ar/messages';

export const ar = {
  common,
  appVersion: "v2.0.6",
  appTitle: "Aura Flux",
  welcomeSubtitle: "محرك الذكاء السينسيليتيك",
  startExperience: "تهيئة النظام",
  onboarding,
  ...settings,
  ...panels,
  ...messages,
  helpModal,
};
