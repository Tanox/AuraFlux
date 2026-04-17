# UI 涓庝氦浜掔郴缁熻鑼?
## 1. 鎺у埗鐣岄潰绯荤粺

### 1.1 Controls 缁勪欢
- **鏂囦欢**: `src/components/controls/Controls.tsx`
- **鐗堟湰**: v2.3.2
- **鍔熻兘**: 涓绘帶鍒剁晫闈㈢粍浠?
**鏍稿績鐗规€?**
- 澶氭爣绛鹃〉甯冨眬锛圔ento Grid 椋庢牸锛?- 閿洏蹇嵎閿敮鎸?- 鍝嶅簲寮忚璁?- 鍔ㄦ€佸睍寮€/鏀惰捣

**鏍囩椤电粨鏋?**
- `visual` - 瑙嗚璁剧疆闈㈡澘
- `input` - 闊抽杈撳叆璁剧疆闈㈡澘
- `playback` - 鎾斁鎺у埗闈㈡澘
- `text` - 鏂囨湰璁剧疆闈㈡澘
- `studio` - 宸ヤ綔瀹よ缃潰鏉?- `system` - 绯荤粺璁剧疆闈㈡澘

**蹇嵎閿敮鎸?**
- `R` - 闅忔満鍖栬缃?- `1-6` - 蹇€熷垏鎹㈡爣绛鹃〉

