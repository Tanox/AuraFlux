// File: src/locales/tw.ts | Version: v1.9.85
import { common } from './tw/common';
import { onboarding } from './tw/onboarding';
import { panels } from './tw/panels';
import { helpModal } from './tw/help';
import { settings } from './tw/settings';
import { messages } from './tw/messages';

export const tw = {
  common,
  appVersion: "v1.10.5",
  appTitle: "Aura Flux",
  welcomeSubtitle: "閫氭劅鏅鸿兘寮曟搸",
  startExperience: "鍟熷嫊绯荤当",
  onboarding,
  ...settings,
  ...panels,
  ...messages,
  helpModal,
};
