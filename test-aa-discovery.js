// AA API Real Endpoint Discovery
const https = require('https');

const username = '3010229';
const password = '8vWhT6Vt';

console.log('🔍 Discovering real AA API endpoints and authentication...');

// Test actual AA API endpoints that might exist
const realEndpoints = [
  // Common REST API patterns
  'https://api.aa.com.tr/v1/news',
  'https://api.aa.com.tr/v2/news', 
  'https://api.aa.com.tr/api/v1/news',
  'https://api.aa.com.tr/rest/v1/news',
  
  // Subscriber endpoints
  'https://api.aa.com.tr/abone/v1/news',
  'https://api.aa.com.tr/abone/api/news',
  'https://api.aa.com.tr/abone/rest/news',
  'https://api.aa.com.tr/subscriber/news',
  
  // Search endpoints
  'https://api.aa.com.tr/search/news',
  'https://api.aa.com.tr/abone/search/news',
  'https://api.aa.com.tr/v1/search',
  
  // Feed endpoints 
  'https://api.aa.com.tr/feed',
  'https://api.aa.com.tr/abone/feed',
  'https://api.aa.com.tr/rss',
  
  // Archive endpoints
  'https://api.aa.com.tr/archive',
  'https://api.aa.com.tr/abone/archive'
];

// Also test different auth methods for the original endpoint
const authMethods = [
  {
    name: 'Basic Auth (current)',
    headers: { 'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}` }
  },
  {
    name: 'API Key in header',
    headers: { 'X-API-KEY': password, 'X-USERNAME': username }
  },
  {
    name: 'Token style',
    headers: { 'Authorization': `Token ${password}` }
  },
  {
    name: 'Custom AA format',
    headers: { 'AA-API-KEY': password, 'AA-USER': username }
  }
];

async function testEndpoint(url, authMethod) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'AA-API-Client/1.0',
        ...authMethod.headers
      }
    };

    console.log(`\n📡 Testing: ${url}`);
    console.log(`🔐 Auth: ${authMethod.name}`);
    
    const req = https.request(options, (res) => {
      console.log(`📊 Status: ${res.statusCode}`);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`✅ SUCCESS! ${url} with ${authMethod.name}`);
          console.log(`📄 Response:`, data.substring(0, 300));
        } else if (res.statusCode === 401) {
          console.log(`🔐 401 Unauthorized`);
        } else if (res.statusCode === 403) {
          console.log(`🚫 403 Forbidden`);
        } else if (res.statusCode === 404) {
          console.log(`❌ 404 Not Found`);
        } else {
          console.log(`❓ ${res.statusCode}: ${data.substring(0, 100)}`);
        }
        
        resolve({ url, auth: authMethod.name, status: res.statusCode, data });
      });
    });

    req.on('error', (error) => {
      console.log(`❌ Error: ${error.message}`);
      resolve({ url, auth: authMethod.name, error: error.message });
    });

    req.setTimeout(5000);
    req.end();
  });
}

async function discoverAPI() {
  const results = [];
  
  // Test main endpoint with different auth methods first
  console.log('\n🔍 === Testing original endpoint with different auth ===');
  const mainEndpoint = 'https://api.aa.com.tr/abone/search';
  
  for (const authMethod of authMethods) {
    const result = await testEndpoint(mainEndpoint, authMethod);
    results.push(result);
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Test different endpoints with basic auth
  console.log('\n🔍 === Testing different endpoints ===');
  const basicAuth = authMethods[0]; // Basic Auth
  
  for (const endpoint of realEndpoints.slice(0, 10)) { // Test first 10 to avoid timeout
    const result = await testEndpoint(endpoint, basicAuth);
    results.push(result);
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n📊 === DISCOVERY SUMMARY ===');
  const successful = results.filter(r => r.status === 200);
  const unauthorized = results.filter(r => r.status === 401);
  const forbidden = results.filter(r => r.status === 403);
  const notFound = results.filter(r => r.status === 404);
  
  console.log(`✅ Successful (200): ${successful.length}`);
  console.log(`🔐 Unauthorized (401): ${unauthorized.length}`);
  console.log(`🚫 Forbidden (403): ${forbidden.length}`);
  console.log(`❌ Not Found (404): ${notFound.length}`);
  
  if (successful.length > 0) {
    console.log('\n🎉 Working endpoints found:');
    successful.forEach(r => console.log(`  - ${r.url} with ${r.auth}`));
  } else {
    console.log('\n💡 No working endpoints found. Credentials might be incorrect or API might require different authentication.');
    console.log('\n📝 Recommendations:');
    console.log('1. Check if credentials are still valid');
    console.log('2. Contact AA API support for current endpoint and auth method');
    console.log('3. Check if account has proper permissions');
  }
}

discoverAPI().catch(console.error);
