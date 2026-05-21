# OpenSpec 文档完善计划

## 版本信息
- **版本**: v1.0.0
- **更新日期**: 2026-05-20
- **作者**: Sut

## Why
当前 OpenSpec 文档虽然结构完整，但存在以下关键问题影响代码重构的指导性：

1. **文件路径不一致**：文档中的路径与实际项目结构不匹配
2. **关键文件缺失**：核心文件如 globals.css、index.tsx、layout.tsx、API 路由等未在文档中覆盖
3. **样式系统未文档化**：新增的 Tailwind 组件类、玻璃态设计模式、按钮系统等缺少规范说明
4. **现代 React 模式缺失**：useCallback/useMemo 优化、ARIA 无障碍属性、性能优化等最佳实践未纳入
5. **类型定义不完整**：部分类型引用但未完整定义

## What Changes

### 1. 核心架构文档更新 (01_core_architecture.md)
- **修正 App.tsx 路径**：从 `src/components/App.tsx` 改为 `src/App.tsx`
- **补充 index.tsx 文档**：添加 `src/app/index.tsx` 主入口文件规范
- **补充 layout.tsx 文档**：添加 `src/app/layout.tsx` 布局包装器规范
- **补充 globals.css 文档**：添加 `src/app/globals.css` 全局样式系统规范

### 2. 新增样式系统文档 (19_component_styles.md)
- **玻璃态设计系统**：glass-card、glass-panel 等组件类规范
- **按钮系统**：btn-base、btn-primary、btn-secondary、btn-ghost 等样式规范
- **动画系统**：动画类定义和动画性能指南
- **无障碍样式**：focus-visible、aria 相关的样式规范
- **选择器样式**：自定义滚动条、选中状态等

### 3. Tailwind 配置文档 (20_tailwind_config.md)
- **主题配置**：primary 颜色系列配置
- **自定义工具类**：@layer components 中的所有工具类
- **深色模式**：dark 模式下的样式处理规范

### 4. React 性能优化模式文档 (21_react_patterns.md)
- **Hook 优化**：useCallback、useMemo 使用指南
- **渲染优化**：React.memo、懒加载最佳实践
- **无障碍模式**：ARIA 属性使用规范
- **错误边界**：ErrorBoundary 组件使用规范

### 5. API 路由文档 (22_api_routes.md)
- **Gemini API 路由**：AI 服务端点规范
- **健康检查端点**：服务健康状态端点

### 6. 2D 可视化文档补充 (03_visual_rendering.md 扩展)
- **FishSwarmMode**：鱼群效果模式
- **Renderer**：渲染器核心
- **ParticleManager**：粒子管理器
- **objectPool**：对象池模式
- **types 和 utils**：类型定义和工具函数

### 7. 测试目录结构修正
- **修正测试路径**：从 `src/__tests__/` 改为实际路径
  - `src/hooks/tests/`：Hook 测试
  - `src/utils/tests/`：工具函数测试

### 8. 类型定义完整化
- **AudioTypes**：音频相关类型完整化
- **PlaybackTypes**：播放控制类型
- **RecordingTypes**：录制相关类型

## Impact

### 受影响的规范
- `01_core_architecture.md`：核心架构路径修正和补充
- `03_visual_rendering.md`：2D 可视化模式补充
- `05_ui_interaction.md`：UI 组件补充
- `08_testing_validation.md`：测试目录路径修正

### 新增规范
- `19_component_styles.md`：组件样式系统
- `20_tailwind_config.md`：Tailwind 配置规范
- `21_react_patterns.md`：React 性能模式
- `22_api_routes.md`：API 路由规范

### 文档版本同步
- 所有更新的文档版本号从 v2.3.10 升级到 v2.4.0
- 同步更新 README.md 索引

## ADDED Requirements

### Requirement: 样式系统文档化
系统 SHALL 提供完整的 Tailwind CSS 组件类和工具类规范文档，包括玻璃态设计、按钮系统、动画效果和无障碍样式。

#### Scenario: 新增 UI 组件
- **WHEN** 开发者需要创建新的 UI 组件
- **THEN** 可以参考 19_component_styles.md 获取样式规范
- **AND** 遵循玻璃态设计模式
- **AND** 使用标准按钮类

#### Scenario: 深色模式适配
- **WHEN** 开发者需要适配深色模式
- **THEN** 遵循 dark: 前缀规范
- **AND** 参考 globals.css 中的 dark 样式定义

### Requirement: React 性能模式文档化
系统 SHALL 提供 React Hook 优化和渲染性能最佳实践文档。

#### Scenario: 优化组件渲染
- **WHEN** 开发者需要优化组件渲染性能
- **THEN** 参考 21_react_patterns.md 中的 useCallback/useMemo 指南
- **AND** 遵循 React.memo 使用规范

#### Scenario: 添加无障碍支持
- **WHEN** 开发者需要添加无障碍属性
- **THEN** 参考 ARIA 属性使用规范
- **AND** 遵循键盘导航支持要求

### Requirement: API 路由文档化
系统 SHALL 提供服务端 API 路由的完整规范。

#### Scenario: 调用 AI 服务
- **WHEN** 开发者需要调用 Gemini AI 服务
- **THEN** 通过 `/api/gemini` 路由调用
- **AND** 通过 `/api/gemini/health` 检查服务状态

## MODIFIED Requirements

### Requirement: 文件头部注释规范
**原规范**：代码文件头必须包含文件名、版本号及更新时间
**更新**：新增样式系统相关文件的注释规范示例

### Requirement: 目录结构规范
**原规范**：测试文件存放在 `src/__tests__/`
**更新**：测试文件实际存放在 `src/hooks/tests/` 和 `src/utils/tests/`

## REMOVED Requirements

### Requirement: App.tsx 旧路径引用
**原内容**：`src/components/App.tsx`
**移除原因**：实际文件位于 `src/App.tsx`
**迁移**：更新所有文档引用为正确路径
