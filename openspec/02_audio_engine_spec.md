# OpenSpec: 音频引擎规范 (02)

## 1. 信号处理流程 (v1.9.7)
1.  **输入采集:** 支持 `MediaStream` (麦克风) 与 `AudioBuffer` (本地文件)。
2.  **频谱分析:** 使用 `AnalyserNode` 进行 FFT 变换。
    - 默认 `fftSize`: 512 - 2048。
    - 平滑系数 (`smoothingTimeConstant`): 0.0 - 0.95。
3.  **特征提取:**
    - **Bass:** 0 - 60Hz 能量均值。
    - **Mids:** 100 - 800Hz 能量均值。
    - **Treble:** 2kHz+ 能量均值。
    - **RMS:** 总体有效值，用于调节全局缩放。

## 2. 播放状态机 (v1.9.7)
- **冷启动播放 (Cold-Start Playback):**
  - 当 `audioBuffer` 为空但播放列表存在时，`togglePlayback` 必须自动调用 `playTrackByIndex(currentIndex)`。
  - 必须包含异步解码锁 (`pendingTrackIdRef`)，防止快速切换导致的内存溢出。
- **自动增益补偿:** 通过 `AdaptiveNoiseFilter` 动态过滤背景底噪，确保低音量下视觉依然活跃。

## 3. 兼容性与自愈
- **AudioContext 恢复:** 必须在用户交互（如 `WelcomeScreen` 点击）后显式调用 `.resume()`。
- **断开处理:** 监听 `devicechange` 事件，在输入源消失时自动回退到静音状态而非崩溃。

---
*Aura Flux Audio Engine Specification - Version 1.9.7*
*Author: Sut*
