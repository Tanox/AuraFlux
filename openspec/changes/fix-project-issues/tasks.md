# 任务列表

## 阶段 1：配置修复
- [x] 修复 .npmrc 配置，移除冲突的 prefix 和 auto-install-peers 配置
- [x] 验证 npm 命令能正常工作

## 阶段 2：版本统一
- [x] 统一 openspec/*.md 文档中的版本号为 v2.3.11
- [x] 验证所有关键文件版本号一致

## 阶段 3：PWA 配置清理
- [x] 从 package.json 移除 @ducanh2912/next-pwa 依赖
- [x] 删除 public/sw.js、public/sw.js.map 和 workbox 文件
- [x] 删除 public/workbox-f1770938.js 和相关的 map 文件

## 阶段 4：代码质量修复
- [x] 修复 useVisualsState.ts 中的 randomizeSettings 竞态条件
- [x] 修复 useAudio.ts 中的音频上下文清理问题
- [x] 创建 src/utils/storage.ts 安全存储工具
- [x] 运行 TypeScript 类型检查确保无错误
- [x] 运行测试确保所有现有测试通过

## 阶段 5：文档和完成
- [x] 更新 CHANGELOG.md 记录本次修复
- [ ] 运行 lint 检查
- [x] 验证变更完整
