// File: app/locales/ko.ts | Version: v1.9.85
import { common } from './ko/common';
import { onboarding } from './ko/onboarding';
import { panels } from './ko/panels';
import { helpModal } from './ko/help';
import { settings } from './ko/settings';
import { messages } from './ko/messages';

export const ko = {
  common,
  appVersion: "v2.3.0",
  appTitle: "Aura Flux",
  welcomeSubtitle: "공감각 인공지능 엔진",
  startExperience: "시스템 초기화",
  onboarding,
  ...settings,
  ...panels,
  ...messages,
  helpModal,
};