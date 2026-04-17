<!-- openspec/01_core_architecture.md v2.3.2 -->
# 鏍稿績鏋舵瀯瑙勮寖

## 1. 搴旂敤鍏ュ彛缁撴瀯

### 1.1 涓诲簲鐢ㄧ粍浠?(App.tsx)
- **鏂囦欢**: `src/components/App.tsx`
- **鐗堟湰**: v2.3.2
- **鍔熻兘**: 搴旂敤鐨勯《灞傚叆鍙ｇ粍浠?
**鏍稿績鐗规€?**
- 鏀寔瀹㈡埛绔覆鏌?(`'use client'`)
- 浣跨敤 `AppProvider` 鎻愪緵鍏ㄥ眬鐘舵€佺鐞?- 瀹炵幇鎳掑姞杞藉拰 `Suspense` 浼樺寲
- 鍖呭惈娆㈣繋灞忓箷鍜屽紩瀵艰鐩栧眰
- 鏀寔鏂囦欢鎷栨斁瀵煎叆
- 鍝嶅簲寮忎富棰樺垏鎹?- 鐗堟湰妫€鏌ュ拰鏇存柊鎻愮ず
- 鍞ら啋閿佺鐞?
**涓昏缁勪欢:**
- `WelcomeScreen` - 鍒濆娆㈣繋鐣岄潰
- `OnboardingOverlay` - 棣栨浣跨敤寮曞
- `HelpModal` - 甯姪妯℃€佹
- `SongOverlay` - 姝屾洸淇℃伅瑕嗙洊灞?- `LyricsOverlay` - 姝岃瘝鏄剧ず瑕嗙洊灞?- `CustomTextOverlay` - 鑷畾涔夋枃鏈鐩栧眰
- `FPSCounter` - 甯х巼璁℃暟鍣?- `VisualizerCanvas` - 2D 鍙鍖栫敾甯?- `ThreeVisualizer` - 3D 鍙鍖栧満鏅?- `Controls` - 鎺у埗鐣岄潰

**鐘舵€佺鐞?**
- `isExpanded` - 鎺у埗鐣岄潰灞曞紑鐘舵€?- `onboarded` - 寮曞瀹屾垚鐘舵€侊紙鎸佷箙鍖栧埌 localStorage锛?- `isIdle` - 绌洪棽鐘舵€侊紙鐢ㄤ簬鑷姩闅愯棌 UI锛?
**浜嬩欢澶勭悊:**
- 鎷栨斁鏂囦欢瀵煎叆
- 鍙屽嚮鍏ㄥ睆
- 鐗堟湰鏇存柊鎻愮ず
- 鎵嬪娍鏀寔

