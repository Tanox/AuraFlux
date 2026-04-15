import * as fs from 'fs';
import * as path from 'path';

// 目标版本号
const targetVersion = 'v2.2.23';
const versionWithoutV = targetVersion.replace('v', '');
const srcDir = path.join(__dirname, '..', 'src');

// 需要更新的文件列表
const filesToUpdate = [
  // 版本常量文件
  path.join(srcDir, 'constants', 'version.ts'),
  // 项目配置文件
  path.join(__dirname, '..', 'package.json'),
  path.join(__dirname, '..', 'metadata.json'),
  // 公共版本文件
  path.join(__dirname, '..', 'public', 'version.json'),
];

// 更新版本常量文件
function updateVersionConstant(filePath: string) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const updatedContent = content.replace(/export const APP_VERSION = 'v[\d.]+';/g, `export const APP_VERSION = '${targetVersion}';`);
    if (content !== updatedContent) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`Updated version constant in: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error updating version constant file: ${filePath}`, error);
  }
}

// 更新 package.json
function updatePackageJson(filePath: string) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const packageJson = JSON.parse(content);
    packageJson.version = versionWithoutV;
    const updatedContent = JSON.stringify(packageJson, null, 2);
    if (content !== updatedContent) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`Updated version in package.json`);
    }
  } catch (error) {
    console.error(`Error updating package.json: ${filePath}`, error);
  }
}

// 更新 metadata.json
function updateMetadataJson(filePath: string) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const metadata = JSON.parse(content);
    metadata.name = `Aura Flux - AI Music Visualizer ${targetVersion}`;
    const updatedContent = JSON.stringify(metadata, null, 2);
    if (content !== updatedContent) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`Updated version in metadata.json`);
    }
  } catch (error) {
    console.error(`Error updating metadata.json: ${filePath}`, error);
  }
}

// 更新 public/version.json
function updatePublicVersionJson(filePath: string) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const versionJson = JSON.parse(content);
    versionJson.version = versionWithoutV;
    const updatedContent = JSON.stringify(versionJson, null, 2);
    if (content !== updatedContent) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`Updated version in public/version.json`);
    }
  } catch (error) {
    console.error(`Error updating public/version.json: ${filePath}`, error);
  }
}

// 更新文件头部的版本号注释
function updateFileVersionComments() {
  function traverseDirectory(dir: string) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        traverseDirectory(filePath);
      } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          const relativePath = filePath.replace(path.join(__dirname, '..') + '\\', '');
          const updatedContent = content.replace(/\/\/ File: .* \| Version: v[\d.]+/g, `// File: ${relativePath} | Version: ${targetVersion}`);
          if (content !== updatedContent) {
            fs.writeFileSync(filePath, updatedContent, 'utf8');
          }
        } catch (error) {
          console.error(`Error updating file comment: ${filePath}`, error);
        }
      }
    }
  }
  
  traverseDirectory(srcDir);
  console.log('Updated version comments in all TypeScript files');
}

// 执行更新
console.log(`Updating version to ${targetVersion}...`);

// 更新版本常量文件
updateVersionConstant(filesToUpdate[0]);

// 更新 package.json
updatePackageJson(filesToUpdate[1]);

// 更新 metadata.json
updateMetadataJson(filesToUpdate[2]);

// 更新 public/version.json
updatePublicVersionJson(filesToUpdate[3]);

// 更新文件头部的版本号注释
updateFileVersionComments();

console.log('Version update completed successfully!');
