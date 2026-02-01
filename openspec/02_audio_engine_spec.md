# OpenSpec: 音频引擎规范 (02)

## 1. 信号流拓扑
支持立体声分离处理的音频链路：
- **实时模式 (LIVE):** `getUserMedia` -> `MediaStreamSource` -> `Splitter` -> `Dual Analysers`。
- **离线模式 (FILE):** `AudioContext.decodeAudioData` -> `BufferSource` -> `Analysers` -> `Destination`。

## 2. 核心算法
- **自适应降噪:** 动态学习环境底噪分布，自动减去噪声偏移。
- **动态峰值限制器:** 实时追踪信号峰值并引入衰减因子，防止视觉效果过载。
- **音频切片 (Audio Slicer):** 提取 15s PCM 片段转换为 WAV，供 Gemini AI 进行通感分析。

## 3. 持久化管理
- **AuraFluxDB (IndexedDB):** 存储大体积音频 Blob 及其元数据（ID3 标签、封面），实现本地媒体库。

---
*Aura Flux Audio Engine Specification - Version 1.8.83*
*Author: Sut*