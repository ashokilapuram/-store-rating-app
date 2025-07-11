#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🗄️ PostgreSQL Setup Script');
console.log('==========================\n');

// Check if .env exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file...');
  
  const envContent = `# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Database Configuration
# For Development (Local PostgreSQL)
DB_USER=postgres
DB_HOST=localhost
DB_NAME=store_rating_dev
DB_PASSWORD=your_password_here
DB_PORT=5432

# For Production (PostgreSQL on Railway/Render/etc.)
# DATABASE_URL=postgresql://username:password@host:port/database

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created');
} else {
  console.log('✅ .env file already exists');
}

console.log('\n📋 Next Steps:');
console.log('===============');
console.log('1. Install PostgreSQL: https://www.postgresql.org/download/');
console.log('2. Create database: CREATE DATABASE store_rating_dev;');
console.log('3. Update .env with your PostgreSQL password');
console.log('4. Run: npm start');
console.log('\n🎯 For production deployment:');
console.log('- Railway: https://railway.app');
console.log('- Render: https://render.com');
console.log('- Heroku: https://heroku.com');

console.log('\n📚 See DATABASE_MIGRATION.md for detailed instructions'); 