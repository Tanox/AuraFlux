# 查找 next 命令的实际路径
Write-Host "Searching for next command..."

# 检查环境变量 PATH
$env:PATH -split ';' | ForEach-Object {
    $nextPath = Join-Path $_ "next.cmd"
    if (Test-Path $nextPath) {
        Write-Host "Found next.cmd at: $nextPath"
    }
}

# 检查默认 npm 全局路径
$defaultGlobal = "$env:USERPROFILE\AppData\Roaming\npm"
$nextPath = Join-Path $defaultGlobal "next.cmd"
if (Test-Path $nextPath) {
    Write-Host "Found next.cmd at default global path: $nextPath"
}

# 检查 .npmrc 中配置的路径
$npmrcGlobal = "$env:USERPROFILE\.npm-global"
$nextPath = Join-Path $npmrcGlobal "next.cmd"
if (Test-Path $nextPath) {
    Write-Host "Found next.cmd at .npmrc global path: $nextPath"
}

Write-Host "Search completed!"