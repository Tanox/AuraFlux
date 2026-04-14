// File: src\locales\de.ts
import { common } from './de/common';
import { onboarding } from './de/onboarding';
import { panels } from './de/panels';
import { helpModal } from './de/help';
import { settings } from './de/settings';
import { messages } from './de/messages';

export const de = {
  common,
  appTitle: "Aura Flux",
  welcomeSubtitle: "Synästhetischer Intelligenz-Motor",
  startExperience: "SYSTEM INITIALISIEREN",
  appVersion: "v2.2.15",
  onboarding,
  ...settings,
  ...panels,
  ...messages,
  helpModal,
};
