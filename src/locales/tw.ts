// File: src/locales/tw.ts | Version: v1.9.80
import { common } from './tw/common';
import { onboarding } from './tw/onboarding';
import { panels } from './tw/panels';
import { helpModal } from './tw/help';
import { settings } from './tw/settings';
import { messages } from './tw/messages';

export const tw = {
  common,
  appVersion: "v1.9.80",
  appTitle: "Aura Flux",
  welcomeSubtitle: "通感智能引擎",
  startExperience: "啟動系統",
  onboarding,
  ...settings,
  ...panels,
  ...messages,
  helpModal,
};
