const axios = require('axios');

// Test the API connection
async function testAPI() {
  const apiUrl = 'https://store-rating-backend.onrender.com';
  
  console.log('Testing API connection...');
  console.log('API URL:', apiUrl);
  
  try {
    // Test the test endpoint
    console.log('\n1. Testing /api/test endpoint...');
    const testResponse = await axios.get(`${apiUrl}/api/test`);
    console.log('✅ Test endpoint working:', testResponse.data);
    
    // Test login endpoint (without credentials)
    console.log('\n2. Testing /api/auth/login endpoint...');
    try {
      const loginResponse = await axios.post(`${apiUrl}/api/auth/login`, {
        email: 'test@example.com',
        password: 'testpassword'
      });
      console.log('❌ Login should have failed but succeeded:', loginResponse.data);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Login endpoint working (correctly rejected invalid credentials)');
      } else {
        console.log('❌ Login endpoint error:', error.message);
      }
    }
    
    console.log('\n🎉 API is accessible and responding!');
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    
    if (error.code === 'ENOTFOUND') {
      console.log('💡 The backend URL might be incorrect or the service is not running');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('💡 The backend service might be sleeping (Render free tier)');
    }
  }
}

// Run the test
testAPI(); 