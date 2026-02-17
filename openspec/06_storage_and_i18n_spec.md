# OpenSpec: 持久化与国际化规范 (06)

## 1. 存储架构 (v1.9.36)

### 1.1. LocalStorage (配置层)
- **Prefix:** `av_v1_`。
- **Keys:** `settings`, `mode`, `theme`, `language`, `apiKeys` (加密)。
- **持久化:** 每次 `setSettings` 均会触发序列化存储。

### 1.2. IndexedDB (数据层)
- **DB Name:** `AuraFluxDB`。
- **Store:** `playlist`。
- **内容:** 存储 `Track` 对象（包含 `File` Blob、Metadata、专辑封面 Base64）。这允许用户在刷新页面后即刻恢复播放环境。

## 2. 国际化 (i18n) 系统
- **支持语言:** en, zh, tw, ja, es, ko, de, fr, ar, ru, pt (新加入)。
- **动态加载:** 采用静态对象引入而非运行时 Fetch，确保极速加载。
- **语义化映射:**
  - `modes`: 对应 `VisualizerMode` 枚举的本地化名称。
  - `themes`: 动态生成的配色方案标签。
  - `regions`: AI 识别的目标地区设置。

---
*Aura Flux Storage & i18n Specification - Version 1.9.36*
*Author: Sut*