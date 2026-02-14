# OpenSpec: 持久化与国际化规范 (06)

## 1. 数据存储层 (v1.9.2)
- **LocalStorage:** 存储轻量级配置（如 `settings.json`, `activeMode`）。
  - 前缀标识: `av_v1_`。
- **IndexedDB:** 存储媒体库音频文件，避免重复上传占用内存。
  - 数据库名: `AuraFluxDB`。
  - 核心 Store: `playlist`。

## 2. 国际化框架 (i18n)
- **支持语言:** 包含 中(简/繁), 英, 日, 韩, 西, 德, 法, 俄, 阿。
- **自适应逻辑:** 
  - 根据浏览器首选语言自动初始化。
  - 适配 RTL (从右向左) 布局（针对阿拉伯语）。

## 3. 配置迁移
- **Export/Import:** 支持导出 `.json` 格式的配置快照，版本号必须匹配以保证向前兼容。

---
*Aura Flux Storage & i18n Specification - Version 1.9.2*
*Author: Sut*