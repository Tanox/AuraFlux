# OpenSpec: 贡献者行为准则 (10)

## 1. 核心理念 (v1.9.36)
我们欢迎并鼓励社区贡献，以使 Aura Flux 变得更加强大和富有创造力。为确保代码质量和项目可维护性，所有贡献者应遵循以下准则。

## 2. Git 工作流与分支策略
本项目采用 **Git Flow** 的简化变体：

- **`main`:** 生产分支。此分支代表了最新的稳定版本，只接受来自 `dev` 分支的合并。
- **`dev`:** 开发集成分支。所有功能和修复最终都会合并到此分支，作为下一个版本的候选。
- **功能分支 (`feature/...`):**
    - 用于开发新功能。
    - 命名规范: `feature/brief-feature-name` (e.g., `feature/add-new-renderer`)。
    - 从 `dev` 分支创建，并最终合并回 `dev` 分支。
- **修复分支 (`fix/...`):**
    - 用于修复 `dev` 分支中的 Bug。
    - 命名规范: `fix/issue-description` (e.g., `fix/resolve-safari-audio-bug`)。
    - 从 `dev` 分支创建，并最终合并回 `dev` 分支。

## 3. 代码提交规范
所有提交信息必须遵循 **Semantic Commits (语义化提交)** 规范。这有助于自动化生成更新日志 (Changelog) 和清晰地追踪项目历史。

- **格式:** `<type>(<scope>): <subject>`
- **示例:**
    - `feat(studio): add 4k recording option`
    - `fix(audio): prevent crash when mic disconnects`
    - `docs(openspec): update rendering specification`
    - `refactor(hooks): unify state logic in useVisualsState`
    - `style(controls): adjust padding on bento cards`
- **常用 `type`:**
    - `feat`: 新功能
    - `fix`: Bug 修复
    - `docs`: 文档变更
    - `style`: 代码风格调整（不影响逻辑）
    - `refactor`: 代码重构
    - `perf`: 性能优化
    - `test`: 测试相关

## 4. 编码风格与质量
- **格式化:** 使用 Prettier 和 ESLint (配置待定) 自动格式化代码。
- **命名:** 遵循 TypeScript/React 社区的標準命名約定（例如，组件使用 `PascalCase`，变量和函数使用 `camelCase`）。
- **注释:**
    - 所有文件头部必须包含文件信息注释。
    - 复杂的函数或算法必须有清晰的 JSDoc 注释。
- **版本号:** 遵循 **SemVer 2.0.0**。所有文件内的版本号必须与 `package.json` 保持一致。

---
*Aura Flux Contribution Guidelines - Version 1.9.36*
*Author: Sut*