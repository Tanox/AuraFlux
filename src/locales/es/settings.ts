import { VisualizerMode, LyricsStyle } from '../../types/index';
import { COLOR_THEMES } from '../../constants/index';

const THEME_NAMES = ["Vaporwave", "Aurora", "Ocaso", "Algod贸n de Az煤car", "El茅ctrico", "Ne贸n", "Matrix", "Oro", "Real", "Solar", "Oc茅ano", "Cyber", "Sakura", "脕rtico", "Desierto", "Voltaje", "Esmeralda", "Cianuro"];
const getThemeLabels = () => {
  const labels: { [key: string]: string } = {};
  COLOR_THEMES.forEach((_: any, i: number) => {
    labels[i.toString()] = THEME_NAMES[i];
  });
  return labels;
};

export const settings = {
  tabs: {
    visual: "Visuales",
    input: "Entrada de Audio",
    playback: "Reproducci贸n",
    text: "Texto Superpuesto",
    studio: "Estudio",
    system: "Sistema",
  },
  sensitivity: "Ganancia",
  speed: "Velocidad",
  smoothing: "Inercia",
  glow: "Brillo",
  trails: "Estelas",
  autoRotate: "Ciclo Auto",
  cycleColors: "Ciclo Auto",
  hideCursor: "Ocultar Cursor",
  fftSize: "Tama帽o FFT",
  quality: "Calidad",
  monitor: "Monitor",
  wakeLock: "Mantener Despierto",
  showFps: "Mostrar FPS",
  showTooltips: "Mostrar Ayuda",
  doubleClickFullscreen: "Doble Clic Pantalla Completa",
  autoHideUi: "Auto Ocultar UI",
  mirrorDisplay: "Espejo",
  language: "Idioma",
  region: "Regi贸n",
  visualizerMode: "Modo Visualizador",
  styleTheme: "Tema de Estilo",
  recognitionSource: "Protocolo IA",
  showLyrics: "Mostrar Letra",
  lyricsStyle: "Estilo de Letra",
  lyricsPosition: "Posición de Anclaje",
  textFont: "Fuente",
  textSize: "Tamaño",
  textRotation: "Rotación",
  textAudioReactive: "Pulso",
  text3D: "Efecto 3D",
  customColor: "Croma Dinámico",
  customText: "Capa de Texto",
  customTextPlaceholder: "INGRESAR TEXTO",
  textSource: "Fuente de Contenido",
  showOptions: "Mostrar Controles",
  hideOptions: "Ocultar Controles",
  randomize: "Aleatorio",
  modes: {
    [VisualizerMode.PLASMA]: "Flujo de Plasma",
    [VisualizerMode.BARS]: "Barras de Espectro",
    [VisualizerMode.DIGITAL_GRID]: "Cuadr铆cula Digital",
    [VisualizerMode.SILK_WAVE]: "Seda Luminosa",
    [VisualizerMode.OCEAN_WAVE]: "Olas del Oc茅ano",
    [VisualizerMode.PARTICLES]: "Part铆culas",
    [VisualizerMode.TUNNEL]: "T煤nel",
    [VisualizerMode.RINGS]: "Anillos",
    [VisualizerMode.LASERS]: "Rayos L谩ser",
    [VisualizerMode.WAVEFORM]: "Forma de Onda",
    [VisualizerMode.NEURAL_FLOW]: "Flujo Neuronal",
    [VisualizerMode.CUBE_FIELD]: "Campo de Cubos",
    [VisualizerMode.KINETIC_WALL]: "Pared Cin茅tica",
    [VisualizerMode.VORTEX]: "V贸rtice Gravitacional",
  },
};