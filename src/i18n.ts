import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { TRANSLATIONS } from './locales';

// 从 localStorage 获取保存的语言设置
const getSavedLanguage = (): string => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('av_v1_language');
    if (saved && Object.keys(TRANSLATIONS).includes(saved)) {
      return saved;
    }
  }
  return 'en'; // 默认语言
};

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
    lng: getSavedLanguage(), // 从 localStorage 读取语言设置
    fallbackLng: 'en', // 回退语言
    interpolation: {
      escapeValue: false // React 已经处理了转义
    },
    compatibilityJSON: 'v4', // 兼容 JSON v4
    react: {
      useSuspense: false // 禁用 Suspense，避免加载问题
    }
  });

export default i18n;