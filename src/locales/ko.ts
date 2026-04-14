// File: src\locales\ko.ts
import { common } from './ko/common';
import { onboarding } from './ko/onboarding';
import { panels } from './ko/panels';
import { helpModal } from './ko/help';
import { settings } from './ko/settings';
import { messages } from './ko/messages';

export const ko = {
  common,
  appTitle: "Aura Flux",
  welcomeSubtitle: "공감각 지능 엔진",
  startExperience: "시스템 초기화",
  appVersion: "v2.2.15",
  onboarding,
  ...settings,
  ...panels,
  ...messages,
  helpModal,
};
