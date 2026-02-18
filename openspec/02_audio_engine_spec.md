# OpenSpec: 音频引擎规范 (02)

## 1. 信号处理流程 (v1.9.70)
音频引擎由 `app/hooks/useAudio.ts` 驱动，并遵循 Web Audio API 标准。

- **输入源:** `Microphone` (麦克风) / `File` (文件)。
- **核心节点:** 
  - `AnalyserNode` (L/R): 提供双通道实时频谱数据 (`Uint8Array`)。
  - `ChannelSplitterNode`: 分离立体声信号。
- **参数:** 
  - `fftSize`: 动态可调 (512, 1024, 2048)。
  - `smoothingTimeConstant`: 动态可调 (0.0 - 0.95)，控制视觉惯性。

## 2. 智能降噪与增益
- **自适应降噪:** (`AdaptiveNoiseFilter`) 在 Worker 中实时消除环境背景噪音。
- **动态峰值限制:** (`DynamicPeakLimiter`) 自动调整增益，防止音频信号过载，确保视觉效果稳定。

---
*Aura Flux Audio Engine Specification - Version 1.9.70*
*Author: Sut*