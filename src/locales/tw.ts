// File: src\locales\tw.ts | Version: v2.1.0
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
  welcomeSubtitle: "通感智能引擎",
  startExperience: "初始化系统",
  onboarding,
  ...settings,
  ...panels,
  ...messages,
  helpModal,
};

