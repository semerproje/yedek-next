// Test Next.js AA API Routes
const https = require('https');

console.log('🔍 Testing Next.js AA API routes...');

async function testNextJSRoute(path, method = 'GET', body = null) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };

    if (body && method === 'POST') {
      options.headers['Content-Length'] = Buffer.byteLength(body);
    }

    console.log(`\n📡 Testing: ${method} http://localhost:3000${path}`);
    if (body) console.log(`📄 Request body: ${body}`);
    
    const req = https.request(options, (res) => {
      console.log(`📊 Status: ${res.statusCode}`);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`📄 Response size: ${data.length} characters`);
        
        try {
          const jsonData = JSON.parse(data);
          console.log(`✅ Valid JSON response`);
          console.log(`📊 Response:`, JSON.stringify(jsonData, null, 2));
          
          if (jsonData.success) {
            console.log(`🎉 API Success: ${jsonData.news?.length || 0} news items found`);
          } else {
            console.log(`❌ API Error: ${jsonData.error}`);
          }
          
          resolve({ status: res.statusCode, data: jsonData });
        } catch (error) {
          console.log(`❌ Invalid JSON response`);
          console.log(`📄 Raw response: ${data}`);
          resolve({ status: res.statusCode, error: 'Invalid JSON', raw: data });
        }
      });
    });

    req.on('error', (error) => {
      console.log(`❌ Request Error: ${error.message}`);
      resolve({ error: error.message });
    });

    req.setTimeout(30000);

    if (body && method === 'POST') {
      req.write(body);
    }
    
    req.end();
  });
}

async function testAllRoutes() {
  console.log('\n🔍 === TESTING NEXT.JS API ROUTES ===');
  
  // Test search route GET (should return info)
  await testNextJSRoute('/api/aa-news/search', 'GET');
  
  // Test search route POST with various payloads
  const searchTests = [
    {
      name: 'Simple search',
      body: { limit: 5 }
    },
    {
      name: 'Category search',
      body: { category: 'genel', limit: 5 }
    },
    {
      name: 'Sport news',
      body: { category: 'spor', limit: 10 }
    }
  ];
  
  for (const test of searchTests) {
    console.log(`\n--- ${test.name} ---`);
    await testNextJSRoute('/api/aa-news/search', 'POST', JSON.stringify(test.body));
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Test discover route
  console.log(`\n--- Discover endpoint ---`);
  await testNextJSRoute('/api/aa-news/discover', 'GET');
}

testAllRoutes().catch(console.error);
