// File: src\locales\pt-BR.ts
import { common } from './pt-BR/common';
import { onboarding } from './pt-BR/onboarding';
import { panels } from './pt-BR/panels';
import { helpModal } from './pt-BR/help';
import { settings } from './pt-BR/settings';
import { messages } from './pt-BR/messages';

export const ptBR = {
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

