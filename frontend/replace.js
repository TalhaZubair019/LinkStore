const fs = require('fs');
const path = require('path');
function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fullPath.includes('node_modules') || fullPath.includes('.next')) continue;
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;
      
      content = content.replace(/text-indigo-500/g, 'text-indigo-600');
      content = content.replace(/hover:text-indigo-500/g, 'hover:text-indigo-600');
      content = content.replace(/bg-indigo-100/g, 'bg-indigo-50');
      content = content.replace(/text-black/g, 'text-gray-900');
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated: ' + fullPath);
      }
    }
  }
}
walk('./src');
console.log('Replacement complete.');
