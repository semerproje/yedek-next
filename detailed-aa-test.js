// Node.js 18+ built-in fetch kullanıyoruz

const AA_CONFIG = {
  baseUrl: 'https://api.aa.com.tr/abone',
  username: '3010229',
  password: '8vWhT6Vt',
  timeout: 30000
};

// Basic Auth header
const authHeader = 'Basic ' + Buffer.from(`${AA_CONFIG.username}:${AA_CONFIG.password}`).toString('base64');

console.log('🔍 AA API Detaylı Test Başlıyor...\n');
console.log('📋 Kullanılan Bilgiler:');
console.log('- Base URL:', AA_CONFIG.baseUrl);
console.log('- Username:', AA_CONFIG.username);
console.log('- Auth Header:', authHeader);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

async function testAAEndpoint(endpoint, method = 'GET', body = null) {
  try {
    console.log(`📡 Test: ${method} ${endpoint}`);
    
    const options = {
      method,
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'AA-News-Client/1.0',
        'Cache-Control': 'no-cache'
      },
      timeout: AA_CONFIG.timeout
    };

    if (body) {
      options.body = JSON.stringify(body);
      console.log('📤 Request Body:', JSON.stringify(body, null, 2));
    }

    const response = await fetch(`${AA_CONFIG.baseUrl}${endpoint}`, options);
    
    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    console.log('📋 Headers:', Object.fromEntries(response.headers));
    
    const responseText = await response.text();
    console.log('📥 Raw Response:', responseText);
    
    try {
      const jsonData = JSON.parse(responseText);
      console.log('✅ JSON Response:', JSON.stringify(jsonData, null, 2));
      return { success: true, data: jsonData, status: response.status };
    } catch (parseError) {
      console.log('❌ JSON Parse Error:', parseError.message);
      return { success: false, error: 'Invalid JSON', rawResponse: responseText, status: response.status };
    }
    
  } catch (error) {
    console.log('🚫 Request Error:', error.message);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  // Test 1: Status Check (Basit GET)
  console.log('🧪 TEST 1: STATUS CHECK');
  await testAAEndpoint('/status');
  console.log('\n' + '━'.repeat(80) + '\n');
  
  // Test 2: Latest News (Parametresiz)
  console.log('🧪 TEST 2: LATEST NEWS (Parametresiz)');
  await testAAEndpoint('/latest');
  console.log('\n' + '━'.repeat(80) + '\n');
  
  // Test 3: Latest News (Limit ile)
  console.log('🧪 TEST 3: LATEST NEWS (Limit=5)');
  await testAAEndpoint('/latest?limit=5');
  console.log('\n' + '━'.repeat(80) + '\n');
  
  // Test 4: Search (Basit arama)
  console.log('🧪 TEST 4: SEARCH (Basit arama)');
  await testAAEndpoint('/search?q=haber&limit=3');
  console.log('\n' + '━'.repeat(80) + '\n');
  
  // Test 5: Search (POST ile)
  console.log('🧪 TEST 5: SEARCH (POST body ile)');
  await testAAEndpoint('/search', 'POST', {
    query: 'türkiye',
    limit: 3,
    language: 'tr'
  });
  console.log('\n' + '━'.repeat(80) + '\n');
  
  // Test 6: Categories (Kategoriler)
  console.log('🧪 TEST 6: CATEGORIES');
  await testAAEndpoint('/categories');
  console.log('\n' + '━'.repeat(80) + '\n');
  
  // Test 7: News Detail (ID ile)
  console.log('🧪 TEST 7: NEWS DETAIL');
  await testAAEndpoint('/news/latest');
  console.log('\n' + '━'.repeat(80) + '\n');
  
  console.log('🏁 Tüm testler tamamlandı!');
}

runTests().catch(console.error);
