#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting Vercel build process...');

// Ensure we have all required files
const requiredFiles = [
  'package.json',
  'public/index.html',
  'src/index.tsx'
];

console.log('✅ Checking required files...');
for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    console.error(`❌ Missing required file: ${file}`);
    process.exit(1);
  }
  console.log(`✅ Found: ${file}`);
}

console.log('✅ All required files present!');

// Run the build
console.log('🔨 Building React app...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

console.log('🎉 Vercel build process completed successfully!');