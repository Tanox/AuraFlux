// File: src\locales\zh\index.ts | Version: v2.2.26
import { messages } from './messages';
import { common } from './common';
import { onboarding } from './onboarding';
import { helpModal } from './help';
import { panels } from './panels';
import { settings } from './settings';

export const translations = {
  ...messages,
  common,
  onboarding,
  help: helpModal,
  panels,
  settings
};
