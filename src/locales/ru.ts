// File: src\locales\ru.ts
import { common } from './ru/common';
import { onboarding } from './ru/onboarding';
import { panels } from './ru/panels';
import { helpModal } from './ru/help';
import { settings } from './ru/settings';
import { messages } from './ru/messages';

export const ru = {
  common,
  appTitle: "Aura Flux",
  welcomeSubtitle: "Синэстетический интеллектуальный движок",
  startExperience: "ИНИЦИАЛИЗИРОВАТЬ СИСТЕМУ",
  appVersion: "v2.2.18",
  onboarding,
  ...settings,
  ...panels,
  ...messages,
  helpModal,
};

