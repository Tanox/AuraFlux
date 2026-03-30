// File: src/locales/en.ts | Version: v2.0.7
import { common } from './en/common';
import { onboarding } from './en/onboarding';
import { panels } from './en/panels';
import { helpModal } from './en/help';
import { settings } from './en/settings';
import { messages } from './en/messages';

export const en = {
  common,
  appVersion: "v2.0.7",
  appTitle: "Aura Flux",
  welcomeSubtitle: "Synesthetic Intelligence Engine",
  startExperience: "INITIALIZE SYSTEM",
  onboarding,
  ...settings,
  ...panels,
  ...messages,
  helpModal,
};