Write-Host "Testing npm installation..."
npm --version
Write-Host "Testing node installation..."
node --version
Write-Host "Current directory: $(Get-Location)"
Write-Host "Listing files:"
get-childitem

Write-Host "Trying to install next globally..."
npm install -g next
Write-Host "Next version:"
next --version