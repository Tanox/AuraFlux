// File: src\locales\pt.ts v2.2.14
import { common } from './pt/common';
import { onboarding } from './pt/onboarding';
import { panels } from './pt/panels';
import { helpModal } from './pt/help';
import { settings } from './pt/settings';
import { messages } from './pt/messages';

export const pt = {
  common,
  appTitle: "Aura Flux",
  welcomeSubtitle: "Motor de Inteligência Sinestésica",
  startExperience: "INICIALIZAR SISTEMA",
  appVersion: "v2.2.15",
  onboarding,
  ...settings,
  ...panels,
  ...messages,
  helpModal,
};

