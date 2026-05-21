# OpenSpec 文档完善检查清单

## Phase 1: 核心架构文档更新

### Task 1: 01_core_architecture.md 更新
- [ ] App.tsx 路径已从 src/components/App.tsx 修正为 src/App.tsx
- [ ] 新增 src/app/index.tsx 主入口文件文档
- [ ] 新增 src/app/layout.tsx 布局包装器文档
- [ ] 新增 src/app/globals.css 全局样式系统文档
- [ ] 文档版本号已更新到 v2.4.0

### Task 2: 08_testing_validation.md 更新
- [ ] 测试目录结构已从 src/__tests__/ 修正为实际路径
- [ ] 测试文件命名规范已更新
- [ ] hooks/tests 和 utils/tests 测试规范已添加

## Phase 2: 新增样式系统文档

### Task 3: 19_component_styles.md 创建
- [ ] 玻璃态设计系统文档完整（glass-card、glass-panel 等）
- [ ] 按钮系统文档完整（btn-base、btn-primary、btn-secondary、btn-ghost）
- [ ] 面板和卡片组件类文档完整
- [ ] 动画类和动画性能指南已添加
- [ ] 无障碍样式文档已添加（focus-visible 等）
- [ ] 选择器样式文档已添加（滚动条、选中状态等）

### Task 4: 20_tailwind_config.md 创建
- [ ] Tailwind 配置规范文档已创建
- [ ] primary 颜色系列配置规范已添加
- [ ] 自定义工具类（@layer components）规范已添加
- [ ] 深色模式样式处理规范已添加

## Phase 3: 新增 React 性能模式文档

### Task 5: 21_react_patterns.md 创建
- [ ] useCallback 使用指南和示例已添加
- [ ] useMemo 使用指南和示例已添加
- [ ] React.memo 使用规范已添加
- [ ] 懒加载（dynamic import）规范已添加
- [ ] ARIA 无障碍属性使用规范已添加
- [ ] ErrorBoundary 错误边界使用规范已添加
- [ ] 性能监控（FPSCounter、WebVitals）使用规范已添加

## Phase 4: 新增 API 路由文档

### Task 6: 22_api_routes.md 创建
- [ ] /api/gemini 路由规范已添加
- [ ] /api/gemini/health 健康检查端点规范已添加
- [ ] API 请求/响应格式规范已添加

## Phase 5: 可视化文档补充

### Task 7: 03_visual_rendering.md 补充
- [ ] FishSwarmMode 鱼群效果模式已补充
- [ ] Renderer 渲染器核心规范已补充
- [ ] ParticleManager 粒子管理器规范已补充
- [ ] objectPool 对象池模式规范已补充
- [ ] types 和 utils 类型定义和工具函数规范已补充
- [ ] SceneBackground 场景背景组件文档已补充
- [ ] ErrorBoundary 组件文档已补充

## Phase 6: UI 组件文档补充

### Task 8: 05_ui_interaction.md 补充
- [ ] AboutContent 关于内容组件已补充
- [ ] WelcomeScreen 最新版本组件规范已补充
- [ ] BentoCard Bento 网格卡片组件已补充

## Phase 7: 索引和版本同步

### Task 9: README.md 更新
- [ ] 文档版本号已更新到 v2.4.0
- [ ] 新文档索引（19、20、21、22）已添加
- [ ] 文档结构说明已更新

### Task 10: config.yaml 同步
- [ ] config.yaml 版本号已更新

## Phase 8: 代码示例和验证

### Task 11: 代码示例补充
- [ ] 所有新增文档包含完整的代码示例
- [ ] 代码示例与实际项目代码一致
- [ ] 路径引用正确性已验证

### Task 12: 文档一致性检查
- [ ] 所有文档间的交叉引用已检查
- [ ] 文档版本号同步已验证
- [ ] 文档格式一致性已检查

## 最终验收

- [ ] 所有新增和更新的文档已完成
- [ ] 文档内容与实际项目结构一致
- [ ] OpenSpec 可以作为代码重构的完整指导文档
