$targetVersion = 'v2.0.6'
$srcDir = Join-Path $PSScriptRoot 'src'

function Update-FileVersion($filePath) {
    try {
        $content = Get-Content -Path $filePath -Raw
        $relativePath = $filePath -replace [regex]::Escape($PSScriptRoot + '\'), ''
        $updatedContent = $content -replace '// File: .* \| Version: v[\d.]+', "// File: $relativePath | Version: $targetVersion"
        if ($content -ne $updatedContent) {
            Set-Content -Path $filePath -Value $updatedContent -Force
            Write-Host "Updated version in: $filePath"
        }
    } catch {
        Write-Error "Error updating file: $filePath - $_"
    }
}

function Traverse-Directory($dir) {
    $files = Get-ChildItem -Path $dir -File
    foreach ($file in $files) {
        if ($file.Extension -eq '.ts' -or $file.Extension -eq '.tsx') {
            Update-FileVersion $file.FullName
        }
    }
    $dirs = Get-ChildItem -Path $dir -Directory
    foreach ($subdir in $dirs) {
        Traverse-Directory $subdir.FullName
    }
}

Traverse-Directory $srcDir
Write-Host 'Version update completed!'