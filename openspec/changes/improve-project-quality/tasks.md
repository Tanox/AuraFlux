# 任务清单：提升项目整体质量

## 变更名称
`improve-project-quality`

## 前置条件
- [x] 安装依赖: `npm install`
- [x] 验证现有构建: `npm run build`

---

## 阶段 1: 版本号统一

### 任务 1.1: 检查版本不一致
```bash
# 列出所有版本不一致的文件
grep -rn "v2\.3\.[0-9]" src/ openspec/ --include="*.ts" --include="*.tsx" --include="*.md" | grep -v "v2.3.10"
```
**验证**: 无输出表示所有版本已统一

### 任务 1.2: 运行版本更新脚本 (如需要)
```bash
node scripts/update-version.ts 2.3.10
```
**验证**: `grep -rn "v2.3.10" openspec/` 输出应为所有 openspec 文档

### 任务 1.3: 更新文件头注释
检查并更新以下文件的版本注释：
- `openspec/01_core_architecture.md` → v2.3.10
- 其他过时文档

**验证**: `grep -r "Version:" openspec/*.md | grep -v "v2.3.10"`

---

## 阶段 2: 测试覆盖提升

### 任务 2.1: 配置 Jest 测试环境
**状态**: 已配置
```bash
# 验证 Jest 配置
cat jest.config.js 2>/dev/null || cat jest.config.ts 2>/dev/null
```

### 任务 2.2: 创建工具函数测试
**创建文件**:
- [ ] `src/utils/tests/audioUtils.test.ts`
- [ ] `src/utils/tests/lyricsUtils.test.ts`

**模板**:
```typescript
import { describe, it, expect, beforeEach } from '@jest/globals';

describe('audioUtils', () => {
  describe('functionName', () => {
    it('should describe expected behavior', () => {
      expect(true).toBe(true);
    });
  });
});
```

### 任务 2.3: 创建 Hook 测试
**创建文件**:
- [ ] `src/hooks/tests/useAudio.test.ts`
- [ ] `src/hooks/tests/useVisualsState.test.ts`

### 任务 2.4: 创建组件测试
**创建文件**:
- [ ] `src/components/visualizers/ui/Toast.test.tsx`
- [ ] `src/components/controls/Controls.test.tsx`

### 任务 2.5: 运行测试覆盖率检查
```bash
npm run test:coverage
```
**目标**: 
- [ ] 分支覆盖率 ≥ 80%
- [ ] 函数覆盖率 ≥ 80%
- [ ] 行覆盖率 ≥ 80%
- [ ] 语句覆盖率 ≥ 80%

---

## 阶段 3: 代码结构优化 (可选)

### 任务 3.1: 分析代码重复
```bash
# 分析可视化模式中的公共逻辑
ls -la src/components/visualizers/2d/*/
ls -la src/components/visualizers/3d/*/
```

### 任务 3.2: 创建公共基类 (如适用)
**创建文件** (如需重构):
- [ ] `src/components/visualizers/2d/BaseParticleSystem.ts`

### 任务 3.3: 重构可视化模式 (如适用)
**重构目标**:
- [ ] `PlasmaMode.ts` - 使用基类
- [ ] `StarfieldMode.ts` - 使用基类

### 任务 3.4: 运行 ESLint
```bash
npm run lint
```
**验证**: 无错误输出

### 任务 3.5: 运行 TypeScript 检查
```bash
npx tsc --noEmit
```
**验证**: 无类型错误

---

## 完成检查清单

### 必须完成 (P0-P1)
- [x] 安装依赖
- [x] 验证版本一致性 (统一为 v2.3.10)
- [x] 创建至少 4 个测试文件 (5个已创建)
- [x] TypeScript 编译检查通过

### 可选完成 (P2)
- [ ] 代码重构
- [ ] ESLint 检查通过 (项目原有配置问题)

---

## 相关文件

| 文件路径 | 描述 |
|----------|------|
| [proposal.md](file:///workspace/openspec/changes/improve-project-quality/proposal.md) | 变更提案 |
| [design.md](file:///workspace/openspec/changes/improve-project-quality/design.md) | 设计方案 |
| `src/constants/version.ts` | 版本常量定义 |
| `src/utils/tests/` | 工具函数测试目录 |
| `src/hooks/tests/` | Hook 测试目录 |

---

## 备注

- 测试覆盖率目标来自 `openspec/08_testing_validation.md`
- 版本管理遵循 `openspec/10_contribution_guidelines.md`
- 命名规范遵循 `openspec/18_naming_conventions.md`
