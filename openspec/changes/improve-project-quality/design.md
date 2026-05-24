# 设计方案：提升项目整体质量

## 变更名称
`improve-project-quality`

---

## 1. 版本号统一方案

### 1.1 当前状态分析

```
VERSION INCONSISTENCY
═══════════════════════════════════════════════════════════════

源代码版本 (v2.3.11)           文档版本 (不一致)
┌─────────────────────┐         ┌─────────────────────────┐
│ src/constants/      │         │ openspec/*.md           │
│ version.ts → 2.3.10 │         │ • 03_visual_rendering   │
│                     │         │   → v2.3.11 ✓          │
│ src/app/layout.tsx  │         │ • 04_ai_integration    │
│ → v2.3.11 ✓        │         │   → v2.3.11 ✓          │
│                     │         │ • 05_ui_interaction    │
│ package.json        │         │   → v2.3.11 ✓          │
│ → 2.3.10 ✓         │         │ • 10_contribution      │
│                     │         │   → v2.3.11 ✓          │
│ README.md           │         │ • 15_faq               │
│ → v2.3.11 ✓        │         │   → v2.3.11 ✓          │
└─────────────────────┘         │ • 17_documentation      │
                                │   → v2.3.11 ✓          │
                                └─────────────────────────┘
```

### 1.2 统一策略

**方案**: 创建批量更新脚本

```typescript
// scripts/update-all-versions.ts
// 批量更新所有文件中的版本号

interface VersionUpdateConfig {
  newVersion: string;      // e.g., "2.3.10"
  files: {
    patterns: string[];     // glob patterns
    exclude?: string[];     // exclude patterns
  };
}

const config: VersionUpdateConfig = {
  newVersion: "2.3.10",
  files: {
    patterns: [
      "src/**/*.ts",
      "src/**/*.tsx",
      "openspec/**/*.md",
      "*.md",
      "package.json"
    ],
    exclude: [
      "**/node_modules/**",
      "**/.next/**"
    ]
  }
};
```

**实现步骤**:
1. 扫描所有源文件中的版本号模式 `v\d+\.\d+\.\d+`
2. 替换为统一版本 `v2.3.11`
3. 更新文件头注释
4. 更新 package.json

### 1.3 自动化验证

```bash
# 验证脚本
npm run verify:versions

# 检查不一致的命令
grep -r "v2\.3\.[0-9]" src/ openspec/ --include="*.ts" --include="*.tsx" --include="*.md" | grep -v "v2.3.11"
```

---

## 2. 测试覆盖提升方案

### 2.1 当前测试结构

```
CURRENT TEST STRUCTURE
═══════════════════════════════════════════════════════════════

src/utils/tests/
├── logger.test.ts        ✓ 存在
└── visualization.test.ts ✓ 存在

覆盖率: ~5%
目标: ≥80%
```

### 2.2 测试策略

```
TEST COVERAGE STRATEGY
═══════════════════════════════════════════════════════════════

                    ┌─────────────────────────────────────┐
                    │         测试覆盖率目标: ≥80%        │
                    └─────────────────────────────────────┘
                                        │
                    ┌───────────────────┼───────────────────┐
                    ▼                   ▼                   ▼
            ┌───────────────┐  ┌───────────────┐  ┌───────────────┐
            │  工具函数     │  │  组件测试     │  │  Hooks 测试   │
            │  (优先)       │  │  (关键组件)   │  │  (状态管理)   │
            └───────────────┘  └───────────────┘  └───────────────┘
                    │                   │                   │
                    ▼                   ▼                   ▼
            ┌───────────────┐  ┌───────────────┐  ┌───────────────┐
            │ • logger.ts   │  │ • Toast.tsx   │  │ • useAudio    │
            │ • visualization│ │ • Controls    │  │ • useVisuals  │
            │ • lyricsUtils │  │ • App.tsx     │  │ • useAiState  │
            └───────────────┘  └───────────────┘  └───────────────┘
```

### 2.3 新增测试文件清单

| 文件 | 类型 | 优先级 |
|------|------|--------|
| `src/utils/tests/audioUtils.test.ts` | 工具函数 | P0 |
| `src/utils/tests/lyricsUtils.test.ts` | 工具函数 | P1 |
| `src/hooks/tests/useAudio.test.ts` | Hook | P0 |
| `src/hooks/tests/useVisualsState.test.ts` | Hook | P1 |
| `src/components/visualizers/ui/Toast.test.tsx` | 组件 | P1 |
| `src/components/controls/Controls.test.tsx` | 组件 | P2 |

### 2.4 测试模板

