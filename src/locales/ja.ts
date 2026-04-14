// File: src\locales\ja.ts
import { common } from './ja/common';
import { onboarding } from './ja/onboarding';
import { panels } from './ja/panels';
import { helpModal } from './ja/help';
import { settings } from './ja/settings';
import { messages } from './ja/messages';

export const ja = {
  common,
  appTitle: "Aura Flux",
  welcomeSubtitle: "共感覚知能エンジン",
  startExperience: "システムを初期化",
  appVersion: "v2.2.18",
  onboarding,
  ...settings,
  ...panels,
  ...messages,
  helpModal,
};
