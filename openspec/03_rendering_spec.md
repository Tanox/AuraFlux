# OpenSpec: 视觉生成渲染规范 (03)

## 1. 2D 渲染模式鲁棒性 (v1.8.95)
- **Enhanced Tunnel (v1.9.2):** 引入 `Temporal Jitter Reduction`。
- **内存回收:** 2D 渲染器在切换时必须释放其私有的 `spriteCache`。

---
*Aura Flux Rendering Specification - Version 1.8.95*
*Author: Sut*