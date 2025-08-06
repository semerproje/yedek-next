// Real AA API Test with Enhanced Parameters
const testRealAAAPI = async () => {
  try {
    console.log('🚀 Starting Real AA API Test...');
    
    const testParams = {
      categories: ['genel', 'spor', 'ekonomi'], // Real AA categories
      keywords: 'türkiye', // Search for Turkey-related news
      start_date: '2025-08-05T00:00:00Z', // Today's news
      end_date: '2025-08-05T23:59:59Z',
      limit: 20,
      content_types: [1], // Text news only
      priority: [1, 2, 3], // All priority levels
      language: 1, // Turkish
      auto_process: true,
      auto_publish: true,
      fetch_photos: true,
      ai_enhance: true,
      newsml_format: true
    };
    
    console.log('📋 Test Parameters:', testParams);
    
    // Call the manual fetch API
    const response = await fetch('http://localhost:3000/api/ultra-premium-aa', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'manual-fetch',
        params: testParams
      })
    });
    
    const result = await response.json();
    
    console.log('📊 AA API Response Status:', response.status);
    console.log('📨 AA API Response:', result);
    
    if (result.success) {
      console.log('✅ Real AA API Test Successful!');
      console.log(`📈 Total news fetched: ${result.data?.processed_count || 0}`);
      console.log(`🔥 News saved to Firebase: ${result.data?.saved_count || 0}`);
      
      if (result.data?.news && result.data.news.length > 0) {
        console.log('📰 Sample news items:');
        result.data.news.slice(0, 3).forEach((news, index) => {
          console.log(`${index + 1}. ${news.title}`);
          console.log(`   Source: ${news.source}`);
          console.log(`   Category: ${news.category}`);
          console.log(`   Published: ${news.publishedAt}`);
          console.log(`   Firebase ID: ${news.id}`);
        });
      }
    } else {
      console.error('❌ AA API Test Failed:', result.error);
    }
    
  } catch (error) {
    console.error('💥 Test Error:', error);
  }
};

// Run the test
testRealAAAPI();
