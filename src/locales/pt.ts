// File: src\locales\pt.ts | Version: v2.1.1
import { common } from './pt/common';
import { onboarding } from './pt/onboarding';
import { panels } from './pt/panels';
import { helpModal } from './pt/help';
import { settings } from './pt/settings';
import { messages } from './pt/messages';

export const pt = {
  common,
  appVersion: "v2.0.6",
  appTitle: "Aura Flux",
  welcomeSubtitle: "Motor de Intelig锚ncia Sinest茅sica",
  startExperience: "INICIALIZAR SISTEMA",
  onboarding,
  ...settings,
  ...panels,
  ...messages,
  helpModal,
};