**浠ｇ爜绀轰緥:**
```tsx
// App.tsx 鏍稿績缁撴瀯
'use client';
// File: src/components/App.tsx | Version: v2.3.3
import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { AppProvider, useUI, useVisuals, useAudioContext, useAI } from '@/context/AppContext';
import { WelcomeScreen } from '@/components/visualizers/ui/WelcomeScreen';
import { OnboardingOverlay } from '@/components/visualizers/ui/onboarding/OnboardingOverlay';
import { HelpModal } from '@/components/visualizers/ui/HelpModal';
import SongOverlay from '@/components/visualizers/ui/SongOverlay';
import LyricsOverlay from '@/components/visualizers/ui/LyricsOverlay';
import CustomTextOverlay from '@/components/visualizers/ui/CustomTextOverlay';
import { FPSCounter } from '@/components/visualizers/ui/FPSCounter';
import { useIdleTimer } from '@/hooks/useIdleTimer';
import { useMobileGestures } from '@/hooks/useMobileGestures';
import { useVersionCheck } from '@/hooks/useVersionCheck';
import { APP_VERSION } from '@/constants/version';

const VisualizerCanvas = dynamic(() => import('@/components/visualizers/VisualizerCanvas'), { ssr: false });
const ThreeVisualizer = dynamic(() => import('@/components/visualizers/ThreeVisualizer'), { ssr: false });
const Controls = dynamic(() => import('@/components/controls/Controls'), { ssr: false });

const MainContent: React.FC = () => {
  const ui = useUI();
  const visuals = useVisuals();
  const audio = useAudioContext();
  const ai = useAI();

  const [isExpanded, setIsExpanded] = useState(false);
  const [onboarded, setOnboarded] = useState(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('av_v1_onboarded');
    }
    return false;
  });

  const { isIdle } = useIdleTimer(isExpanded, visuals?.settings?.autoHideUi);
  const gestures = useMobileGestures();

  // Version check logic
  useVersionCheck(APP_VERSION, (newVersion) => {
    if (ui) {
      ui.showToast(`${ui.t?.common?.updateAvailable || 'New version available'} (${newVersion}). Please refresh.`, 'info', 5000, 'top');
    }
  });

  useEffect(() => {
    if (visuals?.settings?.wakeLock && ui) ui.manageWakeLock(true);
    return () => { if (ui) ui.manageWakeLock(false); };
  }, [visuals?.settings?.wakeLock, ui]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (visuals?.settings?.appTheme === 'light') {
          root.classList.remove('dark');
      } else {
          root.classList.add('dark');
      }
    }
  }, [visuals?.settings?.appTheme]);

  if (!ui || !visuals || !audio || !ai) return null;

  const { 
      hasStarted, language, setLanguage, manageWakeLock, 
      showHelpModal, setShowHelpModal, helpModalInitialTab, 
      isDragging, setIsDragging, t, 
      toggleFullscreen
  } = ui;
  
  const { mode, colorTheme, settings, setSettings, isThreeMode } = visuals;
  const { analyser, analyserR, currentSong, importFiles } = audio;
  const { showLyrics, lyricsStyle, performIdentification } = ai;
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.types.includes('Files')) setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const audioFiles = Array.from(e.dataTransfer.files as FileList).filter((file: File) => file.type.startsWith('audio/'));
      if (audioFiles.length > 0) importFiles(audioFiles);
    }
  };

  const handleRetryIdentification = () => {
      const stream = audio.mediaStream;
      if (performIdentification && stream) {
          performIdentification(stream);
      }
  };

  if (!hasStarted) return <WelcomeScreen />;
  if (!onboarded) return <OnboardingOverlay language={language} setLanguage={setLanguage} onComplete={() => { setOnboarded(true); localStorage.setItem('av_v1_onboarded', 'true'); }} />;

  return (
    <div 
      id="app-root"
      className={`absolute inset-0 bg-white dark:bg-black select-none overflow-hidden transition-all duration-700 ${isDragging ? 'ring-4 ring-blue-500 ring-inset' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      {...gestures}
    >
      {isDragging && (
          <div id="drag-overlay" className="absolute inset-0 bg-blue-500/20 backdrop-blur-sm flex items-center justify-center pointer-events-none z-50">
            <p className="text-white font-bold text-2xl drop-shadow-lg">{t.common.dropFiles}</p>
          </div>
      )}
      <div
        id="visualizer-container"
        className="visualizer-container w-full h-full relative"
        onDoubleClick={settings?.doubleClickFullscreen ? toggleFullscreen : undefined}
      >
        <Suspense fallback={null}>
          {isThreeMode ? (
            analyser && settings ? (
              <ThreeVisualizer analyser={analyser} analyserR={analyserR} colors={colorTheme} settings={settings} mode={mode} />
            ) : (
              <div className="w-full h-full bg-black" />
            )
          ) : (
            <VisualizerCanvas analyser={analyser} analyserR={analyserR} colors={colorTheme} settings={settings} mode={mode} />
          )}
        </Suspense>
      </div>
      {showHelpModal && <HelpModal onClose={() => setShowHelpModal(false)} initialTab={helpModalInitialTab} />}
      <SongOverlay song={currentSong} isVisible={settings.showSongInfo} language={language} onRetry={handleRetryIdentification} onClose={() => setSettings((s: any) => ({...s, showSongInfo: false}))} analyser={analyser} sensitivity={settings.sensitivity} showAlbumArt={settings.showAlbumArtOverlay} />
      <LyricsOverlay settings={settings} song={currentSong} showLyrics={showLyrics} lyricsStyle={lyricsStyle} analyser={analyser} />
      <CustomTextOverlay settings={settings} analyser={analyser} song={currentSong} />
      {settings.showFps && <FPSCounter />}
      <div 
        id="app-version"
        className="absolute bottom-4 right-4 text-xs font-medium text-white/60 drop-shadow-md z-10"
      >
        Aura Flux {APP_VERSION}
      </div>
      <Suspense fallback={null}>
        <Controls isExpanded={isExpanded} setIsExpanded={setIsExpanded} isIdle={isIdle} toggleFullscreen={toggleFullscreen} />
      </Suspense>
    </div>
  );
};

