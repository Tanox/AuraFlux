import { VisualizerMode, LyricsStyle } from '../../types/index';
import { COLOR_THEMES } from '../../constants/index';

const THEME_NAMES = ["Vaporwave", "Aurora", "Sonnenuntergang", "Zuckerwatte", "Elektrisch", "Neon", "Matrix", "Gold", "Königlich", "Solar", "Ozean", "Cyber", "Sakura", "Arktisch", "Wüste", "Spannung", "Smaragd", "Cyanid"];
const getThemeLabels = () => {
  const labels: { [key: string]: string } = {};
  COLOR_THEMES.forEach((_: any, i: number) => {
    labels[i.toString()] = THEME_NAMES[i];
  });
  return labels;
};

export const settings = {
  tabs: {
    visual: "Visuelles",
    input: "Audio-Eingang",
    playback: "Wiedergabe",
    text: "Textebene",
    studio: "Studio",
    system: "System",
  },
  sensitivity: "Verstärkung",
  speed: "Geschwindigkeit",
  smoothing: "Trägheit",
  glow: "Leuchten",
  trails: "Nachleuchten",
  autoRotate: "Auto-Zyklus",
  cycleColors: "Farben-Zyklus",
  hideCursor: "Cursor ausblenden",
  fftSize: "FFT-Größe",
  quality: "Qualität",
  monitor: "Monitor",
  wakeLock: "Wachbleiben",
  showFps: "FPS anzeigen",
  showTooltips: "Tooltips",
  doubleClickFullscreen: "Doppelklick Vollbild",
  autoHideUi: "UI automatisch ausblenden",
  mirrorDisplay: "Spiegeln",
  language: "Sprache",
  region: "Region",
  visualizerMode: "Visualisierer-Modus",
  styleTheme: "Stil-Thema",
  recognitionSource: "KI-Protokoll",
  showLyrics: "Songtext anzeigen",
  lyricsStyle: "Text-Stil",
  lyricsPosition: "Ankerposition",
  textFont: "Schriftart",
  textSize: "Größe",
  textRotation: "Rotation",
  textAudioReactive: "Puls",
  text3D: "3D-Effekt",
  customColor: "Dynamisches Chroma",
  customText: "Textebene",
  customTextPlaceholder: "TEXT EINGEBEN",
  textSource: "Inhaltsquelle",
  showOptions: "Steuerung zeigen",
  hideOptions: "Steuerung verbergen",
  randomize: "Zufällig",
  modes: {
    [VisualizerMode.PLASMA]: "Plasma",
    [VisualizerMode.BARS]: "Balken",
    [VisualizerMode.DIGITAL_GRID]: "Digitales Gitter",
    [VisualizerMode.SILK_WAVE]: "Luminäse Seide",
    [VisualizerMode.OCEAN_WAVE]: "Ozeanwellen",
    [VisualizerMode.TUNNEL]: "Tunnel",
    [VisualizerMode.LASERS]: "Laserstrahlen",
    [VisualizerMode.WAVEFORM]: "Wellen",
    [VisualizerMode.NEURAL_FLOW]: "Neuraler Fluss",
    [VisualizerMode.CUBE_FIELD]: "Würfel-Feld",
    [VisualizerMode.KINETIC_WALL]: "Kinetische Wand",
    [VisualizerMode.VORTEX]: "Gravitationswirbel",
  },
};