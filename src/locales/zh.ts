// File: app/locales/zh.ts | Version: v1.9.80
import { common } from './zh/common';
import { onboarding } from './zh/onboarding';
import { panels } from './zh/panels';
import { helpModal } from './zh/help';
import { settings } from './zh/settings';
import { messages } from './zh/messages';

export const zh = {
  common,
  appVersion: "v1.9.80",
  appTitle: "Aura Flux",
  welcomeSubtitle: "通感智能引擎",
  startExperience: "启动系统",
  onboarding,
  ...settings,
  ...panels,
  ...messages,
  helpModal,
};