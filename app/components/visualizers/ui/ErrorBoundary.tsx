// File: app/components/visualizers/ui/ErrorBoundary.tsx | Version: v1.9.72
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { STORAGE_PREFIX } from '../../../constants/index.ts';

// Minimal static localization for critical errors
const DICT: any = {
  en: {
    title: "System Interruption",
    desc: "The visual logic engine encountered an unhandled state exception.",
    reload: "Re-Initiate Application",
    reset: "Hard Factory Reset",
    confirm: "CRITICAL: This will flush all Aura Flux settings and presets. Proceed?"
  },
  zh: {
    title: "系统逻辑中断",
    desc: "视觉引擎遇到了未处理的状态异常。",
    reload: "重新启动应用",
    reset: "强制恢复出厂设置",
    confirm: "警告：这将清除所有 Aura Flux 预设与配置。确定继续吗？"
  },
  tw: {
    title: "系統邏輯中斷",
    desc: "視覺引擎遇到了未處理的狀態異常。",
    reload: "重新啟動應用",
    reset: "強制恢復出廠設置",
    confirm: "警告：這將清除所有 Aura Flux 預設與配置。確定繼續嗎？"
  },
  ja: {
    title: "システム・エラー",
    desc: "ビジュアル・ロジック・エンジンで未処理の例外が発生しました。",
    reload: "アプリを再起動",
    reset: "工場出荷時リセット",
    confirm: "警告: すべての Aura Flux 設定とプリセットが削除されます。続行しますか？"
  },
  es: {
    title: "Interrupción del Sistema",
    desc: "El motor de lógica visual encontró una excepción de estado no manejada.",
    reload: "Reiniciar Aplicación",
    reset: "Reseteo de Fábrica",
    confirm: "CRÍTICO: Esto borrará todos los ajustes y presets de Aura Flux. ¿Continuar?"
  },
  ko: {
    title: "시스템 논리 중단",
    desc: "비주얼 엔진이 처리되지 않은 상태 예외를 발견했습니다.",
    reload: "애플리케이션 재시작",
    reset: "공장 초기화",
    confirm: "경고: 모든 Aura Flux 설정과 프리셋이 삭제됩니다. 계속하시겠습니까?"
  },
  de: {
    title: "System-Unterbrechung",
    desc: "Die visuelle Logik-Engine hat eine unbehandelte Ausnahme gefunden.",
    reload: "Anwendung neu starten",
    reset: "Werksreset durchführen",
    confirm: "KRITISCH: Dies wird alle Aura Flux Einstellungen und Presets löschen. Fortfahren?"
  },
  fr: {
    title: "Interruption Système",
    desc: "Le moteur visuel a rencontré une exception d'état non gérée.",
    reload: "Redémarrer l'Application",
    reset: "Réinitialisation Totale",
    confirm: "CRITIQUE : Cela effacera tous les réglages et préréglages Aura Flux. Continuer ?"
  },
  ru: {
    title: "Системный сбой",
    desc: "Визуальный движок обнаружил необработанное исключение состояния.",
    reload: "Перезагрузить приложение",
    reset: "Сброс к заводским настройкам",
    confirm: "КРИТИЧЕСКИ: Это удалит все настройки и пресеты Aura Flux. Продолжить?"
  },
  ar: {
    title: "انقطاع النظام",
    desc: "واجه محرك المنطق المرئي استثناءً غير معالج.",
    reload: "إعادة تشغيل التطبيق",
    reset: "إعادة تعيين المصنع",
    confirm: "هام: سيؤدي هذا إلى مسح جميع إعدادات Aura Flux. هل تريد الاستمرار؟"
  },
  pt: {
    title: "Interrupção do Sistema",
    desc: "O motor lógico visual encontrou uma exceção de estado não tratada.",
    reload: "Reiniciar Aplicação",
    reset: "Reset de Fábrica",
    confirm: "CRÍTICO: Isso limpará todas as configurações e predefinições do Aura Flux. Continuar?"
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
  public declare props: Props;
  public state: State = { hasError: false, error: null };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Aura Flux Uncaught Error:', error, errorInfo);
  }

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
    const { hasError, error } = this.state;
    const t = getLoc();
    
    if (hasError) {
      return (
        <div id="error-boundary-screen" className="min-h-screen bg-black flex items-center justify-center p-6 text-center text-white">
          <div className="max-w-md w-full space-y-6 p-8 bg-[#0a0a0c] border border-red-500/30 rounded-3xl shadow-2xl animate-fade-in-up">
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
              <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.334-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
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
                className="w-full py-3 bg-red-500/5 text-red-400/60 font-bold rounded-xl hover:bg-red-500/10 transition-all uppercase tracking-widest text-[9px] border border-red-500/10"
              >
                {t.reset}
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    return this.props.children || null;
  }
}