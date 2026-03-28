# OpenSpec: Aura Flux 规范体系

## 规范版本
- **版本**: v2.0.4
- **更新日期**: 2026-03-28
- **作者**: Sut

## 规范索引

### 核心规范文件
1. **[01 系统架构规范](./01_architecture_spec.md)** - 技术栈与目录结构
2. **[02 音频引擎规范](./02_audio_engine_spec.md)** - 频谱处理与信号分析
3. **[03 视觉生成渲染规范](./03_rendering_spec.md)** - 2D/3D 渲染管线
4. **[04 AI 智能与语义规范](./04_ai_integration_spec.md)** - Gemini 3.0 集成
5. **[05 UI/UX 与交互规范](./05_interface_spec.md)** - 界面设计与用户交互
6. **[06 持久化与国际化规范](./06_storage_and_i18n_spec.md)** - 存储与多语言支持
7. **[07 部署与环境规范](./07_deployment_guide.md)** - 构建与发布流程
8. **[08 测试与验证规范](./08_testing_and_validation.md)** - 质量保障体系
9. **[09 营销与宣传文档](./09_marketing_and_press.md)** - 品牌与市场策略

### 支持文档
10. **[10 贡献者行为准则](./10_contribution_guidelines.md)** - 开发流程规范
11. **[11 安全策略与漏洞报告](./11_security_policy.md)** - 安全与隐私
12. **[12 API 参考文档](./12_api_reference.md)** - 接口规范
13. **[13 架构概览](./13_architecture_overview.md)** - 系统架构总览
14. **[14 用户指南](./14_user_guide.md)** - 使用说明
15. **[15 常见问题](./15_faq.md)** - FAQ 文档

## 规范标准

### 文档格式
- 所有文档使用 Markdown 格式
- 统一使用 UTF-8 编码，CRLF 行尾
- 文件名使用 `XX_描述.md` 格式，其中 XX 为两位数字序号

### 版本管理
- 采用语义化版本规范 (SemVer): MAJOR.MINOR.PATCH
- 所有规范文档版本号保持同步
- 每次修改递增 PATCH 版本号

### 内容要求
- 清晰的层级结构
- 详细的技术规范
- 一致的术语定义
- 可操作的实施指南

## 维护说明
- 规范文档应与代码实现保持同步
- 新增功能时应更新相应的规范文档
- 定期审查并更新规范以反映最新技术栈和最佳实践
