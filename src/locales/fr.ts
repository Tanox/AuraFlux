// File: src\locales\fr.ts
import { common } from './fr/common';
import { onboarding } from './fr/onboarding';
import { panels } from './fr/panels';
import { helpModal } from './fr/help';
import { settings } from './fr/settings';
import { messages } from './fr/messages';

export const fr = {
  common,
  appTitle: "Aura Flux",
  welcomeSubtitle: "Moteur d'Intelligence Synesthésique",
  startExperience: "INITIALISER LE SYSTÈME",
  appVersion: "v2.2.15",
  onboarding,
  ...settings,
  ...panels,
  ...messages,
  helpModal,
};

