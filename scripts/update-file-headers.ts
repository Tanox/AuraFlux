// scripts/update-file-headers.ts
import * as fs from 'fs';
import * as path from 'path';

const VERSION = 'v2.3.11';
const SRC_DIR = path.join(__dirname, '..', 'src');

const patterns = [
  /\/\/\s*File:\s*.*?\s*\|\s*Version:\s*v?[\d.]+\n?/,
  /\/\/\s*File:\s*.*?\s*\|\s*Version:\s*v?[\d.]+\r?\n?/,
  /\/\/\s*src\\.*?\s*v?[\d.]+\n?/,
  /\/\/\s*src\/.*?\s*v?[\d.]+\n?/,
  /\/\*\*[\s\S]*?\*\/\n?/,
];

function getAllTsFiles(dir: string): string[] {
  const files: string[] = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...getAllTsFiles(fullPath));
    } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }

  return files;
}

function updateFileHeader(filePath: string): boolean {
  let content = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative(path.join(__dirname, '..'), filePath).replace(/\\/g, '/');
  const newHeader = `// ${relativePath} ${VERSION}\n`;

  const originalContent = content;

  if (content.startsWith("'use client'") || content.startsWith('"use client"')) {
    const firstLineEnd = content.indexOf('\n') + 1;
    const firstLine = content.substring(0, firstLineEnd);
    const restContent = content.substring(firstLineEnd);

    let cleanedContent = restContent;
    for (const pattern of patterns) {
      cleanedContent = cleanedContent.replace(pattern, '');
    }
    cleanedContent = cleanedContent.replace(/^\n+/, '');

    content = firstLine + '\n' + newHeader + cleanedContent;
  } else {
    let cleanedContent = content;
    for (const pattern of patterns) {
      cleanedContent = cleanedContent.replace(pattern, '');
    }
    cleanedContent = cleanedContent.replace(/^\n+/, '');

    content = newHeader + cleanedContent;
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated: ${relativePath}`);
    return true;
  }

  return false;
}

function main() {
  console.log('Updating file headers...\n');

  const files = getAllTsFiles(SRC_DIR);
  let updatedCount = 0;

  for (const file of files) {
    if (updateFileHeader(file)) {
      updatedCount++;
    }
  }

  console.log(`\nDone! Updated ${updatedCount} files out of ${files.length} total.`);
}

main();
