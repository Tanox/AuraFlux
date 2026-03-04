// File: app/locales/de.ts | Version: v1.9.85
import { common } from './de/common';
import { onboarding } from './de/onboarding';
import { panels } from './de/panels';
import { helpModal } from './de/help';
import { settings } from './de/settings';
import { messages } from './de/messages';

export const de = {
  common,
  appVersion: "v1.9.88",
  appTitle: "Aura Flux",
  welcomeSubtitle: "Synästhetische Intelligenz-Engine",
  startExperience: "SYSTEM INITIALISIEREN",
  onboarding,
  ...settings,
  ...panels,
  ...messages,
  helpModal,
};