export const App: React.FC = () => (
    <AppProvider>
        <Suspense fallback={<div id="app-fallback-loader" className="w-screen h-screen bg-black" />}>
            <MainContent />
        </Suspense>
    </AppProvider>
);
```

### 1.2 404 椤甸潰缁勪欢 (_not-found.tsx)
- **鏂囦欢**: `src/app/_not-found.tsx`
- **鐗堟湰**: v2.3.2
- **鍔熻兘**: 澶勭悊鏈壘鍒伴〉闈㈢殑鎯呭喌

**鏍稿績鐗规€?**
- 浣跨敤 `AppProvider` 鎻愪緵鍏ㄥ眬鐘舵€佺鐞?- 鏀寔澶氳瑷€鏂囨湰
- 鍝嶅簲寮忚璁?- 鎻愪緵杩斿洖棣栭〉鐨勯摼鎺?
**浠ｇ爜绀轰緥:**
```tsx
// _not-found.tsx 鏍稿績缁撴瀯
import { AppProvider, useUI } from '@/context/AppContext';
import React from 'react';

const NotFoundContent = () => {
  const ui = useUI();
  const t = ui?.t;
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">{t?.common?.['404']?.title || 'Page not found'}</p>
      <a
        href="/"
        className="px-6 py-3 bg-white text-black rounded-full hover:bg-gray-200 transition-colors"
      >
        {t?.common?.['404']?.back_home || 'Back to Home'}
      </a>
    </div>
  );
};

export default function NotFound() {
  return (
    <AppProvider>
      <NotFoundContent />
    </AppProvider>
  );
}
```

## 2. 鐘舵€佺鐞嗙郴缁?
### 2.1 搴旂敤涓婁笅鏂?(AppContext.tsx)
- **鏂囦欢**: `src/context/AppContext.tsx`
- **鐗堟湰**: v2.3.2
- **鍔熻兘**: 鎻愪緵鍏ㄥ眬鐘舵€佺鐞嗗拰鍏变韩鍔熻兘

**鏍稿績鍔熻兘:**
- 鎻愪緵 UI 鐘舵€佺鐞?(`useUI`)
- 鎻愪緵瑙嗚鐘舵€佺鐞?(`useVisuals`)
- 鎻愪緵闊抽鐘舵€佺鐞?(`useAudioContext`)
- 鎻愪緵 AI 鐘舵€佺鐞?(`useAI`)
- 绠＄悊鍏ㄥ眬璁剧疆鍜岄厤缃?
**鐘舵€佺粨鏋?**
- `uiState`: 绠＄悊鐣岄潰鐘舵€侊紙灞曞紑/鏀惰捣銆佸紩瀵肩姸鎬佺瓑锛?- `visualState`: 绠＄悊鍙鍖栬缃紙妯″紡銆侀鑹层€佺伒鏁忓害绛夛級
- `audioState`: 绠＄悊闊抽鐘舵€侊紙杈撳叆婧愩€佽澶囥€佹挱鏀剧姸鎬佺瓑锛?- `aiState`: 绠＄悊 AI 鐘舵€侊紙澶勭悊鐘舵€併€佹瓕璇嶆樉绀虹瓑锛?
**浠ｇ爜绀轰緥:**
```tsx
// AppContext.tsx 鏍稿績缁撴瀯
'use client';
// File: src/context/AppContext.tsx | Version: v2.3.3
import React, { useState, createContext, useContext, useMemo, useCallback, useEffect } from 'react';
import { VisualizerMode, LyricsStyle, Language, VisualizerSettings, Region, AudioDevice, SongInfo, SmartPreset, AudioSourceType, Track, PlaybackMode } from '@/types/index';
import { useAudio } from '@/hooks/useAudio';
import { useAppState } from '@/hooks/useAppState';
import { useVisualsState } from '@/hooks/useVisualsState';
import { useAiState } from '@/hooks/useAiState';
import { Toast } from '@/components/visualizers/ui/Toast';
import { TRANSLATIONS } from '@/locales/index';
import { TranslationSchema } from '@/locales/index';

