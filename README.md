# Aura Flux 🎵👁️

### AI 驱动的 3D 音乐可视化与通感分析引擎 (v2.3.10)

[在线演示](https://aura.ewuse.com/) | [English](./README_EN.md) | [文档](./openspec/)

**Aura Flux** 是一款专业级的 Web 应用程序，可将音频频率转化为高保真生成艺术. 基于 **React 19**、**Three.js (WebGL)** 和 **Google Gemini 3 AI** 构建，实现了极致的边缘计算性能与云端智能的完美融合。

---

## 📚 文档目录

- [**项目架构与模块**](./openspec/01_core_architecture.md) - 架构设计与核心模块说明
- [**用户指南**](./openspec/14_user_guide.md) - 用户操作指南与流程图
- [**API 文档**](./openspec/12_api_reference.md) - 接口定义与 Gemini 集成说明
- [**常见问题与故障排除**](./openspec/15_faq.md) - 常见问题与故障排除
- [**OpenSpec 标准**](./openspec/) - 详细的技术规范文档

---

## 🚀 核心特性

- **混合渲染管线：** 在高保真 WebGL 3D 场景（基于 R3F）与针对低功耗设备优化的 2D Canvas 渲染器之间无缝切换。
- **AI 通感 HUD：** 由 **Gemini 3.0 Flash** 驱动的实时歌曲识别、情绪分析和全量歌词检索。
- **AI 视觉导演：** 让 AI 分析 15 秒音乐，自动为您调配最契合旋律的色彩、速度和视觉模式。
- **4K 工作室录制：** 支持以最高 4K 分辨率导出您的创作，并支持自定义录音增益和码率控制。
- **项目规范 (OpenSpec)：** 严格遵循 OpenSpec 标准进行文档和架构管理。
- **数据可移植性：** 支持将精密调校的设置导出为 JSON 文件，并在社区中分享您的预设。

*注意：为了环境兼容性，当前版本已暂时关闭 PWA 特性。*

---

## 🛠️ 安装与部署

### 1. 前置要求
- **Node.js**: v18.17.0 或更高版本
- **npm**: v9.0.0 或更高版本
- **Google Gemini API Key**: 启用 AI 功能所需

### 2. 本地开发

```bash
# 1. 克隆仓库
git clone https://github.com/sutchan/aura-flux.git
cd aura-flux

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 并添加您的 GEMINI_API_KEY（仅服务器端使用，不会暴露给客户端）

# 4. 启动开发服务器
npm run dev
```
访问应用：`http://localhost:3000`.

### 3. 生产构建

```bash
# 构建应用
npm run build

# 启动生产服务器
npm start
```

**重要：** 确保在生产环境变量中设置了 `GEMINI_API_KEY`。

### 4. Docker 部署

```bash
# 构建 Docker 镜像
docker build -t aura-flux .

# 使用 GEMINI_API_KEY 运行容器
docker run -p 3000:3000 -e GEMINI_API_KEY=your_key aura-flux
```

**安全提示：** API Key 现在仅在服务器端使用，永远不会暴露给客户端浏览器。

---

## 🧩 功能模块

| 模块 | 描述 |
| :--- | :--- |
| **音频引擎** | 使用 Web Audio API 进行实时 FFT 分析。提取低频、中频、高频能量。 |
| **可视化引擎** | 基于 Three.js 的渲染系统，支持多种场景（Silk、Neon 等）。 |
| **AI 服务** | 与 Google Gemini 集成，用于歌曲识别、歌词检索和情绪分析。 |
| **UI 系统** | 使用 React 和 Tailwind CSS 构建的响应式控制界面。 |

---

## 🧪 测试

```bash
# 运行所有测试
pnpm test

# 运行特定测试文件
pnpm test -- --testPathPatterns="logger.test|visualization.test"

# 运行带覆盖率的测试
pnpm test -- --coverage
```

**覆盖率要求：**
- 分支覆盖率: ≥80%
- 函数覆盖率: ≥80%
- 行覆盖率: ≥80%
- 语句覆盖率: ≥80%

---

## 📝 代码规范

本项目遵循严格的命名约定和编码标准：

- **文件命名**: 组件使用 PascalCase，钩子/工具函数使用 camelCase
- **目录结构**: 目录使用 kebab-case
- **类型定义**: 所有类型定义在 `src/types/index.ts` 中
- **可视化器注册**: 所有可视化器在 `src/components/visualizers/index.ts` 中注册

详细指南请参阅 [命名约定](./openspec/18_naming_conventions.md)。

---

## 📄 许可与署名

由 **Sut** 倾力开发。  
*当前版本: 2.3.10*  
*个人主页:* [https://github.com/sutchan/aura-flux](https://github.com/sutchan/aura-flux)
