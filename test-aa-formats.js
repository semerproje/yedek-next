// AA API Format Analysis
const https = require('https');

const username = '3010229';
const password = '8vWhT6Vt';

console.log('🔍 Testing AA API with different request formats...');

// Common API authentication patterns for news agencies
const testFormats = [
  {
    name: 'Format 1: REST with Basic Auth',
    url: 'https://api.aa.com.tr/abone/news',
    method: 'GET',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  },
  {
    name: 'Format 2: Query Parameters',
    url: `https://api.aa.com.tr/abone/news?username=${username}&password=${password}&lang=tr&limit=5`,
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  },
  {
    name: 'Format 3: POST with credentials in body',
    url: 'https://api.aa.com.tr/abone/news',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: username,
      password: password,
      language: 'tr',
      limit: 5
    })
  },
  {
    name: 'Format 4: Token-based (search endpoint)',
    url: 'https://api.aa.com.tr/abone/search',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Buffer.from(`${username}:${password}`).toString('base64')}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      filter_language: 'tr',
      limit: 5
    })
  },
  {
    name: 'Format 5: X-API-Key header',
    url: 'https://api.aa.com.tr/abone/news',
    method: 'GET',
    headers: {
      'X-API-Key': `${username}:${password}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  },
  {
    name: 'Format 6: Custom Auth Header',
    url: 'https://api.aa.com.tr/abone/news',
    method: 'GET',
    headers: {
      'X-Auth-User': username,
      'X-Auth-Pass': password,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }
];

async function testFormat(format) {
  return new Promise((resolve) => {
    const urlObj = new URL(format.url);
    const body = format.body || null;
    
    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname + urlObj.search,
      method: format.method,
      headers: { ...format.headers }
    };

    if (body && format.method === 'POST') {
      options.headers['Content-Length'] = Buffer.byteLength(body);
    }

    console.log(`\n📡 ${format.name}`);
    console.log(`📡 ${format.method} ${format.url}`);
    console.log(`📋 Headers:`, options.headers);
    if (body) console.log(`📄 Body:`, body);
    
    const req = https.request(options, (res) => {
      console.log(`📊 Status: ${res.statusCode}`);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`📄 Response (${data.length} chars):`, data.length > 200 ? data.substring(0, 200) + '...' : data);
        
        if (res.statusCode === 200) {
          console.log(`✅ SUCCESS! This format works!`);
        } else if (res.statusCode === 401) {
          console.log(`🔐 Still unauthorized - wrong auth format`);
        } else if (res.statusCode === 404) {
          console.log(`❌ Endpoint not found`);
        } else {
          console.log(`❓ Other status: ${res.statusCode}`);
        }
        
        resolve({ status: res.statusCode, data, format: format.name });
      });
    });

    req.on('error', (error) => {
      console.log(`❌ Network Error: ${error.message}`);
      resolve({ error: error.message, format: format.name });
    });

    req.setTimeout(10000);

    if (body && format.method === 'POST') {
      req.write(body);
    }
    
    req.end();
  });
}

async function runFormatTests() {
  console.log('🚀 Starting AA API format tests...\n');
  
  const results = [];
  
  for (const format of testFormats) {
    const result = await testFormat(format);
    results.push(result);
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay between tests
  }
  
  console.log('\n📊 === TEST SUMMARY ===');
  results.forEach(result => {
    console.log(`${result.format}: ${result.status || 'ERROR'} ${result.error || ''}`);
  });
  
  const successful = results.filter(r => r.status === 200);
  if (successful.length > 0) {
    console.log(`\n🎉 Found ${successful.length} working format(s)!`);
  } else {
    console.log(`\n😞 No working formats found. May need to check credentials or API availability.`);
  }
}

runFormatTests().catch(console.error);
