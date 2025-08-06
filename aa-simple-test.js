// Anadolu Ajansı API Basit Test

const AA_CONFIG = {
  baseUrl: 'https://api.aa.com.tr/abone',
  username: '3010229',
  password: '8vWhT6Vt'
};

const authHeader = 'Basic ' + Buffer.from(`${AA_CONFIG.username}:${AA_CONFIG.password}`).toString('base64');

console.log('🔍 AA API Test Başlıyor...\n');
console.log('📋 Kullanılacak Bilgiler:');
console.log(`- Base URL: ${AA_CONFIG.baseUrl}`);
console.log(`- Username: ${AA_CONFIG.username}`);
console.log(`- Auth Header: ${authHeader}`);
console.log('\n' + '='.repeat(60) + '\n');

// 1. Abonelik bilgilerini test et
async function testSubscription() {
  console.log('1️⃣ SUBSCRIPTION TEST');
  console.log('-------------------');
  
  try {
    const response = await fetch(`${AA_CONFIG.baseUrl}/subscription`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'AA-Test-Client/1.0'
      }
    });
    
    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Subscription Data:');
      console.log(JSON.stringify(data, null, 2));
    } else {
      const errorText = await response.text();
      console.log('❌ Error Response:', errorText);
    }
  } catch (error) {
    console.log('❌ Request Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
}

// 2. Discover filtrelerini test et
async function testDiscover() {
  console.log('2️⃣ DISCOVER TEST (tr_TR)');
  console.log('-------------------------');
  
  try {
    const response = await fetch(`${AA_CONFIG.baseUrl}/discover/tr_TR`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'AA-Test-Client/1.0'
      }
    });
    
    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Discover Data:');
      console.log(JSON.stringify(data, null, 2));
    } else {
      const errorText = await response.text();
      console.log('❌ Error Response:', errorText);
    }
  } catch (error) {
    console.log('❌ Request Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
}

// 3. Son haberları search ile test et
async function testSearch() {
  console.log('3️⃣ SEARCH TEST (Son 3 haber)');
  console.log('-------------------------------');
  
  try {
    const searchPayload = {
      start_date: "*",
      end_date: "NOW",
      filter_type: "1",
      filter_language: "1", 
      limit: 3
    };
    
    console.log('📤 Request Payload:');
    console.log(JSON.stringify(searchPayload, null, 2));
    
    const response = await fetch(`${AA_CONFIG.baseUrl}/search`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'AA-Test-Client/1.0'
      },
      body: JSON.stringify(searchPayload)
    });
    
    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Search Results:');
      console.log(JSON.stringify(data, null, 2));
      
      // Haber detaylarını özetle
      if (data.data && data.data.result) {
        console.log('\n📰 HABER ÖZETİ:');
        console.log('---------------');
        data.data.result.forEach((item, index) => {
          console.log(`${index + 1}. ID: ${item.id}`);
          console.log(`   Tip: ${item.type}`);
          console.log(`   Başlık: ${item.title}`);
          console.log(`   Tarih: ${item.date}`);
          console.log(`   Grup ID: ${item.group_id || 'N/A'}`);
          console.log('');
        });
      }
    } else {
      const errorText = await response.text();
      console.log('❌ Error Response:', errorText);
    }
  } catch (error) {
    console.log('❌ Request Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
}

// Ana test fonksiyonu
async function runTests() {
  await testSubscription();
  await new Promise(resolve => setTimeout(resolve, 1000)); // 1 saniye bekle
  
  await testDiscover();
  await new Promise(resolve => setTimeout(resolve, 1000)); // 1 saniye bekle
  
  await testSearch();
  
  console.log('🎯 Test tamamlandı!');
}

// Testleri başlat
runTests().catch(error => {
  console.error('💥 Test Hatası:', error);
});
