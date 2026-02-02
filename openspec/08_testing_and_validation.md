# OpenSpec: 测试与验证规范 (08)

## 1. 鲁棒性验证 (Robustness Tests - v1.8.95)
- [x] **AI 代码块过滤:** 模拟 Gemini 返回带 ```json 标记的响应，验证解析器是否能提取合法 JSON。
- [x] **上下文恢复:** 手动暂停 AudioContext，触发用户交互，验证 `ensureContext` 能否正确拉回 Running 状态。
- [x] **内存泄露检查:** 连续切换模式 100 次，验证 Canvas 内存占用是否保持稳定（由 cleanup 协议保障）。

## 2. 传统自检
- [x] **FFT Size 稳定性:** 在 3D 模式下热切换采样率无崩溃。
- [x] **移动端适配:** 在 iOS Safari 和 Android Chrome 上实现 60FPS 渲染。

---
*Aura Flux Testing & Validation - Version 1.8.95*
*Author: Sut*