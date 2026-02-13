/**
 * File: components/ui/ErrorBoundary.tsx
 * Version: 1.9.2
 * Author: Sut
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { STORAGE_PREFIX } from '../../core/constants';

// Minimal static localization for critical errors
const DICT: any = {
  en: {
    title: "System Error",
    desc: "The visual engine encountered an unexpected state.",
    reload: "Reload Application",
    reset: "Factory Reset Settings",
    confirm: "This will clear all Aura Flux settings and custom text. Continue?"
  },
  zh: {
    title: "系统错误",
    desc: "视觉引擎遇到了意外状态。",
    reload: "重新加载应用",
    reset: "恢复出厂设置",
    confirm: "这将清除所有 Aura Flux 设置和自定义文本。继续吗？"
  },
  ja: {
    title: "システムエラー",
    desc: "ビジュアルエンジンに予期しないエラーが発生しました。",
    reload: "アプリを再読み込み",
    reset: "設定を初期化",
    confirm: "すべての設定がクリアされます。よろしいですか？"
  },
  es: {
    title: "Error del Sistema",
    desc: "El motor visual encontró un estado inesperado.",
    reload: "Recargar Aplicación",
    reset: "Restablecer Ajustes",
    confirm: "¿Esto borrará todos los ajustes. Continuar?"
  },
  ko: {
    title: "시스템 오류",
    desc: "비주얼 엔진에 예기치 않은 오류가 발생했습니다.",
    reload: "앱 다시 로드",
    reset: "설정 초기화",
    confirm: "모든 설정이 초기화됩니다. 계속하시겠습니까?"
  },
  de: {
    title: "Systemfehler",
    desc: "Ein unerwarteter Fehler ist aufgetreten.",
    reload: "App neu laden",
    reset: "Einstellungen zurücksetzen",
    confirm: "Dies löscht alle Einstellungen. Fortfahren?"
  },
  fr: {
    title: "Erreur Système",
    desc: "Le moteur visuel a rencontré une erreur inattendue.",
    reload: "Recharger l'application",
    reset: "Réinitialiser les paramètres",
    confirm: "Cela effacera tous les paramètres. Continuer ?"
  },
  ru: {
    title: "Системная ошибка",
    desc: "В визуальном движке произошла ошибка.",
    reload: "Перезагрузить",
    reset: "Сброс настроек",
    confirm: "Это удалит все настройки. Продолжить?"
  },
  ar: {
    title: "خطأ في النظام",
    desc: "واجه المحرك المرئي حالة غير متوقعة.",
    reload: "إعادة تحميل التطبيق",
    reset: "إعادة تعيين الإعدادات",
    confirm: "سيؤدي هذا إلى مسح جميع الإعدادات. هل تريد المتابعة؟"
  }
};

const getLoc = () => {
  if (typeof navigator === 'undefined') return DICT.en;
  const lang = navigator.language.split('-')[0];
  return DICT[lang] || DICT.en;
};

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary component to catch rendering errors in the visualizer.
 */
export class ErrorBoundary extends Component<Props, State> {
  // @fix: Explicitly declare props to satisfy compiler property existence checks in this environment.
  public declare props: Props;

  // @fix: Explicitly initialize state as a class field to satisfy compiler property existence checks and satisfy TS component requirements.
  public state: State = {
    hasError: false,
    error: null
  };

  /**
   * Handles state update when an error occurs.
   */
  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  /**
   * Logs error information.
   */
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  /**
   * Resets application state by clearing local storage.
   */
  private handleFactoryReset = () => {
    const t = getLoc();
    if (window.confirm(t.confirm)) {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(STORAGE_PREFIX)) localStorage.removeItem(key);
      });
      window.location.reload();
    }
  }

  public render() {
    // @fix: Access state via 'this' safely as ErrorBoundary now correctly extends React.Component.
    const { hasError, error } = this.state;
    const t = getLoc();
    
    if (hasError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center text-white">
          <div className="max-w-md w-full space-y-6 p-8 bg-[#0a0a0c] border border-red-500/30 rounded-3xl shadow-2xl animate-fade-in-up">
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
              <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-black text-red-400 uppercase tracking-widest mb-2">{t.title}</h1>
              <p className="text-white/50 text-xs font-medium">{t.desc}</p>
            </div>
            {error && (
              <div className="text-left bg-black/40 p-4 rounded-xl border border-white/5 overflow-auto max-h-32">
                <code className="text-[10px] font-mono text-red-300/80 block whitespace-pre-wrap break-all">
                  {error.toString()}
                </code>
              </div>
            )}
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => window.location.reload()} 
                className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors uppercase tracking-[0.2em] text-xs"
              >
                {t.reload}
              </button>
              <button 
                onClick={this.handleFactoryReset} 
                className="w-full py-3 bg-red-500/10 text-red-400 font-bold rounded-xl hover:bg-red-500/20 transition-colors uppercase tracking-widest text-[10px]"
              >
                {t.reset}
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    // @fix: Access children from inherited props (now explicitly declared) to ensure compatibility with standard React component patterns.
    return this.props.children || null;
  }
}