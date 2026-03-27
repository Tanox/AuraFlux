# OpenSpec: 音频引擎规范 (02)

## 1. 信号处理流程 (v1.9.75)
音频引擎由 `app/hooks/useAudio.ts` 驱动，并遵循 Web Audio API 标准。

- **输入源:** `Microphone` (麦克风) / `File` (文件) / `Playlist` (播放列表)。
- **核心节点:** 
  - `AudioContext`: 全局音频上下文，管理所有音频节点。
  - `MediaElementAudioSourceNode`: 处理文件播放。
  - `MediaStreamAudioSourceNode`: 处理麦克风输入。
  - `ChannelSplitterNode`: 分离立体声信号，支持双通道可视化。
  - `AnalyserNode` (L/R): 提供双通道实时频谱数据 (`Uint8Array`)。
- **参数:** 
  - `fftSize`: 动态可调 (512, 1024, 2048, 4096)，平衡频率分辨率与时间响应。
  - `smoothingTimeConstant`: 动态可调 (0.0 - 0.95)，控制视觉惯性。

## 2. 智能分析与处理
- **自适应降噪:** (`AdaptiveNoiseFilter`) 在 Worker 线程中实时运行，消除环境背景噪音，提高信噪比。
- **动态峰值限制:** (`DynamicPeakLimiter`) 自动调整增益，防止音频信号过载，确保视觉效果稳定。
- **节拍检测:** (`BeatDetector`) 在 Worker 线程中分析频谱能量突变，实时识别低频冲击（Kick/Bass），驱动视觉元素的脉冲效果。
- **频率分段:** `getAverage` 工具函数支持自定义频率范围（Bass, Mid, Treble）的能量提取。

---
*Aura Flux Audio Engine Specification - Version 1.9.75*
*Author: Sut*