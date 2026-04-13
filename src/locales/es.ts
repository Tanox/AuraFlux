// File: src\locales\es.ts
import { common } from './es/common';
import { onboarding } from './es/onboarding';
import { panels } from './es/panels';
import { helpModal } from './es/help';
import { settings } from './es/settings';
import { messages } from './es/messages';

export const es = {
  common,
  appTitle: "Aura Flux",
  welcomeSubtitle: "Motor de Inteligencia Sinestésica",
  startExperience: "INICIALIZAR SISTEMA",
  onboarding,
  ...settings,
  ...panels,
  ...messages,
  helpModal,
};
