// File: app/locales/es.ts | Version: v1.9.85
import { common } from './es/common';
import { onboarding } from './es/onboarding';
import { panels } from './es/panels';
import { helpModal } from './es/help';
import { settings } from './es/settings';
import { messages } from './es/messages';

export const es = {
  common,
  appVersion: "v1.9.85",
  appTitle: "Aura Flux",
  welcomeSubtitle: "Motor de Inteligencia Sinestésica",
  startExperience: "INICIALIZAR SISTEMA",
  onboarding,
  ...settings,
  ...panels,
  ...messages,
  helpModal,
};