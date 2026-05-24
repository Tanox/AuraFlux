# 设计文档：修复项目审查发现的问题

## 系统架构和方法

### 1. 配置修复

#### .npmrc 修复
- **目标**：消除与 nvm 的配置冲突
- **方法**：移除问题配置项，保持最小必要配置
- **新配置**：仅保留 registry 配置

```npmrc
registry=https://registry.npmmirror.com
```

### 2. 版本统一

#### 策略
- **统一版本**：v2.3.11
- **涉及范围**：
  - `src/constants/version.ts`
  - `package.json`
  - `metadata.json`
  - 所有 `openspec/*.md` 文档
  - 代码文件注释

#### 使用脚本
使用现有的 `scripts/update-versions.sh` 或直接修改关键文件

### 3. PWA 配置清理

#### 决策：移除 PWA 功能
**原因**：
- `next.config.js` 已移除 PWA 配置
- 简化项目结构
- 减少维护复杂度

#### 清理内容：
- 移除 `@ducanh2912/next-pwa` 依赖
- 移除 `public/sw.js` 和相关 Workbox 文件

### 4. 代码质量修复

#### 状态管理竞态条件修复
**问题**：`randomizeSettings` 使用 setTimeout 保存旧状态
**解决方案**：
1. 改进 reducer，让状态更新在 reducer 内部完成
2. 使用 useEffect 监听状态变化并持久化

#### 音频上下文清理修复
**问题**：每次依赖变化都会关闭音频上下文
**解决方案**：
- 使用 ref 跟踪是否已卸载
- 只在组件真正卸载时清理

### 5. 安全的 localStorage 访问

#### 工具函数设计
创建 `src/utils/storage.ts` 提供以下功能：
- 安全的 getItem/setItem/removeItem
- 错误处理
- 类型安全

## 代码变更计划

### 模块清单和接口设计

#### 新模块：`src/utils/storage.ts`
```typescript
export const safeStorage = {
  getItem: <T>(key: string, defaultValue?: T): T | null => { ... },
  setItem: <T>(key: string, value: T): boolean => { ... },
  removeItem: (key: string): boolean => { ... }
};
```

### 数据模型变更

无数据模型变更。

## 实现计划

### 阶段和里程碑

1. 配置修复阶段
2. 版本统一阶段
3. 代码问题修复阶段
4. 清理阶段

### 增量价值

每个阶段都能带来独立的价值改进。

## 回滚策略

每个变更都通过 git 单独提交，便于按需回滚。

## 安全考虑

- localStorage 访问增加错误处理
- 无其他安全相关变更

## 测试策略

- 运行现有测试确保无回归
- TypeScript 类型检查验证
- 手动验证功能正常

## 文档计划

更新变更日志记录本次修复。
