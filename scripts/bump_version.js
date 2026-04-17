const fs = require('fs');
const path = require('path');

const targetVersion = '2.3.2';
const targetV = 'v2.3.2';

function processFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    const isMd = filePath.endsWith('.md');
    
    let content = fs.readFileSync(filePath, 'utf8');
    let dirty = false;
    const lines = content.split('\n');

    // Handle header rule: 第一行必须是单行注释： <root_relative_path> <version>
    if (lines.length > 0) {
        if (lines[0].match(/v2\.[0-9]+\.[0-9]+/)) {
            lines[0] = lines[0].replace(/v2\.[0-9]+\.[0-9]+/, targetV);
            dirty = true;
        } else if (lines[0].includes('//') && lines[0].includes('src/')) {
            // maybe missing version
            // skip for now to avoid mess
        }
    }

    if (filePath.includes('package.json') || filePath.includes('metadata.json')) {
        content = content.replace(/"version": "2\.[0-9]+\.[0-9]+"/, `"version": "${targetVersion}"`);
        content = content.replace(/App_Name v2\.[0-9]+\.[0-9]+/i, `App Name v${targetVersion}`);
        content = content.replace(/Visualizer v2\.[0-9]+\.[0-9]+/i, `Visualizer v${targetVersion}`);
        dirty = true;
    }

    if (filePath.endsWith('version.ts')) {
        content = content.replace(/APP_VERSION = 'v2\.[0-9]+\.[0-9]+'/, `APP_VERSION = '${targetV}'`);
        dirty = true;
    }
    if (filePath.endsWith('index.ts') && filePath.includes('constants')) {
        content = content.replace(/VERSION = '2\.[0-9]+\.[0-9]+'/, `VERSION = '${targetVersion}'`);
        content = content.replace(/APP_VERSION = '2\.[0-9]+\.[0-9]+'/, `APP_VERSION = '${targetVersion}'`);
        dirty = true;
    }
    
    if (isMd) {
        content = content.replace(/v2\.[0-9]+\.[0-9]+/g, targetV);
        content = content.replace(/version: 2\.[0-9]+\.[0-9]+/gi, `version: ${targetVersion}`);
        content = content.replace(/Version: 2\.[0-9]+\.[0-9]+/gi, `Version: ${targetVersion}`);
        dirty = true;
    }

    if (dirty) {
        let newContent = isMd && !filePath.includes('package.json') ? content : lines.join('\n');
        if (isMd) {
            fs.writeFileSync(filePath, content, 'utf8');
        } else {
            // we joined maybe we should string replace
            let updated = lines.join('\n');
            if (filePath.includes('package.json') || filePath.includes('metadata.json') || filePath.includes('constants')) {
               updated = content; // Because we did replace on content
            }
            fs.writeFileSync(filePath, updated, 'utf8');
        }
    }
}

function walkStringReplace(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file === '.git' || file === '.next' || file === 'public' || file === '.trae') continue;
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            walkStringReplace(fullPath);
        } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.md') || file === 'package.json' || file === 'metadata.json') {
            processFile(fullPath);
        }
    }
}

walkStringReplace(path.join(__dirname, '..'));

console.log('Version bumped to', targetVersion);
