# OpenSpec: 音频引擎规范 (02)

## 1. 播放状态机 (v1.8.97)
- **冷启动播放 (Cold-Start Playback)**: 
  - 系统必须能够处理“媒体库有文件但尚未解码 (audioBuffer 为空)”的场景。
  - 用户触发 `togglePlayback` 时，若 Buffer 不存在，系统应自动回退到 `playTrackByIndex(currentIndex)` 以触发异步解码与播放流。
- **状态自愈**: 监听 `AudioContext.statechange` 并执行心跳恢复。

---
*Aura Flux Audio Engine Specification - Version 1.8.97*
*Author: Sut*