#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting Vercel build process...');
console.log('🕐 Build timestamp:', new Date().toISOString());
console.log('📁 Current working directory:', process.cwd());

// List all files in current directory
console.log('📋 Files in root directory:');
try {
  const files = fs.readdirSync('.');
  files.forEach(file => {
    const stat = fs.statSync(file);
    console.log(`  ${stat.isDirectory() ? '📁' : '📄'} ${file}`);
  });
} catch (error) {
  console.error('❌ Error reading directory:', error.message);
}

// Check if public directory exists and list its contents
if (fs.existsSync('public')) {
  console.log('📋 Files in public directory:');
  try {
    const publicFiles = fs.readdirSync('public');
    publicFiles.forEach(file => {
      console.log(`  📄 public/${file}`);
    });
  } catch (error) {
    console.error('❌ Error reading public directory:', error.message);
  }
} else {
  console.error('❌ Public directory does not exist!');
}

// Ensure we have all required files
const requiredFiles = [
  'package.json',
  'public/index.html',
  'src/index.tsx'
];

console.log('✅ Checking required files...');
let allFilesPresent = true;
for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    console.log(`✅ Found: ${file}`);
  } else {
    console.error(`❌ Missing required file: ${file}`);
    allFilesPresent = false;
  }
}

if (!allFilesPresent) {
  console.error('❌ Some required files are missing. Build cannot continue.');
  process.exit(1);
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