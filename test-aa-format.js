// AA API Correct Format Discovery
const https = require('https');

const username = '3010229';
const password = '8vWhT6Vt';
const auth = Buffer.from(`${username}:${password}`).toString('base64');

console.log('🔍 Finding correct AA API request format...');

// Test different request body formats for search endpoint
const requestFormats = [
  {
    name: 'Format 1: Simple search',
    body: {
      q: 'haberler',
      limit: 5
    }
  },
  {
    name: 'Format 2: Date range search',
    body: {
      from: '2025-08-01',
      to: '2025-08-03',
      limit: 5
    }
  },
  {
    name: 'Format 3: Category search',
    body: {
      category: 'genel',
      limit: 5
    }
  },
  {
    name: 'Format 4: Language specific',
    body: {
      lang: 'tr',
      limit: 5
    }
  },
  {
    name: 'Format 5: Combined parameters',
    body: {
      query: 'spor',
      category: 'spor',
      lang: 'tr',
      from: '2025-08-02',
      to: '2025-08-03',
      limit: 5
    }
  },
  {
    name: 'Format 6: Empty body',
    body: {}
  },
  {
    name: 'Format 7: No body',
    body: null
  }
];

// Test different content types
const contentTypes = [
  'application/json',
  'application/x-www-form-urlencoded',
  'text/plain'
];

async function testRequestFormat(endpoint, format, contentType) {
  return new Promise((resolve) => {
    const url = `https://api.aa.com.tr/abone/${endpoint}`;
    const urlObj = new URL(url);
    
    let body = null;
    if (format.body !== null) {
      if (contentType === 'application/json') {
        body = JSON.stringify(format.body);
      } else if (contentType === 'application/x-www-form-urlencoded') {
        body = new URLSearchParams(format.body).toString();
      } else {
        body = Object.entries(format.body).map(([k,v]) => `${k}=${v}`).join('&');
      }
    }
    
    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json',
        'Content-Type': contentType,
        'User-Agent': 'AA-Client/1.0'
      }
    };

    if (body) {
      options.headers['Content-Length'] = Buffer.byteLength(body);
    }

    console.log(`\n📡 Testing: ${format.name} on ${endpoint}`);
    console.log(`📋 Content-Type: ${contentType}`);
    if (body) console.log(`📄 Body: ${body}`);
    
    const req = https.request(options, (res) => {
      console.log(`📊 Status: ${res.statusCode}`);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`✅ SUCCESS!`);
          try {
            const parsed = JSON.parse(data);
            console.log(`📄 Response:`, JSON.stringify(parsed, null, 2));
          } catch {
            console.log(`📄 Response:`, data);
          }
        } else if (res.statusCode === 401) {
          console.log(`🔐 401 Unauthorized - Wrong credentials`);
        } else if (res.statusCode === 422) {
          console.log(`❌ 422 Unprocessable - Wrong format`);
          console.log(`📄 Error:`, data);
        } else {
          console.log(`❓ ${res.statusCode}:`, data.substring(0, 200));
        }
        
        resolve({ 
          format: format.name, 
          endpoint, 
          contentType, 
          status: res.statusCode, 
          data 
        });
      });
    });

    req.on('error', (error) => {
      console.log(`❌ Error: ${error.message}`);
      resolve({ 
        format: format.name, 
        endpoint, 
        contentType, 
        error: error.message 
      });
    });

    req.setTimeout(10000);

    if (body) {
      req.write(body);
    }
    
    req.end();
  });
}

async function discoverCorrectFormat() {
  const results = [];
  
  // Test search endpoint with different formats
  console.log('\n🔍 === Testing search endpoint ===');
  
  for (const format of requestFormats) {
    for (const contentType of contentTypes) {
      const result = await testRequestFormat('search', format, contentType);
      results.push(result);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // If we found a working format, no need to test others
      if (result.status === 200) {
        console.log(`\n🎉 Found working format! Stopping tests.`);
        break;
      }
    }
  }
  
  // Also test news endpoints
  const newsEndpoints = ['v1/news', 'api/news', 'rest/news'];
  console.log('\n🔍 === Testing news endpoints ===');
  
  for (const endpoint of newsEndpoints) {
    const result = await testRequestFormat(endpoint, { name: 'GET-style', body: {} }, 'application/json');
    results.push(result);
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  console.log('\n📊 === FORMAT DISCOVERY SUMMARY ===');
  const successful = results.filter(r => r.status === 200);
  const unauthorized = results.filter(r => r.status === 401);
  const unprocessable = results.filter(r => r.status === 422);
  
  console.log(`✅ Successful (200): ${successful.length}`);
  console.log(`🔐 Unauthorized (401): ${unauthorized.length}`);
  console.log(`❌ Unprocessable (422): ${unprocessable.length}`);
  
  if (successful.length > 0) {
    console.log('\n🎉 Working formats found:');
    successful.forEach(r => {
      console.log(`  - ${r.format} on ${r.endpoint} with ${r.contentType}`);
    });
  } else {
    console.log('\n💡 No working formats found.');
    console.log('\n📝 All tested combinations failed. This suggests:');
    console.log('1. Credentials might be incorrect or expired');
    console.log('2. Account might not have API access permissions');
    console.log('3. API might have changed authentication method');
    console.log('4. API might require special headers or different auth flow');
  }
}

discoverCorrectFormat().catch(console.error);
