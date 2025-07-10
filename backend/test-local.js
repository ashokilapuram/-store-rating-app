const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

console.log('🔍 Backend Configuration Test');
console.log('=============================');

// Check environment variables
const envVars = {
  'NODE_ENV': process.env.NODE_ENV || 'development',
  'PORT': process.env.PORT || 5000,
  'JWT_SECRET': process.env.JWT_SECRET ? '✅ Set' : '❌ Missing',
  'DB_PATH': process.env.DB_PATH || 'Using default path',
  'CORS_ORIGIN': process.env.CORS_ORIGIN || 'Not set'
};

console.log('\n📋 Environment Variables:');
Object.entries(envVars).forEach(([key, value]) => {
  console.log(`  ${key}: ${value}`);
});

// Check if database directory exists
const dbPath = process.env.DB_PATH || path.resolve(__dirname, 'db/store-rating.db');
const dbDir = path.dirname(dbPath);

console.log('\n🗄️ Database Configuration:');
console.log(`  Database path: ${dbPath}`);
console.log(`  Database directory: ${dbDir}`);

const fs = require('fs');
if (fs.existsSync(dbDir)) {
  console.log(`  ✅ Database directory exists`);
} else {
  console.log(`  ❌ Database directory does not exist`);
}

// Check package.json
const packageJson = require('./package.json');
console.log('\n📦 Package Configuration:');
console.log(`  Name: ${packageJson.name}`);
console.log(`  Version: ${packageJson.version}`);
console.log(`  Main: ${packageJson.main}`);
console.log(`  Start script: ${packageJson.scripts.start}`);

// Check dependencies
console.log('\n📚 Dependencies:');
Object.keys(packageJson.dependencies).forEach(dep => {
  console.log(`  ✅ ${dep}`);
});

console.log('\n🎯 Ready for deployment!');
console.log('Make sure to set JWT_SECRET in your Render environment variables.'); 