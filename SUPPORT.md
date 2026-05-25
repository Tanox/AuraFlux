# Aura Flux 支持指南 🛠️

[简体中文](./README_ZH.md) | [English](./README.md) | [Documentation](./openspec/)

---

## 📞 支持渠道

### 1. 官方文档
- [用户指南](./openspec/14_user_guide.md) - 详细的操作指南和流程图
- [常见问题](./openspec/15_faq.md) - 常见问题与故障排除
- [API 文档](./openspec/12_api_reference.md) - 接口定义与 Gemini 集成说明
- [架构文档](./openspec/01_core_architecture.md) - 项目架构与核心模块说明

### 2. 社区支持
- **GitHub Issues**: [提交问题](https://github.com/sutchan/aura-flux/issues)
- **Discussions**: [参与讨论](https://github.com/sutchan/aura-flux/discussions)
- **Email**: support@aura-flux.com

---

## ❓ 常见问题

### 音频相关
- **问题**: 无法访问麦克风
  **解决方法**: 确保浏览器已授予麦克风访问权限，检查系统隐私设置

- **问题**: 音频分析无响应
  **解决方法**: 尝试刷新页面，检查音频输入设备是否正常工作

- **问题**: 播放本地文件时无声音
  **解决方法**: 确保文件格式为 MP3、WAV 或 OGG，检查浏览器支持

### 可视化相关
- **问题**: 3D 模式性能卡顿
  **解决方法**: 切换到 2D 模式，降低视觉复杂度，或升级硬件

- **问题**: 画面闪烁或黑屏
  **解决方法**: 检查显卡驱动是否最新，尝试刷新页面

### AI 功能相关
- **问题**: AI 分析失败
  **解决方法**: 确保已正确配置 Gemini API Key，检查网络连接

- **问题**: 歌词未显示
  **解决方法**: 确保歌曲有可用的歌词数据，尝试重新分析

---

## 🐛 如何报告问题

### 步骤 1: 检查现有问题
在 [GitHub Issues](https://github.com/sutchan/aura-flux/issues) 中搜索是否已有类似问题

### 步骤 2: 收集信息
- **环境信息**: 浏览器版本、操作系统、硬件配置
- **复现步骤**: 详细描述如何触发问题
- **错误信息**: 浏览器控制台中的错误信息
- **截图/录屏**: 问题发生时的截图或录屏

### 步骤 3: 提交问题
使用以下模板创建新的 GitHub Issue:

```markdown
## 问题描述
[简要描述问题]

## 复现步骤
1. [步骤 1]
2. [步骤 2]
3. [步骤 3]

## 预期行为
[描述预期的正常行为]

## 实际行为
[描述实际发生的问题]

## 环境信息
- 浏览器: [浏览器名称及版本]
- 操作系统: [操作系统名称及版本]
- 硬件: [CPU、GPU 信息]
- Aura Flux 版本: [版本号]

## 附加信息
[截图、录屏或其他相关信息]
```

---

## 🤝 贡献指南

### 代码贡献
1. Fork 项目仓库
2. 创建功能分支: `git checkout -b feature/your-feature`
3. 提交更改: `git commit -m "feat: 描述你的功能"`
4. 推送到分支: `git push origin feature/your-feature`
5. 创建 Pull Request

### 文档贡献
- 改进现有文档
- 添加新的使用示例
- 翻译文档到其他语言

### 测试贡献
- 编写单元测试
- 测试新功能
- 报告边缘情况

详细的贡献指南请参考 [贡献指南](./openspec/10_contribution_guidelines.md)

---

## 🔧 技术支持

### 系统要求
- **浏览器**: Chrome 90+、Firefox 88+、Safari 14+、Edge 90+
- **硬件**: 
  - 最低: 4GB RAM, 集成显卡
  - 推荐: 8GB+ RAM, 独立显卡
- **网络**: 稳定的互联网连接（用于 AI 功能）

### 性能优化
- 对于低配置设备，建议使用 2D 可视化模式
- 关闭不必要的浏览器标签页
- 确保显卡驱动已更新
- 减少同时运行的应用程序

---

## 📊 支持响应时间

| 支持渠道 | 响应时间 |
| :--- | :--- |
| GitHub Issues | 1-3 个工作日 |
| 电子邮件 | 2-4 个工作日 |
| Discussions | 社区驱动，无固定响应时间 |

---

## 📝 版本支持

| 版本 | 支持状态 |
| :--- | :--- |
| v2.x | 完全支持 |
| v1.x | 仅安全更新 |
| v0.x | 不再支持 |

---

## 🆘 紧急支持

对于影响生产环境的严重问题，请在 GitHub Issue 中添加 `urgent` 标签，我们会优先处理。

---

## 📞 联系我们

- **官方网站**: [https://aura.ewuse.com](https://aura.ewuse.com)
- **GitHub**: [https://github.com/sutchan/aura-flux](https://github.com/sutchan/aura-flux)
- **Email**: support@aura-flux.com

---

*Developed with ❤️ by **Sut***
*Version: 2.3.11*
*Support Documentation Last Updated: 2026-04-22*