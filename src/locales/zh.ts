// File: src\locales\zh.ts
import { common } from './zh/common';
import { onboarding } from './zh/onboarding';
import { panels } from './zh/panels';
import { helpModal } from './zh/help';
import { settings } from './zh/settings';
import { messages } from './zh/messages';

export const zh = {
  common,
  appTitle: "Aura Flux",
  welcomeSubtitle: "联觉智能引擎",
  startExperience: "启动系统",
  appVersion: "v2.2.18",
  onboarding,
  ...settings,
  ...panels,
  ...messages,
  helpModal,
};
