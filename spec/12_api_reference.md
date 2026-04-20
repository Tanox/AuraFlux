<!-- openspec/12_api_reference.md v2.3.4 -->
# Aura Flux - API 鎺ュ彛鏂囨。

## 1. 鎺ュ彛姒傝堪

鏈」鐩噰鐢?**Serverless / Client-side Architecture**锛屼富瑕佷緷璧栧墠绔洿鎺ヨ皟鐢?Google Gemini API銆傛湰椤圭洰**涓嶆彁渚?*浼犵粺鐨勫悗绔?RESTful API 鏈嶅姟銆?
鏈枃妗ｄ富瑕佹弿杩帮細
1.  **澶栭儴渚濊禆鎺ュ彛**: Google Gemini API 鐨勯泦鎴愭柟寮忋€?2.  **鍐呴儴鏈嶅姟鎺ュ彛**: 鍓嶇鏈嶅姟灞傜殑鏂规硶瀹氫箟锛屼緵 UI 缁勪欢璋冪敤銆?
## 2. 澶栭儴渚濊禆鎺ュ彛 (Google Gemini API)

鏈」鐩娇鐢?`@google/genai` SDK 涓?Gemini 妯″瀷杩涜浜や簰銆?
| 鎺ュ彛鍚嶇О | 妯″瀷鐗堟湰 | 鐢ㄩ€?|
| :--- | :--- | :--- |
| **Generate Content** | `gemini-3-flash-preview` | 鏂囨湰鐢熸垚銆佹瓕璇嶈幏鍙栥€佹儏鎰熷垎鏋?|
| **Multimodal Input** | `gemini-3-flash-preview` | 闊抽鐗囨璇嗗埆銆佹瓕鏇蹭俊鎭彁鍙?|
| **Image Generation** | `gemini-2.5-flash-image` | 鐢熸垚鑹烘湳鑳屾櫙鍥惧儚 |

### 2.1 閴存潈鏂瑰紡
- **鏂瑰紡**: API Key
- **閰嶇疆**: 鐜鍙橀噺 `GEMINI_API_KEY` (鏈嶅姟鍣ㄧ)

## 3. 鍐呴儴鏈嶅姟鎺ュ彛

### 3.1 AI 鏈嶅姟鎺ュ彛 (aiService.ts)

浠ヤ笅鏂规硶瀹氫箟鍦?`src/services/aiService.ts` 涓紝浣滀负鍗曚緥鏈嶅姟渚涘簲鐢ㄨ皟鐢ㄣ€?
#### 3.1.1 妫€鏌?AI 鏈嶅姟鍙敤鎬?(isAiServiceAvailable)

妫€鏌?AI 鏈嶅姟鏄惁鍙敤銆?
- **鏂规硶绛惧悕**:
  ```typescript
  isAiServiceAvailable(): boolean
  ```

- **杩斿洖鍊?*: `boolean` - AI 鏈嶅姟鏄惁鍙敤

#### 3.1.2 妫€鏌?AI 鏈嶅姟鍙敤鎬?(checkAiServiceAvailability)

妫€鏌?AI 鏈嶅姟鍙敤鎬у苟澶勭悊閿欒銆?
- **鏂规硶绛惧悕**:
  ```typescript
  checkAiServiceAvailability(): { available: boolean; error?: string }
  ```

- **杩斿洖鍊?*:
  ```typescript
  {
    available: boolean; // AI 鏈嶅姟鏄惁鍙敤
    error?: string;     // 閿欒淇℃伅锛堝鏋滀笉鍙敤锛?  }
  ```

#### 3.1.3 鑾峰彇 AI 鏈嶅姟瀹炰緥 (getAiService)

鑾峰彇 AI 鏈嶅姟瀹炰緥銆?
- **鏂规硶绛惧悕**:
  ```typescript
  getAiService(): GenerativeModel
  ```

- **杩斿洖鍊?*: `GenerativeModel` - Google Gemini 鐢熸垚妯″瀷瀹炰緥

#### 3.1.4 浠庨煶棰戠敓鎴愯瑙夐厤缃?(generateVisualConfigFromAudio)

