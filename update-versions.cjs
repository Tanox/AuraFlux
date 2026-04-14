const fs = require('fs');
const path = require('path');

const targetVersion = 'v2.2.22';
const srcDir = path.join(__dirname, 'src');

function updateFileVersion(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const updatedContent = content.replace(/\/\/ File: .+ \| Version: v\d+\.\d+\.\d+/g, `// File: ${filePath.replace(__dirname, '').replace(/\\/g, '/')} | Version: ${targetVersion}`);
    
    if (updatedContent !== content) {
      fs.writeFileSync(filePath, updatedContent);
      console.log(`Updated version in: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error updating file: ${filePath}`, error);
  }
}

function traverseDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      traverseDirectory(filePath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      updateFileVersion(filePath);
    }
  });
}

// Start traversing from src directory
traverseDirectory(srcDir);

console.log('Version update completed!');
