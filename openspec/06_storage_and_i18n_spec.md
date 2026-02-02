# OpenSpec: 持久化与国际化规范 (06)

## 1. 存储架构
- **前缀隔离:** 使用 `av_v1_` 前缀。
- **多层级存储:** LocalStorage (设置) 与 IndexedDB (音频媒体)。

## 2. 国际化 (i18n) 系统
- **多语言支持:** 支持 EN, ZH, TW, JA, ES, KO, DE, FR, AR, RU 等 10 种语言。
- **RTL 支持:** 阿拉伯语环境下自动翻转 UI。

---
*Aura Flux Storage & i18n Specification - Version 1.8.93*
*Author: Sut*