浠庨煶棰戠敓鎴愯瑙夐厤缃€?
- **鏂规硶绛惧悕**:
  ```typescript
  async generateVisualConfigFromAudio(audioBlob: Blob): Promise<VisualConfig>
  ```

- **鍙傛暟璇存槑**:
  | 鍙傛暟鍚?| 绫诲瀷 | 蹇呭～ | 璇存槑 |
  | :--- | :--- | :--- | :--- |
  | `audioBlob` | `Blob` | 鏄?| 闊抽鐗囨 |

- **杩斿洖鏍煎紡 (VisualConfig)**:
  ```typescript
  interface VisualConfig {
    mode: string;        // 鎺ㄨ崘鐨勮瑙夋ā寮?    colorPalette: string[]; // 鎺ㄨ崘鐨勯鑹?palette
    sensitivity: number; // 鎺ㄨ崘鐨勭伒鏁忓害璁剧疆
    speed: number;       // 鎺ㄨ崘鐨勯€熷害璁剧疆
  }
  ```

#### 3.1.5 鐢熸垚鑹烘湳鑳屾櫙 (generateArtisticBackground)

鐢熸垚鑹烘湳鑳屾櫙銆?
- **鏂规硶绛惧悕**:
  ```typescript
  async generateArtisticBackground(prompt: string): Promise<string>
  ```

- **鍙傛暟璇存槑**:
  | 鍙傛暟鍚?| 绫诲瀷 | 蹇呭～ | 璇存槑 |
  | :--- | :--- | :--- | :--- |
  | `prompt` | `string` | 鏄?| 鐢熸垚鑳屾櫙鐨勬彁绀鸿瘝 |

- **杩斿洖鍊?*: `string` - 鐢熸垚鐨勮儗鏅浘鍍?URL

#### 3.1.6 璇嗗埆姝屾洸 (identifySong)

涓婁紶闊抽鐗囨锛岃瘑鍒瓕鏇蹭俊鎭€?
- **鏂规硶绛惧悕**:
  ```typescript
  async identifySong(audioBlob: Blob): Promise<SongInfo>
  ```

- **鍙傛暟璇存槑**:
  | 鍙傛暟鍚?| 绫诲瀷 | 蹇呭～ | 璇存槑 |
  | :--- | :--- | :--- | :--- |
  | `audioBlob` | `Blob` | 鏄?| 褰曞埗鐨勯煶棰戠墖娈?(寤鸿 5-10绉? WebM/WAV 鏍煎紡) |

- **杩斿洖鏍煎紡 (SongInfo)**:
  ```typescript
  interface SongInfo {
    title: string;       // 姝屾洸鏍囬
    artist: string;      // 鑹烘湳瀹?    album?: string;      // 涓撹緫鍚嶇О (鍙€?
    artwork?: string;    // 灏侀潰鍥?URL (鍙€?
    lyrics?: string;     // 姝岃瘝鍐呭 (鍙€?
  }
  ```

- **閿欒鐮?*:
  - `AUDIO_PROCESS_ERROR`: 闊抽澶勭悊澶辫触 (FileReader 閿欒)銆?  - `API_ERROR`: Gemini API 璋冪敤澶辫触銆?  - `NO_MATCH`: 鏈壘鍒板尮閰嶆瓕鏇层€?
### 3.2 闊抽宸ュ叿鎺ュ彛 (audioUtils.ts)

浠ヤ笅鏂规硶瀹氫箟鍦?`src/services/audioUtils.ts` 涓紝鎻愪緵闊抽澶勭悊宸ュ叿鍑芥暟銆?
#### 3.2.1 瑙ｇ爜闊抽鏁版嵁 (decodeAudioData)

瑙ｇ爜闊抽鏁版嵁銆?
- **鏂规硶绛惧悕**:
  ```typescript
  decodeAudioData(audioContext: AudioContext, arrayBuffer: ArrayBuffer): Promise<AudioBuffer>
  ```

