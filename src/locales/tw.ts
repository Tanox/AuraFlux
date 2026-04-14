// File: src\locales\tw.ts
import { common } from './tw/common';
import { onboarding } from './tw/onboarding';
import { panels } from './tw/panels';
import { helpModal } from './tw/help';
import { settings } from './tw/settings';
import { messages } from './tw/messages';

export const tw = {
  common,
  appTitle: "Aura Flux",
  welcomeSubtitle: "聯覺智能引擎",
  startExperience: "啟動系統",
  appVersion: "v2.2.18",
  onboarding,
  ...settings,
  ...panels,
  ...messages,
  helpModal,
};

