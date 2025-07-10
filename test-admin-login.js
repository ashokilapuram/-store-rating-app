const axios = require('axios');

const BACKEND_URL = 'https://store-rating-app-g8m7.onrender.com';

async function testAdminLogin() {
  console.log('🔍 Testing Admin Login...');
  console.log('========================\n');
  console.log(`Backend URL: ${BACKEND_URL}`);
  
  try {
    // Test admin login
    console.log('\n1. Testing admin login...');
    const loginResponse = await axios.post(`${BACKEND_URL}/api/auth/login`, {
      email: 'admin@store.com',
      password: 'admin123'
    }, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('  ✅ Admin login successful!');
    console.log(`  Response: ${JSON.stringify(loginResponse.data)}`);
    
    // Check if token is present
    if (loginResponse.data.token) {
      console.log('  ✅ JWT token received');
      
      // Decode token to check role
      const token = loginResponse.data.token;
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      console.log(`  ✅ User role: ${payload.role}`);
      
      if (payload.role === 'admin') {
        console.log('  ✅ Admin role confirmed!');
      }
    }
    
    console.log('\n🎉 ADMIN LOGIN IS WORKING!');
    console.log('\n📋 Frontend Test:');
    console.log('1. Go to your frontend (localhost:3000)');
    console.log('2. Click Login');
    console.log('3. Use: admin@store.com / admin123');
    console.log('4. Should redirect to admin dashboard');
    
  } catch (error) {
    console.log('\n❌ Admin login failed');
    if (error.response) {
      console.log(`  ❌ HTTP ${error.response.status}: ${error.response.statusText}`);
      console.log(`  ❌ Error: ${error.response.data.error || 'Unknown error'}`);
    } else {
      console.log(`  ❌ Error: ${error.message}`);
    }
    
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check if admin user exists in database');
    console.log('2. Verify credentials: admin@store.com / admin123');
    console.log('3. Check backend logs for any errors');
  }
}

testAdminLogin().catch(console.error); 