type HelpTab = 'guide' | 'shortcuts' | 'about';

interface UIContextType {
  language: Language; setLanguage: React.Dispatch<React.SetStateAction<Language>>;
  region: Region; setRegion: React.Dispatch<React.SetStateAction<Region>>;
  hasStarted: boolean; setHasStarted: React.Dispatch<React.SetStateAction<boolean>>;
  resetSettings: () => void;
  manageWakeLock: (enabled: boolean) => Promise<void>;
  toggleFullscreen: () => void; t: TranslationSchema;
  showToast: (message: string, type?: 'success' | 'info' | 'error', duration?: number, position?: 'top' | 'bottom') => void;
  showHelpModal: boolean;
  setShowHelpModal: React.Dispatch<React.SetStateAction<boolean>>;
  helpModalInitialTab: HelpTab;
  setHelpModalInitialTab: React.Dispatch<React.SetStateAction<HelpTab>>;
  isDragging: boolean;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
}
const UIContext = createContext<UIContextType | null>(null);
export const useUI = () => useContext(UIContext)!;

interface VisualsContextType {
  mode: VisualizerMode; setMode: React.Dispatch<React.SetStateAction<VisualizerMode>>;
  colorTheme: string[]; setColorTheme: React.Dispatch<React.SetStateAction<string[]>>;
  settings: VisualizerSettings; setSettings: React.Dispatch<React.SetStateAction<VisualizerSettings>>;
  activePreset: string; setActivePreset: React.Dispatch<React.SetStateAction<string>>;
  isThreeMode: boolean;
  randomizeSettings: () => void; resetVisualSettings: () => void;
  resetTextSettings: () => void; resetAudioSettings: () => void;
  applyPreset: (preset: SmartPreset) => void;
}
const VisualsContext = createContext<VisualsContextType | null>(null);
export const useVisuals = () => useContext(VisualsContext)!;

interface AudioContextType {
  sourceType: AudioSourceType; isListening: boolean; isPending: boolean;
  analyser: AnalyserNode | null; analyserR: AnalyserNode | null;
  mediaStream: MediaStream | null; audioDevices: AudioDevice[];
  selectedDeviceId: string; onDeviceChange: (id: string) => void;
  toggleMicrophone: (id: string) => void;
  currentSong: SongInfo | null; setCurrentSong: (s: SongInfo | null) => void;
  playlist: Track[]; currentIndex: number; playbackMode: PlaybackMode;
  setPlaybackMode: (m: PlaybackMode) => void;
  importFiles: (files: FileList | File[]) => Promise<any>;
  importFromUrl: (url: string) => Promise<Track>;
  importPlaylistFromUrl: (url: string) => Promise<Track[]>;
  togglePlayback: () => void; seekFile: (t: number) => void;
  playNext: () => void; playPrev: () => void;
  playTrackByIndex: (i: number) => void; removeFromPlaylist: (i: number) => void;
  clearPlaylist: () => void; getAudioSlice: (s?: number) => Promise<Blob | null>;
  isPlaying: boolean; duration: number; currentTime: number;
  fileStatus?: 'ready' | 'loading' | 'none';
  fileName?: string;
  audioContext: AudioContext | null;
}
const AudioContext = createContext<AudioContextType | null>(null);
export const useAudioContext = () => useContext(AudioContext)!;

