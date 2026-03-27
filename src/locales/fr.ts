// File: app/locales/fr.ts | Version: v1.9.85
import { common } from './fr/common';
import { onboarding } from './fr/onboarding';
import { panels } from './fr/panels';
import { helpModal } from './fr/help';
import { settings } from './fr/settings';
import { messages } from './fr/messages';

export const fr = {
  common,
  appVersion: "v1.10.5",
  appTitle: "Aura Flux",
  welcomeSubtitle: "Moteur d'Intelligence Synesthésique",
  startExperience: "INITIALISER LE SYSTÈME",
  onboarding,
  ...settings,
  ...panels,
  ...messages,
  helpModal,
};
