// File: src/locales/en.ts | Version: v1.9.88
import { common } from './en/common';
import { onboarding } from './en/onboarding';
import { panels } from './en/panels';
import { helpModal } from './en/help';
import { settings } from './en/settings';
import { messages } from './en/messages';

export const en = {
  common,
  appVersion: "v1.10.5",
  appTitle: "Aura Flux",
  welcomeSubtitle: "Synesthetic Intelligence Engine",
  startExperience: "INITIALIZE SYSTEM",
  onboarding,
  ...settings,
  ...panels,
  ...messages,
  helpModal,
};