interface AIContextType {
  lyricsStyle: LyricsStyle; showLyrics: boolean; setShowLyrics: (b: boolean | ((prev: boolean) => boolean)) => void;
  enableAnalysis: boolean; setEnableAnalysis: (b: boolean) => void;
  isIdentifying: boolean;
  performIdentification: (s: MediaStream) => Promise<void>;
  resetAiSettings: () => void; 
}
const AIContext = createContext<AIContextType | null>(null);
export const useAI = () => useContext(AIContext)!;

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState({ message: null as string | null, type: 'info' as any, duration: 3000, position: 'bottom' as 'top' | 'bottom' });
  
  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'info', duration = 3000, position: 'top' | 'bottom' = 'bottom') => 
    setToast({ message, type, duration, position }), []);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, message: null }));
  }, []);
  
  const uiState = useAppState();
  const visualsState = useVisualsState(uiState.hasStarted, {} as any);
  const [currentSong, setCurrentSong] = useState<SongInfo | null>(null);
  const audioState = useAudio({ settings: visualsState.settings, language: uiState.language, setCurrentSong, t: uiState.t, showToast });
  
  const aiState = useAiState({
    language: uiState.language,
    region: uiState.region,
    provider: visualsState.settings.recognitionProvider || 'GEMINI',
    isListening: audioState.isListening,
    isSimulating: visualsState.settings.recognitionProvider === 'MOCK',
    mediaStream: audioState.mediaStream,
    initialSettings: visualsState.settings,
    setSettings: visualsState.setSettings,
    onSongIdentified: setCurrentSong,
    currentSong: currentSong,
    getAudioSlice: audioState.getAudioSlice,
    t: uiState.t,
    showToast,
  });

  const toggleFullscreen = useCallback(() => {
    if (typeof document !== 'undefined') {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
        } else {
            if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
        }
    }
  }, []);

  const fileStatus = audioState.playlist.length > 0 ? 'ready' as const : 'none' as const;
  const fileName = audioState.playlist[audioState.currentIndex]?.file.name;

  const isThreeMode = useMemo(() => {
    return [
      VisualizerMode.DIGITAL_GRID, VisualizerMode.SILK_WAVE,
      VisualizerMode.OCEAN_WAVE, VisualizerMode.NEURAL_FLOW,
      VisualizerMode.CUBE_FIELD, VisualizerMode.KINETIC_WALL,
      VisualizerMode.VORTEX, VisualizerMode.LASERS
    ].includes(visualsState.mode);
  }, [visualsState.mode]);

  const uiContextValue: UIContextType = useMemo(() => ({
    ...uiState,
    toggleFullscreen,
    showToast
  }), [uiState, toggleFullscreen, showToast]);
  
  const visualsContextValue = useMemo(() => ({ ...visualsState, isThreeMode }), [visualsState, isThreeMode]);
  const audioContextValue = useMemo(() => ({ ...audioState, currentSong, setCurrentSong, fileStatus, fileName }), [audioState, currentSong, fileStatus, fileName]);
  const aiContextValue = useMemo(() => aiState, [aiState]);

  return (
    <UIContext.Provider value={uiContextValue}>
      <VisualsContext.Provider value={visualsContextValue}>
        <AudioContext.Provider value={audioContextValue}>
          <AIContext.Provider value={aiContextValue}>
            {children}
            <Toast 
              message={toast.message} 
              type={toast.type} 
              duration={toast.duration}
              position={toast.position}
              onClose={hideToast} 
            />
          </AIContext.Provider>
        </AudioContext.Provider>
      </VisualsContext.Provider>
    </UIContext.Provider>
  );
};
```

### 2.2 搴旂敤鐘舵€?Hook (useAppState.ts)
- **鏂囦欢**: `src/hooks/useAppState.ts`
- **鐗堟湰**: v2.3.2
- **鍔熻兘**: 绠＄悊搴旂敤鐨?UI 鐘舵€?
**鏍稿績鍔熻兘:**
- 璇█绠＄悊锛堟敮鎸佸璇█锛?- 鍖哄煙璁剧疆
- 搴旂敤鍚姩鐘舵€?- 甯姪妯℃€佹鐘舵€?- 鎷栨斁鐘舵€?- 鍞ら啋閿佺鐞?- 璁剧疆閲嶇疆

**浠ｇ爜绀轰緥:**
```tsx
// useAppState.ts 鏍稿績缁撴瀯
// File: src/hooks/useAppState.ts | Version: v2.3.3
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
```

### 2.3 瑙嗚鐘舵€?Hook (useVisualsState.ts)
- **鏂囦欢**: `src/hooks/useVisualsState.ts`
- **鐗堟湰**: v2.3.2
- **鍔熻兘**: 绠＄悊鍙鍖栫浉鍏崇殑鐘舵€?
**鏍稿績鍔熻兘:**
- 鍙鍖栨ā寮忕鐞?- 棰滆壊涓婚绠＄悊
- 鍙鍖栬缃鐞?- 棰勮绠＄悊
- 璁剧疆闅忔満鍖?- 璁剧疆閲嶇疆

**浠ｇ爜绀轰緥:**
```tsx
// useVisualsState.ts 鏍稿績缁撴瀯
// File: src/hooks/useVisualsState.ts | Version: v2.3.3
import { useState, useCallback, useMemo } from 'react';
import { VisualizerMode, VisualizerSettings, SmartPreset } from '../types';
import { COLOR_THEMES } from '../constants';

