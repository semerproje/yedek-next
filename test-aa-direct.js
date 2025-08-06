// AA API Direct Test
const https = require('https');

const username = '3010263';
const password = '4WUbxVw9';
const auth = Buffer.from(`${username}:${password}`).toString('base64');

console.log('🔍 Testing AA API directly...');
console.log('🔑 Auth:', auth.substring(0, 20) + '...');

// Test different AA API endpoints
const testUrls = [
  'https://haber.aa.com.tr/abone/discover/tr_TR',
  'https://api.aa.com.tr/abone/discover/tr_TR',
  'https://www.aa.com.tr/abone/discover/tr_TR',
  'https://haber.aa.com.tr/abone/search/',
  'https://api.aa.com.tr/abone/search/',
  'https://www.aa.com.tr/abone/search/'
];

async function testUrl(url, method = 'GET', body = null) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname,
      method: method,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };

    if (body && method === 'POST') {
      options.headers['Content-Length'] = Buffer.byteLength(body);
    }

    console.log(`\n📡 Testing: ${method} ${url}`);
    
    const req = https.request(options, (res) => {
      console.log(`📊 Status: ${res.statusCode}`);
      console.log(`📋 Headers:`, res.headers);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`📄 Response length: ${data.length} characters`);
        if (data.length < 1000) {
          console.log(`📄 Response: ${data}`);
        } else {
          console.log(`📄 Response preview: ${data.substring(0, 200)}...`);
        }
        resolve({ status: res.statusCode, data, headers: res.headers });
      });
    });

    req.on('error', (error) => {
      console.log(`❌ Error: ${error.message}`);
      resolve({ error: error.message });
    });

    req.on('timeout', () => {
      console.log(`⏰ Timeout`);
      req.destroy();
      resolve({ error: 'Timeout' });
    });

    req.setTimeout(10000);

    if (body && method === 'POST') {
      req.write(body);
    }
    
    req.end();
  });
}

async function runTests() {
  // Test discover endpoints
  console.log('\n🔍 === TESTING DISCOVER ENDPOINTS ===');
  for (const url of testUrls.filter(u => u.includes('discover'))) {
    await testUrl(url, 'GET');
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
  }

  // Test search endpoints
  console.log('\n🔍 === TESTING SEARCH ENDPOINTS ===');
  const searchBody = JSON.stringify({
    start_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date().toISOString(),
    filter_category: '1',
    filter_type: '1',
    filter_language: '1',
    limit: 5,
    offset: 0
  });

  for (const url of testUrls.filter(u => u.includes('search'))) {
    await testUrl(url, 'POST', searchBody);
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
  }
}

runTests().catch(console.error);
