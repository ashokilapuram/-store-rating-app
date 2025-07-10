const axios = require('axios');

// Common backend URL patterns to test
const possibleUrls = [
  'https://store-rating-backend.onrender.com',
  'https://store-rating-app-backend.onrender.com',
  'https://store-rating-backend-ashok.onrender.com',
  'https://store-rating-app-ashok.onrender.com',
  'https://store-rating-backend-91630.onrender.com',
  'https://store-rating-app-91630.onrender.com',
  'https://store-rating-backend-user.onrender.com',
  'https://store-rating-app-user.onrender.com'
];

async function testBackendUrls() {
  console.log('🔍 Finding Your Backend URL...');
  console.log('================================\n');

  for (const url of possibleUrls) {
    console.log(`Testing: ${url}`);
    
    try {
      const response = await axios.get(`${url}/health`, { 
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (response.status === 200) {
        console.log('  ✅ BACKEND FOUND!');
        console.log(`  URL: ${url}`);
        console.log(`  Response: ${JSON.stringify(response.data)}`);
        
        // Test admin creation
        try {
          const adminResponse = await axios.post(`${url}/api/auth/create-admin`, {}, {
            timeout: 10000
          });
          console.log(`  ✅ Admin creation: ${JSON.stringify(adminResponse.data)}`);
        } catch (adminError) {
          console.log(`  ❌ Admin creation failed: ${adminError.message}`);
        }
        
        console.log('\n📋 Next Steps:');
        console.log(`1. Update your frontend API URL to: ${url}`);
        console.log(`2. Test admin login with: admin@store.com / admin123`);
        console.log(`3. Check users at: ${url}/api/auth/users`);
        
        return url;
      }
    } catch (error) {
      if (error.code === 'ENOTFOUND') {
        console.log('  ❌ Domain not found');
      } else if (error.code === 'ECONNREFUSED') {
        console.log('  ❌ Connection refused (backend sleeping)');
      } else if (error.response) {
        console.log(`  ❌ HTTP ${error.response.status}: ${error.response.statusText}`);
      } else {
        console.log(`  ❌ Error: ${error.message}`);
      }
    }
    
    console.log('');
  }
  
  console.log('❌ No backend found with common URL patterns');
  console.log('\n🔧 Manual Steps:');
  console.log('1. Go to your Render dashboard');
  console.log('2. Find your backend service');
  console.log('3. Copy the URL (should end with .onrender.com)');
  console.log('4. Test it manually in your browser');
  console.log('5. If backend is sleeping, wait 30-60 seconds for it to wake up');
}

// Also test if backend is just sleeping
async function testSleepingBackend() {
  console.log('\n😴 Testing if backend is sleeping...');
  console.log('=====================================\n');
  
  // Test the most likely URL with longer timeout
  const testUrl = 'https://store-rating-backend.onrender.com';
  
  try {
    console.log(`Testing ${testUrl} with longer timeout...`);
    const response = await axios.get(`${testUrl}/health`, { 
      timeout: 30000 // 30 seconds for sleeping backend
    });
    
    console.log('  ✅ Backend woke up!');
    console.log(`  URL: ${testUrl}`);
    console.log(`  Response: ${JSON.stringify(response.data)}`);
    
    return testUrl;
  } catch (error) {
    console.log('  ❌ Backend still not responding');
    console.log('  💡 Try visiting the URL in your browser to wake it up');
  }
}

async function main() {
  const foundUrl = await testBackendUrls();
  if (!foundUrl) {
    await testSleepingBackend();
  }
}

main().catch(console.error); 