const DEFAULT_SETTINGS: VisualizerSettings = {
  sensitivity: 1.0,
  autoHideUi: true,
  showSongInfo: true,
  showAlbumArtOverlay: true,
  showFps: false,
  appTheme: 'dark',
  wakeLock: true,
  doubleClickFullscreen: true,
  recognitionProvider: 'GEMINI',
  bloom: 0.5,
  particleCount: 1000,
  speed: 1.0,
  cycleColors: true
};

export const useVisualsState = (hasStarted: boolean, initialSettings: any) => {
  const [mode, setMode] = useState<VisualizerMode>(VisualizerMode.DIGITAL_GRID);
  const [colorTheme, setColorTheme] = useState<string[]>(['#00f2ff', '#0062ff', '#7000ff']);
  const [settings, setSettings] = useState<VisualizerSettings>(DEFAULT_SETTINGS);
  const [activePreset, setActivePreset] = useState('Default');

  const randomizeSettings = useCallback(() => {
    // Randomize Mode
    const modes = Object.values(VisualizerMode);
    const randomMode = modes[Math.floor(Math.random() * modes.length)];
    setMode(randomMode);

    // Randomize Colors
    const randomTheme = COLOR_THEMES[Math.floor(Math.random() * COLOR_THEMES.length)];
    setColorTheme(randomTheme.colors);

    // Randomize Settings
    setSettings(prev => ({
      ...prev,
      sensitivity: 0.8 + Math.random() * 1.2,
      speed: 0.5 + Math.random() * 1.5,
      glow: Math.random() > 0.5,
      trails: Math.random() > 0.5
    }));

    setActivePreset('Randomized');
  }, []);

  const resetVisualSettings = useCallback(() => setSettings(DEFAULT_SETTINGS), []);
  const resetTextSettings = useCallback(() => {}, []);
  const resetAudioSettings = useCallback(() => {}, []);

  const applyPreset = useCallback((preset: SmartPreset) => {
    setMode(preset.mode);
    setSettings(prev => ({ ...prev, ...preset.settings }));
    setColorTheme(preset.colors);
    setActivePreset(preset.name);
  }, []);

  return useMemo(() => ({
    mode, setMode,
    colorTheme, setColorTheme,
    settings, setSettings,
    activePreset, setActivePreset,
    randomizeSettings,
    resetVisualSettings,
    resetTextSettings,
    resetAudioSettings,
    applyPreset
  }), [mode, setMode, colorTheme, setColorTheme, settings, setSettings, activePreset, setActivePreset, randomizeSettings, resetVisualSettings, resetTextSettings, resetAudioSettings, applyPreset]);
};
```

## 3. 绫诲瀷瀹氫箟

### 3.1 鏍稿績绫诲瀷 (types/index.ts)
- **鏂囦欢**: `src/types/index.ts`
- **鐗堟湰**: v2.3.2
- **鍔熻兘**: 瀹氫箟搴旂敤涓娇鐢ㄧ殑绫诲瀷

**涓昏绫诲瀷:**
- `VisualizerMode` - 鍙鍖栨ā寮忔灇涓?- `LyricsStyle` - 姝岃瘝椋庢牸鏋氫妇
- `Language` - 璇█绫诲瀷
- `Region` - 鍖哄煙绫诲瀷
- `VisualizerSettings` - 鍙鍖栬缃帴鍙?- `AudioDevice` - 闊抽璁惧鎺ュ彛
- `SongInfo` - 姝屾洸淇℃伅鎺ュ彛
- `SmartPreset` - 鏅鸿兘棰勮鎺ュ彛
- `AudioSourceType` - 闊抽婧愮被鍨?- `Track` - 闊抽杞ㄩ亾鎺ュ彛
- `PlaybackMode` - 鎾斁妯″紡鏋氫妇
- `Position` - 浣嶇疆绫诲瀷

**浠ｇ爜绀轰緥:**
```tsx
// types/index.ts 鏍稿績缁撴瀯
// File: src/types/index.ts | Version: v2.3.3
export enum VisualizerMode {
  DIGITAL_GRID = 'DIGITAL_GRID',
  SILK_WAVE = 'SILK_WAVE',
  OCEAN_WAVE = 'OCEAN_WAVE',
  NEURAL_FLOW = 'NEURAL_FLOW',
  CUBE_FIELD = 'CUBE_FIELD',
  KINETIC_WALL = 'KINETIC_WALL',
  VORTEX = 'VORTEX',
  WAVEFORM = 'WAVEFORM',
  TUNNEL = 'TUNNEL',
  LASERS = 'LASERS',
  PLASMA = 'PLASMA',
  BARS = 'BARS',
  STARFIELD = 'STARFIELD'
}

