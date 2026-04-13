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
  welcomeSubtitle: "シナエスセティックインテリジェンスエンジン",
  startExperience: "システムを初期化",
  onboarding,
  ...settings,
  ...panels,
  ...messages,
  helpModal,
};
