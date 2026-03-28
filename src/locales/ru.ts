// File: src/locales/ru.ts | Version: v2.0.3
import { common } from './ru/common';
import { onboarding } from './ru/onboarding';
import { panels } from './ru/panels';
import { helpModal } from './ru/help';
import { settings } from './ru/settings';
import { messages } from './ru/messages';

export const ru = {
  common,
  appVersion: "v2.0.3",
  appTitle: "Aura Flux",
  welcomeSubtitle: "Движок синестетического интеллекта",
  startExperience: "ИНИЦИАЛИЗАЦИЯ СИСТЕМЫ",
  onboarding,
  ...settings,
  ...panels,
  ...messages,
  helpModal,
};