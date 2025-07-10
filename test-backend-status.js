const axios = require('axios');

// Test different backend URLs to find the correct one
const possibleUrls = [
  'https://store-rating-backend.onrender.com',
  'https://store-rating-app-backend.onrender.com',
  'https://your-app-name.onrender.com' // Replace with your actual backend URL
];

async function testBackendStatus() {
  console.log('🔍 Testing Backend Status...');
  console.log('=============================\n');

  for (const baseUrl of possibleUrls) {
    console.log(`Testing: ${baseUrl}`);
    
    try {
      // Test health endpoint
      console.log('  Testing /health...');
      const healthResponse = await axios.get(`${baseUrl}/health`, { timeout: 5000 });
      console.log('  ✅ Health endpoint working:', healthResponse.data);
      
      // Test API endpoint
      console.log('  Testing /api/test...');
      const testResponse = await axios.get(`${baseUrl}/api/test`, { timeout: 5000 });
      console.log('  ✅ API test endpoint working:', testResponse.data);
      
      // Test users endpoint
      console.log('  Testing /api/auth/users...');
      const usersResponse = await axios.get(`${baseUrl}/api/auth/users`, { timeout: 5000 });
      console.log('  ✅ Users endpoint working:', usersResponse.data);
      
      console.log(`\n🎉 Backend is working at: ${baseUrl}`);
      console.log('\n📋 Next Steps:');
      console.log(`1. Create admin: ${baseUrl}/api/auth/create-admin`);
      console.log(`2. Check users: ${baseUrl}/api/auth/users`);
      console.log(`3. Update frontend API URL to: ${baseUrl}`);
      
      return baseUrl;
      
    } catch (error) {
      if (error.code === 'ENOTFOUND') {
        console.log('  ❌ Domain not found - backend not deployed');
      } else if (error.code === 'ECONNREFUSED') {
        console.log('  ❌ Connection refused - backend sleeping or not running');
      } else if (error.response) {
        console.log(`  ❌ HTTP ${error.response.status}: ${error.response.statusText}`);
      } else {
        console.log(`  ❌ Error: ${error.message}`);
      }
    }
    
    console.log('');
  }
  
  console.log('❌ No working backend found!');
  console.log('\n🔧 Troubleshooting Steps:');
  console.log('1. Check if backend is deployed on Render');
  console.log('2. Check Render logs for deployment errors');
  console.log('3. Verify the correct backend URL');
  console.log('4. Wait for deployment to complete (can take 5-10 minutes)');
}

// Also test local backend
async function testLocalBackend() {
  console.log('\n🔍 Testing Local Backend...');
  console.log('=============================\n');
  
  try {
    const localUrl = 'http://localhost:5000';
    console.log(`Testing: ${localUrl}`);
    
    const healthResponse = await axios.get(`${localUrl}/health`, { timeout: 3000 });
    console.log('  ✅ Local backend working:', healthResponse.data);
    
    const usersResponse = await axios.get(`${localUrl}/api/auth/users`, { timeout: 3000 });
    console.log('  ✅ Local users endpoint working:', usersResponse.data);
    
    console.log('\n📋 Local Backend Commands:');
    console.log('1. Create admin: curl -X POST http://localhost:5000/api/auth/create-admin');
    console.log('2. Check users: curl http://localhost:5000/api/auth/users');
    console.log('3. Run admin script: cd backend && node create-admin.js');
    
  } catch (error) {
    console.log('  ❌ Local backend not running');
    console.log('  💡 Start local backend: cd backend && npm start');
  }
}

// Run tests
async function main() {
  await testBackendStatus();
  await testLocalBackend();
}

main().catch(console.error); 