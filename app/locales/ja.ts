/**
 * File: app/locales/ja.ts
 * Version: v1.9.36
 * Author: Sut
 * Description: Placeholder Japanese (ja) translations.
 */

import { LyricsStyle, VisualizerMode } from '../../types';
import { COLOR_THEMES } from '../../constants';

// --- Helper for creating theme names, directly from constants for now ---
const THEME_NAMES = ["Vaporwave", "Aurora", "Sunset", "Cotton Candy", "Electric", "Neon", "Matrix", "Gold", "Royal", "Solar", "Ocean", "Cyber", "Sakura", "Arctic", "Desert", "Voltage", "Emerald", "Cyanide"];
const getThemeLabels = () => {
  const labels: { [key: string]: string } = {};
  COLOR_THEMES.forEach((_, i) => {
    labels[i.toString()] = THEME_NAMES[i];
  });
  return labels;
};

export const ja = {
  // --- Global / Common strings ---
  common: {
    queue: "Queue",
    empty: "Empty",
    clearAll: "Clear All",
    confirmClear: "Are you sure you want to clear the playlist?",
    updateAvailable: "New update detected",
    updateAction: "Refresh Now",
    dropFiles: "DROP TO IMPORT",
    unknownTrack: "Unknown Track",
    unknownArtist: "Unknown Artist",
    track: "Track",
    artist: "Artist",
    loading: "Loading",
    processing: "Processing",
    simple: "Simple",
    advanced: "Advanced",
    active: "Tracks",
  },

  // --- App Version & Info ---
  appVersion: "v1.9.36",
  appTitle: "Aura Flux",
  welcomeSubtitle: "Synesthetic Intelligence Engine",
  startExperience: "INITIALIZE SYSTEM",

  // --- Onboarding ---
  onboarding: {
    welcome: "Welcome",
    subtitle: "Let's set up your Aura Flux experience",
    selectLanguage: "Select your preferred language",
    next: "Next",
    back: "Back",
    finish: "Finish",
    features: {
      title: "Unlock Your Aura Flux Experience",
      visuals: {
        title: "Dynamic Visuals",
        desc: "Transform your audio into stunning, real-time generative art with 2D & 3D visualizers."
      },
      ai: {
        title: "AI Synesthesia",
        desc: "Get real-time song identification, mood analysis, and smart visual recommendations powered by Gemini 3.0."
      },
      privacy: {
        title: "Privacy First",
        desc: "Audio processing happens on your device. AI requests are minimal, anonymized, and secure."
      }
    },
    shortcuts: {
      title: "Master the Flow",
      desc: "Quickly navigate and control your experience with intuitive shortcuts.",
    },
    sections: {
      essentials: "Essentials",
      visual: "Visual Controls",
      advanced: "Advanced Features",
    }
  },

  // --- Controls / Tabs ---
  tabs: {
    visual: "Visuals",
    input: "Audio Input",
    playback: "Playback",
    text: "Text Overlay",
    studio: "Studio",
    system: "System",
  },

  // --- Visual Panel ---
  visualPanel: {
    display: "Display Quality",
    aiBg: "AI Background",
    generateBg: "Forge AI Art",
    regenerate: "Reforge Art",
    showBg: "Show AI BG",
    opacity: "Opacity",
    bgGenerated: "AI Background Generated",
  },

  // --- Audio Panel ---
  audioPanel: {
    audioInput: "Signal Architecture",
    mic: "Microphone",
    defaultMic: "Default Microphone",
    start: "START CAPTURE",
    stop: "STOP CAPTURE",
    fileActive: "ACTIVE STREAM",
    analysisAi: "Neural Engine",
    enableAi: "Live Analysis",
    apiKey: "Gemini API Key",
    apiKeyPlaceholder: "Gemini Key...",
    saved: "READY",
    update: "UPD",
    keyVerified: "Key Verified & Saved",
    keyCleared: "Key Cleared",
    keyInvalid: "Invalid Gemini API Key",
    aiDirector: "AI Auto-Director",
    analyzing: "Analyzing...",
    recognitionSource: "AI Protocol",
    save: "SAVE",
  },

  // --- Player Panel ---
  player: {
    nowPlaying: "Now Playing",
    playlistTitle: "Playlist",
    noActiveTrack: "No Active Track",
    add: "Local Files",
    addUrl: "AI Link",
    urlPlaceholder: "Paste URL or Playlist Link...",
    supportInfo: "Supports MP3, WAV, FLAC, OGG & Popular Streaming Platforms (AI-Powered)",
    import: "Imported",
    importing: "AI Parsing Playlist...",
    bg: "Album Art Background",
    cover: "Info Overlay",
    blur: "Blur Amount",
    info: "Meta Info",
  },

  // --- Custom Text Panel ---
  textPanel: {
    overlay: "Text Layer Setup",
    appearance: "Style & Typography",
  },

  // --- System Panel ---
  systemPanel: {
    localization: "Aesthetics & Language",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    uiMode: "UI Mode",
    interface: "System & Behavior",
    installApp: "Install Aura Flux App",
    factoryReset: "Factory Reset All Settings",
  },

  // --- Global Settings / Shared ---
  sensitivity: "Gain",
  speed: "Speed",
  smoothing: "Inertia",
  glow: "Glow",
  trails: "Trails",
  autoRotate: "Auto Cycle",
  cycleColors: "Auto Cycle",
  hideCursor: "Hide Cursor",
  fftSize: "FFT Size",
    quality: "Quality",
    monitor: "Monitor",
    wakeLock: "Keep Awake",
    showFps: "Show FPS",
    showTooltips: "Show Tooltips",
    doubleClickFullscreen: "Double-Click Fullscreen",
    autoHideUi: "Auto Hide UI",
    mirrorDisplay: "Mirror Display",
  language: "Language",
  region: "Region",
  visualizerMode: "Visualizer Mode",
  styleTheme: "Style Theme",
  recognitionSource: "AI Protocol",
  showLyrics: "Lyrics Display",
  lyricsStyle: "Lyrics Style",
  lyricsPosition: "Anchor Position",
  textFont: "Font",
  textSize: "Size",
  textRotation: "Rotation",
  textAudioReactive: "Pulse",
  text3D: "3D Effect",
  customColor: "Dynamic Chroma",
  customText: "Text Layer",
  customTextPlaceholder: "ENTER TEXT",
  textSource: "Content Source",
  showOptions: "Show Controls",
  hideOptions: "Hide Controls",
  randomize: "Randomize",

  // --- Placeholders for dynamic lists / Enums ---
  modes: {
    [VisualizerMode.PLASMA]: "Plasma Flow",
    [VisualizerMode.BARS]: "Spectrum Bars",
    [VisualizerMode.DIGITAL_GRID]: "Digital Grid",
    [VisualizerMode.SILK_WAVE]: "Lumina Silk",
    [VisualizerMode.OCEAN_WAVE]: "Ocean Waves",
    [VisualizerMode.PARTICLES]: "Starfield",
    [VisualizerMode.TUNNEL]: "Warp Tunnel",
    [VisualizerMode.RINGS]: "Resonance Rings",
    [VisualizerMode.LASERS]: "Laser Beams",
    [VisualizerMode.FLUID_CURVES]: "Fluid Curves",
    [VisualizerMode.WAVEFORM]: "Spectral Ribbons",
    [VisualizerMode.NEBULA]: "Cosmic Nebula",
    [VisualizerMode.RIPPLES]: "Concentric Ripples",
    [VisualizerMode.SPIRAL]: "Logarithmic Spiral",
    [VisualizerMode.NEURAL_FLOW]: "Neural Flow",
    [VisualizerMode.CUBE_FIELD]: "Cube Field",
    [VisualizerMode.KINETIC_WALL]: "Kinetic Wall",
    [VisualizerMode.RESONANCE_ORB]: "Resonance Orb",
  },
  modeDescriptions: {
    [VisualizerMode.PLASMA]: "Hypnotic, flowing energy fields with vibrant color blending.",
    [VisualizerMode.BARS]: "Classic audio spectrum bars, dynamically reacting to frequencies.",
    [VisualizerMode.DIGITAL_GRID]: "An immersive 3D digital grid, reacting with light pulses.",
    [VisualizerMode.SILK_WAVE]: "Fluid, glowing ribbons that undulate with audio energy.",
    [VisualizerMode.OCEAN_WAVE]: "A stylized terrain of waves, visualizing audio history.",
    [VisualizerMode.PARTICLES]: "A dynamic starfield or particle cloud, reacting to high frequencies.",
    [VisualizerMode.TUNNEL]: "A pulsating geometric tunnel, creating a sense of warp speed.",
    [VisualizerMode.RINGS]: "Concentric rings expanding and contracting with audio peaks.",
    [VisualizerMode.LASERS]: "Sharp, vibrant laser beams cutting through the visual space.",
    [VisualizerMode.FLUID_CURVES]: "Smooth, flowing curves that shift and morph with sound.",
    [VisualizerMode.WAVEFORM]: "Abstract waveforms creating spectral ribbons across the screen.",
    [VisualizerMode.NEBULA]: "A soft, evolving cloud of gas and dust, ambient and reactive.",
    [VisualizerMode.RIPPLES]: "Expanding circular ripples, emanating from the center on beats.",
    [VisualizerMode.SPIRAL]: "A logarithmic spiral of particles, reacting to frequency changes.",
    [VisualizerMode.NEURAL_FLOW]: "Complex, interconnected lines forming a fluid, organic network.",
    [VisualizerMode.CUBE_FIELD]: "A field of glowing cubes that animate and change size with the music.",
    [VisualizerMode.KINETIC_WALL]: "A dynamic wall of elements that push and pull in response to audio.",
    [VisualizerMode.RESONANCE_ORB]: "A central sphere that morphs its surface based on audio input.",
  },

  lyricsStyles: {
    [LyricsStyle.STANDARD]: "Standard",
    [LyricsStyle.KARAOKE]: "Karaoke",
    [LyricsStyle.MINIMAL]: "Minimal",
  },

  themes: getThemeLabels(),

  aiProviders: {
    GEMINI: "Gemini 3.0 (Google)",
    OPENAI: "GPT-4o (OpenAI)",
    GROQ: "Groq (Custom)",
    CLAUDE: "Claude (Anthropic)",
    DEEPSEEK: "DeepSeek",
    QWEN: "Qwen (Alibaba Cloud)",
    MOCK: "Local Mock (Dev Only)",
  },

  regions: {
    global: "Global",
    US: "United States",
    CN: "China",
    JP: "Japan",
    KR: "Korea",
    EU: "Europe",
    LATAM: "Latin America",
  },

  textSources: {
    auto: "Auto",
    custom: "Manual",
    song: "Song",
    clock: "Clock",
  },

  fonts: {
    default: "Inter (Default)",
    system: "System UI",
    mono: "JetBrains Mono",
    modern: "Montserrat",
    heavy: "Oswald",
    elegant: "Playfair Display",
    retro: "Courier New",
    serif: "Times New Roman",
    custom: "Custom...",
  },

  positions: {
    tl: "Top Left", tc: "Top Center", tr: "Top Right",
    ml: "Middle Left", mc: "Middle Center", mr: "Middle Right",
    bl: "Bottom Left", bc: "Bottom Center", br: "Bottom Right",
  },

  presets: {
    title: "Atmosphere Engine",
    hint: "Visual Presets",
    select: "Choose a mood...",
    all_modes: "All Modes (Cycle)",
    calm: "Calm Meditation",
    party: "Party Vibes",
    ambient: "Ambient Dream",
    galaxy: "Deep Galaxy",
    cyberpunk: "Cyberpunk City",
    retrowave: "Retrowave Sunset",
    psychedelic: "Psychedelic Trip",
    vocal: "Vocal Focus",
  },
  qualities: {
    low: "Low (Energy)",
    med: "Medium (Balanced)",
    high: "High (Fidelity)",
  },

  // --- Hints for Tooltips ---
  hints: {
    randomize: "Randomize Visuals & Colors",
    resetVisual: "Reset Visual Settings",
    resetAudio: "Reset Audio Settings",
    resetText: "Reset Text Overlay Settings",
    autoRotate: "Automatically cycle through visual modes",
    enterLocalFont: "e.g. Arial, Helvetica Neue",
    confirmReset: "Are you sure you want to reset all settings to factory defaults? This cannot be undone.",
    recGain: "Adjust audio volume for video recording. Higher gain can lead to louder, more reactive visuals in recordings.",
    syncStart: "If playing a file, start recording automatically when playback begins.",
    countdown: "Display a countdown before recording starts.",
  },

  // --- Toasts / Notifications ---
  toasts: {
    canvasNotFound: "Canvas element not found.",
    audioNotReady: "Audio source not ready. Try starting microphone or playing a file.",
    noVideoFormat: "No supported video format for recording.",
    recInitFail: "Recording initialization failed.",
    recStart: "Recording Started!",
    processing: "Processing video...",
    reviewReady: "Video Ready for Review!",
    exportFail: "Video export failed.",
    copied: "Link Copied!",
    unsupported: "Share functionality not supported by your browser.",
    aiDirectorReq: "Gemini API Key required for AI features.",
    aiFail: "AI generation failed. Check API Key or try again.",
  },

  // --- Errors ---
  errors: {
    accessDenied: "Microphone access denied. Please enable in browser settings.",
    trackLoad: "Unable to load track or decode audio data.",
    configMissing: "API Key is missing or invalid. Please configure in System Settings.",
    unsupportedTitle: 'Browser Not Supported',
    unsupportedText: 'Aura Flux requires modern browser features (like microphone access) that are not available. Please update to a recent version of Chrome, Firefox, or Safari.',
  },

  // @fix: Add `config` object
  config: {
    title: "Data Management",
    export: "EXPORT",
    import: "IMPORT",
    exported: "Configuration Exported",
    importSuccess: "Configuration imported",
    invalidFile: "Invalid configuration file",
    library: "PRESET ARCHIVE",
    placeholder: "Preset Name...",
    save: "SAVE",
    load: "Loaded Preset",
    delete: "Removed",
    deleteConfirm: "Are you sure you want to delete this preset?",
    limitReached: "Preset limit reached (max 3).",
    saved: "Saved",
  },

  // @fix: Add `songOverlay` object
  songOverlay: {
    provider: {
      local: 'Local Cache',
      mock: 'Simulation',
      id3: 'ID3 Tag',
    },
    aiSynesthesia: 'AI Synesthesia',
    googleSearch: 'Google Search',
  },

  // @fix: Add `wrongSong` key
  wrongSong: "Retry Analysis",

  // --- Share ---
  share: {
    appTitle: "Aura Flux - AI Music Visualizer",
    appMessage: "Experience Aura Flux - AI Music Visualizer! 🎵✨",
    shareApp: "Share App",
    title: "Aura Flux Creation",
    message: "Check out this art created with Aura Flux! \n\n{song} by {artist}",
    hashtags: "#AuraFlux #AuraFluxVisualizer #AIMusicArt",
    copied: "Text copied!",
    unsupported: "Sharing not supported",
  },

  // --- Studio Panel ---
  studioPanel: {
    videoConfig: "Video Settings",
    audioMix: "Audio Mix",
    previewTitle: "Recording Preview",
    discard: "Discard",
    share: "Share",
    save: "Save",
    stopping: "Stopping...",
    processing: "Processing...",
    arming: "Armed & Waiting...",
    start: "Record Video",
    settings: {
      resolution: "Resolution",
      resNative: "Native",
      aspectRatio: "Aspect Ratio",
      fps: "FPS",
      codec: "Video Format",
      bitrate: "Bitrate",
      recGain: "Recording Gain",
      syncStart: "Sync to Playback",
      countdown: "Countdown",
    },
    hints: {
      recGain: "Adjust audio volume for video recording. Higher gain can lead to louder, more reactive visuals in recordings.",
      syncStart: "If playing a file, start recording automatically when playback begins.",
      countdown: "Display a countdown before recording starts.",
    },
    formats: {
      vp9: "WebM (VP9)",
      vp8: "WebM (VP8)",
      mp4_h264: "MP4 (H.264)",
    },
  },

  // @fix: Add missing 'helpModal' property
  helpModal: {
    title: "Help & Info",
    tabs: {
      guide: "Guide",
      shortcuts: "Shortcuts",
      about: "About",
    },
    intro: "Aura Flux transforms sound into breathtaking visual experiences. Dive into an immersive world where your music dictates the art.",
    howItWorksTitle: "How to Use",
    howItWorksSteps: [
      "Click 'Initialize System' to start, granting microphone access for real-time visualization.",
      "Explore diverse visual modes and fine-tune settings like speed, sensitivity, and colors in the 'Visuals' tab.",
      "Upload local audio files in 'Playback' or use 'AI Link' to parse URLs from popular streaming platforms.",
      "Enable 'Live Analysis' in 'Audio Input' for AI-powered song identification and mood-driven visual recommendations.",
      "Personalize with custom text overlays, fonts, and 3D effects under 'Text Overlay'.",
      "Capture your creations in up to 4K resolution using the 'Studio' tools, or manage language and UI preferences in 'System'.",
    ],
    shortcutsTitle: "Keyboard Shortcuts",
    shortcutItems: {
      toggleMic: "Toggle Mic/Playback",
      fullscreen: "Toggle Fullscreen",
      lyrics: "Toggle AI Info / Lyrics",
      hideUi: "Toggle UI Visibility",
      randomize: "Randomize Visuals",
      speed: "Adjust Speed",
      glow: "Toggle Glow",
      trails: "Toggle Trails",
      changeMode: "Cycle Visual Mode",
      changeTheme: "Cycle Color Theme",
      tabs: "Switch Panel Tabs",
      help: "Open Help (This Modal)",
    },
    gesturesTitle: "Touch Gestures",
    gestureItems: {
      swipeMode: "Swipe Left/Right: Change Visual Mode",
      swipeSens: "Swipe Up/Down: Adjust Sensitivity (Gain)",
      longPress: "Long Press: Toggle AI Info / Lyrics Overlay",
    },
    projectInfoTitle: "Our Vision",
    aboutDescription: "Aura Flux allows you to see the invisible. It's an exploration into the synergy of generative art, real-time audio processing, and advanced AI. Our mission is to transform auditory experiences into deeply personal and visually stunning journeys.",
    techStackTitle: "Core Technology",
  },
};
