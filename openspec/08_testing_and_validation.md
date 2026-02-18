# OpenSpec: 测试与验证规范 (08)

## 1. 测试层级 (v1.9.70)

### 1.1. 逻辑验证 (Unit)
- **重点:** `audioUtils.ts` (WAV 转换), `beatDetector.ts` (算法准确性)。

### 1.2. 流程集成 (Integration)
- **重点:** `useAudio` 到 `VisualizerCanvas` 的原始数据传递链。
- **AI 模拟:** 使用 `MOCK` 模式测试 UI 对识别结果的响应。

### 1.3. 端到端 (E2E)
- **关键场景:** 麦克风授权 -> 视觉反馈 -> 歌词加载 -> 视频录制导出。

## 2. 性能基准
- **帧率:** 在标准硬件（Intel/M1+ 集显）上，Med 模式下必须稳定在 60FPS。
- **Worker 负载:** 2D 渲染不应阻塞 UI 线程的主响应循环。

---
*Aura Flux Testing & Validation Specification - Version 1.9.70*
*Author: Sut*