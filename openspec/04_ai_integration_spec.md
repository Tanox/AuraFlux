# OpenSpec: AI 智能与语义规范 (04)

## 1. 模型架构 (v1.9.73)
所有 AI 逻辑遵循 **Gemini 3.0 SDK** 最新规范。

- **Gemini 3.0 Flash:** 负责实时音频识别与「视觉导演」模式。
- **Gemini 2.5 Flash Image:** 负责根据音乐情绪生成艺术背景图。
- **Gemini 3.Pro:** 负责解析复杂的外部流媒体歌单。

## 2. 核心协议
### 2.1. 歌曲识别 (Identification)
- **输入:** 4 秒 Base64 编码的音频片段。
- **Schema:** 包含 `title`, `artist`, `mood`, `identified`。

### 2.2. AI 导演 (Auto-Director)
- **机制:** 分析 15 秒音频指纹。
- **反馈:** 自动配置视觉模式（如 `PLASMA`）、配色方案（3色数组）及动画速度。

### 2.3. 安全与 Key 管理
- **强制要求:** 密钥必须且仅能通过 `process.env.API_KEY` 访问。UI 严禁提供任何 Key 输入或配置界面。

---
*Aura Flux AI Integration Specification - Version 2.4.1*
*Author: Sut*