# 清理缓存和构建产物
Write-Host "Cleaning cache and build artifacts..."

# 清理 .next 目录
Remove-Item -Recurse -Force ".next" -ErrorAction SilentlyContinue

# 清理 node_modules 目录
Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue

# 清理 npm 锁文件
Remove-Item -Force "package-lock.json" -ErrorAction SilentlyContinue
Remove-Item -Force "pnpm-lock.yaml" -ErrorAction SilentlyContinue
Remove-Item -Force "yarn.lock" -ErrorAction SilentlyContinue

# 清理构建输出目录
Remove-Item -Recurse -Force "out" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "dist" -ErrorAction SilentlyContinue

Write-Host "Cleanup completed!"
