import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { TRANSLATIONS } from './locales';

// 配置 i18next
i18n
  .use(initReactI18next)
  .init({
    resources: Object.entries(TRANSLATIONS).reduce((acc, [lang, translations]) => {
      acc[lang] = {
        translation: translations
      };
      return acc;
    }, {} as Record<string, { translation: any }>),
    lng: 'en', // 默认语言
    fallbackLng: 'en', // 回退语言
    interpolation: {
      escapeValue: false // React 已经处理了转义
    },
    compatibilityJSON: 'v3' // 兼容 JSON v3
  });

export default i18n;