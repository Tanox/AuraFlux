// File: src\hooks\useAppState.ts | Version: v2.0.6
import { useState, useCallback, useMemo } from 'react';
import { Language, Region } from '../types';
import { TRANSLATIONS } from '../locales';

const getInitialLanguage = (): Language => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('av_v1_language');
    if (saved) return saved as Language;
    
    const navLang = navigator.language;
    if (navLang.startsWith('zh-TW')) return 'zh-TW';
    if (navLang.startsWith('zh')) return 'zh';
    if (navLang.startsWith('pt-BR')) return 'pt-BR';
    if (navLang.startsWith('pt')) return 'pt';
    if (navLang.startsWith('es')) return 'es';
    if (navLang.startsWith('ar')) return 'ar';
    if (navLang.startsWith('fr')) return 'fr';
    if (navLang.startsWith('de')) return 'de';
    if (navLang.startsWith('ja')) return 'ja';
    if (navLang.startsWith('ko')) return 'ko';
    if (navLang.startsWith('ru')) return 'ru';
  }
  return 'en';
};

export const useAppState = () => {
  const [language, _setLanguage] = useState<Language>(getInitialLanguage);
  
  const setLanguage = useCallback((lang: Language | ((prev: Language) => Language)) => {
    _setLanguage(prev => {
      const next = typeof lang === 'function' ? lang(prev) : lang;
      localStorage.setItem('av_v1_language', next);
      return next;
    });
  }, []);

  const [region, setRegion] = useState<Region>('US');
  const [hasStarted, setHasStarted] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [helpModalInitialTab, setHelpModalInitialTab] = useState<'guide' | 'shortcuts' | 'about'>('guide');
  const [isDragging, setIsDragging] = useState(false);

  const t = useMemo(() => TRANSLATIONS[language] || TRANSLATIONS.en, [language]);

  const resetSettings = useCallback(() => {
    localStorage.clear();
    window.location.reload();
  }, []);

  const manageWakeLock = useCallback(async (enabled: boolean) => {
    if (typeof window !== 'undefined' && 'wakeLock' in navigator) {
      try {
        if (enabled) {
          await (navigator as any).wakeLock.request('screen');
        }
      } catch (err: any) {
        if (err.name !== 'NotAllowedError') {
          console.warn('Wake Lock error:', err?.message || err);
        }
      }
    }
  }, []);

  return useMemo(() => ({
    language, setLanguage,
    region, setRegion,
    hasStarted, setHasStarted,
    showHelpModal, setShowHelpModal,
    helpModalInitialTab, setHelpModalInitialTab,
    isDragging, setIsDragging,
    t,
    resetSettings,
    manageWakeLock
  }), [language, setLanguage, region, setRegion, hasStarted, setHasStarted, showHelpModal, setShowHelpModal, helpModalInitialTab, setHelpModalInitialTab, isDragging, setIsDragging, t, resetSettings, manageWakeLock]);
};