- **鍙傛暟璇存槑**:
  | 鍙傛暟鍚?| 绫诲瀷 | 蹇呭～ | 璇存槑 |
  | :--- | :--- | :--- | :--- |
  | `audioContext` | `AudioContext` | 鏄?| 闊抽涓婁笅鏂?|
  | `arrayBuffer` | `ArrayBuffer` | 鏄?| 闊抽鏁版嵁缂撳啿鍖?|

- **杩斿洖鍊?*: `Promise<AudioBuffer>` - 瑙ｇ爜鍚庣殑闊抽缂撳啿鍖?
#### 3.2.2 鎻愬彇闊抽鐗瑰緛 (extractAudioFeatures)

鎻愬彇闊抽鐗瑰緛銆?
- **鏂规硶绛惧悕**:
  ```typescript
  extractAudioFeatures(audioBuffer: AudioBuffer): AudioFeatures
  ```

- **鍙傛暟璇存槑**:
  | 鍙傛暟鍚?| 绫诲瀷 | 蹇呭～ | 璇存槑 |
  | :--- | :--- | :--- | :--- |
  | `audioBuffer` | `AudioBuffer` | 鏄?| 闊抽缂撳啿鍖?|

- **杩斿洖鏍煎紡 (AudioFeatures)**:
  ```typescript
  interface AudioFeatures {
    duration: number;     // 闊抽鏃堕暱锛堢锛?    sampleRate: number;   // 閲囨牱鐜?    channels: number;     // 澹伴亾鏁?    energy: number;       // 鑳介噺鍊?    spectralCentroid: number; // 棰戣氨涓績
  }
  ```

### 3.3 瑙嗚鏈嶅姟鎺ュ彛 (visualService.ts)

浠ヤ笅鏂规硶瀹氫箟鍦?`src/services/visualService.ts` 涓紝鎻愪緵瑙嗚娓叉煋鐩稿叧鍔熻兘銆?
#### 3.3.1 鑾峰彇瑙嗚妯″紡鍒楄〃 (getVisualModes)

鑾峰彇鍙敤鐨勮瑙夋ā寮忓垪琛ㄣ€?
- **鏂规硶绛惧悕**:
  ```typescript
  getVisualModes(): VisualMode[]
  ```

- **杩斿洖鏍煎紡 (VisualMode)**:
  ```typescript
  interface VisualMode {
    id: string;          // 妯″紡 ID
    name: string;        // 妯″紡鍚嶇О
    description: string; // 妯″紡鎻忚堪
    type: '2d' | '3d';   // 妯″紡绫诲瀷
  }
  ```

#### 3.3.2 鐢熸垚棰滆壊 palette (generateColorPalette)

鐢熸垚棰滆壊 palette銆?
- **鏂规硶绛惧悕**:
  ```typescript
  generateColorPalette(mood: string): string[]
  ```

- **鍙傛暟璇存槑**:
  | 鍙傛暟鍚?| 绫诲瀷 | 蹇呭～ | 璇存槑 |
  | :--- | :--- | :--- | :--- |
  | `mood` | `string` | 鏄?| 鎯呮劅鍏抽敭璇?|

- **杩斿洖鍊?*: `string[]` - 棰滆壊 palette锛圚ex 浠ｇ爜鏁扮粍锛?
## 4. 鐘舵€佺鐞嗘帴鍙?
### 4.1 UI 鐘舵€佹帴鍙?(useUI)

- **鏂囦欢**: `src/context/AppContext.tsx`
- **鍔熻兘**: 绠＄悊 UI 鐩稿叧鐘舵€?
**杩斿洖鍊?*:
```typescript
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
```

### 4.2 瑙嗚鐘舵€佹帴鍙?(useVisuals)

- **鏂囦欢**: `src/context/AppContext.tsx`
- **鍔熻兘**: 绠＄悊瑙嗚鐩稿叧鐘舵€?
**杩斿洖鍊?*:
```typescript
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
```

### 4.3 闊抽鐘舵€佹帴鍙?(useAudioContext)

- **鏂囦欢**: `src/context/AppContext.tsx`
- **鍔熻兘**: 绠＄悊闊抽鐩稿叧鐘舵€?
**杩斿洖鍊?*:
```typescript
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
```

