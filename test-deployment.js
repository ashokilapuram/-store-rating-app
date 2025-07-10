const axios = require('axios');

// Test the backend deployment with proper host binding
async function testDeployment() {
  console.log('🔍 Testing Backend Deployment...');
  console.log('================================\n');

  // Common backend URLs to test
  const testUrls = [
    'https://store-rating-backend.onrender.com',
    'https://store-rating-app-backend.onrender.com',
    'https://store-rating-backend-ashok.onrender.com',
    'https://store-rating-app-ashok.onrender.com'
  ];

  for (const baseUrl of testUrls) {
    console.log(`Testing: ${baseUrl}`);
    
    try {
      // Test health endpoint
      console.log('  Testing /health...');
      const healthResponse = await axios.get(`${baseUrl}/health`, { 
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (healthResponse.status === 200) {
        console.log('  ✅ Health endpoint working!');
        console.log(`  Response: ${JSON.stringify(healthResponse.data)}`);
        
        // Test API endpoint
        console.log('  Testing /api/test...');
        const testResponse = await axios.get(`${baseUrl}/api/test`, { timeout: 10000 });
        console.log('  ✅ API test endpoint working!');
        
        // Test users endpoint
        console.log('  Testing /api/auth/users...');
        const usersResponse = await axios.get(`${baseUrl}/api/auth/users`, { timeout: 10000 });
        console.log('  ✅ Users endpoint working!');
        console.log(`  Users found: ${usersResponse.data.users.length}`);
        
        // Test admin creation
        console.log('  Testing /api/auth/create-admin...');
        const adminResponse = await axios.post(`${baseUrl}/api/auth/create-admin`, {}, { timeout: 10000 });
        console.log('  ✅ Admin creation working!');
        console.log(`  Response: ${JSON.stringify(adminResponse.data)}`);
        
        console.log(`\n🎉 BACKEND IS WORKING!`);
        console.log(`URL: ${baseUrl}`);
        console.log('\n📋 Next Steps:');
        console.log(`1. Update frontend API URL to: ${baseUrl}`);
        console.log(`2. Test admin login: admin@store.com / admin123`);
        console.log(`3. Check users: ${baseUrl}/api/auth/users`);
        
        return baseUrl;
      }
    } catch (error) {
      if (error.code === 'ENOTFOUND') {
        console.log('  ❌ Domain not found');
      } else if (error.code === 'ECONNREFUSED') {
        console.log('  ❌ Connection refused (backend sleeping)');
      } else if (error.response) {
        console.log(`  ❌ HTTP ${error.response.status}: ${error.response.statusText}`);
        if (error.response.status === 404) {
          console.log('  💡 This might be the right URL but backend not deployed yet');
        }
      } else {
        console.log(`  ❌ Error: ${error.message}`);
      }
    }
    
    console.log('');
  }
  
  console.log('❌ No working backend found');
  console.log('\n🔧 Deployment Steps:');
  console.log('1. Push your updated code to GitHub');
  console.log('2. Redeploy on Render (should auto-deploy)');
  console.log('3. Wait 5-10 minutes for deployment');
  console.log('4. Check Render logs for any errors');
  console.log('5. Test again with this script');
}

// Also test local backend to make sure it works
async function testLocalBackend() {
  console.log('\n🔍 Testing Local Backend...');
  console.log('=============================\n');
  
  try {
    const localUrl = 'http://localhost:5000';
    console.log(`Testing: ${localUrl}`);
    
    const healthResponse = await axios.get(`${localUrl}/health`, { timeout: 5000 });
    console.log('  ✅ Local health endpoint working');
    
    const usersResponse = await axios.get(`${localUrl}/api/auth/users`, { timeout: 5000 });
    console.log('  ✅ Local users endpoint working');
    console.log(`  Users found: ${usersResponse.data.users.length}`);
    
    console.log('\n✅ Local backend is working correctly');
    
  } catch (error) {
    console.log('  ❌ Local backend not running');
    console.log('  💡 Start local backend: npm start');
  }
}

async function main() {
  await testDeployment();
  await testLocalBackend();
}

main().catch(console.error); 