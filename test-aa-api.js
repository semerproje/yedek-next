// Test AA API Proxy Functionality
// Bu dosya AA API proxy'sinin çalışıp çalışmadığını test eder

async function testAAAPIProxy() {
  console.log('🧪 Testing AA API Proxy...\n');

  const baseUrl = 'http://localhost:3000/api/aa-proxy';
  
  try {
    // Test 1: Discover endpoint
    console.log('1️⃣ Testing discover endpoint...');
    const discoverResponse = await fetch(`${baseUrl}?endpoint=/discover/tr_TR`);
    const discoverData = await discoverResponse.json();
    
    if (discoverData.success) {
      console.log('✅ Discover endpoint working!');
      console.log('📊 Categories:', Object.keys(discoverData.data.category || {}).length);
      console.log('📊 Providers:', Object.keys(discoverData.data.provider || {}).length);
    } else {
      console.log('❌ Discover endpoint failed:', discoverData.error);
    }

    // Test 2: Subscription endpoint
    console.log('\n2️⃣ Testing subscription endpoint...');
    const subscriptionResponse = await fetch(`${baseUrl}?endpoint=/subscription/`);
    const subscriptionData = await subscriptionResponse.json();
    
    if (subscriptionData.success) {
      console.log('✅ Subscription endpoint working!');
      console.log('📊 Available packages:', subscriptionData.data.package?.length || 0);
    } else {
      console.log('❌ Subscription endpoint failed:', subscriptionData.error);
    }

    // Test 3: Search endpoint (POST)
    console.log('\n3️⃣ Testing search endpoint...');
    const searchResponse = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'search',
        params: {
          start_date: '2024-08-01T00:00:00Z',
          end_date: 'NOW',
          filter_type: '1', // Haber
          filter_language: '1', // Türkçe
          limit: 5
        }
      })
    });
    
    const searchData = await searchResponse.json();
    
    if (searchData.success) {
      console.log('✅ Search endpoint working!');
      console.log('📊 Total news found:', searchData.data.total || 0);
      console.log('📊 News in response:', searchData.data.result?.length || 0);
    } else {
      console.log('❌ Search endpoint failed:', searchData.error);
    }

    console.log('\n🎉 AA API Proxy test completed!');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Node.js ortamında çalıştırma
if (typeof window === 'undefined') {
  // Import fetch for Node.js
  const fetch = require('node-fetch');
  testAAAPIProxy();
} else {
  // Browser ortamında çalıştırma için window'a ekle
  window.testAAAPIProxy = testAAAPIProxy;
  console.log('🌐 AA API test function loaded. Run testAAAPIProxy() in console.');
}
