<!-- openspec/06_i18n_storage.md v2.3.4 -->
# 鍥介檯鍖栦笌瀛樺偍绯荤粺瑙勮寖

## 鐗堟湰淇℃伅
- **鐗堟湰**: v2.3.4
- **鏇存柊鏃ユ湡**: 2026-04-19
- **浣滆€?*: Sut

## 1. 鍥介檯鍖?(i18n) 绯荤粺

### 1.1 璇█鏂囦欢缁撴瀯
- **鐩綍**: `src/locales/`
- **鍔熻兘**: 鎻愪緵澶氳瑷€鏀寔

**鏀寔鐨勮瑷€:**
- `en` - 鑻辫
- `zh` - 绠€浣撲腑鏂?- `tw` - 绻佷綋涓枃
- `es` - 瑗跨彮鐗欒
- `ar` - 闃挎媺浼
- `fr` - 娉曡
- `pt` - 钁¤悇鐗欒
- `pt-BR` - 宸磋タ钁¤悇鐗欒
- `de` - 寰疯
- `ja` - 鏃ヨ
- `ko` - 闊╄
- `ru` - 淇勮

**璇█鏂囦欢缁撴瀯:**
- `common.ts` - 閫氱敤鏂囨湰
- `help.ts` - 甯姪鏂囨湰
- `messages.ts` - 娑堟伅鏂囨湰
- `onboarding.ts` - 寮曞鏂囨湰
- `panels.ts` - 闈㈡澘鏂囨湰
- `settings.ts` - 璁剧疆鏂囨湰

### 1.2 鍥介檯鍖栧伐鍏?- **鏂囦欢**: `src/locales/index.ts`
- **鍔熻兘**: 鍥介檯鍖栧伐鍏峰嚱鏁?
**鏍稿績鍔熻兘:**
- 璇█鍒囨崲
- 鏂囨湰缈昏瘧
- RTL 鏀寔
- 璇█妫€娴?
**浠ｇ爜绀轰緥:**
```tsx
// locales/index.ts 鏍稿績缁撴瀯
// File: src/locales/index.ts | Version: v2.3.4
import en from './en';
import zhCN from './zh-CN';
import zhTW from './zh-TW';
import es from './es';
import ar from './ar';
import fr from './fr';
import ptBR from './pt-BR';
import de from './de';
import ja from './ja';
import ko from './ko';
import ru from './ru';

type LocaleType = typeof en;

export const locales = {
  en,
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  es,
  ar,
  fr,
  'pt-BR': ptBR,
  de,
  ja,
  ko,
  ru
};

export const getTranslations = (lang: string): LocaleType => {
  return locales[lang as keyof typeof locales] || en;
};

export const availableLanguages = [
  { value: 'en', label: 'English' },
  { value: 'zh-CN', label: '涓枃 (绠€浣?' },
  { value: 'zh-TW', label: '涓枃 (绻侀珨)' },
  { value: 'es', label: 'Espa帽ol' },
  { value: 'ar', label: '丕賱毓乇亘賷丞' },
  { value: 'fr', label: 'Fran莽ais' },
  { value: 'pt-BR', label: 'Portugu锚s (Brasil)' },
  { value: 'de', label: 'Deutsch' },
  { value: 'ja', label: '鏃ユ湰瑾? },
  { value: 'ko', label: '頃滉淡鞏? },
  { value: 'ru', label: '袪褍褋褋泻懈泄' }
];

export const availableRegions = [
  { value: 'US', label: 'United States' },
  { value: 'CN', label: 'China' },
  { value: 'TW', label: 'Taiwan' },
  { value: 'ES', label: 'Spain' },
  { value: 'AR', label: 'Arab World' },
  { value: 'FR', label: 'France' },
  { value: 'BR', label: 'Brazil' },
  { value: 'DE', label: 'Germany' },
  { value: 'JP', label: 'Japan' },
  { value: 'KR', label: 'Korea' },
  { value: 'RU', label: 'Russia' }
];
```

### 1.3 RTL 鏀寔
- **鍔熻兘**: 闃挎媺浼绛?RTL 璇█鐨勬敮鎸?
**鐗规€?**
- 鑷姩妫€娴?RTL 璇█
- 鐣岄潰甯冨眬鑷姩璋冩暣
- 鏂囨湰鏂瑰悜澶勭悊

## 2. 瀛樺偍绯荤粺

### 2.1 LocalStorage 瀛樺偍
- **鏂囦欢**: `src/hooks/useLocalStorage.ts`
- **鍔熻兘**: 鏈湴瀛樺偍绠＄悊

**鏍稿績鍔熻兘:**
- 鏁版嵁鎸佷箙鍖?- 鍝嶅簲寮忓瓨鍌?- 绫诲瀷瀹夊叏
- 閿欒澶勭悊

**瀛樺偍閿墠缂€:**
- `av_v1_`

**瀛樺偍鐨勬暟鎹?**
- `settings` - 搴旂敤璁剧疆
- `mode` - 瑙嗚妯″紡
- `theme` - 涓婚璁剧疆
- `language` - 璇█璁剧疆
- `onboarded` - 寮曞瀹屾垚鐘舵€?
**浠ｇ爜绀轰緥:**
```tsx
// useLocalStorage.ts 鏍稿績缁撴瀯
// File: src/hooks/useLocalStorage.ts | Version: v2.3.3
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

export const getLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

export const setLocalStorage = <T>(key: string, value: T): void => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
};

export const removeLocalStorage = (key: string): void => {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
  }
};

export const clearLocalStorage = (): void => {
  try {
    window.localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};
```

### 2.2 IndexedDB 瀛樺偍
- **鍔熻兘**: 瀛樺偍澶у瀷鏁版嵁

**鏍稿績鍔熻兘:**
- 瀛樺偍瀹屾暣鐨?`Track` 瀵硅薄
- 瀛樺偍 File Blob 鍜屼笓杈戝皝闈?- 鏀寔绂荤嚎鎭㈠

**鏁版嵁搴撲俊鎭?**
- 鏁版嵁搴撳悕: `AuraFluxDB`
- 瀛樺偍鍐呭: 闊抽鏂囦欢鍜岀浉鍏冲厓鏁版嵁

### 2.3 鎸佷箙鍖栫瓥鐣?
**璁剧疆鎸佷箙鍖?**
- 姣忔 `setSettings` 鎿嶄綔鑷姩鍚屾鍒版湰鍦板瓨鍌?- 搴旂敤鍚姩鏃朵粠鏈湴瀛樺偍鍔犺浇璁剧疆

**鏁版嵁鎸佷箙鍖?**
- 鎾斁鍒楄〃鑷姩鎸佷箙鍖?- 姝屾洸淇℃伅缂撳瓨
- 鐘舵€佹仮澶?
## 3. 绫诲瀷瀹氫箟

### 3.1 鏍稿績绫诲瀷
- **鏂囦欢**: `src/types/index.ts`
- **鍔熻兘**: 瀹氫箟搴旂敤涓娇鐢ㄧ殑绫诲瀷

**涓昏绫诲瀷:**
- `VisualizerMode` - 鍙鍖栨ā寮?- `VisualizerSettings` - 鍙鍖栬缃?- `AudioDevice` - 闊抽璁惧
- `Track` - 闊抽杞ㄩ亾
- `PlaybackMode` - 鎾斁妯″紡
- `SongInfo` - 姝屾洸淇℃伅
- `LyricsStyle` - 姝岃瘝鏍峰紡
