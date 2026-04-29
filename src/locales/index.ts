// src/locales/index.ts v2.3.8
import { translations as en } from './en';
import { translations as zh } from './zh';
import { translations as es } from './es';

// 涓哄叾浠栬瑷€鍒涘缓鍩烘湰缈昏瘧缁撴瀯
export const TRANSLATIONS: Record<string, any> = {
  en,
  zh,
  'zh-TW': zh, // 浣跨敤绠€浣撲腑鏂囦綔涓洪粯璁?
  es,
  ar: en, // 鏆傛椂浣跨敤鑻辫浣滀负榛樿
  fr: en, // 鏆傛椂浣跨敤鑻辫浣滀负榛樿
  pt: en, // 鏆傛椂浣跨敤鑻辫浣滀负榛樿
  'pt-BR': en, // 鏆傛椂浣跨敤鑻辫浣滀负榛樿
  de: en, // 鏆傛椂浣跨敤鑻辫浣滀负榛樿
  ja: en, // 鏆傛椂浣跨敤鑻辫浣滀负榛樿
  ko: en, // 鏆傛椂浣跨敤鑻辫浣滀负榛樿
  ru: en, // 鏆傛椂浣跨敤鑻辫浣滀负榛樿
};

export type TranslationSchema = typeof en;