```typescript
// src/utils/tests/audioUtils.test.ts
import { describe, it, expect, beforeEach } from '@jest/globals';

describe('audioUtils', () => {
  describe('frequencyAnalysis', () => {
    it('should return valid frequency data', () => {
      // TODO: 实现测试
    });
  });
});
```

---

## 3. 代码结构优化方案

### 3.1 问题分析

```
CODE DUPLICATION
═══════════════════════════════════════════════════════════════

src/components/visualizers/
├── 2d/
│   ├── plasma/PlasmaMode.ts      ← 粒子管理逻辑重复
│   ├── starfield/StarfieldMode.ts ← 粒子管理逻辑重复
│   └── tunnel/TunnelMode.ts      ← 粒子管理逻辑重复
│
└── 3d/
    ├── silkWave/SilkWaveScene.tsx   ← 场景初始化重复
    ├── oceanWave/OceanWaveScene.tsx  ← 场景初始化重复
    └── neuralFlow/NeuralFlowScene.tsx ← 场景初始化重复
```

### 3.2 抽象方案

```
REFACTORING DESIGN
═══════════════════════════════════════════════════════════════

Before:                              After:
┌─────────────────────┐            ┌─────────────────────┐
│ PlasmaMode.ts       │            │ BaseParticleSystem.ts│
│ ├─ particlePool[]   │            │ ├─ particlePool[]   │
│ ├─ updateParticles()│    ──►     │ ├─ updateParticles()│
│ └─ render()         │            │ └─ render()         │
├─────────────────────┤            └─────────────────────┘
│ StarfieldMode.ts    │                     ▲
│ ├─ particlePool[]   │  extract common      │
│ ├─ updateParticles()│  logic              │
│ └─ render()         │                     │
├─────────────────────┤            ┌─────────────────────┐
│ TunnelMode.ts       │            │ PlasmaMode.ts       │
│ ├─ particlePool[]   │            │ ├─ extends         │
│ ├─ updateParticles()│            │ │  BaseParticleSystem│
│ └─ render()         │            │ └─ render() override│
└─────────────────────┘            └─────────────────────┘
```

### 3.3 公共基类设计

```typescript
// src/components/visualizers/2d/BaseParticleSystem.ts

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

export abstract class BaseParticleSystem {
  protected particles: Particle[] = [];
  protected ctx: CanvasRenderingContext2D;
  protected width: number;
  protected height: number;
  
  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
  }
  
  abstract update(deltaTime: number, audioData: Uint8Array): void;
  abstract render(): void;
  
  protected updateParticle(particle: Particle, deltaTime: number): void {
    particle.x += particle.vx * deltaTime;
    particle.y += particle.vy * deltaTime;
    particle.life -= deltaTime;
  }
  
  protected createParticle(options: Partial<Particle>): Particle {
    return {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      life: 1,
      maxLife: 1,
      size: 1,
      color: '#fff',
      ...options
    };
  }
}
```

---

## 4. 实施计划

### 4.1 阶段划分

```
IMPLEMENTATION PHASES
═══════════════════════════════════════════════════════════════

Phase 1: 版本统一          Phase 2: 测试覆盖        Phase 3: 代码优化
(1-2 小时)                (2-3 小时)               (2-4 小时)
     │                        │                        │
     ▼                        ▼                        ▼
┌─────────┐              ┌─────────┐              ┌─────────┐
│ 1.1 更新 │              │ 2.1 工具 │              │ 3.1 抽象 │ 
│ 版本脚本 │              │ 函数测试 │              │ 粒子系统 │
├─────────┤              ├─────────┤              ├─────────┤
│ 1.2 运行 │              │ 2.2 Hook │              │ 3.2 重构 │
│ 验证命令 │              │ 测试    │              │ Plasma  │
├─────────┤              ├─────────┤              ├─────────┤
│ 1.3 提交 │              │ 2.3 组件 │              │ 3.3 重构 │
│ 代码    │              │ 测试    │              │ Starfield│
└─────────┘              └─────────┘              └─────────┘
```

### 4.2 验证清单

| 阶段 | 验证项 | 命令 |
|------|--------|------|
| 版本统一 | 无不一致版本号 | `grep -r "v2\.3\.[0-9]" src/ openspec/ | grep -v "v2.3.11"` |
| 测试覆盖 | 覆盖率 ≥ 80% | `npm run test:coverage` |
| 代码优化 | 无 ESLint 错误 | `npm run lint` |
| 代码优化 | 无 TypeScript 错误 | `npx tsc --noEmit` |

---

## 5. 回滚方案

如遇问题，可通过以下方式回滚：

```bash
# 回滚到合并前状态
git revert <merge-commit>

# 或回滚特定文件
git checkout HEAD~1 -- <file>
```
