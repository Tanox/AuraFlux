#!/bin/bash

# Script to update all version references from v2.3.10 to v2.3.11

OLD_VERSION="v2.3.10"
NEW_VERSION="v2.3.11"

echo "Updating versions from $OLD_VERSION to $NEW_VERSION..."

# Update source files
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i "s/$OLD_VERSION/$NEW_VERSION/g" {} \;

# Update i18n files
find src/locales -type f -name "*.ts" -exec sed -i "s/$OLD_VERSION/$NEW_VERSION/g" {} \;

# Update documentation
find openspec -type f -name "*.md" -exec sed -i "s/$OLD_VERSION/$NEW_VERSION/g" {} \;

# Update root level docs
for f in README.md README_EN.md CHANGELOG.md; do
  if [ -f "$f" ]; then
    sed -i "s/$OLD_VERSION/$NEW_VERSION/g" "$f"
    echo "Updated $f"
  fi
done

echo "Done!"
echo ""
echo "Verifying changes..."
echo "Files still using old version:"
grep -r "$OLD_VERSION" src/ openspec/ --include="*.ts" --include="*.tsx" --include="*.md" 2>/dev/null | head -20 || echo "None found!"
