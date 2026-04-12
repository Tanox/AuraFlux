// File: src\locales\fr.ts | Version: v2.1.0
import { common } from './fr/common';
import { onboarding } from './fr/onboarding';
import { panels } from './fr/panels';
import { helpModal } from './fr/help';
import { settings } from './fr/settings';
import { messages } from './fr/messages';

export const fr = {
  common,
  appVersion: "v2.0.6",
  appTitle: "Aura Flux",
  welcomeSubtitle: "Moteur d'Intelligence Synesth茅sique",
  startExperience: "INITIALISER LE SYST脠ME",
  onboarding,
  ...settings,
  ...panels,
  ...messages,
  helpModal,
};

