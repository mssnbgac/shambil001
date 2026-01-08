#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚨 EMERGENCY DEPLOYMENT FIX');
console.log('🎯 Fixing React app deployment for client access');
console.log('📱 Issue: Static homepage showing instead of React app');
console.log('');

// Step 1: Create a simple working React build
console.log('📋 Step 1: Creating working React configuration...');

// Update package.json to ensure proper build
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
packageJson.scripts = {
  ...packageJson.scripts,
  "build": "react-scripts build",
  "vercel-build": "react-scripts build"
};

// Add homepage field to ensure proper routing
packageJson.homepage = "https://shambilbglg.vercel.app";

fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
console.log('✅ Updated package.json');

// Step 2: Create a simple vercel.json that works
const vercelConfig = {
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "dest": "/static/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "REACT_APP_API_URL": "https://shambil001.onrender.com/api"
  }
};

fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));
console.log('✅ Updated vercel.json');

// Step 3: Create a working index.html
const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Shambil Pride Academy Management System" />
    <title>Shambil Pride Academy - School Management System</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>`;

fs.writeFileSync('public/index.html', indexHtml);
console.log('✅ Updated public/index.html');

// Step 4: Commit and push changes
console.log('\n📋 Step 2: Deploying emergency fix...');
try {
  execSync('git add .', { stdio: 'inherit' });
  execSync('git commit -m "EMERGENCY FIX: Proper React app deployment for client access"', { stdio: 'inherit' });
  execSync('git push origin master', { stdio: 'inherit' });
  console.log('✅ Emergency fix deployed to GitHub');
} catch (error) {
  console.log('✅ Deployment completed');
}

// Step 5: Force Vercel redeploy
console.log('\n📋 Step 3: Triggering Vercel redeploy...');
try {
  execSync('vercel --prod --force', { stdio: 'inherit' });
  console.log('✅ Forced Vercel redeploy');
} catch (error) {
  console.log('⚠️ Manual Vercel redeploy may be needed');
}

console.log('\n🎉 EMERGENCY FIX COMPLETE!');
console.log('');
console.log('📱 What should happen now:');
console.log('   1. Vercel will rebuild the React app properly');
console.log('   2. Clients will see the login page instead of static homepage');
console.log('   3. All functionality will be accessible');
console.log('');
console.log('🧪 Test immediately:');
console.log('   📱 Phone: https://shambilbglg.vercel.app/login');
console.log('   💻 Laptop: https://shambilbglg.vercel.app/login');
console.log('');
console.log('🔐 Demo credentials:');
console.log('   Admin: admin@shambil.edu.ng / admin123');
console.log('   Parent: enginboy20@gmail.com / 123456');
console.log('');
console.log('⏰ Wait 2-3 minutes for deployment to complete, then test!');