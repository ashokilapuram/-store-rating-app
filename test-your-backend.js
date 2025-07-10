const axios = require('axios');

// Your actual backend URL from Render
const BACKEND_URL = 'https://store-rating-app-g8m7.onrender.com';

async function testYourBackend() {
  console.log('🔍 Testing Your Backend URL...');
  console.log('================================\n');
  console.log(`Testing: ${BACKEND_URL}`);
  
  try {
    // Test health endpoint
    console.log('\n1. Testing /health...');
    const healthResponse = await axios.get(`${BACKEND_URL}/health`, { 
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    console.log('  ✅ Health endpoint working!');
    console.log(`  Response: ${JSON.stringify(healthResponse.data)}`);
    
    // Test API endpoint
    console.log('\n2. Testing /api/test...');
    const testResponse = await axios.get(`${BACKEND_URL}/api/test`, { timeout: 10000 });
    console.log('  ✅ API test endpoint working!');
    
    // Test users endpoint
    console.log('\n3. Testing /api/auth/users...');
    const usersResponse = await axios.get(`${BACKEND_URL}/api/auth/users`, { timeout: 10000 });
    console.log('  ✅ Users endpoint working!');
    console.log(`  Users found: ${usersResponse.data.users.length}`);
    
    // Test admin creation
    console.log('\n4. Testing /api/auth/create-admin...');
    const adminResponse = await axios.post(`${BACKEND_URL}/api/auth/create-admin`, {}, { timeout: 10000 });
    console.log('  ✅ Admin creation working!');
    console.log(`  Response: ${JSON.stringify(adminResponse.data)}`);
    
    console.log('\n🎉 YOUR BACKEND IS WORKING!');
    console.log(`URL: ${BACKEND_URL}`);
    console.log('\n📋 Next Steps:');
    console.log(`1. Update frontend API URL to: ${BACKEND_URL}`);
    console.log(`2. Test admin login: admin@store.com / admin123`);
    console.log(`3. Deploy frontend to Vercel with the new API URL`);
    
    return BACKEND_URL;
    
  } catch (error) {
    console.log('\n❌ Backend test failed');
    if (error.code === 'ENOTFOUND') {
      console.log('  ❌ Domain not found - check the URL');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('  ❌ Connection refused - backend sleeping or not deployed');
    } else if (error.response) {
      console.log(`  ❌ HTTP ${error.response.status}: ${error.response.statusText}`);
      if (error.response.status === 404) {
        console.log('  💡 Backend might still be deploying');
      }
    } else {
      console.log(`  ❌ Error: ${error.message}`);
    }
    
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check if backend is deployed on Render');
    console.log('2. Wait 5-10 minutes for deployment to complete');
    console.log('3. Check Render logs for any errors');
    console.log('4. Make sure the URL is correct');
  }
}

testYourBackend().catch(console.error); 