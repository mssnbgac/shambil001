const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing build issues...');

// Clear build cache
try {
  if (fs.existsSync('build')) {
    fs.rmSync('build', { recursive: true, force: true });
    console.log('✅ Cleared build directory');
  }
} catch (error) {
  console.log('⚠️ Could not clear build directory:', error.message);
}

// Clear node_modules/.cache
try {
  const cachePath = path.join('node_modules', '.cache');
  if (fs.existsSync(cachePath)) {
    fs.rmSync(cachePath, { recursive: true, force: true });
    console.log('✅ Cleared build cache');
  }
} catch (error) {
  console.log('⚠️ Could not clear cache:', error.message);
}

console.log('🚀 Starting build...');

try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build successful!');
} catch (error) {
  console.log('❌ Build failed');
  process.exit(1);
}