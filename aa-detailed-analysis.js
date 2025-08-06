// AA API Detailed Response Analysis
const https = require('https');

const username = '3010263';
const password = '4WUbxVw9';
const auth = Buffer.from(`${username}:${password}`).toString('base64');

console.log('🔍 Analyzing AA API responses in detail...');

async function analyzeAAResponse(url, method = 'GET', body = null) {
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
        'Accept': 'application/json',
        'User-Agent': 'AA-API-Client/1.0'
      }
    };

    if (body && method === 'POST') {
      options.headers['Content-Length'] = Buffer.byteLength(body);
    }

    console.log(`\n📡 Analyzing: ${method} ${url}`);
    if (body) console.log(`📄 Request body: ${body}`);
    
    const req = https.request(options, (res) => {
      console.log(`📊 HTTP Status: ${res.statusCode}`);
      console.log(`📋 Response Headers:`, res.headers);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`📄 Response size: ${data.length} characters`);
        
        try {
          const jsonData = JSON.parse(data);
          console.log(`✅ Valid JSON response`);
          console.log(`📊 Response structure:`, JSON.stringify(jsonData, null, 2));
          
          // Analyze the structure
          if (jsonData.response) {
            console.log(`🔍 Response wrapper found`);
            console.log(`  - Success: ${jsonData.response.success}`);
            console.log(`  - Code: ${jsonData.response.code}`);
            console.log(`  - Message: ${jsonData.response.message || 'No message'}`);
          }
          
          if (jsonData.data) {
            console.log(`📊 Data section found`);
            console.log(`  - Data keys: ${Object.keys(jsonData.data)}`);
            
            if (jsonData.data.result) {
              console.log(`📰 News result found`);
              console.log(`  - Result type: ${typeof jsonData.data.result}`);
              console.log(`  - Is array: ${Array.isArray(jsonData.data.result)}`);
              
              if (Array.isArray(jsonData.data.result)) {
                console.log(`  - News count: ${jsonData.data.result.length}`);
                
                if (jsonData.data.result.length > 0) {
                  console.log(`📝 First news item structure:`);
                  const firstItem = jsonData.data.result[0];
                  console.log(`    - Keys: ${Object.keys(firstItem)}`);
                  console.log(`    - ID: ${firstItem.id || 'No ID'}`);
                  console.log(`    - Title: ${firstItem.title || firstItem.headline || 'No Title'}`);
                  console.log(`    - Date: ${firstItem.date || firstItem.pubdate || 'No Date'}`);
                  console.log(`    - Category: ${firstItem.category || 'No Category'}`);
                }
              }
            }
          }
          
          resolve({ status: res.statusCode, data: jsonData, raw: data });
        } catch (error) {
          console.log(`❌ Invalid JSON response`);
          console.log(`📄 Raw response: ${data.substring(0, 500)}${data.length > 500 ? '...' : ''}`);
          resolve({ status: res.statusCode, error: 'Invalid JSON', raw: data });
        }
      });
    });

    req.on('error', (error) => {
      console.log(`❌ Request Error: ${error.message}`);
      resolve({ error: error.message });
    });

    req.setTimeout(15000);

    if (body && method === 'POST') {
      req.write(body);
    }
    
    req.end();
  });
}

async function runDetailedAnalysis() {
  // Test different search parameters
  const searchTests = [
    {
      name: 'Simple search with minimal params',
      body: {
        limit: 10
      }
    },
    {
      name: 'Search with category filter',
      body: {
        filter_category: '1',
        limit: 10
      }
    },
    {
      name: 'Search with date range',
      body: {
        start_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        end_date: new Date().toISOString(),
        limit: 10
      }
    },
    {
      name: 'Search with all filters',
      body: {
        start_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: new Date().toISOString(),
        filter_category: '1',
        filter_type: '1',
        filter_language: '1',
        limit: 10,
        offset: 0
      }
    },
    {
      name: 'Empty search',
      body: {}
    }
  ];

  console.log('\n🔍 === DETAILED SEARCH ANALYSIS ===');
  
  for (const test of searchTests) {
    console.log(`\n--- ${test.name} ---`);
    const result = await analyzeAAResponse(
      'https://api.aa.com.tr/abone/search/', 
      'POST', 
      JSON.stringify(test.body)
    );
    
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
  }
  
  // Also test discover
  console.log('\n🔍 === DISCOVER ENDPOINT ANALYSIS ===');
  await analyzeAAResponse('https://api.aa.com.tr/abone/discover/tr_TR', 'GET');
}

runDetailedAnalysis().catch(console.error);
