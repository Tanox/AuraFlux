# Aura Flux - 项目架构与功能模块说明

## 1. 架构设计

Aura Flux 采用现代化的前端架构，结合 WebGL 高性能渲染与边缘 AI 计算能力。

### 1.1 核心架构图

```mermaid
graph TD
    User[用户] -->|交互/音频输入| UI[React UI 层]
    UI -->|控制指令| AudioEngine[音频分析引擎]
    UI -->|渲染指令| RenderEngine[渲染引擎 (Three.js/R3F)]
    UI -->|AI 请求| AIService[AI 服务层 (Gemini)]
    
    AudioEngine -->|频谱数据 (FFT)| RenderEngine
    AIService -->|分析结果 (Mood/Lyrics)| UI
    AIService -->|参数调整| RenderEngine
```

### 1.2 技术栈选型

| 模块 | 技术选型 | 说明 |
| :--- | :--- | :--- |
| **核心框架** | Next.js 15.1 (App Router) | 提供服务端渲染 (SSR) 与静态生成 (SSG) 能力，优化首屏加载。 |
| **UI 库** | React 19 + Tailwind CSS v4 | 构建响应式、高性能的用户界面。 |
| **3D 渲染** | Three.js + React Three Fiber | 声明式 3D 场景构建，利用 WebGL 硬件加速。 |
| **后期处理** | React Three Postprocessing | 实现电影级特效。 |
| **音频分析** | Web Audio API | 原生浏览器 API，实现实时 FFT 频谱分析与波形提取。 |
| **AI 智能** | Google Gemini 3.0 Flash | 提供实时歌词同步、情感分析与视觉参数自动调优。 |
| **状态管理** | React Context + Hooks | 轻量级状态管理，适应高频音频数据流。 |
| **部署** | Docker + Google Cloud Run | 容器化部署，支持弹性伸缩。 |

## 2. 功能模块说明

### 2.1 音频分析引擎 (Audio Engine)
- **核心功能**: 实时捕获麦克风或系统音频，进行 FFT (快速傅里叶变换) 分析。
- **关键逻辑**:
  - 使用 `AudioContext` 创建分析器节点。
  - 提取频域数据 (Frequency Data) 和时域数据 (Time Domain Data)。
  - 计算低频 (Bass)、中频 (Mid)、高频 (Treble) 能量值，用于驱动视觉效果。

### 2.2 渲染引擎 (Rendering Engine)
- **核心功能**: 将音频数据转化为 3D 视觉效果。
- **支持模式**:
  - **Digital Grid**: 数字化网格，适合科技感音乐。
  - **Silk Wave**: 丝绸波浪效果，适合柔和音乐。
  - **Ocean Wave**: 海洋波浪，适合舒缓节奏。
  - **Neon City**: 赛博朋克风格，适合电子音乐。
  - **Cosmic Void**: 宇宙粒子效果，适合氛围音乐。
  - **Vortex**: 漩涡引力效果，适合高能音乐。
  - **Kinetic Wall**: 动能墙，适合强节奏。
  - **Cube Field**: 立方体场，适合极简风格。
  - **Liquid Sphere**: 液态球体，适合流动感音乐。
  - **Neural Flow**: 神经流，适合复杂编曲。
- **关键逻辑**:
  - `useFrame` 钩子每帧更新几何体顶点或材质 Uniforms。
  - 响应音频能量值，动态调整物体大小、颜色、发光强度。

### 2.3 AI 智能服务 (AI Service)
- **核心功能**: 增强音乐体验的智能辅助。
- **子功能**:
  - **歌曲识别**: 录制片段上传至 Gemini 识别曲名、艺术家。
  - **歌词同步**: 获取并显示当前播放歌曲的歌词。
  - **情感分析**: 分析音乐情感 (如 "Happy", "Sad", "Energetic")。
  - **自动调参**: 根据情感分析结果，自动调整视觉效果参数 (如颜色、速度)。

### 2.4 用户界面 (User Interface)
- **核心功能**: 提供直观的控制面板。
- **模块**:
  - **播放控制**: 播放/暂停、麦克风开关。
  - **视觉设置**: 切换模式、调整参数 (Bloom, Speed, Sensitivity)。
  - **AI 面板**: 显示识别结果与歌词。
  - **设置面板**: 语言切换、性能监控、版本信息。

## 3. 目录结构说明

```
/
├── src/
│   ├── app/              # Next.js App Router 页面
│   ├── components/       # React 组件
│   │   ├── ui/           # 通用 UI 组件 (Button, Slider)
│   │   ├── visualizers/  # 3D 视觉效果组件
│   │   └── panels/       # 控制面板组件
│   ├── hooks/            # 自定义 Hooks (useAudioAnalyzer, useAIService)
│   ├── services/         # 业务逻辑服务 (AI, Audio)
│   ├── types/            # TypeScript 类型定义
│   └── utils/            # 工具函数
├── public/               # 静态资源
├── openspec/             # 项目规范文档
└── ...配置文件
```
