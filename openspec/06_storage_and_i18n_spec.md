# OpenSpec: 持久化与国际化规范 (06)

## 1. 存储架构
- **前缀隔离:** 所有存储项使用 `av_v1_` 前缀。
- **多层级存储:**
  - **LocalStorage:** 存储基础设置（模式、参数）、AI 密钥（Base64 加密）、UI 状态。
  - **IndexedDB (AuraFluxDB):** 专门用于存储大体积 HQ 音频文件及其解析出的元数据，实现持久化媒体库。
- **快照管理 (Snapshots):** 支持导出当前全局配置为 JSON 文件，或在本地保存最多 3 个预设快照。

## 2. 国际化 (i18n) 系统
- **语言支持 (10 种):** English, 简体中文, 繁體中文, 日本語, Español, 한국어, Deutsch, Français, العربية, Русский。
- **RTL 支持:** 阿拉伯语环境下自动翻转 UI 排版与文档流。
- **完整性检查:** 每个版本发布前必须进行多国语言 Schema 对齐校验，确保无空键。

---
*Aura Flux Storage & i18n Specification - Version 1.8.83*
*Author: Sut*