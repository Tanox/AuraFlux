// File: src\locales\ko.ts | Version: v2.0.6
import { common } from './ko/common';
import { onboarding } from './ko/onboarding';
import { panels } from './ko/panels';
import { helpModal } from './ko/help';
import { settings } from './ko/settings';
import { messages } from './ko/messages';

export const ko = {
  common,
  appVersion: "v2.0.6",
  appTitle: "Aura Flux",
  welcomeSubtitle: "시네스테틱 인텔리전스 엔진",
  startExperience: "시스템 초기화",
  onboarding,
  ...settings,
  ...panels,
  ...messages,
  helpModal,
};
