// File: src/locales/ja.ts | Version: v2.0.3
import { common } from './ja/common';
import { onboarding } from './ja/onboarding';
import { panels } from './ja/panels';
import { helpModal } from './ja/help';
import { settings } from './ja/settings';
import { messages } from './ja/messages';

export const ja = {
  common,
  appVersion: "v2.0.3",
  appTitle: "Aura Flux",
  welcomeSubtitle: "共感覚インテリジェンス・エンジン",
  startExperience: "システムを初期化",
  onboarding,
  ...settings,
  ...panels,
  ...messages,
  helpModal,
};