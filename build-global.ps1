# 使用全局包构建应用
$env:NODE_PATH = "$env:USERPROFILE\.npm-global\node_modules"
$env:NEXT_DIST_DIR = "$env:USERPROFILE\.npm-global\.next"

Write-Host "Building with global packages..."
& "$env:USERPROFILE\.npm-global\bin\next.cmd" build --webpack

Write-Host "Build completed!"