// File: src\locales\en\index.ts | Version: v2.3.1 | Updated: 2026-04-16 16:55
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
 * 合并所有翻译资源到顶级对象
 * 使用 deepMerge 解决 messages、panels、settings 之间的同名键冲突（如 hints, config, share 等）
 */
export const translations = deepMerge(
  {},
  messages,
  panels,
  settings,
  { common, onboarding, helpModal }
);
