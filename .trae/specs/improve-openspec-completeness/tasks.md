# OpenSpec 文档完善任务列表

## 任务概述

本任务列表涵盖 OpenSpec 文档的全面完善，包括路径修正、新增文档、样式系统规范化等内容。

---

## Phase 1: 核心架构文档更新

### Task 1: 更新 01_core_architecture.md
- [ ] Task 1.1: 修正 App.tsx 文件路径（从 src/components/App.tsx 改为 src/App.tsx）
- [ ] Task 1.2: 添加 src/app/index.tsx 主入口文件文档
- [ ] Task 1.3: 添加 src/app/layout.tsx 布局包装器文档
- [ ] Task 1.4: 添加 src/app/globals.css 全局样式系统文档
- [ ] Task 1.5: 更新文档版本号到 v2.4.0

### Task 2: 更新 08_testing_validation.md
- [ ] Task 2.1: 修正测试目录结构（从 src/__tests__/ 改为实际路径）
- [ ] Task 2.2: 更新测试文件命名规范
- [ ] Task 2.3: 添加 hooks/tests 和 utils/tests 的具体测试规范

---

## Phase 2: 新增样式系统文档

### Task 3: 创建 19_component_styles.md
- [ ] Task 3.1: 创建组件样式系统主文档
- [ ] Task 3.2: 添加玻璃态设计系统（glass-card、glass-panel 等）
- [ ] Task 3.3: 添加按钮系统（btn-base、btn-primary、btn-secondary、btn-ghost）
- [ ] Task 3.4: 添加面板和卡片组件类
- [ ] Task 3.5: 添加动画类和动画性能指南
- [ ] Task 3.6: 添加无障碍样式（focus-visible 等）
- [ ] Task 3.7: 添加选择器样式（滚动条、选中状态等）

### Task 4: 创建 20_tailwind_config.md
- [ ] Task 4.1: 创建 Tailwind 配置规范文档
- [ ] Task 4.2: 添加 primary 颜色系列配置规范
- [ ] Task 4.3: 添加自定义工具类（@layer components）规范
- [ ] Task 4.4: 添加深色模式样式处理规范

---

## Phase 3: 新增 React 性能模式文档

### Task 5: 创建 21_react_patterns.md
- [ ] Task 5.1: 创建 React 性能模式主文档
- [ ] Task 5.2: 添加 useCallback 使用指南和示例
- [ ] Task 5.3: 添加 useMemo 使用指南和示例
- [ ] Task 5.4: 添加 React.memo 使用规范
- [ ] Task 5.5: 添加懒加载（dynamic import）规范
- [ ] Task 5.6: 添加 ARIA 无障碍属性使用规范
- [ ] Task 5.7: 添加 ErrorBoundary 错误边界使用规范
- [ ] Task 5.8: 添加性能监控（FPSCounter、WebVitals）使用规范

---

## Phase 4: 新增 API 路由文档

### Task 6: 创建 22_api_routes.md
- [ ] Task 6.1: 创建 API 路由规范主文档
- [ ] Task 6.2: 添加 /api/gemini 路由规范
- [ ] Task 6.3: 添加 /api/gemini/health 健康检查端点规范
- [ ] Task 6.4: 添加 API 请求/响应格式规范

---

## Phase 5: 可视化文档补充

### Task 7: 更新 03_visual_rendering.md
- [ ] Task 7.1: 补充 FishSwarmMode 鱼群效果模式
- [ ] Task 7.2: 补充 Renderer 渲染器核心规范
- [ ] Task 7.3: 补充 ParticleManager 粒子管理器规范
- [ ] Task 7.4: 补充 objectPool 对象池模式规范
- [ ] Task 7.5: 补充 types 和 utils 类型定义和工具函数规范
- [ ] Task 7.6: 补充 SceneBackground 场景背景组件文档
- [ ] Task 7.7: 补充 ErrorBoundary 组件文档

---

## Phase 6: UI 组件文档补充

### Task 8: 更新 05_ui_interaction.md
- [ ] Task 8.1: 补充 AboutContent 关于内容组件
- [ ] Task 8.2: 补充 WelcomeScreen 最新版本组件规范
- [ ] Task 8.3: 补充 BentoCard Bento 网格卡片组件

---

## Phase 7: 索引和版本同步

### Task 9: 更新 README.md
- [ ] Task 9.1: 更新文档版本号到 v2.4.0
- [ ] Task 9.2: 添加新文档索引（19、20、21、22）
- [ ] Task 9.3: 更新文档结构说明

### Task 10: 同步更新 config.yaml
- [ ] Task 10.1: 更新 config.yaml 版本号

---

## Phase 8: 代码示例和验证

### Task 11: 补充代码示例
- [ ] Task 11.1: 为所有新增文档添加代码示例
- [ ] Task 11.2: 确保代码示例与实际项目代码一致
- [ ] Task 11.3: 验证文档中的路径引用正确性

### Task 12: 文档一致性检查
- [ ] Task 12.1: 检查所有文档间的交叉引用
- [ ] Task 12.2: 验证文档版本号同步
- [ ] Task 12.3: 检查文档格式一致性

---

## 任务依赖关系

```
Task 1 (01_core_architecture 更新)
  └─ Task 2 (08_testing_validation 更新)
      └─ Task 9 (README.md 更新)

Task 3 (19_component_styles 创建)
  └─ Task 4 (20_tailwind_config 创建)

Task 5 (21_react_patterns 创建)
Task 6 (22_api_routes 创建)
  └─ Task 11 (代码示例补充)

Task 7 (03_visual_rendering 补充)
Task 8 (05_ui_interaction 补充)
  └─ Task 12 (文档一致性检查)
```

---

## 验收标准

1. 所有新增文档包含完整的代码示例
2. 所有路径引用与实际项目结构一致
3. 文档版本号统一更新到 v2.4.0
4. README.md 正确索引所有文档
5. 文档间交叉引用正确无误
6. 样式系统文档覆盖 globals.css 中的所有组件类
7. React 性能模式文档包含所有优化指南
