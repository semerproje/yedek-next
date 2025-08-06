// Node.js 18+ built-in fetch kullanıyoruz

const AA_CONFIG = {
  baseUrl: 'https://api.aa.com.tr/abone',
  username: '3010229',
  password: '8vWhT6Vt',
  timeout: 30000
};

// Basic Auth header
const authHeader = 'Basic ' + Buffer.from(`${AA_CONFIG.username}:${AA_CONFIG.password}`).toString('base64');

console.log('🔍 AA API Response Format Analizi\n');

async function analyzeResponse() {
  try {
    console.log('📡 /latest endpoint test ediliyor...');
    
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

    const response = await fetch(`${AA_CONFIG.baseUrl}/latest`, options);
    
    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    
    const responseText = await response.text();
    console.log('📥 Raw Response (ilk 1000 karakter):');
    console.log(responseText.substring(0, 1000));
    
    console.log('\n🔍 JSON Parse Denemesi:');
    try {
      const jsonData = JSON.parse(responseText);
      console.log('✅ JSON parse başarılı');
      console.log('📊 Response yapısı:');
      console.log('- response özelliği var mı?', !!jsonData.response);
      console.log('- data özelliği var mı?', !!jsonData.data);
      
      if (jsonData.response) {
        console.log('- response.success:', jsonData.response.success);
        console.log('- response.code:', jsonData.response.code);
        console.log('- response.message:', jsonData.response.message);
      }
      
      if (jsonData.data) {
        console.log('- data.result var mı?', !!jsonData.data.result);
        console.log('- data.total:', jsonData.data.total);
        
        if (jsonData.data.result && Array.isArray(jsonData.data.result)) {
          console.log('- result array uzunluğu:', jsonData.data.result.length);
          console.log('- ilk eleman yapısı:', Object.keys(jsonData.data.result[0] || {}));
        }
      }
      
      return jsonData;
      
    } catch (parseError) {
      console.log('❌ JSON parse error:', parseError.message);
      return null;
    }
    
  } catch (error) {
    console.error('🚫 Request error:', error.message);
    return null;
  }
}

analyzeResponse().catch(console.error);
