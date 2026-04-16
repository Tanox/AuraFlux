// File: src\locales\zh\index.ts | Version: v2.3.0 | Updated: 2026-04-16 16:40
import { messages } from './messages';
import { common } from './common';
import { onboarding } from './onboarding';
import { helpModal } from './help';
import { panels } from './panels';
import { settings } from './settings';

/**
 * 合并所有翻译资源到顶级对象
 * panels 和 settings 展平，使 t('audioPanel.xxx') 等键直接可用
 * helpModal 保持原名，与代码中 t('helpModal.xxx') 调用一致
 */
export const translations = {
  ...messages,
  common,
  onboarding,
  helpModal,
  ...panels,
  ...settings
};
