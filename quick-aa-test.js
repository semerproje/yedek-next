// Node.js 18+ built-in fetch kullanıyoruz

const AA_CONFIG = {
  baseUrl: 'https://api.aa.com.tr/abone',
  username: '3010229', 
  password: '8vWhT6Vt',
  timeout: 10000
};

// Basic Auth header
const authHeader = 'Basic ' + Buffer.from(`${AA_CONFIG.username}:${AA_CONFIG.password}`).toString('base64');

console.log('🔍 AA API /latest Endpoint Test\n');

async function quickLatestTest() {
  try {
    console.log('📡 GET /latest testi...');
    
    const options = {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'AA-News-Client/1.0'
      },
      timeout: AA_CONFIG.timeout
    };

    const response = await fetch(`${AA_CONFIG.baseUrl}/latest`, options);
    
    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    
    if (response.status === 200) {
      const responseText = await response.text();
      
      try {
        const jsonData = JSON.parse(responseText);
        
        if (jsonData.response?.success && jsonData.data?.result) {
          console.log('✅ API BAŞARILI - Veri alındı!');
          console.log(`📊 Toplam haber: ${jsonData.data.total}`);
          console.log(`📊 Dönen haber sayısı: ${jsonData.data.result.length}`);
          
          console.log('\n📰 İlk 3 haber:');
          jsonData.data.result.slice(0, 3).forEach((item, index) => {
            console.log(`${index + 1}. ${item.title} (${item.type})`);
          });
          
          return { success: true, data: jsonData.data };
          
        } else if (jsonData.response?.success === false) {
          console.log('❌ API HATA:', jsonData.response.message);
          return { success: false, error: jsonData.response.message };
          
        } else {
          console.log('❓ Beklenmeyen response formatı');
          console.log('📥 Response:', JSON.stringify(jsonData, null, 2));
          return { success: false, error: 'Unexpected format' };
        }
        
      } catch (parseError) {
        console.log('❌ JSON parse hatası:', parseError.message);
        console.log('📥 Raw response:', responseText.substring(0, 500));
        return { success: false, error: 'JSON parse error' };
      }
    } else {
      console.log(`❌ HTTP Error: ${response.status}`);
      return { success: false, error: `HTTP ${response.status}` };
    }
    
  } catch (error) {
    console.error('🚫 Request hatası:', error.message);
    return { success: false, error: error.message };
  }
}

quickLatestTest().then(result => {
  console.log('\n🏁 Test tamamlandı');
  console.log('📊 Sonuç:', result.success ? 'BAŞARILI' : 'BAŞARISIZ');
  if (!result.success) {
    console.log('🔧 Hata:', result.error);
  }
}).catch(console.error);
