export const helpModal = {
  title: "帮助中心",
  intro: "Aura Flux 将音频转化为令人惊叹的视觉体验。进入一个沉浸式世界，您的音乐决定着艺术。",
  howItWorksTitle: "如何使用",
  howItWorksSteps: [
    "点击'启用音频系统'开始，授予麦克风权限以进行实时可视化。",
    "在'视觉'选项中选择不同的视觉模式，并调整速度、灵敏度和颜色等设置。",
    "在'播放'中上传本地音频文件，或使用'AI 链接'解析流媒体平台的 URL。",
    "在'音频输入'中启用'实时分析'，以进行 AI 驱动的歌曲识别和情绪驱动的视觉推荐。",
    "探索'文本'选项，添加自定义文本或歌词，并调整其外观和行为。",
    "使用'工作室'选项录制和导出您的视觉体验，与朋友分享。",
  ],
  troubleshootingTitle: "故障排除",
  troubleshootingSteps: [
    "确保您已授予麦克风权限，并且没有其他应用正在使用麦克风。",
    "检查您的浏览器是否支持 Web Audio API 和 WebGL。",
    "如果视觉效果卡顿，请尝试降低'质量'设置或关闭'实时分析'。",
    "如果音频文件无法播放，请确保它们是受支持的格式（MP3, WAV, FLAC, OGG）。",
    "如果 AI 功能不工作，请确保您已输入有效的 Gemini API 密钥。",
  ],
  faqTitle: "常见问题",
  faq: [
    {
      question: "Aura Flux 支持哪些音频格式？",
      answer: "Aura Flux 支持 MP3, WAV, FLAC, OGG 格式的本地文件，以及通过 AI 链接解析的流媒体平台 URL。",
    },
    {
      question: "AI 功能需要付费吗？",
      answer: "Aura Flux 的 AI 功能使用 Google Gemini API，您需要提供自己的 API 密钥，可能会产生相关费用。",
    },
    {
      question: "我可以在移动设备上使用 Aura Flux 吗？",
      answer: "Aura Flux 主要针对桌面浏览器优化，在移动设备上可能会有性能限制。",
    },
    {
      question: "如何导出我的视觉体验？",
      answer: "在'工作室'选项中，设置您的录制偏好，然后点击'录制视频'开始录制。完成后，您可以下载生成的视频。",
    },
    {
      question: "Aura Flux 是否收集我的数据？",
      answer: "Aura Flux 优先考虑隐私，音频处理在您的设备上进行，AI 请求最少，且不收集个人数据。",
    },
  ],
  contactTitle: "联系我们",
  contact: "如果您有任何问题或反馈，请通过 GitHub Issues 联系我们。",
};