### 4.4 AI 鐘舵€佹帴鍙?(useAI)

- **鏂囦欢**: `src/context/AppContext.tsx`
- **鍔熻兘**: 绠＄悊 AI 鐩稿叧鐘舵€?
**杩斿洖鍊?*:
```typescript
interface AIContextType {
  lyricsStyle: LyricsStyle; showLyrics: boolean; setShowLyrics: (b: boolean | ((prev: boolean) => boolean)) => void;
  enableAnalysis: boolean; setEnableAnalysis: (b: boolean) => void;
  isIdentifying: boolean;
  performIdentification: (s: MediaStream) => Promise<void>;
  resetAiSettings: () => void; 
}
```

## 5. 璋冪敤绀轰緥

### 5.1 AI 鏈嶅姟璋冪敤绀轰緥

```typescript
import { aiService } from '@/services/aiService';

// 绀轰緥锛氳瘑鍒瓕鏇插苟鑾峰彇鍒嗘瀽缁撴灉
async function handleIdentify(audioBlob: Blob) {
  try {
    // 1. 妫€鏌?AI 鏈嶅姟鍙敤鎬?    if (!aiService.isAiServiceAvailable()) {
      throw new Error('AI service is not available');
    }

    // 2. 璇嗗埆姝屾洸
    const songInfo = await aiService.identifySong(audioBlob);
    console.log('Identified:', songInfo);

    // 3. 鐢熸垚鑹烘湳鑳屾櫙
    const background = await aiService.generateArtisticBackground(
      `Create a beautiful abstract background that matches the mood of the song "${songInfo.title}" by ${songInfo.artist}`
    );
    
    // 4. 浠庨煶棰戠敓鎴愯瑙夐厤缃?    const visualConfig = await aiService.generateVisualConfigFromAudio(audioBlob);
    
    // 5. 搴旂敤瑙嗚璁剧疆
    applyVisualSettings(visualConfig);
    
  } catch (error) {
    console.error('AI Service Error:', error);
  }
} 
```

### 5.2 闊抽鏈嶅姟璋冪敤绀轰緥

```typescript
import { decodeAudioData, extractAudioFeatures } from '@/services/audioUtils';

// 绀轰緥锛氬鐞嗛煶棰戞枃浠?async function processAudioFile(file: File) {
  try {
    // 1. 鍒涘缓闊抽涓婁笅鏂?    const audioContext = new AudioContext();
    
    // 2. 璇诲彇鏂囦欢
    const arrayBuffer = await file.arrayBuffer();
    
    // 3. 瑙ｇ爜闊抽鏁版嵁
    const audioBuffer = await decodeAudioData(audioContext, arrayBuffer);
    
    // 4. 鎻愬彇闊抽鐗瑰緛
    const features = extractAudioFeatures(audioBuffer);
    console.log('Audio features:', features);
    
    return features;
  } catch (error) {
    console.error('Audio processing error:', error);
    throw error;
  }
}
```

### 5.3 鐘舵€佺鐞嗕娇鐢ㄧず渚?
```typescript
import { useUI, useVisuals, useAudioContext, useAI } from '@/context/AppContext';

function ControlsPanel() {
  // 浣跨敤 UI 鐘舵€?  const ui = useUI();
  const { isDragging, setIsDragging, showToast, toggleFullscreen } = ui;
  
  // 浣跨敤瑙嗚鐘舵€?  const visuals = useVisuals();
  const { mode, setMode, colorTheme, setColorTheme, settings, setSettings, isThreeMode } = visuals;
  
  // 浣跨敤闊抽鐘舵€?  const audio = useAudioContext();
  const { sourceType, isListening, currentSong, playlist, togglePlayback, playNext, playPrev } = audio;
  
  // 浣跨敤 AI 鐘舵€?  const ai = useAI();
  const { showLyrics, setShowLyrics, isIdentifying, performIdentification } = ai;
  
  return (
    <div className="controls-panel">
      {/* 鎺у埗鐣岄潰浠ｇ爜 */}
    </div>
  );
}
```
