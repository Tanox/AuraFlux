# Aura Flux - Project Specification

本项目严格遵循 **OpenSpec** 标准进行架构设计与文档编写。Aura Flux 是一项融合了高性能实时频谱分析与 Google Gemini 3 系列生成式 AI 的沉浸式视听交互实验。

> **Note:** 原 `docs/` 目录下的文档已合并至本目录。请参阅 [Architecture](./13_architecture_overview.md) 与 [API Documentation](./12_api_reference.md)。

## 核心规范索引 (v2.0.0 Standard)

文档根据系统开发周期进行逻辑排序：

### I. 基础与核心架构
1.  **[01 架构与设计规范](./01_architecture_spec.md)** - 定义技术栈与目录标准（已移除 app/assets）。
2.  **[02 音频引擎与信号规范](./02_audio_engine_spec.md)** - 定义频谱处理算法与多通道分析。
3.  **[03 视觉生成渲染规范](./03_rendering_spec.md)** - 定义 2D Worker 与 3D R3F 渲染管线。

### II. 智能与交互增强
4.  **[04 AI 智能与语义规范](./04_ai_integration_spec.md)** - 定义 Gemini 3.0 通感协议。
5.  **[05 UI/UX 与交互规范](./05_interface_spec.md)** - 定义 Bento Grid 布局与沉浸式交互。
6.  **[06 持久化与国际化规范](./06_storage_and_i18n_spec.md)** - 定义 IndexedDB 与多国语言映射。

### III. 质量保障与交付
7.  **[07 部署与环境规范](./07_deployment_guide.md)** - 定义 Vite 构建与当前 PWA 状态。
8.  **[08 测试与验证](./08_testing_and_validation.md)** - 定义逻辑验证与性能基准。

### IV. 品牌、社区与安全
9.  **[09 营销与宣传文档](./09_marketing_and_press.md)** - 定义品牌识别与市场卖点。
10. **[10 贡献者行为准则](./10_contribution_guidelines.md)** - 定义代码准则与开发流程。
11. **[11 安全策略与漏洞报告](./11_security_policy.md)** - 定义隐私声明与报告流程。

---
*Aura Flux Project Specification - Final Audit v2.4.1*