export enum LyricsStyle {
  STANDARD = 'STANDARD',
  KARAOKE = 'KARAOKE',
  MINIMAL = 'MINIMAL'
}

export type Language = 'en' | 'zh' | 'zh-TW' | 'es' | 'ar' | 'fr' | 'pt' | 'pt-BR' | 'de' | 'ja' | 'ko' | 'ru';

export type Region = 'US' | 'CN' | 'EU' | 'OTHER';

export interface VisualizerSettings {
  sensitivity: number;
  autoHideUi: boolean;
  showSongInfo: boolean;
  showAlbumArtOverlay: boolean;
  showFps: boolean;
  appTheme: 'light' | 'dark';
  wakeLock: boolean;
  doubleClickFullscreen: boolean;
  recognitionProvider: 'GEMINI' | 'MOCK';
  [key: string]: any;
}

export interface AudioDevice {
  deviceId: string;
  label: string;
}

export interface SongInfo {
  title: string;
  artist: string;
  album?: string;
  artwork?: string;
  lyrics?: string;
  [key: string]: any;
}

export interface SmartPreset {
  name: string;
  nameKey: string;
  settings: Partial<VisualizerSettings>;
  mode: VisualizerMode;
  colors: string[];
}

export type AudioSourceType = 'microphone' | 'file' | 'url';

