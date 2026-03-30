# PowerShell script to update version numbers in all files

$targetVersion = "v2.0.7"
$fileExtensions = @(".ts", ".tsx", ".js", ".jsx")

# Function to update version in a file
function Update-Version($filePath) {
    $content = Get-Content -Path $filePath -Raw
    $updatedContent = $content -replace 'Version: v[0-9]+\.[0-9]+\.[0-9]+', "Version: $targetVersion"
    Set-Content -Path $filePath -Value $updatedContent
    Write-Host "Updated version in $filePath"
}

# Get all files with specified extensions
Get-ChildItem -Path "src" -Recurse | Where-Object { $fileExtensions -contains $_.Extension } | ForEach-Object {
    Update-Version $_.FullName
}

# Update package.json
$packageJson = Get-Content -Path "package.json" -Raw
$updatedPackageJson = $packageJson -replace '"version": "[0-9]+\.[0-9]+\.[0-9]+"', '"version": "2.0.7"'
Set-Content -Path "package.json" -Value $updatedPackageJson
Write-Host "Updated version in package.json"

# Update metadata.json
$metadataJson = Get-Content -Path "metadata.json" -Raw
$updatedMetadataJson = $metadataJson -replace 'v[0-9]+\.[0-9]+\.[0-9]+', $targetVersion
Set-Content -Path "metadata.json" -Value $updatedMetadataJson
Write-Host "Updated version in metadata.json"

# Update version.ts
$versionTs = Get-Content -Path "src\constants\version.ts" -Raw
$updatedVersionTs = $versionTs -replace 'v[0-9]+\.[0-9]+\.[0-9]+', $targetVersion
Set-Content -Path "src\constants\version.ts" -Value $updatedVersionTs
Write-Host "Updated version in src\constants\version.ts"

# Update public/version.json
$versionJson = Get-Content -Path "public\version.json" -Raw
$updatedVersionJson = $versionJson -replace '[0-9]+\.[0-9]+\.[0-9]+', '2.0.7'
Set-Content -Path "public\version.json" -Value $updatedVersionJson
Write-Host "Updated version in public\version.json"

Write-Host "Version update completed!"
