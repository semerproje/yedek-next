// Node.js 18+ built-in fetch kullanıyoruz

const AA_CONFIG = {
  baseUrl: 'https://api.aa.com.tr/abone',
  username: '3010229',
  password: '8vWhT6Vt',
  timeout: 30000
};

// Basic Auth header
const authHeader = 'Basic ' + Buffer.from(`${AA_CONFIG.username}:${AA_CONFIG.password}`).toString('base64');

console.log('🔍 AA API Haber Detay Test Başlıyor...\n');

async function testNewsDetail(newsId) {
  try {
    console.log(`📡 Haber Detay Test: ${newsId}`);
    
    const options = {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'AA-News-Client/1.0',
        'Cache-Control': 'no-cache'
      },
      timeout: AA_CONFIG.timeout
    };

    const response = await fetch(`${AA_CONFIG.baseUrl}/news/${newsId}`, options);
    
    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    
    const responseText = await response.text();
    
    try {
      const jsonData = JSON.parse(responseText);
      console.log('✅ JSON Response:', JSON.stringify(jsonData, null, 2));
      
      if (jsonData.data && jsonData.data.content) {
        console.log('\n📰 HABER İÇERİĞİ:');
        console.log('Başlık:', jsonData.data.title);
        console.log('İçerik:', jsonData.data.content.substring(0, 500) + '...');
        console.log('Kategori:', jsonData.data.category);
        console.log('Tarih:', jsonData.data.date);
      }
      
      return { success: true, data: jsonData, status: response.status };
    } catch (parseError) {
      console.log('❌ JSON Parse Error:', parseError.message);
      console.log('📥 Raw Response:', responseText);
      return { success: false, error: 'Invalid JSON', rawResponse: responseText, status: response.status };
    }
    
  } catch (error) {
    console.log('🚫 Request Error:', error.message);
    return { success: false, error: error.message };
  }
}

async function runDetailTests() {
  // En güncel haberlerden birkaçını test edelim
  const testNewsIds = [
    'aa:text:20250730:38706615',  // Gazeteci ve yazar Erdem Sabih Anılan
    'aa:text:20250730:38706414',  // Döviz kurları
    'aa:text:20250730:38706415',  // Cumhurbaşkanı Erdoğan mesajı
    'aa:text:20250730:38706413',  // Mısır-Pakistan haberi
    'aa:text:20250730:38706316'   // New York borsası haberi
  ];
  
  for (const newsId of testNewsIds) {
    console.log('\n' + '━'.repeat(80));
    await testNewsDetail(newsId);
    console.log('━'.repeat(80) + '\n');
  }
  
  console.log('🏁 Haber detay testleri tamamlandı!');
}

runDetailTests().catch(console.error);