export interface Track {
  id: string;
  file: File;
  url?: string;
  title: string;
  artist: string;
  albumArtUrl?: string;
}

export enum PlaybackMode {
  SEQUENCE = 'SEQUENCE',
  LOOP = 'LOOP',
  SHUFFLE = 'SHUFFLE'
}

export type Position = 'top' | 'center' | 'bottom';
```

## 4. 鏍稿績甯搁噺

### 4.1 鐗堟湰甯搁噺 (version.ts)
- **鏂囦欢**: `src/constants/version.ts`
- **鍔熻兘**: 瀹氫箟搴旂敤鐗堟湰鍙?
**鍐呭:**
```typescript
export const APP_VERSION = 'v2.3.2';
```

### 4.2 閫氱敤甯搁噺 (index.ts)
- **鏂囦欢**: `src/constants/index.ts`
- **鍔熻兘**: 瀹氫箟搴旂敤涓娇鐢ㄧ殑甯搁噺

**涓昏甯搁噺:**
- 瑙嗚妯″紡瀹氫箟
- 棰滆壊涓婚
- 闊抽鍒嗘瀽鍙傛暟
- UI 閰嶇疆閫夐」

**浠ｇ爜绀轰緥:**
```typescript
// File: src/constants/index.ts | Version: v2.3.3
import { VisualizerMode } from '../types';

export const APP_NAME = 'Aura Flux';
export const VERSION = '2.3.0';
export const APP_VERSION = VERSION;

export const FONTS = [
  'Inter',
  'JetBrains Mono',
  'Space Grotesk',
  'Outfit',
  'Playfair Display',
  'Cormorant Garamond',
  'Anton',
  'Montserrat'
];

export const THEMES = {
  DARK: 'dark',
  LIGHT: 'light'
};

export const getPositionOptions = (t: any) => [
  { value: 'top', label: t?.positions?.top || 'Top' },
  { value: 'center', label: t?.positions?.center || 'Center' },
  { value: 'bottom', label: t?.positions?.bottom || 'Bottom' }
];

export const getFontOptions = () => FONTS.map(font => ({ value: font, label: font }));

export const COLOR_THEMES = [
  { id: 'neon', name: 'Neon', colors: ['#ff00ff', '#00ffff', '#00ff00'] },
  { id: 'sunset', name: 'Sunset', colors: ['#ff4e50', '#f9d423', '#ff9a9e'] },
  { id: 'ocean', name: 'Ocean', colors: ['#2193b0', '#6dd5ed', '#000046'] },
  { id: 'forest', name: 'Forest', colors: ['#11998e', '#38ef7d', '#000000'] },
  { id: 'cyber', name: 'Cyber', colors: ['#00ffcc', '#ff0066', '#333399'] },
  { id: 'monochrome', name: 'Monochrome', colors: ['#ffffff', '#888888', '#000000'] }
];

export const SMART_PRESETS = [
  {
    name: 'Cyber Grid',
    nameKey: 'cyberpunk',
    mode: VisualizerMode.DIGITAL_GRID,
    colors: ['#00ffcc', '#ff0066', '#333399'],
    settings: { sensitivity: 1.2 }
  },
  {
    name: 'Deep Ocean',
    nameKey: 'ambient',
    mode: VisualizerMode.OCEAN_WAVE,
    colors: ['#2193b0', '#6dd5ed', '#000046'],
    settings: { sensitivity: 0.3 }
  },
  {
    name: 'Neon Vortex',
    nameKey: 'galaxy',
    mode: VisualizerMode.VORTEX,
    colors: ['#ff00ff', '#00ffff', '#00ff00'],
    settings: { sensitivity: 1.5 }
  }
];
```
