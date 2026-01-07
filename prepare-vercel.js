const fs = require('fs');
const path = require('path');

// Copy client files to root for Vercel deployment
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'build') {
        copyDir(srcPath, destPath);
      }
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Copy client package.json to root
fs.copyFileSync('client/package.json', 'package.json');

// Copy client source files to root
copyDir('client/src', 'src');
copyDir('client/public', 'public');

// Copy other client files
const clientFiles = ['tailwind.config.js'];
clientFiles.forEach(file => {
  if (fs.existsSync(`client/${file}`)) {
    fs.copyFileSync(`client/${file}`, file);
  }
});

console.log('✅ Prepared files for Vercel deployment');