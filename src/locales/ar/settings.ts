import { VisualizerMode, LyricsStyle } from '../../types/index';
import { COLOR_THEMES } from '../../constants/index';

const THEME_NAMES = ["سماء", "حريق", "جبل", "وردي غامق", "تركواز", "قمر", "أزرق", "بحري", "فضي", "ذهبي", "أحمر", "أخضر", "برتقالي", "بنفسجي", "أسود", "عتيق", "قهوة", "رمادي"];
const getThemeLabels = () => {
  const labels: { [key: string]: string } = {};
  COLOR_THEMES.forEach((_: any, i: number) => {
    labels[i.toString()] = THEME_NAMES[i];
  });
  return labels;
};

export const settings = {
  tabs: {
    visual: "المرئي",
    input: "مدخل الصوت",
    playback: "التشغيل",
    text: "نص التитуль",
    studio: "الستوديو",
    system: "النظام",
  },
  sensitivity: "الحساسية",
  speed: "السرعة",
  smoothing: "التعتيم",
  glow: "التوهج",
  trails: "التلال",
  autoRotate: "تدوير تلقائي",
  cycleColors: "تبديل الألوان",
  hideCursor: "إخفاء المؤشر",
  fftSize: "حجم FFT",
  quality: "الجودة",
  monitor: "مراقبة",
  wakeLock: "قفل الاستيقاظ",
  showFps: "عرض FPS",
  showTooltips: "عرض التلميحات",
  doubleClickFullscreen: "شاشة كاملة بالنقر مزدوج",
  autoHideUi: "إخفاء الواجهة تلقائيًا",
  mirrorDisplay: "عكس العرض",
  language: "اللغة",
  region: "المنطقة",
  visualizerMode: "وضع العرض",
  styleTheme: "لون النمط",
  recognitionSource: "مصدر التعرف",
  showLyrics: "عرض الكلمات",
  lyricsStyle: "نمط الكلمات",
  lyricsPosition: "موضع الكلمات",
  textFont: "الخط",
  textSize: "حجم الخط",
  textRotation: "تدوير النص",
  textAudioReactive: "تفاعل",
  text3D: "تسجيل النص ثلاثي الأبعاد",
  customColor: "لون مخصص",
  customText: "نص مخصص",
  customTextPlaceholder: "أدخل نصًا",
  textSource: "مصدر النص",
  showOptions: "عرض الخيارات",
  hideOptions: "إخفاء الخيارات",
  randomize: "عشوائي",
  modes: {
    [VisualizerMode.PLASMA]: "نمط بلازما",
    [VisualizerMode.BARS]: "أعمدة",
    [VisualizerMode.DIGITAL_GRID]: "شبكة رقمية",
    [VisualizerMode.SILK_WAVE]: "موجة حريرية",
    [VisualizerMode.OCEAN_WAVE]: "موجات المحيط",
    [VisualizerMode.PARTICLES]: "جسيمات",
    [VisualizerMode.TUNNEL]: "نفق",
    [VisualizerMode.RINGS]: "حلقات",
    [VisualizerMode.LASERS]: "ليزر",
    [VisualizerMode.WAVEFORM]: "موجات",
    [VisualizerMode.NEURAL_FLOW]: "تدفق عصبي",
    [VisualizerMode.CUBE_FIELD]: "ميدان المكعبات",
    [VisualizerMode.KINETIC_WALL]: "جدار حركي",
    [VisualizerMode.VORTEX]: "دوامة",
  },
};