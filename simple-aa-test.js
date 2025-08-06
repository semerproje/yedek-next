// Simple AA API Test
const credentials = {
  username: '3010229',
  password: '8vWhT6Vt',
  baseUrl: 'https://api.aa.com.tr/abone'
};

function getAuthHeader() {
  const auth = Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64');
  return `Basic ${auth}`;
}

async function testAAAPI() {
  console.log('🔍 AA API Basit Test...\n');
  
  const testEndpoints = [
    { url: `${credentials.baseUrl}/status`, name: 'Status API' },
    { url: `${credentials.baseUrl}/search?limit=3`, name: 'Search API' },
    { url: `${credentials.baseUrl}/latest?limit=3`, name: 'Latest API' },
  ];

  for (const endpoint of testEndpoints) {
    console.log(`📡 Test: ${endpoint.name}`);
    console.log(`🔗 URL: ${endpoint.url}`);
    
    try {
      const response = await fetch(endpoint.url, {
        method: 'GET',
        headers: {
          'Authorization': getAuthHeader(),
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'AA-News-Crawler-Test/1.0'
        }
      });

      console.log(`📊 Response:`);
      console.log(`  - Status: ${response.status} ${response.statusText}`);
      console.log(`  - Headers:`, Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        try {
          const data = await response.json();
          console.log(`  - Data:`, JSON.stringify(data, null, 2));
        } catch (jsonError) {
          console.log(`  - Raw Response: ${await response.text()}`);
        }
      } else {
        const errorText = await response.text();
        console.log(`  - Error Response: ${errorText}`);
      }

    } catch (error) {
      console.error(`❌ ${endpoint.name} Hatası:`, error.message);
    }
    
    console.log('---\n');
  }

  console.log('✅ Test Tamamlandı!');
}

testAAAPI().catch(console.error);
