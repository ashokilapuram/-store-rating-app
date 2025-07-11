#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 New Repository Setup Script');
console.log('===============================\n');

// Check if .git exists
const gitPath = path.join(__dirname, '.git');
if (!fs.existsSync(gitPath)) {
  console.log('📝 Initializing new Git repository...');
  console.log('\n📋 Next Steps:');
  console.log('===============');
  console.log('1. Create new GitHub repository:');
  console.log('   - Go to https://github.com/new');
  console.log('   - Name: store-rating-app');
  console.log('   - Make it public');
  console.log('   - Don\'t initialize with README');
  console.log('\n2. Run these commands:');
  console.log('   git init');
  console.log('   git add .');
  console.log('   git commit -m "Initial commit with PostgreSQL"');
  console.log('   git branch -M main');
  console.log('   git remote add origin https://github.com/YOUR_USERNAME/store-rating-app.git');
  console.log('   git push -u origin main');
  console.log('\n3. Deploy to Render:');
  console.log('   - Go to https://render.com');
  console.log('   - Create new Blueprint Instance');
  console.log('   - Connect your GitHub repository');
  console.log('\n📚 See DEPLOYMENT_GUIDE.md for detailed instructions');
} else {
  console.log('✅ Git repository already exists');
  console.log('\n📋 Ready to deploy!');
  console.log('===============');
  console.log('1. Push to GitHub: git push');
  console.log('2. Deploy to Render using DEPLOYMENT_GUIDE.md');
}

console.log('\n🎯 Key Files Created:');
console.log('====================');
console.log('✅ render.yaml - Render deployment config');
console.log('✅ DATABASE_MIGRATION.md - PostgreSQL setup');
console.log('✅ DEPLOYMENT_GUIDE.md - Complete deployment guide');
console.log('✅ Updated package.json files');
console.log('✅ Updated API configuration');
console.log('✅ PostgreSQL database setup');

console.log('\n🔧 What\'s Changed:');
console.log('==================');
console.log('✅ Migrated from SQLite to PostgreSQL');
console.log('✅ Updated all API endpoints');
console.log('✅ Added production deployment config');
console.log('✅ Fixed environment variables');
console.log('✅ Added proper error handling');

console.log('\n🚀 Ready for Production!'); 