**浠ｇ爜绀轰緥:**
```tsx
// Controls.tsx 鏍稿績缁撴瀯
// File: src/components/controls/Controls.tsx | Version: v2.3.3
import React, { useState, useMemo } from 'react';
import { VisualizerMode, ColorTheme } from '@/types';

interface ControlsProps {
  mode: VisualizerMode;
  setMode: (mode: VisualizerMode) => void;
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
  sensitivity: number;
  setSensitivity: (value: number) => void;
  smoothing: number;
  setSmoothing: (value: number) => void;
  useGradient: boolean;
  setUseGradient: (value: boolean) => void;
  isListening: boolean;
  setIsListening: (value: boolean) => void;
  showLyrics: boolean;
  setShowLyrics: (value: boolean) => void;
  enableAnalysis: boolean;
  setEnableAnalysis: (value: boolean) => void;
  language: string;
  setLanguage: (value: string) => void;
  region: string;
  setRegion: (value: string) => void;
  isSimulating: boolean;
  setIsSimulating: (value: boolean) => void;
  isMobile: boolean;
  t: (key: string) => string;
  availableThemes: { value: ColorTheme; label: string }[];
  availableModes: { value: VisualizerMode; label: string }[];
  availableLanguages: { value: string; label: string }[];
  availableRegions: { value: string; label: string }[];
  performIdentification: (stream: MediaStream) => void;
  mediaStream: MediaStream | null;
  isIdentifying: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  mode, setMode, colorTheme, setColorTheme,
  sensitivity, setSensitivity, smoothing, setSmoothing,
  useGradient, setUseGradient, isListening, setIsListening,
  showLyrics, setShowLyrics, enableAnalysis, setEnableAnalysis,
  language, setLanguage, region, setRegion, isSimulating, setIsSimulating,
  isMobile, t, availableThemes, availableModes, availableLanguages, availableRegions,
  performIdentification, mediaStream, isIdentifying
}) => {
  const [activeTab, setActiveTab] = useState('visuals');

  const tabs = useMemo(() => [
    { id: 'visuals', label: t('controls.visuals') || 'Visuals' },
    { id: 'audio', label: t('controls.audio') || 'Audio' },
    { id: 'ai', label: t('controls.ai') || 'AI' },
    { id: 'settings', label: t('controls.settings') || 'Settings' },
  ], [t]);

  return (
    <div id="controls-container" className={`fixed top-4 right-4 z-50 ${isMobile ? 'w-3/4' : 'w-80'}`}>
      <div className="bg-black/70 backdrop-blur-lg border border-white/20 rounded-lg p-4">
        <div className="flex border-b border-white/20 mb-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`px-3 py-2 text-sm font-medium ${activeTab === tab.id ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="tab-content">
          {/* Visuals Tab */}
          {activeTab === 'visuals' && (
            <div className="space-y-4">
              {/* Visualizer Mode */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  {t('controls.visualizerMode') || 'Visualizer Mode'}
                </label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as VisualizerMode)}
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 text-sm"
                >
                  {availableModes.map(m => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Color Theme */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  {t('controls.colorTheme') || 'Color Theme'}
                </label>
                <select
                  value={colorTheme}
                  onChange={(e) => setColorTheme(e.target.value as ColorTheme)}
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 text-sm"
                >
                  {availableThemes.map(theme => (
                    <option key={theme.value} value={theme.value}>
                      {theme.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sensitivity */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="block text-sm font-medium text-gray-300">
                    {t('controls.sensitivity') || 'Sensitivity'}
                  </label>
                  <span className="text-xs text-gray-400">{sensitivity.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.1"
                  value={sensitivity}
                  onChange={(e) => setSensitivity(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Smoothing */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="block text-sm font-medium text-gray-300">
                    {t('controls.smoothing') || 'Smoothing'}
                  </label>
                  <span className="text-xs text-gray-400">{smoothing.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={smoothing}
                  onChange={(e) => setSmoothing(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Use Gradient */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="useGradient"
                  checked={useGradient}
                  onChange={(e) => setUseGradient(e.target.checked)}
                />
                <label htmlFor="useGradient" className="text-sm text-gray-300">
                  {t('controls.useGradient') || 'Use Gradient'}
                </label>
              </div>
            </div>
          )}

          {/* Audio Tab */}
          {activeTab === 'audio' && (
            <div className="space-y-4">
              {/* Listen Toggle */}
              <button
                className={`w-full py-2 rounded ${isListening ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-700 hover:bg-gray-600'} text-white font-medium`}
                onClick={() => setIsListening(!isListening)}
              >
                {isListening ? t('controls.stopListening') || 'Stop Listening' : t('controls.startListening') || 'Start Listening'}
              </button>

              {/* Simulate Audio */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isSimulating"
                  checked={isSimulating}
                  onChange={(e) => setIsSimulating(e.target.checked)}
                />
                <label htmlFor="isSimulating" className="text-sm text-gray-300">
                  {t('controls.simulateAudio') || 'Simulate Audio'}
                </label>
              </div>
            </div>
          )}

          {/* AI Tab */}
          {activeTab === 'ai' && (
            <div className="space-y-4">
              {/* Show Lyrics */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showLyrics"
                  checked={showLyrics}
                  onChange={(e) => setShowLyrics(e.target.checked)}
                />
                <label htmlFor="showLyrics" className="text-sm text-gray-300">
                  {t('controls.showLyrics') || 'Show Lyrics'}
                </label>
              </div>

              {/* Enable Analysis */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="enableAnalysis"
                  checked={enableAnalysis}
                  onChange={(e) => setEnableAnalysis(e.target.checked)}
                />
                <label htmlFor="enableAnalysis" className="text-sm text-gray-300">
                  {t('controls.enableAnalysis') || 'Enable Analysis'}
                </label>
              </div>

              {/* Identify Song */}
              <button
                className="w-full py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium"
                onClick={() => mediaStream && performIdentification(mediaStream)}
                disabled={!mediaStream || isIdentifying}
              >
                {isIdentifying ? t('controls.identifying') || 'Identifying...' : t('controls.identifySong') || 'Identify Song'}
              </button>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              {/* Language */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  {t('controls.language') || 'Language'}
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 text-sm"
                >
                  {availableLanguages.map(lang => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Region */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  {t('controls.region') || 'Region'}
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 text-sm"
                >
                  {availableRegions.map(reg => (
                    <option key={reg.value} value={reg.value}>
                      {reg.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Controls;
```

### 1.2 BottomBar 缁勪欢
- **鏂囦欢**: `src/components/controls/BottomBar.tsx`
- **鍔熻兘**: 搴曢儴鎺у埗鏍?
**鏍稿績鍔熻兘:**
- 鎾斁鎺у埗鎸夐挳
- 瑙嗚妯″紡鍒囨崲
- 闅忔満鍖栨寜閽?- 鍏ㄥ睆鍒囨崲
- 灞曞紑/鏀惰捣鎺у埗鐣岄潰

**浠ｇ爜绀轰緥:**
```tsx
// BottomBar.tsx 鏍稿績缁撴瀯
// File: src/components/controls/BottomBar.tsx | Version: v2.3.3
import React, { useState } from 'react';
import { Track, SongInfo } from '@/types';

interface BottomBarProps {
  isPlaying: boolean;
  setIsPlaying: (value: boolean) => void;
  volume: number;
  setVolume: (value: number) => void;
  tracks: Track[];
  currentTrack: Track | null;
  onTrackSelect: (track: Track) => void;
  onAddTrack: () => void;
  onRemoveTrack: (track: Track) => void;
  isRecording: boolean;
  setIsRecording: (value: boolean) => void;
  isMobile: boolean;
  t: (key: string) => string;
  currentSong: SongInfo | null;
  recordingTime: string;
}

const BottomBar: React.FC<BottomBarProps> = ({
  isPlaying, setIsPlaying, volume, setVolume,
  tracks, currentTrack, onTrackSelect, onAddTrack, onRemoveTrack,
  isRecording, setIsRecording, isMobile, t, currentSong, recordingTime
}) => {
  const [showPlaylist, setShowPlaylist] = useState(false);

  return (
    <div id="bottom-bar" className="fixed bottom-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-lg border-t border-white/20 p-4">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Song Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {currentSong ? (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center">
                <span className="text-white text-sm">{currentSong.title?.charAt(0) || '?'}</span>
              </div>
              <div className="min-w-0">
                <h4 className="text-white font-medium truncate">{currentSong.title || 'Unknown'}</h4>
                <p className="text-gray-400 text-xs truncate">{currentSong.artist || 'Unknown Artist'}</p>
              </div>
            </div>
          ) : (
            <div className="text-gray-400 text-sm">{t('bottomBar.noSongPlaying') || 'No song playing'}</div>
          )}
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-4 flex-1 justify-center">
          <button
            className="text-white hover:text-blue-400 transition-colors"
            onClick={() => setShowPlaylist(!showPlaylist)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
          <button
            className="text-white hover:text-blue-400 transition-colors"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isPlaying ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              )}
            </svg>
          </button>
          <button
            className={`text-white ${isRecording ? 'text-red-500' : 'text-white'} hover:text-blue-400 transition-colors`}
            onClick={() => setIsRecording(!isRecording)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 10a7 7 0 017 7m-7-4a1 1 0 112 0 1 1 0 01-2 0z" />
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-24"
          />
        </div>

        {/* Recording Time */}
        {isRecording && (
          <div className="text-white text-sm ml-4">
            {recordingTime}
          </div>
        )}
      </div>

      {/* Playlist */}
      {showPlaylist && (
        <div className="absolute bottom-full left-0 right-0 bg-black/90 border-t border-white/20 p-4 max-h-60 overflow-y-auto">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-white font-medium">{t('bottomBar.playlist') || 'Playlist'}</h3>
            <button
              className="text-blue-400 text-sm"
              onClick={onAddTrack}
            >
              {t('bottomBar.addTrack') || 'Add Track'}
            </button>
          </div>
          <div className="space-y-1">
            {tracks.length === 0 ? (
              <div className="text-gray-400 text-sm text-center py-4">
                {t('bottomBar.emptyPlaylist') || 'Empty playlist'}
              </div>
            ) : (
              tracks.map((track) => (
                <div
                  key={track.id}
                  className={`flex items-center justify-between p-2 rounded ${currentTrack?.id === track.id ? 'bg-blue-900/30' : 'hover:bg-gray-800/50'}`}
                  onClick={() => onTrackSelect(track)}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-white text-sm truncate">{track.name}</p>
                    <p className="text-gray-400 text-xs truncate">{track.url}</p>
                  </div>
                  <button
                    className="text-gray-400 hover:text-red-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveTrack(track);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BottomBar;
```

## 2. 鎺у埗闈㈡澘瀹炵幇

### 2.1 瑙嗚璁剧疆闈㈡澘
- **鏂囦欢**: `src/components/controls/panels/VisualSettingsPanel.tsx`
- **鍔熻兘**: 瑙嗚鏁堟灉璁剧疆

**鏍稿績鍔熻兘:**
- 瑙嗚妯″紡閫夋嫨
- 棰滆壊涓婚閰嶇疆
- 鐏垫晱搴﹁皟鏁?- 璐ㄩ噺璁剧疆
- AI 鑳屾櫙璁剧疆

### 2.2 闊抽璁剧疆闈㈡澘
- **鏂囦欢**: `src/components/controls/panels/AudioSettingsPanel.tsx`
- **鍔熻兘**: 闊抽杈撳叆璁剧疆

**鏍稿績鍔熻兘:**
- 闊抽璁惧閫夋嫨
- 杈撳叆婧愬垏鎹?- 澧炵泭璋冩暣
- AI 璁剧疆

### 2.3 鎾斁鎺у埗闈㈡澘
- **鏂囦欢**: `src/components/controls/panels/PlaybackPanel.tsx`
- **鍔熻兘**: 鎾斁鎺у埗

**鏍稿績鍔熻兘:**
- 鎾斁/鏆傚仠
- 涓婁竴棣?涓嬩竴棣?- 鎾斁鍒楄〃绠＄悊
- 鎾斁妯″紡璁剧疆

### 2.4 鏂囨湰璁剧疆闈㈡澘
- **鏂囦欢**: `src/components/controls/panels/CustomTextSettingsPanel.tsx`
- **鍔熻兘**: 鑷畾涔夋枃鏈缃?
**鏍稿績鍔熻兘:**
- 鏂囨湰鍐呭杈撳叆
- 鏂囨湰鏍峰紡閰嶇疆
- 鏂囨湰浣嶇疆璋冩暣
- 鏂囨湰鍔ㄧ敾璁剧疆

### 2.5 宸ヤ綔瀹よ缃潰鏉?- **鏂囦欢**: `src/components/controls/panels/StudioPanel.tsx`
- **鍔熻兘**: 宸ヤ綔瀹ゅ姛鑳借缃?
**鏍稿績鍔熻兘:**
- 瑙嗛褰曞埗
- 褰曞埗璁剧疆
- 棰勮鍔熻兘
- 瀵煎嚭閫夐」

### 2.6 绯荤粺璁剧疆闈㈡澘
- **鏂囦欢**: `src/components/controls/panels/SystemSettingsPanel.tsx`
- **鍔熻兘**: 绯荤粺閰嶇疆

**鏍稿績鍔熻兘:**
- 璇█閫夋嫨
- 涓婚鍒囨崲
- 棰勮绠＄悊
- 绯荤粺淇℃伅

## 3. UI 瑕嗙洊灞傜粍浠?
### 3.1 姝屾洸淇℃伅瑕嗙洊灞?- **鏂囦欢**: `src/components/visualizers/ui/SongOverlay.tsx`
- **鍔熻兘**: 鏄剧ず褰撳墠姝屾洸淇℃伅

### 3.2 姝岃瘝瑕嗙洊灞?- **鏂囦欢**: `src/components/visualizers/ui/LyricsOverlay.tsx`
- **鍔熻兘**: 鏄剧ず姝岃瘝

### 3.3 鑷畾涔夋枃鏈鐩栧眰
- **鏂囦欢**: `src/components/visualizers/ui/CustomTextOverlay.tsx`
- **鍔熻兘**: 鏄剧ず鑷畾涔夋枃鏈?
### 3.4 甯姪妯℃€佹
- **鏂囦欢**: `src/components/visualizers/ui/HelpModal.tsx`
- **鍔熻兘**: 鏄剧ず甯姪淇℃伅

### 3.5 娆㈣繋灞忓箷
- **鏂囦欢**: `src/components/visualizers/ui/WelcomeScreen.tsx`
- **鍔熻兘**: 鍒濆娆㈣繋鐣岄潰

### 3.6 寮曞瑕嗙洊灞?- **鏂囦欢**: `src/components/visualizers/ui/onboarding/OnboardingOverlay.tsx`
- **鍔熻兘**: 棣栨浣跨敤寮曞

### 3.7 甯х巼璁℃暟鍣?- **鏂囦欢**: `src/components/visualizers/ui/FPSCounter.tsx`
- **鍔熻兘**: 鏄剧ず甯х巼

## 4. 浜や簰鍔熻兘

### 4.1 鎵嬪娍鏀寔
- **鏂囦欢**: `src/hooks/useMobileGestures.ts`
- **鍔熻兘**: 绉诲姩璁惧鎵嬪娍鏀寔

**鏀寔鐨勬墜鍔?**
- 宸﹀彸婊戝姩 - 鍒囨崲瑙嗚妯″紡
- 涓婁笅婊戝姩 - 璋冭妭闊抽澧炵泭
- 闀挎寜 - 寮€鍏?AI 淇℃伅鍥惧眰

### 4.2 绌洪棽妫€娴?- **鏂囦欢**: `src/hooks/useIdleTimer.ts`
- **鍔熻兘**: 妫€娴嬬敤鎴风┖闂茬姸鎬?
**鏍稿績鍔熻兘:**
- 鑷姩闅愯棌 UI
- 鍝嶅簲寮忓敜閱?- 鍙厤缃殑绌洪棽鏃堕棿

### 4.3 鐗堟湰妫€鏌?- **鏂囦欢**: `src/hooks/useVersionCheck.ts`
- **鍔熻兘**: 妫€鏌ュ簲鐢ㄧ増鏈洿鏂?
**鏍稿績鍔熻兘:**
- 瀹氭湡妫€鏌ョ増鏈?- 鏄剧ず鏇存柊鎻愮ず
- 寮曞鐢ㄦ埛鍒锋柊

### 4.4 瑙嗛褰曞埗
- **鏂囦欢**: `src/hooks/useVideoRecorder.ts`
- **鍔熻兘**: 瑙嗛褰曞埗鍔熻兘

**鏍稿績鍔熻兘:**
- 灞忓箷褰曞埗
- 褰曞埗鎺у埗
- 瑙嗛瀵煎嚭
- 褰曞埗璁剧疆

## 5. UI 缁勪欢搴?
### 5.1 鎺у埗缁勪欢

#### 5.1.1 婊戝潡缁勪欢
- **鏂囦欢**: `src/components/visualizers/ui/controls/Slider.tsx`
- **鍔熻兘**: 婊戝姩璋冭妭鎺т欢

#### 5.1.2 寮€鍏崇粍浠?- **鏂囦欢**: `src/components/visualizers/ui/controls/SettingsToggle.tsx`
- **鍔熻兘**: 璁剧疆寮€鍏?
#### 5.1.3 鍒嗘鎺у埗
- **鏂囦欢**: `src/components/visualizers/ui/controls/SegmentedControl.tsx`
- **鍔熻兘**: 鍒嗘閫夋嫨鎺т欢

#### 5.1.4 鑷畾涔夐€夋嫨鍣?- **鏂囦欢**: `src/components/visualizers/ui/controls/CustomSelect.tsx`
- **鍔熻兘**: 鑷畾涔夐€夋嫨鎺т欢

#### 5.1.5 宸ュ叿鎻愮ず
- **鏂囦欢**: `src/components/visualizers/ui/controls/Tooltip.tsx`
- **鍔熻兘**: 宸ュ叿鎻愮ず

### 5.2 甯冨眬缁勪欢

#### 5.2.1 Bento 鍗＄墖
- **鏂囦欢**: `src/components/visualizers/ui/layout/BentoCard.tsx`
- **鍔熻兘**: Bento 椋庢牸鍗＄墖

## 6. 鍝嶅簲寮忚璁?
### 6.1 甯冨眬绛栫暐
- 绉诲姩璁惧浼樺寲
- 妗岄潰璁惧澧炲己
- 鑷€傚簲甯冨眬
- 鍝嶅簲寮忓瓧浣?
### 6.2 瑙︽懜浼樺寲
- 瑙︽懜鍙嬪ソ鐨勬帶浠跺昂瀵?- 鎵嬪娍鏀寔
- 瑙︽懜鍙嶉
- 闃茶瑙﹁璁?
