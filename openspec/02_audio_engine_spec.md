# OpenSpec: 音频引擎规范 (02)

## 1. 信号处理流程 (v1.9.36)
音频引擎由 `app/hooks/useAudio.ts` 驱动，支持立体声解耦分析。

1.  **输入源切换:**
    - **MICROPHONE:** 通过 `getUserMedia` 捕捉，支持动态设备热切换。
    - **FILE:** 使用 `decodeAudioData` 解码。支持大文件异步锁，防止快速连击导致内存崩溃。
2.  **立体声架构:**
    - 使用 `ChannelSplitterNode` 将左/右声道分离。
    - 绑定两个独立的 `AnalyserNode` (`analyser`, `analyserR`)，为视觉模式提供相位差数据（如 `WaveformRenderer`）。
3.  **采样与滤波:**
    - 默认 `fftSize: 512`，支持 2048 (Pro) 设置。
    - 内置 `AdaptiveNoiseFilter`: 基于频谱包络的动态噪声抑制。
    - 内置 `DynamicPeakLimiter`: 归一化能量输出，防止由于音频文件音量过大导致的视觉饱和。

## 2. 核心特征提取
- **Bass (0-60Hz):** 驱动 3D 场景的位移与 2D 模式的整体脉冲。
- **Energy (L/R):** 用于 `SilkWaveScene` 等模式的差异化扰动。
- **BeatDetection:** 基于 Spectral Flux 算法的节奏识别。

## 3. 媒体持久化
- 采用 **IndexedDB (AuraFluxDB)** 存储播放列表。
- 支持 `audioBufferToWav` 工具，可将本地解码后的音频转化为 Blob 发送至 AI 进行分析或导演。

---
*Aura Flux Audio Engine Specification - Version 1.9.36*
*Author: Sut*