// File: src\locales\zh.ts
import { onboarding } from './zh/onboarding';
import { panels } from './zh/panels';
import { helpModal } from './zh/help';
import { settings } from './zh/settings';
import { messages } from './zh/messages';

export const zh = {
  appTitle: "Aura Flux",
  welcomeSubtitle: "联觉智能引擎",
  startExperience: "启动系统",
  appVersion: "v2.2.15",
  onboarding,
  ...settings,
  ...panels,
  ...messages,
  helpModal,
};
