# OpenSpec: 持久化与国际化规范 (06)

## 1. 存储架构 (v2.0.4)

### 1.1. LocalStorage (配置层)
- **前缀:** `av_v1_`。
- **持久化对象:** `settings`, `mode`, `theme`, `language`, `onboarded`。
- **响应式:** 每次 `setSettings` 操作均同步持久化到本地。

### 1.2. IndexedDB (数据层)
- **数据库名:** `AuraFluxDB`。
- **内容:** 存储完整的 `Track` 对象，包括 File Blob 和专辑封面。允许离线恢复上次播放环境。

## 2. 国际化 (i18n) 系统
- **支持语言:** 包含 en, zh-CN, zh-TW, ja, es, ko, de, fr, ar, ru, pt-BR。
- **RTL 支持:** `ar` (阿拉伯语) 模式下，文档与 UI 自动切换为从右向左布局。
- **语义化:** 所有渲染器模式名称通过本地化字典映射。

---
*Aura Flux Storage & i18n Specification - Version 2.0.4*
*Author: Sut*