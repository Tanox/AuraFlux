import { VisualizerMode, LyricsStyle } from '../../types/index';
import { COLOR_THEMES } from '../../constants/index';

const THEME_NAMES = ["蒸汽波", "极光", "日落", "棉花糖", "电光", "霓虹", "矩阵", "黄金", "真实", "太阳", "海洋", "赛博", "樱花", "北极", "沙漠", "电压", "翡翠", "氰化物"];
const getThemeLabels = () => {
  const labels: { [key: string]: string } = {};
  COLOR_THEMES.forEach((_: any, i: number) => {
    labels[i.toString()] = THEME_NAMES[i];
  });
  return labels;
};

export const settings = {
  tabs: {
    visual: "视觉",
    input: "音频输入",
    playback: "播放",
    text: "文本叠加",
    studio: "工作室",
    system: "系统",
  },
  sensitivity: "增益",
  speed: "速度",
  smoothing: "惯性",
  glow: "辉光",
  trails: "轨迹",
  autoRotate: "自动循环",
  cycleColors: "自动循环",
  hideCursor: "隐藏光标",
  fftSize: "FFT 大小",
  quality: "质量",
  monitor: "监测",
  wakeLock: "保持屏幕",
  showFps: "显示 FPS",
  showTooltips: "显示工具提示",
  doubleClickFullscreen: "双击全屏",
  autoHideUi: "自动隐藏 UI",
  mirrorDisplay: "镜像显示",
  showPlaybackTab: "播放选项卡",
  showStudioTab: "工作室选项卡",
  language: "语言",
  region: "区域",
  visualizerMode: "可视化模式",
  styleTheme: "风格主题",
  recognitionSource: "AI 协议",
  showLyrics: "歌词显示",
  lyricsStyle: "歌词风格",
  lyricsPosition: "锚点位置",
  textFont: "字体",
  textSize: "大小",
  textRotation: "旋转",
  textAudioReactive: "脉冲",
  text3D: "3D 效果",
  customColor: "动态色彩",
  customText: "文本图层",
  customTextPlaceholder: "输入文本",
  textSource: "内容来源",
  showOptions: "显示控制",
  hideOptions: "隐藏控制",
  randomize: "随机化",
  modes: {
    [VisualizerMode.PLASMA]: "等离子流",
    [VisualizerMode.BARS]: "均衡器",
    [VisualizerMode.DIGITAL_GRID]: "数字网格",
    [VisualizerMode.SILK_WAVE]: "丝光波",
    [VisualizerMode.OCEAN_WAVE]: "海洋",
    [VisualizerMode.PARTICLES]: "粒子",
    [VisualizerMode.RINGS]: "环形",
    [VisualizerMode.TUNNEL]: "隧道",
    [VisualizerMode.WAVEFORM]: "波形",
    [VisualizerMode.KINETIC_WALL]: "动态墙",
    [VisualizerMode.LASER]: "激光",
    [VisualizerMode.CUBE_FIELD]: "立方体场",
    [VisualizerMode.VORTEX]: "漩涡",
    [VisualizerMode.NEURAL_FLOW]: "神经流",
  },
  lyrics: {
    [LyricsStyle.STATIC]: "静态",
    [LyricsStyle.SYNCED]: "同步",
  },
  themeLabels: getThemeLabels(),
};