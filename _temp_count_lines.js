const fs = require('fs');
const path = require('path');

const results = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
      walk(fullPath);
    } else if (/\.(ts|tsx|js|jsx|css)$/.test(entry.name)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n').length;
      if (lines > 200) {
        results.push({
          lines,
          path: fullPath.replace(/\\/g, '/').replace('e:/Github/AuraFlux/', '')
        });
      }
    }
  }
}

walk('src');
results.sort((a, b) => b.lines - a.lines);
results.forEach(r => console.log(r.lines + ': ' + r.path));
