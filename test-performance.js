// Performance Test Script
// Node.js 18+ has built-in fetch

async function testWebVitalsAPI() {
  console.log('🚀 Testing Web Vitals API Performance...\n');
  
  const testData = {
    name: 'FCP',
    value: 1500,
    rating: 'good',
    entries: []
  };

  const promises = [];
  const startTime = Date.now();
  
  // Send 5 concurrent requests
  for (let i = 0; i < 5; i++) {
    promises.push(
      fetch('http://localhost:3000/api/analytics/web-vitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...testData, id: i })
      })
    );
  }

  try {
    const responses = await Promise.all(promises);
    const endTime = Date.now();
    
    console.log(`✅ All ${promises.length} requests completed in ${endTime - startTime}ms`);
    console.log(`📊 Average response time: ${(endTime - startTime) / promises.length}ms per request`);
    
    // Check responses
    for (let i = 0; i < responses.length; i++) {
      const response = responses[i];
      const data = await response.json();
      console.log(`📋 Request ${i + 1}: Status ${response.status}, Dev Mode: ${data.dev || false}`);
    }
    
    console.log('\n🎯 Expected improvements:');
    console.log('- Development mode: Firebase writes disabled');
    console.log('- Response time: < 100ms per request');
    console.log('- Console noise: Dramatically reduced');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testWebVitalsAPI();
