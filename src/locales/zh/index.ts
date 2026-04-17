// File: src\locales\zh\index.ts | Version: v2.3.3 | Updated: 2026-04-16 16:55
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
 * 閸氬牆鑻熼幍鈧張澶岀倳鐠囨垼绁┃鎰煂妞ゅ墎楠囩€电钖?
 * 娴ｈ法鏁?deepMerge 鐟欙絽鍠?messages閵嗕垢anels閵嗕够ettings 娑斿妫块惃鍕倱閸氬秹鏁崘鑼崐閿涘牆顩?hints, config, share 缁涘绱?
 */
export const translations = deepMerge(
  {},
  messages,
  panels,
  settings,
  { common, onboarding, helpModal }
);
