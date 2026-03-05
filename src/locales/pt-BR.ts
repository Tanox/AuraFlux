// File: src/locales/pt-BR.ts | Version: v1.9.85
import { common } from './pt-BR/common';
import { onboarding } from './pt-BR/onboarding';
import { panels } from './pt-BR/panels';
import { helpModal } from './pt-BR/help';
import { settings } from './pt-BR/settings';
import { messages } from './pt-BR/messages';

export const ptBR = {
  common,
  appVersion: "v1.10.5",
  appTitle: "Aura Flux",
  welcomeSubtitle: "Motor de Inteligência Sinestésica",
  startExperience: "INICIALIZAR SISTEMA",
  onboarding,
  ...settings,
  ...panels,
  ...messages,
  helpModal,
};
