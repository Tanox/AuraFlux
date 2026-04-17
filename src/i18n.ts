'use client';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { TRANSLATIONS } from './locales';

// 浠?localStorage 鑾峰彇淇濆瓨鐨勮瑷€璁剧疆
const getSavedLanguage = (): string => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('av_v1_language');
    if (saved && Object.keys(TRANSLATIONS).includes(saved)) {
      return saved;
    }
  }
  return 'en'; // 榛樿璇█
};

// 閰嶇疆 i18next
i18n
  .use(initReactI18next)
  .init({
    resources: Object.entries(TRANSLATIONS).reduce((acc, [lang, translations]) => {
      acc[lang] = {
        translation: translations
      };
      return acc;
    }, {} as Record<string, { translation: any }>),
    lng: getSavedLanguage(), // 浠?localStorage 璇诲彇璇█璁剧疆
    fallbackLng: 'en', // 鍥為€€璇█
    interpolation: {
      escapeValue: false // React 宸茬粡澶勭悊浜嗚浆涔?    },
    compatibilityJSON: 'v4', // 鍏煎 JSON v4
    react: {
      useSuspense: false // 绂佺敤 Suspense锛岄伩鍏嶅姞杞介棶棰?    }
  });

export default i18n;
