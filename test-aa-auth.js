// AA API Authentication Test
const https = require('https');

const username = '3010229';
const password = '8vWhT6Vt';

console.log('🔍 Testing different AA API authentication methods...');
console.log('🔑 Username:', username);
console.log('🔑 Password:', password.substring(0, 3) + '***');

// Test different authentication methods
const authMethods = [
  {
    name: 'Basic Auth (Base64)',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  },
  {
    name: 'Username/Password in body',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    body: { username, password }
  },
  {
    name: 'Username/Password as URL params',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  }
];

// Test different API endpoints
const testEndpoints = [
  'https://api.aa.com.tr/abone/discover/tr_TR',
  'https://api.aa.com.tr/abone/login',
  'https://api.aa.com.tr/abone/auth',
  'https://api.aa.com.tr/auth',
  'https://api.aa.com.tr/login'
];

async function testAuth(url, method, authMethod, extraParams = '') {
  return new Promise((resolve) => {
    const fullUrl = url + extraParams;
    const urlObj = new URL(fullUrl);
    
    const body = authMethod.body ? JSON.stringify(authMethod.body) : null;
    
    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: { ...authMethod.headers }
    };

    if (body && method === 'POST') {
      options.headers['Content-Length'] = Buffer.byteLength(body);
    }

    console.log(`\n📡 Testing: ${authMethod.name}`);
    console.log(`📡 URL: ${method} ${fullUrl}`);
    console.log(`📋 Headers:`, options.headers);
    if (body) console.log(`📄 Body:`, body);
    
    const req = https.request(options, (res) => {
      console.log(`📊 Status: ${res.statusCode}`);
      console.log(`📋 Response Headers:`, res.headers);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`📄 Response: ${data}`);
        resolve({ status: res.statusCode, data, headers: res.headers });
      });
    });

    req.on('error', (error) => {
      console.log(`❌ Error: ${error.message}`);
      resolve({ error: error.message });
    });

    req.setTimeout(10000);

    if (body && method === 'POST') {
      req.write(body);
    }
    
    req.end();
  });
}

async function runAuthTests() {
  // Test login endpoints first
  console.log('\n🔍 === TESTING LOGIN ENDPOINTS ===');
  
  for (const endpoint of testEndpoints) {
    for (const authMethod of authMethods) {
      if (authMethod.name.includes('URL params')) {
        await testAuth(endpoint, 'GET', authMethod, `?username=${username}&password=${password}`);
      } else {
        await testAuth(endpoint, 'POST', authMethod);
      }
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  // Test discover with different auth
  console.log('\n🔍 === TESTING DISCOVER WITH DIFFERENT AUTH ===');
  
  for (const authMethod of authMethods) {
    await testAuth('https://api.aa.com.tr/abone/discover/tr_TR', 'GET', authMethod);
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

runAuthTests().catch(console.error);
