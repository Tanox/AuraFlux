# 设置环境变量
$env:NODE_PATH = "C:\Users\Admin\AppData\Roaming\npm\node_modules"
$env:NEXT_DIST_DIR = "C:\Users\Admin\AppData\Roaming\npm\.next"

# 运行构建命令
Write-Host "Building with global packages..."
& "C:\Users\Admin\AppData\Roaming\npm\next.cmd" build --webpack
