#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🚀 DEPLOYING TO VERCEL FOR THIRD-PARTY ACCESS');
console.log('🎯 Target: https://shambilbglg.vercel.app');

try {
  console.log('📦 Installing Vercel CLI...');
  execSync('npm install -g vercel', { stdio: 'inherit' });
  
  console.log('🔐 Logging into Vercel...');
  console.log('Please follow the login prompts...');
  execSync('vercel login', { stdio: 'inherit' });
  
  console.log('🚀 Deploying to production...');
  execSync('vercel --prod', { stdio: 'inherit' });
  
  console.log('✅ DEPLOYMENT COMPLETE!');
  console.log('🌐 Your app should now work for third parties at:');
  console.log('   https://shambilbglg.vercel.app');
  console.log('');
  console.log('🧪 Test accounts for third parties:');
  console.log('   Admin: admin@shambil.edu.ng / admin123');
  console.log('   Parent: enginboy20@gmail.com / 123456');
  console.log('   Teacher: teacher@shambil.edu.ng / teacher123');
  
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  console.log('');
  console.log('🔧 Manual deployment steps:');
  console.log('1. Install Vercel CLI: npm install -g vercel');
  console.log('2. Login to Vercel: vercel login');
  console.log('3. Deploy: vercel --prod');
}