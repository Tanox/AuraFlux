# 全局依赖配置说明

本项目已配置为使用全局 npm/pnpm 包，避免在项目目录中创建不必要的 node_modules 和缓存目录。

## 配置更改

### 1. npm 配置 (.npmrc)
- 禁用本地 package-lock 生成
- 使用全局缓存目录
- 设置全局脚本前缀

### 2. pnpm 配置 (.pnpmrc)
- 配置 pnpm 使用全局存储目录
- 配置虚拟存储到用户主目录
- 设置全局缓存位置

### 3. Next.js 配置 (next.config.js)
- 将 .next 构建目录重定向到用户主目录
- 避免项目目录下产生 .next 缓存

### 4. 脚本增强 (package.json)
- 添加了 clean 相关脚本
- 配置了环境变量
- 添加了 cross-env 依赖

## 使用指南

### 安装全局依赖 (首次设置)

#### 对于 npm 用户:
```bash
# 安装所有依赖为全局包
npm install -g
```

#### 对于 pnpm 用户:
```bash
# 安装所有依赖为全局包
pnpm install -g
```

### 运行项目

```bash
# 使用 npm
npm run dev

# 或使用 pnpm
pnpm dev
```

### 清理本地缓存
```bash
npm run clean
```

## 全局目录结构

配置后的缓存和构建文件位置：
- **npm 缓存**: `~/.npm/cache`
- **pnpm 存储**: `~/.pnpm-store`
- **pnpm 虚拟存储**: `~/.pnpm-virtual-store`
- **pnpm 缓存**: `~/.pnpm/cache`
- **Next.js 构建**: `~/.next`

## 重要说明

1. **首次使用需要全局安装**: 项目依赖需要先全局安装才能正常运行
2. **多版本管理**: 如果需要管理不同版本的项目，可以考虑使用 nvm 或 pnpm 环境隔离
3. **安全性**: 全局安装的包可能影响其他项目，建议在测试环境中验证

## 兼容性

- Windows: 使用 `%USERPROFILE%` 代替 `~`
- Linux/macOS: 使用 `~` 正常工作

## 回退到本地依赖

如果需要回退到本地依赖管理，可以：
1. 删除或重命名 .npmrc 和 .pnpmrc
2. 恢复 next.config.js 中的 distDir 配置
3. 正常使用 `npm install` 或 `pnpm install`
