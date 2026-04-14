const fs = require('fs');
const path = require('path');

const targetVersion = 'v2.2.16';
const srcDir = path.join(__dirname, 'src');

function updateFileVersion(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const updatedContent = content.replace(/\/\/ File: .* \| Version: v[\d.]+/g, `// File: ${filePath.replace(__dirname + '\\', '')} | Version: ${targetVersion}`);
    if (content !== updatedContent) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`Updated version in: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error updating file: ${filePath}`, error);
  }
}

function traverseDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      traverseDirectory(filePath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      updateFileVersion(filePath);
    }
  }
}

traverseDirectory(srcDir);
console.log('Version update completed!');
