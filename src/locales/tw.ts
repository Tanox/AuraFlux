// File: src\locales\tw.ts | Version: v2.0.6
import { common } from './tw/common';
import { onboarding } from './tw/onboarding';
import { panels } from './tw/panels';
import { helpModal } from './tw/help';
import { settings } from './tw/settings';
import { messages } from './tw/messages';

export const tw = {
  common,
  appVersion: "v2.0.6",
  appTitle: "Aura Flux",
  welcomeSubtitle: "閫氭劅鏅鸿兘寮曟�?,
  startExperience: "鍟熷嫊绯荤当",
  onboarding,
  ...settings,
  ...panels,
  ...messages,
  helpModal,
};

