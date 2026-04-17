// File: src\locales\en\index.ts | Version: v2.3.3 | Updated: 2026-04-16 16:55
import { messages } from './messages';
import { common } from './common';
import { onboarding } from './onboarding';
import { helpModal } from './help';
import { panels } from './panels';
import { settings } from './settings';

function isObject(item: any) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

function deepMerge(target: any, ...sources: any[]): any {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  return deepMerge(target, ...sources);
}

/**
 * 鍚堝苟鎵€鏈夌炕璇戣祫婧愬埌椤剁骇瀵硅薄
 * 浣跨敤 deepMerge 瑙ｅ喅 messages銆乸anels銆乻ettings 涔嬮棿鐨勫悓鍚嶉敭鍐茬獊锛堝 hints, config, share 绛夛級
 */
export const translations = deepMerge(
  {},
  messages,
  panels,
  settings,
  { common, onboarding, helpModal }
);
