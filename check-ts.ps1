npx tsc --noEmit --skipLibCheck 2>&1 | Out-File -FilePath ts-errors.txt -Encoding UTF8
Get-Content ts-errors.txt