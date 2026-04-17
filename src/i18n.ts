'use client';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { TRANSLATIONS } from './locales';

const getSavedLanguage = (): string => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('av_v1_language');
    if (saved && Object.keys(TRANSLATIONS).includes(saved)) {
      return saved;
    }
  }
  return 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources: Object.entries(TRANSLATIONS).reduce((acc, [lang, translations]) => {
      acc[lang] = { translation: translations };
      return acc;
    }, {} as Record<string, { translation: any }>),
    lng: getSavedLanguage(),
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    compatibilityJSON: 'v4',
    react: { useSuspense: false }
  });

export default i18n;